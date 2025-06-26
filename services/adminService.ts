// services/adminService.ts

import apiClient from '../lib/apiClient';
import { ApiResponse, PaginationMeta } from '../types/apiTypes';
import { GameCategory, Gift, Report } from '../types/adminTypes';
import { Game } from '../types/gameTypes';
import { User } from '@/types/userTypes';

// --- YÖNETİCİ KAYDI ---
export interface AdminRegistrationRequest {
    username: string;
    email: string;
    password: string;
    nickname: string;
    registrationSecret: string;
}

export const registerAdmin = async (payload: AdminRegistrationRequest): Promise<ApiResponse<{ kullanici: User }>> => {
    return (await apiClient.post('/auth/register-admin', payload)).data;
};

// --- OYUN KATEGORİSİ FONKSİYONLARI ---
export const getGameCategories = async (): Promise<ApiResponse<{ kategoriler: GameCategory[] }>> => {
    return (await apiClient.get('/games/categories')).data;
};
export const createGameCategory = async (data: { name: string; slug?: string; iconUrl?: string }): Promise<ApiResponse<{ kategori: GameCategory }>> => {
    return (await apiClient.post('/games/categories', data)).data;
};

// --- OYUN FONKSİYONLARI ---
export const getGames = async (): Promise<ApiResponse<{ oyunlar: Game[] }>> => {
    return (await apiClient.get('/games')).data;
};
export const createGame = async (data: { gameId: string; name: string; description?: string; iconUrl?: string; entryCost?: number; categoryId?: string; }): Promise<ApiResponse<{ oyun: Game }>> => {
    return (await apiClient.post('/games', data)).data;
};
export const updateGame = async (gameModelId: string, data: { name?: string; description?: string; entryCost?: number; }): Promise<ApiResponse<{ oyun: Game }>> => {
    return (await apiClient.put(`/games/${gameModelId}`, data)).data;
};
export const deleteGame = async (gameModelId: string): Promise<ApiResponse<null>> => {
    return (await apiClient.delete(`/games/${gameModelId}`)).data;
};

// --- HEDİYE FONKSİYONLARI ---
export const getGifts = async (): Promise<ApiResponse<{ hediyeler: Gift[] }>> => {
    return (await apiClient.get('/gifts')).data;
};
export const createGift = async (data: { giftId: string; name: string; cost: number; value: number; imageUrl: string; }): Promise<ApiResponse<{ hediye: Gift }>> => {
    return (await apiClient.post('/gifts', data)).data;
};
export const updateGift = async (giftModelId: string, data: { name?: string; cost?: number; value?: number; isActive?: boolean; }): Promise<ApiResponse<{ hediye: Gift }>> => {
    return (await apiClient.put(`/gifts/${giftModelId}`, data)).data;
};
export const deleteGift = async (giftModelId: string): Promise<ApiResponse<null>> => {
    return (await apiClient.delete(`/gifts/${giftModelId}`)).data;
};

// --- DUYURU FONKSİYONLARI ---
export const sendSystemAnnouncement = async (data: { title: string; message: string; targetUserIds?: string[]; targetSegment?: string }): Promise<ApiResponse<null>> => {
    return (await apiClient.post('/notifications/system-announcement', data)).data;
};

// --- RAPOR FONKSİYONLARI ---
export const getAllReports = async (params: { page?: number, limit?: number, status?: string, type?: string }): Promise<ApiResponse<{ raporlar: Report[], meta: PaginationMeta }>> => {
    return (await apiClient.get('/reports/all', { params })).data;
};
export const getReportDetails = async (reportId: string): Promise<ApiResponse<{ rapor: Report }>> => {
    return (await apiClient.get(`/reports/${reportId}`)).data;
};
export const updateReportStatus = async (reportId: string, status: string): Promise<ApiResponse<{ rapor: Report }>> => {
    return (await apiClient.put(`/reports/${reportId}/status`, { status })).data;
};

// --- MANUEL İŞLEM FONKSİYONLARI (Admin) ---
export const createManualTransaction = async (data: { userId: string; transactionType: string; amount: number; currency: string; }): Promise<ApiResponse<any>> => {
    return (await apiClient.post('/transactions', data)).data;
};