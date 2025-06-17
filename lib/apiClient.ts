// lib/apiClient.ts

import axios from 'axios';

export const API_BASE_URL = 'https://3000-firebase-websachat-backend-1748272624869.cluster-6vyo4gb53jczovun3dxslzjahs.cloudworkstations.dev';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- YENİ EKLENEN KISIM: REQUEST INTERCEPTOR ---
// Bu interceptor, apiClient ile yapılan HER istek gönderilmeden önce çalışır.
apiClient.interceptors.request.use(
  (config) => {
    // Tarayıcı ortamında olup olmadığımızı kontrol edelim (Next.js hem sunucuda hem client'ta çalışır)
    if (typeof window !== 'undefined') {
      const token = window.localStorage.getItem('accessToken');
      if (token) {
        // Eğer token varsa, isteğin header'larına ekle.
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config; // Değiştirilmiş config ile isteğe devam et.
  },
  (error) => {
    // İstek hatası varsa, hatayı geri döndür.
    return Promise.reject(error);
  }
);

export default apiClient;