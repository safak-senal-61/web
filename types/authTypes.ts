// types/authTypes.ts
import { User } from './userTypes'; // User tipinizin olduğu yolu doğrulayın
import { ApiResponse } from './apiTypes'; // Merkezi API tipini import ediyoruz.

export interface LoginPayload {
  loginIdentifier: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  accessExpiresIn: string;
}

// Başarılı bir giriş/OAuth işleminde 'veri' alanının nasıl görüneceğini tanımlar.
export interface LoginSuccessData {
  tokenlar: Tokens;
  kullanici: User;
  twoFactorRequired?: boolean;
}

// Başarılı bir oturum kontrolünde 'veri' alanının nasıl görüneceğini tanımlar.
export interface CurrentUserSuccessData {
  kullanici: User;
}

// ApiResponse<T> kullanarak tipleri daha temiz bir şekilde tanımlıyoruz.
export type LoginResponse = ApiResponse<LoginSuccessData>;
export type CurrentUserResponse = ApiResponse<CurrentUserSuccessData>;

// AuthContextType arayüzü
export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<{ success: boolean; message: string; twoFactorRequired?: boolean }>;
  logout: (shouldRedirect?: boolean) => Promise<void>;
  // HATA BURADAYDI, YENİ FONKSİYONUN TİPİNİ EKLİYORUZ:
  handleOauthCallback: (data: LoginSuccessData) => void; 
}