// lib/apiClient.ts

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

export const API_BASE_URL = 'https://3000-firebase-websachat-backend-1748272624869.cluster-6vyo4gb53jczovun3dxslzjahs.cloudworkstations.dev';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Çerezlerin gönderilmesi için bu ayar kritik
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- YENİLENMİŞ INTERCEPTOR LOGIC ---

// Token yenileme işlemi sırasında diğer istekleri tutmak için değişkenler
let isRefreshing = false;
let failedQueue: Array<{ 
  resolve: (value: unknown) => void; 
  reject: (reason?: any) => void; 
}> = [];

// Kuyruktaki istekleri işleyen fonksiyon
const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};


// Request Interceptor: Her isteğe token ekler (Değişiklik yok)
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('accessToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// Response Interceptor: 401 hatalarını yakalayıp token yenileme mekanizmasını çalıştırır (GÜNCELLENDİ)
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Eğer zaten bir token yenileme işlemi devam ediyorsa, bu isteği kuyruğa al
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
        .then(token => {
          if (originalRequest.headers) {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
          }
          return apiClient(originalRequest);
        })
        .catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await apiClient.post('/auth/refresh-token');
        const newAccessToken = data.veri.accessToken;

        window.localStorage.setItem('accessToken', newAccessToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }
        
        // Bekleyen istekleri yeni token ile tekrar çalıştır
        processQueue(null, newAccessToken);
        
        // Başarısız olan orijinal isteği yeni token ile tekrar gönder
        return apiClient(originalRequest);

      } catch (refreshError: any) {
        // Token yenileme başarısız olursa, bekleyen tüm istekleri reddet ve kullanıcıyı logout yap
        processQueue(refreshError, null);
        
        console.error("Token yenilenemedi, çıkış yapılıyor.", refreshError);
        window.localStorage.removeItem('accessToken');
        delete apiClient.defaults.headers.common['Authorization'];

        if (typeof window !== 'undefined') {
          // Kullanıcıyı login sayfasına yönlendir
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;