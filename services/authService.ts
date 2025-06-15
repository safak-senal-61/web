// services/authService.ts

import axios from 'axios';
import apiClient from '../lib/apiClient';
import { 
  LoginPayload, 
  LoginResponse, 
  CurrentUserResponse
} from '../types/authTypes'; // Bu tipler artık merkezi ApiResponse'u kullanıyor olmalı

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