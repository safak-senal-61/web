// types/chatroomTypes.ts

export interface ChatRoom {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  coverImageUrl?: string | null;
  type: 'PUBLIC' | 'PRIVATE';
  passwordHash?: string | null;
  maxParticipants: number;
  currentParticipantCount: number;
  activeParticipants: string[];
  moderators: string[];
  speakerSeatCount: number;
  speakerSeatAssignments?: any;
  tags: string[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  owner: {
    id: string;
    username: string;
    nickname: string;
    profilePictureUrl?: string;
  };
}

export interface CreateChatRoomRequest {
  title: string;
  description: string;
  type: 'PUBLIC' | 'PRIVATE';
  maxParticipants: number;
  speakerSeatCount: number;
  tags: string[];
  password?: string;
}

export interface UpdateChatRoomRequest {
  title?: string;
  description?: string;
  maxParticipants?: number;
  tags?: string[];
}

export interface ChatRoomResponse {
  basarili: boolean;
  mesaj: string;
  veri?: {
    oda: ChatRoom;
  };
}

export interface ChatRoomListResponse {
  basarili: boolean;
  mesaj: string;
  veri?: {
    odalar: ChatRoom[];
    toplam: number;
    sayfa: number;
    sayfaBoyutu: number;
  };
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  messageType: 'TEXT' | 'IMAGE' | 'VOICE' | 'SYSTEM';
  createdAt: string;
  sender: {
    id: string;
    username: string;
    nickname: string;
    profilePictureUrl?: string | null;
  };
}

export interface ChatParticipant {
  id: string;
  username: string;
  nickname: string;
  profilePictureUrl?: string;
  role: 'OWNER' | 'MODERATOR' | 'SPEAKER' | 'LISTENER';
  joinedAt: string;
  isMuted?: boolean;
  speakerSeatIndex?: number;
}