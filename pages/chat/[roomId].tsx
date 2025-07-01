// pages/chat/[roomId].tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { ChatRoom, ChatMessage, ChatParticipant } from '@/types/chatroomTypes';
import { getChatRoom, getChatMessages, getChatParticipants, leaveChatRoom } from '@/services/chatroomService';
import { Header } from '@/components/layout/Header';
import Drawer from '@/components/common/Drawer';
import ChatHeader from '@/components/chat/ChatHeader';
import Message from '@/components/chat/Message';
import MessageInput from '@/components/chat/MessageInput';
import ParticipantList from '@/components/chat/ParticipantList';
import JoinPrivateRoomModal from '@/components/chat/JoinPrivateRoomModal';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const ChatRoomPage = () => {
    const { user, isLoading: authIsLoading } = useAuth();
    const router = useRouter();
    const { roomId } = router.query;

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [room, setRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [participants, setParticipants] = useState<ChatParticipant[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [needsPassword, setNeedsPassword] = useState(false);

    const isOwner = user?.id === room?.ownerId;

    const fetchRoomData = useCallback(async () => {
        if (typeof roomId !== 'string') return;
        setIsLoading(true);
        setError(null);

        try {
            const [roomRes, messagesRes, participantsRes] = await Promise.all([
                getChatRoom(roomId),
                getChatMessages(roomId),
                getChatParticipants(roomId)
            ]);

            if (roomRes.basarili && roomRes.veri) {
                setRoom(roomRes.veri.oda);
            } else {
                if (roomRes.mesaj.includes('şifre gereklidir')) {
                    setNeedsPassword(true);
                    setError(null); // Şifre istenirken hata gösterme
                } else {
                   throw new Error(roomRes.mesaj || 'Oda bilgileri alınamadı.');
                }
            }

            if (messagesRes.basarili && messagesRes.veri) setMessages(messagesRes.veri.mesajlar);
            if (participantsRes.basarili && participantsRes.veri) setParticipants(participantsRes.veri.katilimcilar);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [roomId]);

    useEffect(() => {
        if (!authIsLoading && !user) {
            router.push(`/login?redirect=/chat/${roomId}`);
            return;
        }
        if (user && roomId) {
            fetchRoomData();
        }
    }, [user, authIsLoading, router, roomId, fetchRoomData]);

    const handleLeaveRoom = async () => {
        if (typeof roomId !== 'string') return;
        await leaveChatRoom(roomId);
        router.push('/chat');
    };

    if (authIsLoading || isLoading) {
        return <div className="flex justify-center items-center h-screen bg-slate-900"><FaSpinner className="animate-spin text-white h-10 w-10"/></div>
    }
    
    if (needsPassword) {
        return <JoinPrivateRoomModal roomId={roomId as string} onJoinSuccess={fetchRoomData} />;
    }

    if (error) {
        return <div className="flex flex-col justify-center items-center h-screen bg-slate-900 text-white"><FaExclamationTriangle className="text-red-500 text-4xl mb-4"/>{error}</div>
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
             <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} user={user} />
             <div className="flex-1 flex flex-col overflow-hidden">
                <Header onMenuClick={() => setIsDrawerOpen(!isDrawerOpen)} />

                {room && (
                    <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
                       <div className="col-span-12 lg:col-span-8 xl:col-span-9 flex flex-col h-full">
                           <ChatHeader room={room} onLeave={handleLeaveRoom} isOwner={isOwner} />
                           <div className="flex-1 overflow-y-auto p-6 space-y-4">
                               {messages.map(msg => <Message key={msg.id} message={msg} currentUserId={user!.id} />)}
                           </div>
                           <MessageInput roomId={room.id} onMessageSent={(newMessage) => setMessages(prev => [...prev, newMessage])} />
                       </div>
                       <div className="hidden lg:block lg:col-span-4 xl:col-span-3 h-full bg-slate-800/50 border-l border-slate-700">
                            <ParticipantList participants={participants} room={room} />
                       </div>
                    </div>
                )}
             </div>
        </div>
    );
};

export default ChatRoomPage;