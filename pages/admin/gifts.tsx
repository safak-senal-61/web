// pages/admin/gifts.tsx

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { getGifts } from '@/services/adminService';
import { Gift } from '@/types/adminTypes';
import { FaPlus } from 'react-icons/fa';

// Bileşenleri dinamik olarak import edelim
const GiftList = React.lazy(() => import('@/components/admin/gifts/GiftList'));
const CreateGiftModal = React.lazy(() => import('@/components/admin/gifts/CreateGiftModal'));

const GiftsAdminPage = () => {
    const [gifts, setGifts] = useState<Gift[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const giftsRes = await getGifts();
            if (giftsRes.basarili && giftsRes.veri) {
                setGifts(giftsRes.veri.hediyeler);
            } else {
                setError(giftsRes.mesaj || 'Hediyeler yüklenemedi.');
            }
        } catch (err) {
            setError('Veriler yüklenirken bir sunucu hatası oluştu.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Hediye Yönetimi</h1>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <FaPlus className="mr-2" /> Yeni Hediye Ekle
                </Button>
            </div>

            {error && <p className="text-red-400 bg-red-500/10 p-4 rounded-lg">{error}</p>}

            {isLoading ? (
                <p className="text-slate-300">Yükleniyor...</p>
            ) : (
                <React.Suspense fallback={<div className="bg-slate-800 rounded-2xl p-6">Yükleniyor...</div>}>
                    <GiftList gifts={gifts} onEdit={() => {}} onDelete={() => {}} />
                </React.Suspense>
            )}

            <React.Suspense fallback={null}>
                <CreateGiftModal 
                    isOpen={isCreateModalOpen}
                    onOpenChange={setIsCreateModalOpen}
                    onSuccess={fetchData}
                />
            </React.Suspense>
        </AdminLayout>
    );
};

export default GiftsAdminPage;