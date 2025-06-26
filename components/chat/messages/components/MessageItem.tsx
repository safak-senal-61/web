import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../../ui/avatar';
import { Badge } from '../../../ui/badge';
import { ChatMessage } from '../../../../types/chatroomTypes';
import DateFormatter from '../../shared/DateFormatter';

interface MessageItemProps {
  message: ChatMessage;
  variant?: 'card' | 'bubble' | 'compact';
  showAvatar?: boolean;
  showBadge?: boolean;
  className?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  variant = 'card',
  showAvatar = true,
  showBadge = true,
  className = ''
}) => {
  const getMessageTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'system':
        return 'bg-blue-100 text-blue-800';
      case 'announcement':
        return 'bg-yellow-100 text-yellow-800';
      case 'warning':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderAvatar = () => {
    if (!showAvatar) return null;
    
    return (
      <Avatar className="h-10 w-10 flex-shrink-0">
        {message.sender.profilePictureUrl ? (
          <img 
            src={message.sender.profilePictureUrl} 
            alt={message.sender.nickname}
            className="h-full w-full object-cover rounded-full"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {message.sender.nickname.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </Avatar>
    );
  };

  const renderMessageHeader = () => (
    <div className="flex items-center space-x-2 mb-1">
      <span className="font-medium text-gray-900">
        {message.sender.nickname}
      </span>
      <span className="text-sm text-gray-500">
        @{message.sender.username}
      </span>
      {showBadge && (
        <Badge 
          variant="secondary" 
          className={`text-xs ${getMessageTypeColor(message.messageType)}`}
        >
          {message.messageType}
        </Badge>
      )}
    </div>
  );

  if (variant === 'bubble') {
    return (
      <div className={`flex items-start space-x-3 ${className}`}>
        {renderAvatar()}
        <div className="flex-1 min-w-0">
          {renderMessageHeader()}
          <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
            <p className="text-gray-800">{message.content}</p>
            <DateFormatter 
              date={message.createdAt} 
              format="relative"
              className="text-xs text-gray-500 mt-1 block"
            />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center space-x-3 py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors ${className}`}>
        {showAvatar && (
          <Avatar className="h-8 w-8 flex-shrink-0">
            {message.sender.profilePictureUrl ? (
              <img 
                src={message.sender.profilePictureUrl} 
                alt={message.sender.nickname}
                className="h-full w-full object-cover rounded-full"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-xs">
                  {message.sender.nickname.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </Avatar>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-sm text-gray-900 truncate">
              {message.sender.nickname}
            </span>
            <DateFormatter 
              date={message.createdAt} 
              format="relative"
              className="text-xs text-gray-500"
            />
          </div>
          <p className="text-sm text-gray-700 truncate">{message.content}</p>
        </div>
        {showBadge && (
          <Badge 
            variant="secondary" 
            className={`text-xs ${getMessageTypeColor(message.messageType)}`}
          >
            {message.messageType}
          </Badge>
        )}
      </div>
    );
  }

  // Card variant (default)
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {renderAvatar()}
          <div className="flex-1 min-w-0">
            {renderMessageHeader()}
            <p className="text-gray-800 mb-2">{message.content}</p>
            <DateFormatter 
              date={message.createdAt} 
              format="relative"
              className="text-xs text-gray-500"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export { MessageItem };