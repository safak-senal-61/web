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
import { AuthContextType, LoginPayload } from '../types/authTypes';
import { loginUser, fetchCurrentUser } from '../services/authService';
import apiClient from '../lib/apiClient';

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

  const isAuthenticated = !!accessToken && !!user;

  useEffect(() => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setIsLoading(true);
    fetchCurrentUser().then(response => {
      if (response.basarili && response.veri?.kullanici) {
        setUser(response.veri.kullanici);
      } else {
        window.localStorage.removeItem('accessToken');
        setAccessToken(null);
        delete apiClient.defaults.headers.common['Authorization'];
      }
      setIsLoading(false);
    });
  }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<{ success: boolean; message: string; twoFactorRequired?: boolean }> => {
    // Servisimiz hatayı yakaladığı için artık burada try-catch'e gerek yok.
    const response = await loginUser(payload);

    if (response.basarili && response.veri) {
      const { kullanici, tokenlar } = response.veri;
      setUser(kullanici);
      setAccessToken(tokenlar.accessToken);
      window.localStorage.setItem('accessToken', tokenlar.accessToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokenlar.accessToken}`;
      
      return { success: true, message: response.mesaj || "Giriş başarılı.", twoFactorRequired: response.veri.twoFactorRequired };
    }
    
    // Hata durumunda burası çalışacak.
    return { success: false, message: response.mesaj || 'Giriş başarısız oldu.' };
  }, []);

  const logout = useCallback(async (shouldRedirect = true) => {
    console.log(`${LOG_PREFIX} Logout işlemi başlatıldı.`);
    
    // 1. ÖNCE backend'e logout isteğini gönder (eğer token varsa).
    // Bu istek, mevcut (henüz silinmemiş) token ile yapılacaktır.
    if (accessToken) {
        try {
            await apiClient.post('/auth/logout');
            console.log(`${LOG_PREFIX} Backend'de oturum başarıyla sonlandırıldı.`);
        } catch (error) {
            // Hata olsa bile frontend'den çıkış yapmaya devam etmeliyiz.
            // Zaten token geçersiz olabilir, bu durumda 401 hatası almak normaldir.
            console.error(`${LOG_PREFIX} Backend logout API çağrısı başarısız oldu (bu beklenen bir durum olabilir):`, error);
        }
    }

    // 2. SONRA frontend'deki tüm kullanıcı verilerini ve token'ı temizle.
    setUser(null);
    setAccessToken(null);
    window.localStorage.removeItem('accessToken');
    delete apiClient.defaults.headers.common['Authorization'];
    console.log(`${LOG_PREFIX} Frontend state ve token temizlendi.`);

    // 3. Gerekliyse kullanıcıyı login sayfasına yönlendir.
    if (shouldRedirect) {
      await router.push('/login');
    }
  }, [router, accessToken]); // accessToken'ı bağımlılıklara ekleyerek güncel değeri almasını sağlıyoruz.

  const value = { user, accessToken, isLoading, isAuthenticated, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;