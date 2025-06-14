import axios from 'axios';

const API_BASE_URL = 'https://3000-firebase-websachat-backend-1748272624869.cluster-6vyo4gb53jczovun3dxslzjahs.cloudworkstations.dev/';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // HTTPOnly cookie'lerin gönderilip alınması için çok önemli!
  headers: {
    'Content-Type': 'application/json',
  },
});

// Access Token'ı her isteğe eklemek için interceptor
// Bu token AuthContext'ten veya başka bir state yönetiminden alınacak
apiClient.interceptors.request.use(
  (config) => {
    // Bu kısım AuthContext implementasyonundan sonra güncellenecek
    // Şimdilik placeholder:
    // const token = localStorage.getItem('accessToken'); // VEYA context'ten al
    // if (token && config.headers) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Yanıt interceptor'ü (örneğin 401'de refresh token denemesi için)
// Şimdilik basit tutuyoruz, ileride eklenebilir.
// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         // const { data } = await apiClient.post('/auth/refresh-token'); // Refresh endpoint'iniz
//         // localStorage.setItem('accessToken', data.accessToken); // Yeni access token'ı kaydet
//         // apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
//         // originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
//         // return apiClient(originalRequest);
//         console.log("Token refresh logic needs to be implemented here or logout user.");
//         // Örneğin: window.location.href = '/login'; // Veya AuthContext üzerinden logout
//       } catch (refreshError) {
//         console.error("Refresh token failed", refreshError);
//         // Logout
//         return Promise.reject(refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );


export default apiClient;