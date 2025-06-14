// pages/games/sampleGameData.ts
import { Game, GamePlatform, GameGenre } from '../types/gameTypes'; // Bu yolu kontrol edin, muhtemelen ../../types/gameTypes doğru

export const samplePlatforms: GamePlatform[] = [
  { id: 'p1', name: 'PC', slug: 'pc', icon: 'FaWindows' },
  { id: 'p2', name: 'PlayStation 5', slug: 'ps5', icon: 'FaPlaystation' },
  { id: 'p3', name: 'Xbox Series X/S', slug: 'xbox-series-xs', icon: 'FaXbox' },
  { id: 'p4', name: 'Nintendo Switch', slug: 'nintendo-switch', icon: 'FaMobileAlt' },
];

export const sampleGenres: GameGenre[] = [
  { id: 'g1', name: 'Aksiyon', slug: 'action', icon: 'GiCrosshair' },
  { id: 'g2', name: 'Macera', slug: 'adventure', icon: 'GiBackpack' },
  { id: 'g3', name: 'RPG', slug: 'rpg', icon: 'GiCrystalBall' },
  { id: 'g4', name: 'Strateji', slug: 'strategy', icon: 'GiChessKnight' },
  { id: 'g5', name: 'Simülasyon', slug: 'simulation', icon: 'GiSteeringWheel' },
  { id: 'g6', name: 'Spor', slug: 'sports', icon: 'GiBasketballBall' },
  { id: 'g7', name: 'MOBA', slug: 'moba', icon: 'GiSwordsEmblem' },
  { id: 'g8', name: 'FPS', slug: 'fps', icon: 'GiTargetShot' },
];

export const sampleGamesData: Game[] = [
  {
    id: 'game1',
    title: 'Cyber Guardian 2088',
    slug: 'cyber-guardian-2088',
    description: 'Neon ışıklı bir metropolde geçen, yüksek oktanlı bir siberpunk aksiyon RPG. İnsanlığın kaderi senin ellerinde.',
    shortDescription: 'Siberpunk aksiyon RPG.',
    coverImageUrl: 'https://source.unsplash.com/random/400x550?cyberpunk,game',
    bannerImageUrl: 'https://source.unsplash.com/random/1200x400?cyberpunk,city',
    genres: [sampleGenres[0], sampleGenres[2]], // Aksiyon, RPG
    platforms: [samplePlatforms[0], samplePlatforms[1], samplePlatforms[2]], // PC, PS5, Xbox
    releaseDate: new Date('2024-03-15'),
    developer: 'NeonByte Studios',
    publisher: 'FuturePlay Games',
    rating: 88,
    tags: ['Multiplayer', 'Co-op', 'Open World'],
    isPopular: true,
    isNewRelease: true,
    isPlayableOnWebsaChat: true,
    communitySize: 125000,
    trailerUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    storeUrl: '#',
  },
  {
    id: 'game2',
    title: 'Cosmic Colonizers',
    slug: 'cosmic-colonizers',
    description: 'Geniş bir galakside kendi kolonini kur, yeni gezegenler keşfet ve yıldızlararası bir imparatorluk yönet.',
    shortDescription: 'Galaktik koloni simülasyonu.',
    coverImageUrl: 'https://source.unsplash.com/random/400x550?space,strategy,game',
    bannerImageUrl: 'https://source.unsplash.com/random/1200x400?galaxy,stars',
    genres: [sampleGenres[3], sampleGenres[4]], // Strateji, Simülasyon
    platforms: [samplePlatforms[0]], // PC
    releaseDate: new Date('2023-11-01'),
    developer: 'Galaxy Interactive',
    publisher: 'Stellaris Inc.',
    rating: 92,
    tags: ['Singleplayer', '4X', 'Sci-Fi'],
    isPopular: true,
    isNewRelease: false,
    isPlayableOnWebsaChat: false,
    communitySize: 78000,
  },
  {
    id: 'game3',
    title: 'Valorant',
    slug: 'valorant',
    description: '5v5 karakter tabanlı taktiksel nişancı oyunu. Yaratıcılığın en büyük silahın olduğu küresel rekabetçi bir sahnede yeteneklerini sergile.',
    shortDescription: 'Taktiksel 5v5 nişancı.',
    coverImageUrl: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt9cfd5bd17cbc1923/6333a3c66f69a347b8e46954/Val_Banner_Mask_Gradient_2560x1080.png?width=400&height=550&fit=cover',
    bannerImageUrl: 'https://images.contentstack.io/v3/assets/bltb6530b271fddd0b1/blt0c91f21b0f33a746/6333a3c74c529947932ae49e/Val_Red_Mask_Gradient_Banner_1200x400.png?width=1200&height=400&fit=cover',
    genres: [sampleGenres[0], sampleGenres[7]], // Aksiyon, FPS
    platforms: [samplePlatforms[0]], // PC
    releaseDate: new Date('2020-06-02'),
    developer: 'Riot Games',
    publisher: 'Riot Games',
    rating: 90,
    tags: ['Multiplayer', 'Competitive', 'Esports'],
    isPopular: true,
    isNewRelease: false,
    isPlayableOnWebsaChat: true,
    communitySize: 1500000,
    WebsaChatLaunchParams: 'valorant://launch',
  },
  {
    id: 'game4',
    title: 'Mystic Grove',
    slug: 'mystic-grove',
    description: 'Büyülü bir ormanda geçen, rahatlatıcı bir macera ve keşif oyunu. Ormanın sırlarını çöz ve sevimli yaratıklarla arkadaş ol.',
    shortDescription: 'Rahatlatıcı macera oyunu.',
    coverImageUrl: 'https://source.unsplash.com/random/400x550?fantasy,forest,game',
    bannerImageUrl: 'https://source.unsplash.com/random/1200x400?enchanted,forest',
    genres: [sampleGenres[1]], // Macera
    platforms: [samplePlatforms[0], samplePlatforms[3]], // PC, Switch
    releaseDate: new Date('2024-05-20'),
    developer: 'Whimsy Works',
    publisher: 'IndieDream',
    rating: 85,
    tags: ['Indie', 'Exploration', 'Cozy'],
    isPopular: false,
    isNewRelease: true,
    isPlayableOnWebsaChat: false,
  }
];