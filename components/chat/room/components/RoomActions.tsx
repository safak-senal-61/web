import React, { useState } from 'react';
import { ChatRoom } from '../../../../types/chatroomTypes';
import { Trash2, Settings, MessageCircle, UserPlus, LogOut } from 'lucide-react';
import { useAuth } from '../../../../hooks/useAuth';

interface RoomActionsProps {
  room: ChatRoom;
  onJoin?: () => void;
  onLeave?: () => void;
  onDelete?: () => void;
  onSettings?: () => void;
  onViewMessages?: () => void;
  variant?: 'dropdown' | 'buttons' | 'minimal';
}

const RoomActions: React.FC<RoomActionsProps> = ({ 
  room, 
  onJoin,
  onLeave,
  onDelete,
  onSettings,
  onViewMessages,
  variant = 'buttons'
}) => {
  const { user } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  
  const isOwner = user && user.id === room.owner.id;
  const isParticipant = user && room.activeParticipants?.some(p => p === user.id);
  const isFull = (room.currentParticipantCount || room.activeParticipants?.length || 0) >= room.maxParticipants;

  const actions = [
    {
      key: 'join',
      label: 'Katıl',
      icon: UserPlus,
      onClick: onJoin,
      show: !isParticipant && !isFull && onJoin,
      className: 'bg-blue-500 hover:bg-blue-600 text-white'
    },
    {
      key: 'leave', 
      label: 'Ayrıl',
      icon: LogOut,
      onClick: onLeave,
      show: isParticipant && onLeave,
      className: 'bg-red-500 hover:bg-red-600 text-white'
    },
    {
      key: 'messages',
      label: 'Mesajlar',
      icon: MessageCircle,
      onClick: onViewMessages,
      show: onViewMessages,
      className: 'bg-green-500 hover:bg-green-600 text-white'
    },
    {
      key: 'settings',
      label: 'Ayarlar',
      icon: Settings,
      onClick: onSettings,
      show: isOwner && onSettings,
      className: 'bg-gray-500 hover:bg-gray-600 text-white'
    },
    {
      key: 'delete',
      label: 'Sil',
      icon: Trash2,
      onClick: onDelete,
      show: isOwner && onDelete,
      className: 'bg-red-500 hover:bg-red-600 text-white'
    }
  ].filter(action => action.show);

  if (variant === 'minimal') {
    return (
      <div className="flex items-center space-x-2">
        {isOwner && onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50/80 rounded-xl transition-all duration-300 hover:scale-110"
            title="Odayı Sil"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(!showDropdown);
          }}
          className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Settings className="h-4 w-4" />
        </button>
        
        {showDropdown && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-2 z-10">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick?.();
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <button
            key={action.key}
            onClick={(e) => {
              e.stopPropagation();
              action.onClick?.();
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1 ${action.className}`}
          >
            <Icon className="h-4 w-4" />
            <span>{action.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default RoomActions;