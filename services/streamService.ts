// services/streamService.ts

import apiClient from '../lib/apiClient';
import { ApiResponse } from '../types/apiTypes';
import {
  Stream,
  StreamPaginationMeta,
  CreateStreamPayload,
  UpdateStreamPayload,
  IceServerResponse,
  AgoraConfig
} from '../types/streamTypes';

// Genel API yanıt tipleri
type PaginatedStreamsResponse = ApiResponse<{
  yayinlar: Stream[];
  meta: StreamPaginationMeta;
}>;

type StreamDetailResponse = ApiResponse<{ yayin: Stream }>;
type CreateStreamResponse = ApiResponse<{ yayin: Stream; agora: AgoraConfig }>;
type EndStreamResponse = ApiResponse<{ streamId: string; status: string; endTime: string }>;
type AgoraTokenResponse = ApiResponse<{ agora: AgoraConfig }>;


/**
 * Aktif (canlı) yayınları listeler.
 * @param page Sayfa numarası
 * @param limit Sayfa başına öğe sayısı
 */
export const getLiveStreams = async (page = 1, limit = 20): Promise<PaginatedStreamsResponse> => {
  const response = await apiClient.get<PaginatedStreamsResponse>(`/streams/live?page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Giriş yapmış kullanıcının kendi yayınlarını listeler.
 * @param status 'LIVE' veya 'SCHEDULED'
 * @param page Sayfa numarası
 * @param limit Sayfa başına öğe sayısı
 */
export const getMyStreams = async (status: 'LIVE' | 'SCHEDULED' | 'ENDED' = 'LIVE', page = 1, limit = 10): Promise<PaginatedStreamsResponse> => {
  const response = await apiClient.get<PaginatedStreamsResponse>(`/streams/my-streams?status=${status}&page=${page}&limit=${limit}`);
  return response.data;
};

/**
 * Belirli bir yayının detaylarını getirir.
 * @param streamId Yayın ID'si
 */
export const getStreamDetails = async (streamId: string): Promise<StreamDetailResponse> => {
  const response = await apiClient.get<StreamDetailResponse>(`/streams/${streamId}`);
  return response.data;
};

/**
 * Yeni bir canlı yayın başlatır veya planlar.
 * Kapak fotoğrafı içerdiği için FormData kullanır.
 * @param data Form verileri (title, status, coverImage vb.)
 */
export const createStream = async (data: CreateStreamPayload): Promise<CreateStreamResponse> => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('status', data.status);
    if (data.startTime) {
        formData.append('startTime', data.startTime);
    }
    if (data.coverImage) {
        formData.append('coverImage', data.coverImage);
    }
    // Diğer alanlar (tags, location) da eklenebilir.
    // formData.append('tags', JSON.stringify(data.tags));

    const response = await apiClient.post<CreateStreamResponse>('/streams', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};


/**
 * Bir yayını günceller.
 * @param streamId Yayın ID'si
 * @param data Güncellenecek veriler
 */
export const updateStream = async (streamId: string, data: UpdateStreamPayload): Promise<StreamDetailResponse> => {
  const response = await apiClient.put<StreamDetailResponse>(`/streams/${streamId}`, data);
  return response.data;
};

/**
 * Bir canlı yayını sonlandırır.
 * @param streamId Yayın ID'si
 */
export const endStream = async (streamId: string): Promise<EndStreamResponse> => {
  const response = await apiClient.post<EndStreamResponse>(`/streams/${streamId}/end`);
  return response.data;
};

/**
 * WebRTC için STUN/TURN sunucu listesini alır.
 */
export const getIceServers = async (): Promise<ApiResponse<IceServerResponse>> => {
  const response = await apiClient.get<ApiResponse<IceServerResponse>>('/streams/webrtc/ice-servers');
  return response.data;
};

/**
 * Bir kullanıcının yayına katıldığını bildirir.
 * @param streamId Yayın ID'si
 */
export const notifyViewerJoined = async (streamId: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>(`/streams/${streamId}/viewer-joined`);
  return response.data;
};

/**
 * Bir kullanıcının yayından ayrıldığını bildirir.
 * @param streamId Yayın ID'si
 */
export const notifyViewerLeft = async (streamId: string): Promise<ApiResponse<null>> => {
  const response = await apiClient.post<ApiResponse<null>>(`/streams/${streamId}/viewer-left`);
  return response.data;
};

/**
 * YENİ EKLENEN VE EXPORT EDİLEN FONKSİYON
 * Bir yayına katılmak için Agora token'ı alır.
 * @param streamId Yayın ID'si
 */
export const getStreamToken = async (streamId: string): Promise<AgoraTokenResponse> => {
  // NOT: Bu endpoint'in backend'de izleyiciler için bir token üretmesi gerekmektedir.
  // Örneğin: GET /api/streams/{streamId}/token
  const response = await apiClient.get<AgoraTokenResponse>(`/streams/${streamId}/token`);
  return response.data;
};