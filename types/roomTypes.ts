 //types/roomTypes.ts gibi bir dosyada
export interface UserProfileTeaser { // Oda kartında gösterilecek kullanıcı bilgisi
    id: string;
    username: string;
    avatarUrl?: string | null | undefined;
  }
  
  export interface Room {
    id: string;
    name: string;
    description: string;
    memberCount: number;
    maxMembers: number;
    tags?: string[];
    isPrivate: boolean;
    imageUrl?: string;
    category?: string; // Oyun, Müzik, Sohbet vb.
    language?: string; // tr, en vb.
    createdBy?: UserProfileTeaser; // Odayı oluşturan kişi
    lastActivity?: string | Date; // Son aktivite zamanı (string veya Date)
    isPopular?: boolean; // Trendler için
    isNew?: boolean; // Yeni odalar için
    // İleride eklenebilecekler: voiceEnabled, rules, etc.
  }