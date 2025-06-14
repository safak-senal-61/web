import axios from 'axios';
import apiClient from '../lib/apiClient';
import { 
  LoginPayload, 
  LoginResponse, 
  CurrentUserResponse // <-- DÜZELTME: Doğru tip buradan import ediliyor.
} from '../types/authTypes';

// loginUser fonksiyonu, login işlemini gerçekleştirir.
export const loginUser = async (credentials: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    // Axios hatası ise, backend'den gelen yanıtı döndür.
    if (axios.isAxiosError(error) && error.response) {
      // Backend'in LoginResponse formatında bir hata mesajı döndürdüğünü varsayıyoruz.
      return error.response.data as LoginResponse; 
    }
    // Diğer beklenmedik hatalar için genel bir mesaj döndür.
    return {
      basarili: false,
      mesaj: 'Giriş sırasında beklenmedik bir hata oluştu.',
    };
  }
};

// fetchCurrentUser fonksiyonu, mevcut oturumu kontrol eder.
// DÜZELTME: Fonksiyonun dönüş tipi olarak merkezi CurrentUserResponse kullanılıyor.
export const fetchCurrentUser = async (): Promise<CurrentUserResponse> => {
  try {
    console.log("[authService] Fetching current user (/auth/me)...");
    
    // apiClient.get çağrısındaki generic tip de güncellendi.
    const response = await apiClient.get<CurrentUserResponse>('/auth/me');
    
    console.log("[authService] /auth/me response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[authService] Error fetching current user:", error.message);
    
    // 401 gibi yetkilendirme hatalarında bu blok çalışır.
    if (axios.isAxiosError(error) && error.response) {
      // Backend'den gelen yanıtı istemciye döndür.
      return error.response.data as CurrentUserResponse;
    }
    
    // Diğer beklenmedik hatalar için genel bir mesaj döndür.
    return {
      basarili: false,
      mesaj: 'Oturum bilgileri alınırken beklenmedik bir hata oluştu.',
    };
  }
};

/*
  Gelecekte eklenebilecek diğer servis fonksiyonları için örnekler:

  import { Achievement, Gift, User } from '../types/userTypes';

  export const fetchUserAchievements = async (userId: string): Promise<Achievement[]> => {
    const response = await apiClient.get(`/users/${userId}/achievements`);
    return response.data;
  };

  export const fetchUserGifts = async (userId: string): Promise<Gift[]> => {
    const response = await apiClient.get(`/users/${userId}/gifts`);
    return response.data;
  };
  
  export const fetchUserFollowers = async (userId: string): Promise<User[]> => {
    const response = await apiClient.get(`/users/${userId}/followers`);
    return response.data;
  };

  export const fetchUserFollowing = async (userId: string): Promise<User[]> => {
    const response = await apiClient.get(`/users/${userId}/following`);
    return response.data;
  };
*/