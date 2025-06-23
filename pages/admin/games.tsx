// pages/admin/games.tsx

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { getGames, getGameCategories, deleteGame } from '@/services/adminService';
import { Game } from '@/types/gameTypes';
import { GameCategory } from '@/types/adminTypes';
import { FaPlus } from 'react-icons/fa';

// Dinamik importlar
const GameList = React.lazy(() => import('@/components/admin/games/GameList'));
const CategoryList = React.lazy(() => import('@/components/admin/games/CategoryList'));
const CreateCategoryModal = React.lazy(() => import('@/components/admin/games/CreateCategoryModal'));
const CreateGameModal = React.lazy(() => import('@/components/admin/games/CreateGameModal'));
const EditGameModal = React.lazy(() => import('@/components/admin/games/EditGameModal'));
// Silme onayı için genel bir modal da oluşturulabilir, şimdilik window.confirm kullanıyoruz.


const GamesAdminPage = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [categories, setCategories] = useState<GameCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal state'leri
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [isGameModalOpen, setIsGameModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);


    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [gamesRes, categoriesRes] = await Promise.all([getGames(), getGameCategories()]);
            if (gamesRes.basarili && gamesRes.veri) setGames(gamesRes.veri.oyunlar);
            if (categoriesRes.basarili && categoriesRes.veri) setCategories(categoriesRes.veri.kategoriler);
        } catch (err) {
            setError('Veriler yüklenirken bir sunucu hatası oluştu.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEditClick = (game: Game) => {
        setSelectedGame(game);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = async (game: Game) => {
        if (window.confirm(`'${game.title}' oyununu silmek istediğinizden emin misiniz?`)) {
            const response = await deleteGame(game.id);
            if(response.basarili) {
                fetchData(); // Listeyi yenile
            } else {
                alert(`Hata: ${response.mesaj}`);
            }
        }
    };


    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Oyun Yönetimi</h1>
                <div className="flex gap-4">
                    <Button onClick={() => setIsCategoryModalOpen(true)}><FaPlus className="mr-2" /> Yeni Kategori</Button>
                    <Button onClick={() => setIsGameModalOpen(true)}><FaPlus className="mr-2" /> Yeni Oyun</Button>
                </div>
            </div>

            {error && <p className="text-red-400 bg-red-500/10 p-4 rounded-lg">{error}</p>}

            {isLoading ? <p className="text-slate-300">Yükleniyor...</p> : (
                <div className="space-y-8">
                     <React.Suspense fallback={<div className="bg-slate-800 rounded-2xl p-6">Yükleniyor...</div>}>
                        <CategoryList categories={categories} />
                        <GameList games={games} onEdit={handleEditClick} onDelete={handleDeleteClick} />
                     </React.Suspense>
                </div>
            )}
            
            <React.Suspense fallback={null}>
                <CreateCategoryModal isOpen={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen} onSuccess={fetchData} />
                <CreateGameModal isOpen={isGameModalOpen} onOpenChange={setIsGameModalOpen} onSuccess={fetchData} categories={categories} />
                <EditGameModal game={selectedGame} isOpen={isEditModalOpen} onOpenChange={setIsEditModalOpen} onSuccess={fetchData} />
            </React.Suspense>

        </AdminLayout>
    );
};

export default GamesAdminPage;