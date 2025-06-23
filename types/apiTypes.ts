// types/apiTypes.ts

/**
 * Başarılı bir API yanıtını temsil eder. `veri` alanı zorunludur.
 */
interface ApiSuccessResponse<T> {
  basarili: true;
  mesaj: string;
  veri: T;
}

/**
 * Başarısız bir API yanıtını temsil eder. `veri` alanı bulunmaz.
 */
interface ApiErrorResponse {
  basarili: false;
  mesaj: string;
  veri?: undefined; // `veri` alanının olmamasını sağlıyoruz
}

/**
 * Tüm API yanıtları için genel, yeniden kullanılabilir ve tür-güvenli arayüz.
 * `basarili` alanının değerine göre `veri` alanının varlığı belirlenir.
 * @template T Başarılı bir yanıtta `veri` alanının tipini belirtir.
 */
export type ApiResponse<T = null> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Sayfalanmış (paginated) veriler için meta bilgileri.
 */
export interface PaginationMeta {
  toplamKayit: number;
  suankiSayfa: number;
  sayfaBasiOge: number;
  toplamSayfa: number;
}