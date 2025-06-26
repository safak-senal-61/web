import React, { useRef } from 'react';
import { Send, Mic } from 'lucide-react';
import { useTypingIndicator } from '../../../hooks/useTypingIndicator';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  roomId: string;
  currentUserId: string;
  currentUsername: string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  roomId,
  currentUserId,
  currentUsername
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Use typing indicator hook
  const { isAnyoneTyping, startTyping, stopTyping, getTypingMessage } = useTypingIndicator({
    roomId,
    currentUserId,
    currentUsername
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    onSendMessage();
    stopTyping();
    inputRef.current?.focus();
  };

  const handleTyping = () => {
    startTyping();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="relative border-t border-slate-200/50 bg-white/70 backdrop-blur-md">
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5" />
      
      <div className="relative p-6">
        <form onSubmit={handleSubmit} className="flex items-center space-x-4">
          {/* Message Input */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                handleTyping();
              }}
              onKeyPress={handleKeyPress}
              placeholder="Mesajınızı yazın..."
              className="w-full px-5 py-3 pl-6 pr-12 bg-white/80 backdrop-blur-sm border border-slate-200/50 rounded-2xl focus:ring-2 focus:ring-violet-500/50 focus:border-violet-300 outline-none transition-all duration-200 text-slate-800 placeholder-slate-500 shadow-sm"
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button 
              type="button" 
              className="p-3 rounded-xl bg-white/60 hover:bg-white/80 backdrop-blur-sm transition-all duration-200 ring-1 ring-slate-200/50 hover:ring-violet-300/50 group"
            >
              <Mic className="h-5 w-5 text-slate-600 group-hover:text-violet-600 transition-colors" />
            </button>
            
            <button 
              type="submit" 
              disabled={!newMessage.trim()} 
              className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transform hover:scale-105 active:scale-95"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
        
        {/* Typing indicator */}
        {isAnyoneTyping && (
          <div className="mt-3 flex items-center space-x-2 text-sm text-slate-500">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <span>{getTypingMessage()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageInput;