// types/adminTypes.ts

import { User } from './userTypes';

export type ReportStatus = "PENDING" | "REVIEWED_ACCEPTED" | "REVIEWED_REJECTED" | "RESOLVED";
export type ReportType = "USER" | "STREAM" | "ROOM" | "MESSAGE";

export interface Report {
  id: string;
  reporterId: string;
  reportedUserId?: string;
  reason: string;
  description?: string;
  status: ReportStatus;
  type: ReportType;
  entityId: string; // Raporlanan içeriğin ID'si (kullanıcı, mesaj vb.)
  createdAt: string;
  reporter: Pick<User, 'id' | 'username'>;
  reportedUser?: Pick<User, 'id' | 'username'>;
  reviewedById?: string;
  reviewTimestamp?: string;
}

export interface GameCategory {
    id: string;
    name: string;
    slug: string;
    iconUrl?: string | null;
}

export interface Gift {
    id: string;
    giftId: string;
    name: string;
    cost: number;
    value: number; // Alan elmas değeri
    imageUrl: string;
    isActive: boolean;
}