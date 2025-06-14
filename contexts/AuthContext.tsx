import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import { User } from '../types/userTypes';
import { AuthContextType as AuthContextTypeDefinition, LoginPayload } from '../types/authTypes';
import { loginUser as apiLoginUser, fetchCurrentUser } from '../services/authService';
import apiClient from '../lib/apiClient';

const AuthContext = createContext<AuthContextTypeDefinition | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const LOG_PREFIX = "[AuthContext]";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  // DİKKAT: Access token'ı state'te tutmaya devam ediyoruz, çünkü login sonrası lazım oluyor
  // ve interceptor'da kullanıyoruz. Ancak bu token'ın yenilenme mantığı
  // (genellikle bir interceptor ile) backend/apiClient katmanında olmalıdır.
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // isAuthenticated'in tanımı aynı kalıyor. Token ve kullanıcı varsa true olur.
  const isAuthenticated = !!user && !!accessToken;

  // Oturum kontrolü için güncellenmiş useEffect
  useEffect(() => {
    const checkUserSession = async () => {
      console.log(`${LOG_PREFIX} checkUserSession: Oturum kontrolü başlatılıyor...`);
      try {
        const response = await fetchCurrentUser(); 
        
        // DÜZELTME: Yanıtın sadece 'kullanici' içerdiğini varsayıyoruz.
        if (response.basarili && response.veri?.kullanici) {
          console.log(`${LOG_PREFIX} checkUserSession: Geçerli oturum bulundu.`, response.veri);
          setUser(response.veri.kullanici);
          
          // ÖNEMLİ DEĞİŞİKLİK:
          // /auth/me yanıtından token gelmediği için setAccessToken'i burada ÇAĞIRMIYORUZ.
          // Ancak, kullanıcının geçerli olduğunu bildiğimiz için, uygulamayı "authenticated"
          // duruma getirmek adına geçici veya sembolik bir token atayabiliriz.
          // Bu, isAuthenticated'in doğru çalışmasını sağlar.
          // Eğer API'niz access token'ı /login dışında hiçbir yerde vermiyorsa
          // ve token'ın state'te tutulması gerekiyorsa, bu token'ı LocalStorage'da
          // saklayıp buradan okumak bir seçenek olabilir. Şimdilik sembolik bir değer atayalım.
          setAccessToken("session_active"); // veya localStorage'dan okunan token
          
        } else {
          console.log(`${LOG_PREFIX} checkUserSession: Geçerli oturum bulunamadı.`);
          setUser(null);
          setAccessToken(null);
        }
      } catch (error) {
        console.error(`${LOG_PREFIX} checkUserSession: Oturum kontrolü sırasında hata.`, error);
        setUser(null);
        setAccessToken(null);
      } finally {
        setIsLoading(false);
        console.log(`${LOG_PREFIX} checkUserSession: Oturum kontrolü tamamlandı. isLoading: false`);
      }
    };

    checkUserSession();
  }, []); // Sadece ilk mount'ta çalışır.

  // Bu interceptor, state'teki accessToken'ı kullanmaya devam eder.
  // Login sonrası bu token set edilir. Oturum kontrolü sonrası sembolik token set edilir.
  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        // Sembolik token'ı Authorization header'ına eklememek için kontrol
        if (accessToken && accessToken !== "session_active" && config.headers) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
    };
  }, [accessToken]);


  // Login fonksiyonu hem kullanıcıyı hem de GERÇEK accessToken'ı ayarlar.
  const login = useCallback(async (payload: LoginPayload): Promise<{ success: boolean; message: string; twoFactorRequired?: boolean }> => {
    setIsLoading(true);
    try {
      const response = await apiLoginUser(payload);
      // Login yanıtının hem 'kullanici' hem de 'tokenlar' içerdiğini varsayıyoruz.
      if (response.basarili && response.veri) {
        setUser(response.veri.kullanici);
        setAccessToken(response.veri.tokenlar.accessToken); // Burası kritik
        setIsLoading(false);
        return { success: true, message: response.mesaj || "Giriş başarılı.", twoFactorRequired: response.veri.twoFactorRequired };
      } else {
        setUser(null);
        setAccessToken(null);
        setIsLoading(false);
        return { success: false, message: response.mesaj || 'Giriş başarısız.' };
      }
    } catch (error: any) {
      setUser(null);
      setAccessToken(null);
      setIsLoading(false);
      return { success: false, message: error.message || 'Bir hata oluştu.' };
    }
  }, []);

  // Logout fonksiyonu state'i temizler.
  const logout = useCallback(async () => {
    // ... logout mantığı aynı kalabilir ...
    const tokenToInvalidate = accessToken;
    setUser(null);
    setAccessToken(null);
    setIsLoading(true);
    try {
      if (tokenToInvalidate) {
          await apiClient.post('/auth/logout', { token: tokenToInvalidate });
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} Logout API call failed:`, error);
    }
    await router.push('/login');
    setIsLoading(false);
  }, [router, accessToken]);


  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;