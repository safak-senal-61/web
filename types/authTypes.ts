// types/authTypes.ts
import { User } from './userTypes'; // User tipinizin olduğu yolu doğrulayın

export interface LoginPayload {
  loginIdentifier: string; // API'nizin beklediği alan adlarına göre ayarlayın
  password: string;
  // otp_kodu?: string; // Eğer 2FA varsa eklenebilir
}

export interface Tokens {
  accessToken: string;
  accessExpiresIn: string; // Örn: "1h", "3600s" veya backend'den gelen expiration timestamp
  // refreshToken?: string; // Refresh token kullanıyorsanız
  // refreshExpiresIn?: string;
}

export interface LoginSuccessData {
  tokenlar: Tokens;
  kullanici: User;
  twoFactorRequired?: boolean; // Bu alan backend'den geliyorsa
}

export interface LoginResponse {
  basarili: boolean;
  mesaj: string;
  veri?: LoginSuccessData; // Başarısız durumda 'veri' olmayabilir
}

// Bu interface AuthContext tarafından sağlanacak değerleri tanımlar
export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;       // İlk yükleme ve auth işlemleri sırasında true
  isAuthenticated: boolean; // <<--- BU ALAN EKLENDİ! Kullanıcının giriş yapıp yapmadığını belirtir
  login: (payload: LoginPayload) => Promise<{ success: boolean; message: string; twoFactorRequired?: boolean }>;
  logout: () => Promise<void>; // Logout da async olabilir (API call vb.)
  // refreshToken?: () => Promise<boolean>; // Gerekirse refresh token fonksiyonu
}

export interface CurrentUserSuccessData {
  tokenlar: Tokens; // API'niz oturum kontrolünde de token gönderiyorsa bu gerekli
  kullanici: User;
}

export interface CurrentUserResponse {
  basarili: boolean;
  mesaj: string;
  veri?: CurrentUserSuccessData; // Başarısız durumda 'veri' olmayabilir
}