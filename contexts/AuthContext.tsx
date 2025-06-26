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
import { loginUser, fetchCurrentUser, addDevice, getDevices } from '../services/authService';
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

    // State'i temizle
    setUser(null);
    setAccessToken(null);
    
    // localStorage'ı tamamen temizle
    window.localStorage.clear();
    
    // apiClient'teki Authorization header'ını temizle
    delete apiClient.defaults.headers.common['Authorization'];
    
    console.log(`${LOG_PREFIX} Frontend state, localStorage ve headers temizlendi.`);
    if (shouldRedirect) {
      router.push('/login');
    }
  }, [router]);

  const loadSession = useCallback(async () => {
    const token = window.localStorage.getItem('accessToken');
    if (token) {
      try {
        // Artık burada header ayarlamaya gerek yok, interceptor hallediyor.
        const response = await fetchCurrentUser();
        if (response.basarili && response.veri?.kullanici) {
          setAccessToken(token);
          setUser(response.veri.kullanici);
        } else {
          // Token geçersizse veya kullanıcı bilgisi alınamazsa logout yap
          console.log(`${LOG_PREFIX} Token geçersiz veya kullanıcı bilgisi alınamadı, logout yapılıyor.`);
          await logout(false);
        }
      } catch (error) {
        // API çağrısında hata olursa (token süresi dolmuş olabilir)
        console.log(`${LOG_PREFIX} fetchCurrentUser hatası, logout yapılıyor:`, error);
        await logout(false);
      }
    }
    setIsLoading(false);
  }, [logout]);

  useEffect(() => {
    loadSession();
    
    // Token süresi dolduğunda tetiklenen event'i dinle
    const handleTokenExpired = () => {
      console.log(`${LOG_PREFIX} Token süresi doldu, oturum sonlandırılıyor.`);
      logout(false); // Yönlendirme yapmadan logout yap, çünkü apiClient zaten yönlendirme yapacak
    };
    
    window.addEventListener('auth:token-expired', handleTokenExpired);
    
    return () => {
      window.removeEventListener('auth:token-expired', handleTokenExpired);
    };
  }, [loadSession, logout]);

  // Cihaz tipini tespit eden yardımcı fonksiyon
  const detectDeviceType = (): 'mobile' | 'desktop' | 'tablet' | 'other' => {
    if (typeof window === 'undefined') return 'other';
    
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    
    if (isTablet) return 'tablet';
    if (isMobile) return 'mobile';
    return 'desktop';
  };

  // Cihaz adını oluşturan yardımcı fonksiyon
  const generateDeviceName = (): string => {
    if (typeof window === 'undefined') return 'Bilinmeyen Cihaz';
    
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    
    // Tarayıcı bilgisi
    let browser = 'Bilinmeyen Tarayıcı';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    
    // İşletim sistemi bilgisi
    let os = 'Bilinmeyen OS';
    if (platform.includes('Win')) os = 'Windows';
    else if (platform.includes('Mac')) os = 'macOS';
    else if (platform.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';
    
    return `${browser} - ${os}`;
  };

  // Backend'den cihaz silme işlemi sonrası logout fonksiyonu
  const logoutFromDevice = useCallback(async (deviceId: string) => {
    try {
      console.log(`${LOG_PREFIX} Cihaz silme işlemi başlatıldı: ${deviceId}`);
      
      const response = await apiClient.delete(`/auth/devices/${deviceId}`);
      
      if (response.data.basarili) {
        console.log(`${LOG_PREFIX} Cihaz başarıyla silindi ve oturum sonlandırıldı.`);
        // Eğer silinen cihaz mevcut cihazsa, kullanıcıyı çıkış yap
        await logout(true);
      } else {
        console.error(`${LOG_PREFIX} Cihaz silme işlemi başarısız:`, response.data.mesaj);
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} Cihaz silme işlemi sırasında hata:`, error);
    }
  }, [logout]);

  // Giriş sonrası cihaz bilgilerini ekleyen fonksiyon (Backend IP ve konum bilgisini kendisi alacak)
  const addCurrentDevice = useCallback(async () => {
    try {
      const currentUserAgent = navigator.userAgent;
      const currentDeviceName = generateDeviceName();
      const currentDeviceType = detectDeviceType();
      
      console.log(`${LOG_PREFIX} Cihaz bilgileri backend'e gönderiliyor: ${currentDeviceName} (${currentDeviceType})`);
      
      // Backend'e sadece cihaz bilgilerini gönder, IP ve konum backend'de işlenecek
      const result = await addDevice({
        deviceName: currentDeviceName,
        deviceType: currentDeviceType,
        userAgent: currentUserAgent
        // location ve ip backend'de otomatik olarak alınacak
      });
      
      if (result.basarili) {
        console.log(`${LOG_PREFIX} Cihaz bilgileri başarıyla eklendi: ${currentDeviceName}`);
      } else {
        console.warn(`${LOG_PREFIX} Cihaz ekleme uyarısı: ${result.mesaj}`);
      }
     } catch (error) {
       console.error(`${LOG_PREFIX} Cihaz bilgileri eklenirken hata oluştu:`, error);
       // Hata olsa bile giriş işlemini engellemiyoruz
     }
   }, []);

  const login = useCallback(async (payload: LoginPayload): Promise<{ success: boolean; message: string; twoFactorRequired?: boolean }> => {
    const response = await loginUser(payload);
    if (response.basarili && response.veri) {
      const { kullanici, tokenlar } = response.veri;
      window.localStorage.setItem('accessToken', tokenlar.accessToken);
      setAccessToken(tokenlar.accessToken);
      setUser(kullanici);
      
      // Giriş başarılı olduktan sonra cihaz bilgilerini ekle
      await addCurrentDevice();
      
      return { success: true, message: "Giriş başarılı.", twoFactorRequired: response.veri.twoFactorRequired };
    }
    return { success: false, message: response.mesaj || 'Giriş başarısız oldu.' };
  }, [addCurrentDevice]);

  const handleOauthCallback = useCallback(async (data: LoginSuccessData) => {
    const { kullanici, tokenlar } = data;
    window.localStorage.setItem('accessToken', tokenlar.accessToken);
    setAccessToken(tokenlar.accessToken);
    setUser(kullanici);
    
    // OAuth giriş sonrası da cihaz bilgilerini ekle
    await addCurrentDevice();
  }, [addCurrentDevice]);

  

  const value: AuthContextType = { user, accessToken, isLoading, isAuthenticated, login, logout, handleOauthCallback, logoutFromDevice };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;