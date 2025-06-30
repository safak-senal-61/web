// services/chatroomService.ts

import apiClient from '../lib/apiClient';
import {
  ChatRoom,
  CreateChatRoomRequest,
  UpdateChatRoomRequest,
  ChatRoomResponse,
  ChatRoomListResponse,
  ChatMessage,
  ChatParticipant
} from '../types/chatroomTypes';
import { ApiResponse } from '../types/apiTypes';

// Sohbet odası oluşturma
export const createChatRoom = async (data: CreateChatRoomRequest): Promise<ChatRoomResponse> => {
  try {
    const response = await apiClient.post('/chatrooms', data);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Sohbet odası oluşturulurken bir hata oluştu.'
    };
  }
};

// Sohbet odası detaylarını getirme
export const getChatRoom = async (roomId: string): Promise<ChatRoomResponse> => {
  try {
    const response = await apiClient.get(`/chatrooms/${roomId}`);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Sohbet odası bilgileri alınırken bir hata oluştu.'
    };
  }
};

// Sohbet odası güncelleme
export const updateChatRoom = async (roomId: string, data: UpdateChatRoomRequest): Promise<ChatRoomResponse> => {
  try {
    const response = await apiClient.put(`/chatrooms/${roomId}`, data);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Sohbet odası güncellenirken bir hata oluştu.'
    };
  }
};

// Sohbet odası silme
export const deleteChatRoom = async (roomId: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.delete(`/chatrooms/${roomId}`);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Sohbet odası silinirken bir hata oluştu.'
    };
  }
};

// Sohbet odalarını listeleme (public odalar)
export const getChatRooms = async (page = 1, limit = 20, search?: string, tags?: string[]): Promise<ChatRoomListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    if (search) {
      params.append('search', search);
    }
    
    if (tags && tags.length > 0) {
      tags.forEach(tag => params.append('tags', tag));
    }
    
    const response = await apiClient.get(`/chatrooms/public?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Sohbet odaları alınırken bir hata oluştu.'
    };
  }
};

// Sohbet odalarında arama
export const searchChatRooms = async (query: string, page = 1, limit = 20): Promise<ChatRoomListResponse> => {
  try {
    const params = new URLSearchParams({
      query: query,
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await apiClient.get(`/chatrooms/search?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Sohbet odaları aranırken bir hata oluştu.'
    };
  }
};

// Sohbet odasına katılma
export const joinChatRoom = async (roomId: string, password?: string): Promise<ApiResponse> => {
  try {
    console.log('joinChatRoom service called:', {
      roomId,
      hasPassword: !!password,
      timestamp: new Date().toISOString()
    });
    
    const requestData = { password };
    console.log('Sending request to:', `/chatrooms/${roomId}/join`);
    console.log('Request data:', requestData);
    
    const response = await apiClient.post(`/chatrooms/${roomId}/join`, requestData);
    
    console.log('joinChatRoom response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    
    return response.data;
  } catch (error: any) {
    console.error('joinChatRoom service error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL
      }
    });
    throw error;
  }
};

// Sohbet odasından ayrılma
export const leaveChatRoom = async (roomId: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(`/chatrooms/${roomId}/leave`);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Sohbet odasından ayrılırken bir hata oluştu.'
    };
  }
};

// Sohbet odası kapak fotoğrafını güncelleme
export const updateChatRoomCoverImage = async (roomId: string, coverImage: File): Promise<ChatRoomResponse> => {
  try {
    const formData = new FormData();
    formData.append('coverImage', coverImage);
    
    const response = await apiClient.put(`/chatrooms/${roomId}/cover-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Kapak fotoğrafı güncellenirken bir hata oluştu.'
    };
  }
};

// Sohbet odası mesajlarını getirme
export const getChatMessages = async (roomId: string, page = 1, limit = 50): Promise<{ basarili: boolean; mesaj: string; veri?: { mesajlar: ChatMessage[]; meta: { toplamMesaj: number; suankiSayfa: number; toplamSayfa: number; } } }> => {
  try {
    const response = await apiClient.get(`/chatrooms/${roomId}/messages?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Mesajlar alınırken bir hata oluştu.'
    };
  }
};

// Mesaj gönderme
export const sendMessage = async (roomId: string, content: string, messageType: 'TEXT' | 'IMAGE' | 'VOICE' = 'TEXT'): Promise<{ basarili: boolean; mesaj: string; veri?: { mesaj: ChatMessage } }> => {
  try {
    const response = await apiClient.post(`/chatrooms/${roomId}/messages`, { content, messageType });
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Mesaj gönderilirken bir hata oluştu.'
    };
  }
};

// Sohbet odası katılımcılarını getirme
export const getChatParticipants = async (roomId: string): Promise<{ basarili: boolean; mesaj: string; veri?: { katilimcilar: ChatParticipant[]; } }> => {
  try {
    const response = await apiClient.get(`/chatrooms/${roomId}/participants`);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Katılımcılar alınırken bir hata oluştu.'
    };
  }
};

// Herkese açık sohbet odalarını listeleme
export const getPublicChatRooms = async (page = 1, limit = 20): Promise<ChatRoomListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
    
    const response = await apiClient.get(`/chatrooms/public?${params.toString()}`);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Herkese açık sohbet odaları alınırken bir hata oluştu.'
    };
  }
};



// Moderatör ekleme
export const addModerator = async (roomId: string, targetUserId: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.post(`/chatrooms/${roomId}/moderators/${targetUserId}`);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Moderatör eklenirken bir hata oluştu.'
    };
  }
};

// Moderatör çıkarma
export const removeModerator = async (roomId: string, targetUserId: string): Promise<ApiResponse> => {
  try {
    const response = await apiClient.delete(`/chatrooms/${roomId}/moderators/${targetUserId}`);
    return response.data;
  } catch (error: any) {
    return {
      basarili: false,
      mesaj: error.response?.data?.mesaj || 'Moderatör çıkarılırken bir hata oluştu.'
    };
  }
};

// Export all functions as a service object
export const chatroomService = {
  createChatRoom,
  getChatRoom,
  updateChatRoom,
  deleteChatRoom,
  getChatRooms,
  getPublicChatRooms,
  searchChatRooms,
  joinChatRoom,
  leaveChatRoom,
  updateChatRoomCoverImage,
  getChatMessages,
  sendMessage,
  getChatParticipants,
  addModerator,
  removeModerator
};

// Default export
export default chatroomService;