// components/chat/ChatHeader.tsx
import React from 'react';
import { ChatRoom } from '@/types/chatroomTypes';
import { Button } from '@/components/ui/button';
import { FaArrowLeft, FaCog, FaTrash, FaSignOutAlt } from 'react-icons/fa';
import Link from 'next/link';

interface ChatHeaderProps {
  room: ChatRoom;
  onLeave: () => void;
  isOwner: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ room, onLeave, isOwner }) => {
    return (
        <div className="flex-shrink-0 flex items-center justify-between p-4 bg-slate-800/80 backdrop-blur-sm border-b border-slate-700">
            <div className="flex items-center gap-4">
                <Link href="/chat">
                    <Button variant="ghost" size="icon"><FaArrowLeft /></Button>
                </Link>
                <div>
                    <h2 className="text-lg font-bold text-white">{room.title}</h2>
                    <p className="text-xs text-slate-400">{room.description}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {isOwner && (
                    <>
                        <Button variant="ghost" size="icon" title="Oda Ayarları"><FaCog /></Button>
                        <Button variant="destructive" size="icon" title="Odayı Sil"><FaTrash /></Button>
                    </>
                )}
                <Button onClick={onLeave} variant="outline" size="sm" className="ml-2">
                    <FaSignOutAlt className="mr-2 h-4 w-4" />
                    Ayrıl
                </Button>
            </div>
        </div>
    );
};

export default ChatHeader;