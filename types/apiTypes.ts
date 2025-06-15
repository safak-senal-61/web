/**
 * Tüm API yanıtları için genel, yeniden kullanılabilir arayüz.
 * Hata durumlarında (`basarili: false`), `veri` alanı genellikle bulunmaz.
 * Başarılı durumlarda (`basarili: true`), `veri` alanı beklenen datayı içerir.
 * @template T Başarılı bir yanıtta `veri` alanının tipini belirtir. Varsayılan `null`'dır.
 */
export interface ApiResponse<T = null> {
    basarili: boolean;
    mesaj: string;
    veri?: T;
  }
  
  /**
   * Sayfalanmış (paginated) veriler için meta bilgileri.
   */
  export interface PaginationMeta {
    toplamKayit: number;
    suankiSayfa: number;
    sayfaBasiOge: number;
    toplamSayfa: number;
  }