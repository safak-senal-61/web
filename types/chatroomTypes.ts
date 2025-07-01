// types/chatroomTypes.ts

import { User } from './userTypes';
import { ApiResponse, PaginationMeta as BasePaginationMeta } from './apiTypes';

// --- TEMEL OBJELER ---

// ChatRoom tipi için olası türler
export type ChatRoomType = 'PUBLIC' | 'PRIVATE' | 'VOICE_ONLY';

// Sadeleştirilmiş kullanıcı bilgisi (owner, sender vb. için)
export interface RoomOwnerInfo extends Pick<User, 'id' | 'username' | 'nickname' | 'profilePictureUrl'> {}

// Listeleme ve Arama endpoint'lerinden dönen sadeleştirilmiş oda bilgisi
export interface ChatRoomListItem {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  currentParticipantCount: number;
  maxParticipants: number;
  coverImageUrl?: string | null;
  type: ChatRoomType;
  tags?: string[];
  owner: RoomOwnerInfo;
}

// Tam bir sohbet odası objesi
export interface ChatRoom extends ChatRoomListItem {
  status: 'ACTIVE' | 'INACTIVE';
  speakerSeatCount: number;
  speakerSeatAssignments?: any;
  activeParticipants: string[];
  moderators: string[];
  createdAt: string;
  updatedAt: string;
}

// Mesaj objesi
export interface ChatMessage {
  id: string;
  sender: RoomOwnerInfo;
  content: string;
  createdAt: string;
  // Bu alanlar şemada olmasa da genellikle kullanışlıdır
  roomId?: string;
  messageType?: 'TEXT' | 'IMAGE' | 'VOICE' | 'SYSTEM';
}

// --- ISTEK (REQUEST) PAYLOAD'LARI ---

// Yeni oda oluşturma isteği
export interface CreateChatRoomRequest {
  title: string;
  description?: string;
  coverImageUrl?: string;
  type: ChatRoomType;
  password?: string;
  maxParticipants: number;
  speakerSeatCount?: number;
  tags?: string[];
}

// Oda güncelleme isteği
export interface UpdateChatRoomRequest {
  title?: string;
  description?: string;
}

// Mesaj gönderme isteği
export interface SendMessageRequest {
  content: string;
  messageType?: 'TEXT' | 'IMAGE' | 'VOICE';
}


// --- API YANIT (RESPONSE) TİPLERİ ---

// Listeleme ve Arama için özel Meta tipi
export interface ChatRoomListPaginationMeta extends BasePaginationMeta {
    toplamOda?: number;
    toplamSonuc?: number;
}

// Tek bir oda yanıtı
export type ChatRoomResponse = ApiResponse<{
    oda: Pick<ChatRoom, 'id' | 'ownerId' | 'title' | 'description' | 'type' | 'maxParticipants' | 'activeParticipants' | 'createdAt' | 'updatedAt' | 'owner' >
}>;

// Oda listesi yanıtı
export type ChatRoomListResponse = ApiResponse<{ odalar: ChatRoomListItem[] }, ChatRoomListPaginationMeta>;

// Mesaj gönderme başarılı yanıtı
export type SendMessageResponse = ApiResponse<{ mesaj: ChatMessage }>;

// Kapak fotoğrafı güncelleme başarılı yanıtı
export type ChatRoomCoverImageUpdateResponse = ApiResponse<{
    oda: Pick<ChatRoom, 'id' | 'coverImageUrl'>
}>;