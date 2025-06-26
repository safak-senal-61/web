import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../../../types/chatroomTypes';
import { Crown, Shield } from 'lucide-react';

interface MessageDisplayProps {
  messages: ChatMessage[];
  currentUserId: string;
  ownerId: string;
  moderators?: string[];
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({
  messages,
  currentUserId,
  ownerId,
  moderators = []
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getUserRole = (userId: string) => {
    if (userId === ownerId) return 'owner';
    if (moderators?.includes(userId)) return 'moderator';
    return 'member';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner':
        return <Crown className="h-3 w-3 text-amber-500" />;
      case 'moderator':
        return <Shield className="h-3 w-3 text-violet-500" />;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 ring-1 ring-amber-200">Sahip</span>;
      case 'moderator':
        return <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-semibold bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 ring-1 ring-violet-200">Moderatör</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="space-y-6">
        {messages.map((message, index) => {
          const role = getUserRole(message.senderId);
          const isCurrentUser = message.senderId === currentUserId;
          
          return (
            <div key={index} className={`flex items-start space-x-4 group ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="h-12 w-12 rounded-2xl overflow-hidden ring-2 ring-white shadow-lg">
                  {message.sender.profilePictureUrl ? (
                    <img src={message.sender.profilePictureUrl} alt={message.sender.username} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-violet-400 to-purple-500 text-white font-semibold text-sm">
                      {message.sender.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {/* Role indicator */}
                {role !== 'member' && (
                  <div className="absolute -top-1 -right-1 p-1 bg-white rounded-full shadow-md">
                    {getRoleIcon(role)}
                  </div>
                )}
              </div>

              {/* Message Content */}
              <div className={`flex-1 min-w-0 ${isCurrentUser ? 'text-right' : ''}`}>
                {/* Message Header */}
                <div className={`flex items-center space-x-3 mb-2 ${isCurrentUser ? 'justify-end flex-row-reverse space-x-reverse' : ''}`}>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-800">{message.sender.username}</span>
                    {getRoleBadge(role)}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {new Date(message.createdAt).toLocaleTimeString('tr-TR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                
                {/* Message Bubble */}
                <div className={`relative max-w-lg ${isCurrentUser ? 'ml-auto' : 'mr-auto'}`}>
                  <div className={`px-4 py-3 rounded-2xl shadow-sm ring-1 backdrop-blur-sm transition-all duration-200 group-hover:shadow-md ${
                    isCurrentUser 
                      ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-violet-500/20 ring-violet-200/30' 
                      : 'bg-white/80 text-slate-800 ring-slate-200/50 hover:bg-white/90'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {message.content}
                    </p>
                  </div>
                  
                  {/* Message tail */}
                  <div className={`absolute top-4 w-3 h-3 ${
                    isCurrentUser 
                      ? '-left-1 bg-gradient-to-br from-violet-500 to-purple-600 transform rotate-45' 
                      : '-right-1 bg-white/80 ring-1 ring-slate-200/50 transform rotate-45'
                  }`} />
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageDisplay;