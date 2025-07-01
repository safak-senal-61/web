// pages/chat/index.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { Header } from '@/components/layout/Header';
import Drawer from '@/components/common/Drawer';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { FaPlusCircle, FaComments, FaSearch } from 'react-icons/fa';
import { getPublicChatRooms } from '@/services/chatroomService';
import { ChatRoom } from '@/types/chatroomTypes';
import ChatRoomCard from '@/components/chat/ChatRoomCard';
import CreateRoomModal from '@/components/chat/CreateRoomModal';
import { Input } from '@/components/ui/input';

const ChatPage = () => {
    const { user, isLoading: authIsLoading } = useAuth();
    const router = useRouter();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchChatRooms = useCallback(async () => {
        setIsLoading(true);
        const response = await getPublicChatRooms(1, 50); // İlk 50 odayı al
        if (response.basarili && response.veri) {
            setChatRooms(response.veri.odalar);
        } else {
            // Hata yönetimi eklenebilir
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!authIsLoading && !user) {
            router.push('/login?redirect=/chat');
            return;
        }
        if (user) {
            fetchChatRooms();
        }
    }, [user, authIsLoading, router, fetchChatRooms]);
    
    const filteredRooms = chatRooms.filter(room => 
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        room.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/90 to-slate-900">
            <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} user={user} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setIsDrawerOpen(!isDrawerOpen)} />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
                    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl sm:text-4xl font-bold text-white">Sohbet Odaları</h1>
                                <p className="mt-2 text-md text-slate-300">
                                    Canlı sohbet odalarını keşfet veya kendi odanı oluştur.
                                </p>
                            </div>
                            <Button onClick={() => setIsCreateModalOpen(true)} className="self-start md:self-center">
                                <FaPlusCircle className="mr-2" />
                                Yeni Oda Oluştur
                            </Button>
                        </div>

                        <div className="relative">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input 
                                placeholder="Odalarda ara..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 bg-slate-800/70 border-slate-700 h-12"
                            />
                        </div>

                        {isLoading ? (
                            <div className="text-center py-16 text-white">Yükleniyor...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {filteredRooms.map(room => (
                                    <ChatRoomCard key={room.id} room={room} />
                                ))}
                            </div>
                        )}
                         { !isLoading && filteredRooms.length === 0 && (
                            <div className="text-center py-20 bg-slate-800/50 rounded-2xl">
                                <FaComments className="mx-auto text-5xl text-slate-500 mb-4" />
                                <h3 className="text-xl font-semibold text-white">Sohbet Odası Bulunamadı</h3>
                                <p className="text-slate-400 mt-2">İlk odayı siz oluşturun!</p>
                            </div>
                         )}
                    </div>
                </main>
            </div>
            
            <CreateRoomModal 
                isOpen={isCreateModalOpen}
                onOpenChange={setIsCreateModalOpen}
                onSuccess={() => fetchChatRooms()} // Oda oluşturulunca listeyi yenile
            />
        </div>
    );
};

export default ChatPage;