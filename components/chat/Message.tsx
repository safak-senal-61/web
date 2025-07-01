// components/chat/Message.tsx
import React from 'react';
import { ChatMessage } from '@/types/chatroomTypes';
import Image from 'next/image';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface MessageProps {
  message: ChatMessage;
  currentUserId: string;
}

const Message: React.FC<MessageProps> = ({ message, currentUserId }) => {
    const isCurrentUser = message.sender.id === currentUserId;

    return (
        <div className={`flex items-end gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            {!isCurrentUser && (
                <Image src={message.sender.profilePictureUrl || '/default-avatar.png'} alt={message.sender.nickname} width={32} height={32} className="rounded-full flex-shrink-0"/>
            )}
            <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-blue-600 text-white rounded-br-none' : 'bg-slate-700 text-slate-200 rounded-bl-none'}`}>
                 {!isCurrentUser && (
                     <p className="text-xs font-bold text-blue-400 mb-1">{message.sender.nickname}</p>
                 )}
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-2 opacity-60 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                    {format(new Date(message.createdAt), 'HH:mm', { locale: tr })}
                </p>
            </div>
        </div>
    );
};

export default Message;