// lib/apiClient.ts

import axios, { AxiosError } from 'axios';

export const API_BASE_URL = 'https://3000-firebase-websachat-backend-1748272624869.cluster-6vyo4gb53jczovun3dxslzjahs.cloudworkstations.dev';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Çerezlerin (özellikle refresh token için) gönderilmesi için
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Her isteğe token ekler
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

// Response Interceptor: 401 hatalarını yakalayıp token yenileme mekanizmasını çalıştırır
apiClient.interceptors.response.use(
  (response) => response, // Başarılı yanıtları doğrudan geri döndür
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Sadece 401 hatalarını ve token yenileme denemesi yapılmamış istekleri ele al
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true; // İsteği yeniden denendi olarak işaretle

      try {
        // Backend'de /auth/refresh-token gibi bir endpoint'iniz olmalı
        const { data } = await apiClient.post('/auth/refresh-token');
        const newAccessToken = data.veri.accessToken;

        window.localStorage.setItem('accessToken', newAccessToken);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        }

        // Başarısız olan orijinal isteği yeni token ile tekrar gönder
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Token yenileme başarısız olursa, kullanıcıyı logout yap
        console.error("Token yenilenemedi, çıkış yapılıyor.", refreshError);
        window.localStorage.removeItem('accessToken');
        delete apiClient.defaults.headers.common['Authorization'];
        // Kullanıcıyı login sayfasına yönlendir
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);


export default apiClient;