// types/transactionTypes.ts

/**
 * Tek bir finansal işlemin yapısını tanımlar.
 */
export interface Transaction {
    id: string;
    userId: string;
    transactionType: "COIN_PURCHASE" | "GIFT_SEND" | "DIAMOND_CONVERSION" | "STREAM_REWARD";
    amount: string; // Para birimi (örn: 10.00) veya miktar (örn: 50)
    currency: "TRY" | "USD" | "COIN" | "DIAMOND"; // İşlemin para birimi veya birimi
    relatedEntityId?: string | null;
    relatedEntityType?: "COIN_PACKAGE" | "GIFT" | "USER" | "STREAM" | null;
    description?: string | null;
    platform?: "IYZICO" | "INTERNAL" | "GOOGLE_PLAY" | "APP_STORE" | null;
    platformTransactionId?: string | null;
    status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
    createdAt: string; // ISO Date string
  }
  
  /**
   * Kullanıcının jeton ve elmas bakiyesini tanımlar.
   */
  export interface Balance {
    jetonlar: string;
    elmaslar: string;
  }
  
  /**
   * İşlem listesi API yanıtı için sayfalama meta verileri.
   */
  export interface TransactionPaginationMeta {
    toplamIslem: number;
    suankiSayfa: number;
    toplamSayfa: number;
  }

  /**
 * Satın alınabilir bir jeton paketini tanımlar.
 */
export interface CoinPackage {
    id: string;          // Örn: "PKG100"
    name: string;        // Örn: "Başlangıç Paketi"
    description: string; // Örn: "Sohbete hızlı bir başlangıç yap!"
    coins: number;       // Örn: 1000
    price: number;       // Örn: 10.00
    currency: "TRY" | "USD";
    bonusCoins?: number; // Opsiyonel bonus jeton
    isPopular?: boolean; // Popüler paketleri işaretlemek için
  }