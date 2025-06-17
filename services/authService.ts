// services/authService.ts

import axios from 'axios';
import apiClient from '../lib/apiClient';
import { 
  LoginPayload, 
  LoginResponse, 
  CurrentUserResponse
} from '../types/authTypes'; // Bu tipler artık merkezi ApiResponse'u kullanıyor olmalı
import { ApiResponse } from '../types/apiTypes'; // En üste import edin

/**
 * Giriş işlemini gerçekleştiren ve her zaman tutarlı bir LoginResponse döndüren fonksiyon.
 * Axios hatası alsa bile, hatayı yakalayıp standart formatımıza dönüştürür.
 */
export const loginUser = async (credentials: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    // API'den 2xx (başarılı) yanıtı gelirse, direkt onu döndür.
    return response.data;
  } catch (error: unknown) {
    // API'den 4xx veya 5xx gibi bir hata kodu gelirse bu blok çalışır.
    if (axios.isAxiosError(error) && error.response) {
      // Backend'den gelen hata JSON'ını (örn: { basarili: false, mesaj: "..." }) döndür.
      // Bu, beklediğimiz ve yönetebileceğimiz bir durum.
      return error.response.data as LoginResponse;
    }
    
    // Ağ hatası gibi beklenmedik bir durum olursa, kendi standart hata nesnemizi oluşturup döndür.
    // Bu sayede uygulama asla çökmez.
    console.error("Beklenmedik giriş hatası:", error);
    return {
      basarili: false,
      mesaj: 'Sunucuya bağlanırken bir hata oluştu. Lütfen tekrar deneyin.',
    };
  }
};

/**
 * Mevcut kullanıcı oturumunu kontrol eden fonksiyon.
 * Her zaman tutarlı bir CurrentUserResponse döndürür.
 */
export const fetchCurrentUser = async (): Promise<CurrentUserResponse> => {
  try {
    const response = await apiClient.get<CurrentUserResponse>('/auth/me');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as CurrentUserResponse;
    }
    return {
      basarili: false,
      mesaj: 'Oturum bilgileri alınırken bir hata oluştu.',
    };
  }
};



/**
 * Şifre sıfırlama talebi gönderir.
 */
export const requestPasswordReset = async (email: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>('/auth/forgot-password', { email });
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse;
    }
    return {
      basarili: false,
      mesaj: 'Sunucuya bağlanırken bir hata oluştu.',
    };
  }
};

/**
 * Gelen token'ın geçerliliğini backend'e sorar.
 */
export const validateResetToken = async (token: string): Promise<ApiResponse> => {
    try {
        const response = await apiClient.get<ApiResponse>(`/auth/validate-reset-token?token=${token}`);
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data as ApiResponse;
        }
        return {
            basarili: false,
            mesaj: 'Token doğrulaması sırasında sunucu hatası.',
        };
    }
};

/**
 * Token ve yeni şifre ile şifreyi sıfırlar.
 */
export const resetPassword = async (token: string, password: string, confirmPassword: string): Promise<ApiResponse> => {
    try {
        const response = await apiClient.post<ApiResponse>(`/auth/reset-password?token=${token}`, { password, confirmPassword });
        return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error) && error.response) {
            return error.response.data as ApiResponse;
        }
        return {
            basarili: false,
            mesaj: 'Şifre sıfırlanırken sunucu hatası.',
        };
    }
};
