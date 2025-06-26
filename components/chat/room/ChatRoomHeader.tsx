import React from 'react';
import { ChatRoom } from '../../../types/chatroomTypes';
import { Settings, LogOut } from 'lucide-react';

interface ChatRoomHeaderProps {
  room: ChatRoom;
  onSettingsClick?: () => void;
  onLeaveClick?: () => void;
}

const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({
  room,
  onSettingsClick,
  onLeaveClick
}) => {
  return (
    <div className="relative px-8 py-6 bg-white/70 backdrop-blur-md border-b border-slate-200/50">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              {room.title}
            </h2>
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold ring-1 ${
                room.type === 'PUBLIC' 
                  ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 ring-emerald-200' 
                  : 'bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 ring-amber-200'
              }`}>
                {room.type === 'PUBLIC' ? 'Herkese Açık' : 'Özel'}
              </span>
              {room.status === 'ACTIVE' && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25">
                  <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                  Aktif
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onSettingsClick}
            className="p-3 rounded-xl bg-white/60 hover:bg-white/80 backdrop-blur-sm transition-all duration-200 ring-1 ring-slate-200/50 hover:ring-violet-300/50 group"
          >
            <Settings className="h-5 w-5 text-slate-600 group-hover:text-violet-600 transition-colors" />
          </button>
          <button 
            onClick={onLeaveClick}
            className="p-3 rounded-xl bg-white/60 hover:bg-red-50 backdrop-blur-sm transition-all duration-200 ring-1 ring-slate-200/50 hover:ring-red-300/50 group"
          >
            <LogOut className="h-5 w-5 text-slate-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomHeader;