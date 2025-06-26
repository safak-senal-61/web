import React from 'react';
import { ChatRoom } from '../../../../types/chatroomTypes';

interface RoomStatusProps {
  room: ChatRoom;
  variant?: 'badge' | 'indicator' | 'text';
  size?: 'sm' | 'md' | 'lg';
}

const RoomStatus: React.FC<RoomStatusProps> = ({ 
  room, 
  variant = 'badge',
  size = 'md'
}) => {
  const isActive = room.status === 'ACTIVE';
  
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-xs px-4 py-2', 
    lg: 'text-sm px-6 py-3'
  };

  if (variant === 'badge') {
    return (
      <span className={`inline-flex items-center rounded-2xl font-bold tracking-wide ${
        isActive 
          ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 ring-1 ring-emerald-200/50 shadow-sm' 
          : 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-600 ring-1 ring-slate-200/50'
      } ${sizeClasses[size]}`}>
        {isActive ? '🟢 Aktif' : '⚫ Pasif'}
      </span>
    );
  }

  if (variant === 'indicator') {
    return (
      <div className={`w-3 h-3 rounded-full ${
        isActive ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
      }`} />
    );
  }

  if (variant === 'text') {
    return (
      <span className={`font-medium ${
        isActive ? 'text-emerald-600' : 'text-gray-500'
      }`}>
        {isActive ? 'Aktif' : 'Pasif'}
      </span>
    );
  }

  return null;
};

export default RoomStatus;