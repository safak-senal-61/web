// services/transactionService.ts

import apiClient from '../lib/apiClient';
import { ApiResponse, PaginationMeta } from '../types/apiTypes';
import { Transaction, Balance } from '../types/transactionTypes';

type GetTransactionsParams = {
  page?: number;
  limit?: number;
  type?: "COIN_PURCHASE" | "GIFT_SEND" | "DIAMOND_CONVERSION" | "STREAM_REWARD";
};

/**
 * Giriş yapmış kullanıcının finansal işlemlerini listeler.
 */
export const getMyTransactions = async (params: GetTransactionsParams = {}): Promise<ApiResponse<{ islemler: Transaction[], meta: PaginationMeta }>> => {
  try {
    const response = await apiClient.get('/transactions/me', { params });
    return response.data;
  } catch (error: any) {
    return error.response?.data || { basarili: false, mesaj: "İşlemler getirilirken bir hata oluştu." };
  }
};

/**
 * Giriş yapmış kullanıcının mevcut bakiyesini getirir.
 */
export const getMyBalance = async (): Promise<ApiResponse<{ bakiye: Balance }>> => {
    try {
        const response = await apiClient.get('/transactions/balance/me');
        return response.data;
    } catch (error: any) {
        return error.response?.data || { basarili: false, mesaj: "Bakiye bilgisi alınamadı." };
    }
};

/**
 * Belirtilen miktarda elması jetona dönüştürür.
 */
export const convertDiamondsToCoins = async (diamondAmount: number): Promise<ApiResponse<{ yeniBakiye: Balance }>> => {
    try {
        const response = await apiClient.post('/transactions/convert/diamonds-to-coins', { diamondAmount });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { basarili: false, mesaj: "Dönüşüm sırasında bir hata oluştu." };
    }
};


/**
 * Seçilen jeton paketi için Iyzico ödeme formunu başlatır.
 * @param coinPackageId Satın alınacak paketin ID'si
 */
export const purchaseCoinPackage = async (coinPackageId: string): Promise<ApiResponse<{ paymentPageContent: string }>> => {
    try {
        const response = await apiClient.post('/transactions/purchase/coins', { coinPackageId });
        return response.data;
    } catch (error: any) {
        return error.response?.data || { basarili: false, mesaj: "Ödeme işlemi başlatılırken bir hata oluştu." };
    }
};