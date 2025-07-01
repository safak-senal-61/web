// types/apiTypes.ts

/**
 * Başarılı bir API yanıtını temsil eder.
 * @template T Başarılı yanıttaki 'veri' alanının tipi.
 * @template M Başarılı yanıttaki 'meta' alanının tipi (opsiyonel).
 */
interface ApiSuccessResponse<T, M = never> {
  basarili: true;
  mesaj: string;
  veri: T;
  meta?: M; // Opsiyonel meta alanı
}

/**
 * Başarısız bir API yanıtını temsil eder. 'veri' alanı bulunmaz.
 */
interface ApiErrorResponse {
  basarili: false;
  mesaj: string;
  veri?: undefined;
}

/**
 * Tüm API yanıtları için genel, yeniden kullanılabilir ve tür-güvenli arayüz.
 * 'basarili' alanının değerine göre 'veri' ve 'meta' alanlarının varlığı belirlenir.
 * @template T Başarılı bir yanıtta 'veri' alanının tipini belirtir.
 * @template M Başarılı bir yanıtta 'meta' alanının tipini belirtir.
 */
export type ApiResponse<T = null, M = never> = ApiSuccessResponse<T, M> | ApiErrorResponse;

/**
 * Sayfalanmış (paginated) veriler için temel meta bilgileri.
 */
export interface PaginationMeta {
  suankiSayfa: number;
  sayfaBasiOge: number;
  toplamSayfa: number;
  toplamKayit?: number; // toplamOda, toplamSonuc gibi alanları birleştirelim
}