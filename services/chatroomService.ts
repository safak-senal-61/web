// services/chatroomService.ts

import apiClient from '../lib/apiClient';
import {
  CreateChatRoomRequest,
  UpdateChatRoomRequest,
  SendMessageRequest,
  ChatRoomResponse,
  ChatRoomListResponse,
  SendMessageResponse,
  ChatRoomCoverImageUpdateResponse,
} from '../types/chatroomTypes';
import { ApiResponse } from '../types/apiTypes';

// 1. Yeni bir sohbet odası oluşturur (POST /chatrooms)
export const createChatRoom = async (data: CreateChatRoomRequest): Promise<ChatRoomResponse> => {
  try {
    const response = await apiClient.post<ChatRoomResponse>('/chatrooms', data);
    return response.data;
  } catch (error: any) {
    return error.response?.data || { basarili: false, mesaj: 'Sohbet odası oluşturulurken bir hata oluştu.' };
  }
};

// 2. Herkese açık ve aktif sohbet odalarını listeler (GET /chatrooms/public)
export const getPublicChatRooms = async (page = 1, limit = 20): Promise<ChatRoomListResponse> => {
  try {
    const response = await apiClient.get<ChatRoomListResponse>('/chatrooms/public', { params: { page, limit } });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { basarili: false, mesaj: 'Sohbet odaları alınırken bir hata oluştu.' };
  }
};

// 3. Başlık veya açıklamaya göre sohbet odalarını arar (GET /chatrooms/search)
export const searchChatRooms = async (query: string, page = 1, limit = 20): Promise<ChatRoomListResponse> => {
  try {
    const response = await apiClient.get<ChatRoomListResponse>('/chatrooms/search', { params: { query, page, limit } });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { basarili: false, mesaj: 'Sohbet odaları aranırken bir hata oluştu.' };
  }
};

// 4. Belirli bir sohbet odasının detaylarını getirir (GET /chatrooms/:roomId)
export const getChatRoom = async (roomId: string): Promise<ChatRoomResponse> => {
    try {
      const response = await apiClient.get<ChatRoomResponse>(`/chatrooms/${roomId}`);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { basarili: false, mesaj: 'Oda detayları alınamadı.' };
    }
};

// 5. Sohbet odası bilgilerini günceller (PUT /chatrooms/:roomId)
export const updateChatRoom = async (roomId: string, data: UpdateChatRoomRequest): Promise<ChatRoomResponse> => {
    try {
      const response = await apiClient.put<ChatRoomResponse>(`/chatrooms/${roomId}`, data);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { basarili: false, mesaj: 'Oda güncellenirken bir hata oluştu.' };
    }
};

// 6. Sohbet odasını siler (DELETE /chatrooms/:roomId)
export const deleteChatRoom = async (roomId: string): Promise<ApiResponse> => {
    try {
      const response = await apiClient.delete<ApiResponse>(`/chatrooms/${roomId}`);
      return response.data;
    } catch (error: any) {
      return error.response?.data || { basarili: false, mesaj: 'Oda silinirken bir hata oluştu.' };
    }
};

// 7. Bir sohbet odasının kapak fotoğrafını günceller (PUT /chatrooms/:roomId/cover-image)
export const updateChatRoomCoverImage = async (roomId: string, coverImage: File): Promise<ChatRoomCoverImageUpdateResponse> => {
    try {
      const formData = new FormData();
      formData.append('coverImage', coverImage);
      
      const response = await apiClient.put<ChatRoomCoverImageUpdateResponse>(`/chatrooms/${roomId}/cover-image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error: any) {
      return error.response?.data || { basarili: false, mesaj: 'Kapak fotoğrafı güncellenirken bir hata oluştu.' };
    }
};
  
// 8. Bir sohbet odasına katılır (POST /chatrooms/:roomId/join)
export const joinChatRoom = async (roomId: string, password?: string): Promise<ApiResponse> => {
      try {
        const response = await apiClient.post<ApiResponse>(`/chatrooms/${roomId}/join`, { password });
        return response.data;
      } catch (error: any) {
        return error.response?.data || { basarili: false, mesaj: 'Odaya katılırken bir hata oluştu.' };
      }
};
  
// 9. Bir sohbet odasından ayrılır (POST /chatrooms/:roomId/leave)
export const leaveChatRoom = async (roomId: string): Promise<ApiResponse> => {
      try {
          const response = await apiClient.post<ApiResponse>(`/chatrooms/${roomId}/leave`);
          return response.data;
      } catch (error: any) {
          return error.response?.data || { basarili: false, mesaj: 'Odadan ayrılırken bir hata oluştu.' };
      }
};

// 10. Belirli bir odaya yeni bir mesaj gönderir (POST /chatrooms/:roomId/messages)
export const sendMessage = async (roomId: string, data: SendMessageRequest): Promise<SendMessageResponse> => {
    try {
        const response = await apiClient.post<SendMessageResponse>(`/chatrooms/${roomId}/messages`, data);
        return response.data;
    } catch (error: any) {
        return error.response?.data || { basarili: false, mesaj: 'Mesaj gönderilirken bir hata oluştu.' };
    }
};

// Tüm fonksiyonları tek bir servis objesinde topluyoruz
export const chatroomService = {
  createChatRoom,
  getPublicChatRooms,
  searchChatRooms,
  getChatRoom,
  updateChatRoom,
  deleteChatRoom,
  updateChatRoomCoverImage,
  joinChatRoom,
  leaveChatRoom,
  sendMessage
};

export default chatroomService;