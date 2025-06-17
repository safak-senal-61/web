// contexts/AuthContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import { User } from '../types/userTypes';
import { AuthContextType, LoginPayload, LoginSuccessData } from '../types/authTypes';
import { loginUser, fetchCurrentUser } from '../services/authService';
import apiClient from '../lib/apiClient';
import { ApiResponse } from '../types/apiTypes';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const LOG_PREFIX = "[AuthContext]";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user && !!accessToken;

  const logout = useCallback(async (shouldRedirect = true) => {
    console.log(`${LOG_PREFIX} Logout işlemi başlatıldı.`);
    
    if (window.localStorage.getItem('accessToken')) {
        try {
            await apiClient.post('/auth/logout');
            console.log(`${LOG_PREFIX} Backend'de oturum başarıyla sonlandırıldı.`);
        } catch (error) {
            console.error(`${LOG_PREFIX} Backend logout API çağrısı başarısız oldu:`, error);
        }
    }

    setUser(null);
    setAccessToken(null);
    window.localStorage.removeItem('accessToken');
    
    console.log(`${LOG_PREFIX} Frontend state ve token temizlendi.`);
    if (shouldRedirect) {
      router.push('/login');
    }
  }, [router]);

  const loadSession = useCallback(async () => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      // Artık burada header ayarlamaya gerek yok, interceptor hallediyor.
      const response = await fetchCurrentUser();
      if (response.basarili && response.veri?.kullanici) {
        setAccessToken(token);
        setUser(response.veri.kullanici);
      } else {
        await logout(false);
      }
    }
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = useCallback(async (payload: LoginPayload): Promise<{ success: boolean; message: string; twoFactorRequired?: boolean }> => {
    const response = await loginUser(payload);
    if (response.basarili && response.veri) {
      const { kullanici, tokenlar } = response.veri;
      window.localStorage.setItem('accessToken', tokenlar.accessToken);
      setAccessToken(tokenlar.accessToken);
      setUser(kullanici);
      // Header ayarlamaya gerek yok.
      return { success: true, message: "Giriş başarılı.", twoFactorRequired: response.veri.twoFactorRequired };
    }
    return { success: false, message: response.mesaj || 'Giriş başarısız oldu.' };
  }, []);

  const handleOauthCallback = useCallback((data: LoginSuccessData) => {
    const { kullanici, tokenlar } = data;
    window.localStorage.setItem('accessToken', tokenlar.accessToken);
    setAccessToken(tokenlar.accessToken);
    setUser(kullanici);
    // Header ayarlamaya gerek yok.
  }, []);

  

  const value: AuthContextType = { user, accessToken, isLoading, isAuthenticated, login, logout, handleOauthCallback };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;