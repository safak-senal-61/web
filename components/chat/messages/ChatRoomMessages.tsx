// components/chat/ChatRoomMessages.tsx

import React, { useState, useEffect } from 'react';
import { ChatMessage, ChatRoom } from '../../../types/chatroomTypes';
import ChatRoomHeader from '../room/ChatRoomHeader';
import MessageDisplay from './MessageDisplay';
import MessageInput from './MessageInput';

interface ChatRoomMessagesProps {
  room: ChatRoom;
  currentUserId: string;
}

const ChatRoomMessages: React.FC<ChatRoomMessagesProps> = ({ room, currentUserId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);



  // Mock messages for demonstration
  useEffect(() => {
    const mockMessages: ChatMessage[] = [
      {
        id: '1',
        roomId: room.id,
        senderId: room.owner.id,
        content: 'Merhaba herkese! Bu odaya hoş geldiniz 👋',
        messageType: 'TEXT',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        sender: {
          id: room.owner.id,
          username: room.owner.username,
          nickname: room.owner.nickname,
          profilePictureUrl: room.owner.profilePictureUrl
        }
      },
      {
        id: '2',
        roomId: room.id,
        senderId: 'user2',
        content: 'Harika bir oda olmuş, teşekkürler!',
        messageType: 'TEXT',
        createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
        sender: {
          id: 'user2',
          username: 'oyuncu123',
          nickname: 'Oyuncu123',
          profilePictureUrl: null
        }
      },
      {
        id: '3',
        roomId: room.id,
        senderId: 'user3',
        content: 'Bugün hangi oyunu oynayacağız?',
        messageType: 'TEXT',
        createdAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        sender: {
          id: 'user3',
          username: 'gamemaster',
          nickname: 'GameMaster',
          profilePictureUrl: null
        }
      }
    ];
    setMessages(mockMessages);
  }, [room]);



  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      roomId: room.id,
      senderId: currentUserId,
      content: newMessage.trim(),
      messageType: 'TEXT',
      createdAt: new Date().toISOString(),
      sender: {
        id: currentUserId,
        username: 'current_user', // This would come from user context
        nickname: 'Sen',
        profilePictureUrl: null
      }
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleSettingsClick = () => {
    // Settings functionality
    console.log('Settings clicked');
  };

  const handleLeaveClick = () => {
    // Leave room functionality
    console.log('Leave room clicked');
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-gray-50 rounded-2xl border border-slate-200/50 shadow-xl overflow-hidden backdrop-blur-sm">
      {/* Room Header */}
      <ChatRoomHeader 
        room={room}
        onSettingsClick={handleSettingsClick}
        onLeaveClick={handleLeaveClick}
      />

      {/* Messages Area */}
      <MessageDisplay 
        messages={messages}
        currentUserId={currentUserId}
        ownerId={room.ownerId}
        moderators={room.moderators}
      />

      {/* Message Input */}
      <MessageInput 
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        roomId={room.id}
        currentUserId={currentUserId}
        currentUsername="Mevcut Kullanıcı"
      />
    </div>
  );
};

export default ChatRoomMessages;