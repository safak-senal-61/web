// types/streamTypes.ts

import { User } from './userTypes';

// API'den gelen broadcaster (yayıncı) bilgilerini tanımlar.
export interface StreamBroadcaster extends Pick<User, 'id' | 'username' | 'nickname' | 'profilePictureUrl'> {
  // Bu arayüz, User tipinden sadece gerekli alanları alır.
  // İhtiyaç olursa ekstra alanlar eklenebilir.
}

// Tek bir yayın (stream) verisinin yapısını tanımlar.
// GET /streams/live, GET /streams/{streamId} gibi endpoint'lerden döner.
export interface Stream {
  id: string;
  title: string;
  status: 'LIVE' | 'SCHEDULED' | 'ENDED';
  startTime: string; // ISO Date string
  endTime?: string | null; // ISO Date string
  coverImageUrl?: string | null;
  broadcasterId: string;
  currentViewers: number;
  peakViewers: number;
  totalDiamondsReceived: string; // Büyük sayılar için string olabilir
  tags?: string[] | null;
  location?: any | null; // Yapısı belirsiz, any olarak bırakıldı
  rtcChannelName?: string | null;
  recordingUrl?: string | null;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  broadcaster: StreamBroadcaster; // Yayıncı bilgileri
}

// Sayfalanmış API yanıtları için meta verileri (GET /streams/live, GET /streams/my-streams)
export interface StreamPaginationMeta {
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

// Yeni bir yayın oluşturma (POST /streams) isteğinin gövdesi
// Bu bir FormData olacağı için, bu arayüzü form state'ini yönetmek için kullanacağız.
export interface CreateStreamPayload {
  title: string;
  status: 'LIVE' | 'SCHEDULED';
  startTime?: string; // SCHEDULED ise zorunlu
  coverImage?: File;
  tags?: string; // Virgülle ayrılmış etiketler
  location?: any;
}

// Bir yayını güncelleme (PUT /streams/{streamId}) isteğinin gövdesi
export interface UpdateStreamPayload extends Omit<Partial<CreateStreamPayload>, 'coverImage'> {
  // Partial, tüm alanları opsiyonel yapar.
  // Omit, coverImage'i bu tipten çıkarır çünkü güncellemede dosya gönderimi farklı olabilir.
}


// WebRTC için ICE sunucu bilgilerini tanımlar (GET /streams/webrtc/ice-servers)
export interface IceServerResponse {
  iceServers: RTCIceServer[];
}

// Yayın oluşturulduğunda dönen Agora token ve kanal bilgilerini tanımlar (POST /streams)
export interface AgoraConfig {
  token: string;
  appId: string;
  channelName: string;
}