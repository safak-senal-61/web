// components/chat/ChatRoomCard.tsx

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ChatRoom } from '../../../types/chatroomTypes';
import chatroomService from '../../../services/chatroomService';
import { useAuth } from '../../../hooks/useAuth';
import RoomAvatar from './components/RoomAvatar';
import RoomStatus from './components/RoomStatus';
import RoomParticipantInfo from './components/RoomParticipantInfo';
import RoomActions from './components/RoomActions';
import DateFormatter from '../shared/DateFormatter';

interface ChatRoomCardProps {
  room: ChatRoom;
  onRoomDeleted?: () => void;
  variant?: 'default' | 'compact' | 'detailed';
}

const ChatRoomCard: React.FC<ChatRoomCardProps> = ({ 
  room, 
  onRoomDeleted,
  variant = 'default'
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isJoining, setIsJoining] = useState(false);
  
  const isOwner = user && user.id === room.owner.id;
  const currentCount = room.currentParticipantCount || room.activeParticipants?.length || 0;
  const isFull = currentCount >= room.maxParticipants;
  const isActive = room.status === 'ACTIVE';

  const handleJoinRoom = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (isFull || !isActive) return;

    setIsJoining(true);
    try {
      await chatroomService.joinChatRoom(room.id);
      router.push(`/chat/room/${room.id}`);
    } catch (error) {
      console.error('Odaya katılma hatası:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleDeleteRoom = async () => {
    try {
      await chatroomService.deleteChatRoom(room.id);
      onRoomDeleted?.();
    } catch (error) {
      console.error('Oda silme hatası:', error);
    }
  };

  const handleViewMessages = () => {
    router.push(`/chat/room/${room.id}/messages`);
  };

  if (variant === 'compact') {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center space-x-3">
          <RoomAvatar room={room} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{room.title}</h3>
            <p className="text-sm text-gray-500 truncate">@{room.owner.username}</p>
          </div>
          <div className="flex items-center space-x-2">
            <RoomStatus room={room} variant="indicator" />
            <RoomParticipantInfo room={room} variant="compact" showProgressBar={false} />
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <RoomAvatar room={room} size="lg" />
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                {room.title}
              </h3>
              <p className="text-sm text-gray-500">@{room.owner.username}</p>
              <div className="mt-2">
                <RoomStatus room={room} variant="badge" size="sm" />
              </div>
            </div>
          </div>
          <RoomActions 
            room={room}
            onDelete={handleDeleteRoom}
            variant="minimal"
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Description */}
        {room.description && (
          <p className="text-gray-600 text-sm line-clamp-2">
            {room.description}
          </p>
        )}

        {/* Cover Image */}
        {room.coverImageUrl && (
          <div className="relative h-32 rounded-lg overflow-hidden">
            <img 
              src={room.coverImageUrl} 
              alt={room.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Participants */}
        <RoomParticipantInfo room={room} showProgressBar={true} variant="detailed" />

        {/* Created Date */}
        <div className="flex items-center text-sm text-gray-500">
          <span>Oluşturulma: </span>
          <DateFormatter date={room.createdAt} format="relative" className="ml-1" />
        </div>

        {/* Tags */}
        {room.tags && room.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {room.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index} 
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
              >
                #{tag}
              </span>
            ))}
            {room.tags.length > 3 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                +{room.tags.length - 3} daha
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-6 pt-0">
        <RoomActions 
          room={room}
          onJoin={handleJoinRoom}
          onViewMessages={handleViewMessages}
          onDelete={handleDeleteRoom}
          variant="buttons"
        />
      </div>
    </div>
  );
};

export default ChatRoomCard;