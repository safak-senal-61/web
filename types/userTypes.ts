// types/userTypes.ts
export interface User {
  isPrivate: boolean;
  pinnedMessagesInRooms: string[] | null;
  twoFactorEnabled: boolean;
  emailVerificationToken: string | null;
  emailVerificationExpiresAt: string | null;
  passwordResetToken: string | null;
  passwordResetExpiresAt: string | null;
  postCount: number | null;
  avatarUrl: string | null;
  id: string;
  authProvider: string;
  authId: string | null;
  username: string;
  nickname: string;
  profilePictureUrl: string | null;
  bio: string | null;
  gender: string | null; // 'MALE', 'FEMALE', 'OTHER' vb. (Backend'den gelen değere göre)
  birthDate: string | null; // ISO Date string
  country: string | null;
  region: string | null;
  level: number;
  vipLevel?: number; // Opsiyonel olabilir
  coins: string; // Backend'den string geliyorsa, number'a çevirmeniz gerekebilir
  diamonds: string; // Backend'den string geliyorsa, number'a çevirmeniz gerekebilir
  email: string;
  isEmailVerified: boolean;
  lastLoginAt: string | null; // ISO Date string
  followingCount: number; // EKLENDİ
  followerCount: number; // EKLENDİ
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  isOnline?: boolean; // Opsiyonel olabilir
  preferences: any | null;
  allowDirectMessages: boolean;
  notificationSettings: any | null;
  blockedUserIds: string[] | null;
  accountStatus: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED';
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  amIFollowingThisUser?: boolean;
  isThisUserFollowingMe?: boolean;
  followRequestStatusToThisUser?: 'PENDING' | null;
  isBlockedByMe?: boolean;
  isContentRestrictedDueToPrivacy?: boolean;
  // EKLENEN ALANLAR (Backend'den gelen isimlerle eşleşmeli)
  xp?: string | number; // Backend'den string gelebilir, kullanırken number'a çevirin
  xpToNextLevel?: string | number; // Backend'den string gelebilir, kullanırken number'a çevirin
  // ... backend'den gelen diğer potansiyel kullanıcı alanları
}