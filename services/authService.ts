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

/**
 * Admin kaydı için interface
 */
export interface AdminRegistrationPayload {
  username: string;
  email: string;
  password: string;
  nickname: string;
  registrationSecret: string;
}

/**
 * Admin kaydı işlemini gerçekleştiren fonksiyon.
 */
export const registerAdmin = async (payload: AdminRegistrationPayload): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post<ApiResponse>('/auth/register-admin', payload);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse;
    }
    console.error("Admin kayıt hatası:", error);
    return {
      basarili: false,
      mesaj: 'Admin kaydı sırasında sunucuya bağlanırken bir hata oluştu.',
    };
  }
};

/**
 * Admin girişi için özel fonksiyon
 */
export const loginAdmin = async (credentials: LoginPayload): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as LoginResponse;
    }
    console.error("Admin giriş hatası:", error);
    return {
      basarili: false,
      mesaj: 'Admin girişi sırasında sunucuya bağlanırken bir hata oluştu.',
    };
  }
};

/**
 * Cihaz yönetimi için interface'ler
 */
export interface Device {
  id: string;
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet' | 'other';
  ipAddress: string;
  lastUsedAt: string;
  createdAt: string;
  isCurrentDevice: boolean;
  userAgent?: string;
  location?: string;
  userId?: string;
}

export interface AddDevicePayload {
  deviceName: string;
  deviceType: 'mobile' | 'desktop' | 'tablet' | 'other';
  location?: string;
  userAgent?: string;
}

export interface UpdateDevicePayload {
  deviceName: string;
}

export interface DevicesResponse {
  devices: Device[];
}

export interface DeviceResponse {
  device: Device;
}

/**
 * Yeni güvenilir cihaz ekler
 */
export const addDevice = async (payload: AddDevicePayload): Promise<ApiResponse<DeviceResponse>> => {
  try {
    const response = await apiClient.post<ApiResponse<DeviceResponse>>('/auth/devices', payload);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<DeviceResponse>;
    }
    console.error("Cihaz ekleme hatası:", error);
    return {
      basarili: false,
      mesaj: 'Cihaz eklenirken bir hata oluştu.',
    };
  }
};

/**
 * Kullanıcının güvenilir cihazlarını listeler
 */
export const getDevices = async (): Promise<ApiResponse<DevicesResponse>> => {
  try {
    const response = await apiClient.get<ApiResponse<DevicesResponse>>('/auth/devices');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<DevicesResponse>;
    }
    console.error("Cihazları getirme hatası:", error);
    return {
      basarili: false,
      mesaj: 'Cihazlar getirilirken bir hata oluştu.',
    };
  }
};

/**
 * Belirli bir güvenilir cihazı siler
 */
export const deleteDevice = async (deviceId: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.delete<ApiResponse>(`/auth/devices/${deviceId}`);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse;
    }
    console.error("Cihaz silme hatası:", error);
    return {
      basarili: false,
      mesaj: 'Cihaz silinirken bir hata oluştu.',
    };
  }
};

/**
 * Belirli bir cihazın adını günceller
 */
export const updateDevice = async (deviceId: string, payload: UpdateDevicePayload): Promise<ApiResponse<DeviceResponse>> => {
  try {
    const response = await apiClient.put<ApiResponse<DeviceResponse>>(`/auth/devices/${deviceId}`, payload);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data as ApiResponse<DeviceResponse>;
    }
    console.error("Cihaz güncelleme hatası:", error);
    return {
      basarili: false,
      mesaj: 'Cihaz güncellenirken bir hata oluştu.',
    };
  }
};

/**
 * Mevcut cihaz hariç tüm cihazları siler
 * Backend'de /auth/devices/all endpoint'i mevcut değilse, tek tek silme işlemi yapar
 */
export const deleteAllDevices = async (): Promise<ApiResponse> => {
  try {
    // Önce backend endpoint'ini deneyelim
    const response = await apiClient.delete<ApiResponse>('/auth/devices/all');
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Tüm cihazları silme hatası (HTTP):", error.response.status, error.response.data);
      
      // Eğer 404 veya 403 hatası alıyorsak, alternatif yöntem kullan
      if (error.response.status === 404 || error.response.status === 403) {
        console.log("Backend endpoint mevcut değil, tek tek silme işlemi başlatılıyor...");
        
        try {
          // Önce tüm cihazları getir
          const devicesResponse = await getDevices();
          
          if (!devicesResponse.basarili || !devicesResponse.veri?.devices) {
            return {
              basarili: false,
              mesaj: 'Cihazlar listelenemedi.',
            };
          }
          
          const devices = devicesResponse.veri.devices;
          const currentUserAgent = typeof window !== 'undefined' ? navigator.userAgent : '';
          
          // Mevcut cihaz hariç diğerlerini sil
          const devicesToDelete = devices.filter((device: any) => 
            device.userAgent !== currentUserAgent
          );
          
          if (devicesToDelete.length === 0) {
            return {
              basarili: true,
              mesaj: 'Silinecek cihaz bulunamadı.',
              veri: null
             

      
            };
          }
          
          // Her cihazı tek tek sil
          let deletedCount = 0;
          let failedCount = 0;
          
          for (const device of devicesToDelete) {
            try {
              const deleteResult = await deleteDevice(device.id);
              if (deleteResult.basarili) {
                deletedCount++;
              } else {
                failedCount++;
              }
            } catch (deleteError) {
              console.error(`Cihaz silme hatası (ID: ${device.id}):`, deleteError);
              failedCount++;
            }
          }
          
          return <ApiResponse>{
            basarili: deletedCount > 0,
            mesaj: `${deletedCount} cihaz silindi${failedCount > 0 ? `, ${failedCount} cihaz silinemedi` : ''}.`,
            veri: null
         
          };
          
        } catch (alternativeError) {
          console.error("Alternatif silme yöntemi hatası:", alternativeError);
          return {
            basarili: false,
            mesaj: 'Cihazlar silinirken bir hata oluştu.',
          };
        }
      }
      
      return error.response.data as ApiResponse;
    }
    console.error("Tüm cihazları silme hatası:", error);
    return {
      basarili: false,
      mesaj: 'Cihazlar silinirken bir hata oluştu.',
    };
  }
};


