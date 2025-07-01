// components/chat/ChatRoomCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChatRoom } from '@/types/chatroomTypes';
import { FaUsers, FaLock, FaUserCircle, FaComments } from 'react-icons/fa';

interface ChatRoomCardProps {
    room: ChatRoom;
}

const ChatRoomCard: React.FC<ChatRoomCardProps> = ({ room }) => {
    return (
        <Link href={`/chat/${room.id}`} className="group block bg-slate-800/70 border border-slate-700 rounded-2xl p-5 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-blue-500/10">
            <div className="flex flex-col h-full">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-4">
                    {room.coverImageUrl ? (
                        <Image src={room.coverImageUrl} alt={room.title} layout="fill" objectFit="cover" className="group-hover:scale-105 transition-transform duration-300"/>
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
                            <FaComments className="text-4xl text-slate-500" />
                        </div>
                    )}
                     {room.type === 'PRIVATE' && (
                        <div className="absolute top-2 right-2 p-2 bg-black/50 rounded-full">
                            <FaLock className="text-white text-xs"/>
                        </div>
                    )}
                </div>
                <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-400 transition-colors">{room.title}</h3>
                <p className="text-sm text-slate-400 flex-grow mb-4 line-clamp-2">{room.description}</p>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-700 pt-3 mt-auto">
                    <div className="flex items-center gap-2">
                         <FaUserCircle />
                         <span className='truncate'>{room.owner.nickname}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUsers />
                        <span>{room.currentParticipantCount} / {room.maxParticipants}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ChatRoomCard;