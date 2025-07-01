// components/chat/ParticipantList.tsx
import React from 'react';
import { ChatParticipant, ChatRoom } from '@/types/chatroomTypes';
import { FaCrown, FaShieldAlt } from 'react-icons/fa';
import Image from 'next/image';

interface ParticipantListProps {
  participants: ChatParticipant[];
  room: ChatRoom;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ participants, room }) => {
  return (
    <div className="p-4 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-4">Katılımcılar ({participants.length})</h3>
      <div className="space-y-3 overflow-y-auto">
        {participants.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-700/50">
                <Image src={p.profilePictureUrl || '/default-avatar.png'} alt={p.nickname} width={40} height={40} className="rounded-full"/>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-white truncate">{p.nickname}</p>
                    <p className="text-xs text-slate-400">@{p.username}</p>
                </div>
                <div className="flex gap-2 text-lg text-slate-500">
                    {p.id === room.ownerId && <FaCrown className="text-yellow-400" title="Oda Sahibi"/>}
                    {room.moderators.includes(p.id) && <FaShieldAlt className="text-blue-400" title="Moderatör" />}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default ParticipantList;