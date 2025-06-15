import axios from 'axios';

// DEĞİŞİKLİK: 'export' anahtar kelimesi eklendi.
export const API_BASE_URL = 'https://3000-firebase-websachat-backend-1748272624869.cluster-6vyo4gb53jczovun3dxslzjahs.cloudworkstations.dev';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Bu kısım AuthContext implementasyonundan sonra güncellenecek
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;