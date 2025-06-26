import React from 'react';
import { ChatRoom } from '../../../../types/chatroomTypes';
import { Lock } from 'lucide-react';

interface RoomAvatarProps {
  room: ChatRoom;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

const RoomAvatar: React.FC<RoomAvatarProps> = ({ 
  room, 
  size = 'md', 
  showStatus = true 
}) => {
  const sizeClasses = {
    sm: 'h-10 w-10 rounded-xl',
    md: 'h-14 w-14 rounded-2xl',
    lg: 'h-20 w-20 rounded-3xl'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl'
  };

  const statusSizes = {
    sm: 'w-3 h-3',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} overflow-hidden ring-2 ring-cyan-100/80 group-hover:ring-cyan-300/60 transition-all duration-500 shadow-lg shadow-cyan-500/10`}>
        {room.owner.profilePictureUrl ? (
          <img 
            src={room.owner.profilePictureUrl} 
            alt={room.owner.nickname} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center">
            <span className={`text-white font-bold ${textSizes[size]}`}>
              {room.owner.nickname.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      
      {showStatus && room.status === 'ACTIVE' && (
        <div className={`absolute -bottom-1 -right-1 ${statusSizes[size]} bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-sm`}>
          <div className="w-full h-full bg-emerald-400 rounded-full animate-pulse" />
        </div>
      )}
      
      {room.type === 'PRIVATE' && (
        <div className="absolute -top-1 -right-1 bg-amber-500 rounded-full p-1">
          <Lock className="h-3 w-3 text-white" />
        </div>
      )}
    </div>
  );
};

export default RoomAvatar;