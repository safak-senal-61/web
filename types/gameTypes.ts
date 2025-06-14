// types/gameTypes.ts

export interface GamePlatform {
    id: string;
    name: string;
    slug: string; // pc, ps5, xbox-series-x, nintendo-switch
    icon?: string; // Platform ikonu için bir yol veya bileşen adı
  }
  
  export interface GameGenre {
    id: string;
    name: string;
    slug: string;
    icon?: string; // Tür ikonu için
  }
  
  export interface Game {
    id: string;
    title: string;
    slug: string; // Oyunun URL dostu adı (örneğin, "cyberpunk-2077")
    description: string;
    shortDescription?: string;
    coverImageUrl: string; // Ana kapak görseli
    bannerImageUrl?: string; // Daha geniş bir banner görseli (detay sayfası için)
    genres: GameGenre[];
    platforms: GamePlatform[];
    releaseDate: Date | string;
    developer: string;
    publisher: string;
    rating?: number; // 0-100 veya 0-5 arası bir değer
    playerCount?: {
      current?: number; // Anlık oyuncu sayısı (varsa)
      peak?: number; // Zirve oyuncu sayısı
      minMultiplayer?: number;
      maxMultiplayer?: number;
    };
    tags?: string[]; // "Multiplayer", "Co-op", "Singleplayer", "Indie" vb.
    isPopular?: boolean;
    isNewRelease?: boolean;
    trailerUrl?: string;
    storeUrl?: string; // Oyunu satın alma/indirme linki
    // WebsaChat'e özel alanlar:
    isPlayableOnWebsaChat?: boolean; // WebsaChat üzerinden direkt oynanabilir mi?
    WebsaChatLaunchParams?: string; // Oynanabilirse başlatma parametreleri
    communitySize?: number; // WebsaChat üzerindeki topluluk boyutu
  }
  
  export interface UserProfileTeaser { // Bu zaten roomTypes'da var, ama oyunlar için de lazım olabilir
    id: string;
    username: string;
    avatarUrl?: string;
  }