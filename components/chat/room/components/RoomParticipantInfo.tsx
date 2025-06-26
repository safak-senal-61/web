import React from 'react';
import { ChatRoom } from '../../../../types/chatroomTypes';
import { Users } from 'lucide-react';

interface RoomParticipantInfoProps {
  room: ChatRoom;
  showProgressBar?: boolean;
  variant?: 'compact' | 'detailed';
}

const RoomParticipantInfo: React.FC<RoomParticipantInfoProps> = ({ 
  room, 
  showProgressBar = true,
  variant = 'detailed'
}) => {
  const currentCount = room.currentParticipantCount || room.activeParticipants?.length || 0;
  const maxCount = room.maxParticipants;
  const percentage = Math.round((currentCount / maxCount) * 100);
  const isFull = currentCount >= maxCount;
  
  const getProgressColor = () => {
    if (percentage >= 90) return 'from-red-400 to-red-600';
    if (percentage >= 70) return 'from-amber-400 to-orange-500';
    return 'from-emerald-400 to-green-500';
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center space-x-2 text-sm text-slate-600">
        <Users className="h-4 w-4" />
        <span className={isFull ? 'text-red-600 font-semibold' : ''}>
          {currentCount}/{maxCount}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2 text-slate-600">
          <Users className="h-4 w-4" />
          <span>Katılımcılar</span>
        </div>
        <span className={`font-semibold ${
          isFull ? 'text-red-600' : 'text-slate-700'
        }`}>
          {currentCount}/{maxCount}
        </span>
      </div>
      
      {showProgressBar && (
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getProgressColor()} transition-all duration-500 rounded-full`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
          {isFull && (
            <div className="absolute inset-0 bg-red-500/20 animate-pulse rounded-full" />
          )}
        </div>
      )}
      
      {isFull && (
        <div className="text-xs text-red-600 font-medium flex items-center space-x-1">
          <span>⚠️</span>
          <span>Oda dolu</span>
        </div>
      )}
    </div>
  );
};

export default RoomParticipantInfo;