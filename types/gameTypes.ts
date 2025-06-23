// types/gameTypes.ts

export interface GameGenre {
    id: string;
    name: string;
    slug: string;
    icon?: string;
  }
  
  export interface GamePlatform {
    id: string;
    name: string;
    slug: string;
    icon?: string;
  }
  
  export interface Game {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription?: string;
    coverImageUrl: string;
    bannerImageUrl?: string;
    genres: GameGenre[];
    platforms: GamePlatform[];
    releaseDate: Date;
    developer?: string;
    publisher?: string;
    rating?: number;
    tags?: string[];
    isPopular?: boolean;
    isNewRelease?: boolean;
    isPlayableOnWebsaChat?: boolean;
    communitySize?: number;
    trailerUrl?: string;
    storeUrl?: string;
    WebsaChatLaunchParams?: string;
    entryCost?: number;
  }