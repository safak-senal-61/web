// types/authTypes.ts
import { User } from './userTypes'; // User tipinizin olduğu yolu doğrulayın
import { ApiResponse } from './apiTypes'; // Yeni oluşturduğumuz merkezi tipi import ediyoruz.

export interface LoginPayload {
  loginIdentifier: string;
  password: string;
}

export interface Tokens {
  accessToken: string;
  accessExpiresIn: string;
}

// Başarılı bir giriş işleminde 'veri' alanının nasıl görüneceğini tanımlar.
export interface LoginSuccessData {
  tokenlar: Tokens;
  kullanici: User;
  twoFactorRequired?: boolean;
}

// Başarılı bir oturum kontrolünde 'veri' alanının nasıl görüneceğini tanımlar.
export interface CurrentUserSuccessData {
  kullanici: User;
}

// Artık ApiResponse<T> kullanarak tipleri daha temiz bir şekilde tanımlıyoruz.
export type LoginResponse = ApiResponse<LoginSuccessData>;
export type CurrentUserResponse = ApiResponse<CurrentUserSuccessData>;


// AuthContextType aynı kalabilir, çünkü kullandığı tipleri yukarıda tanımladık.
export interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<{ success: boolean; message: string; twoFactorRequired?: boolean }>;
  logout: () => Promise<void>;
}