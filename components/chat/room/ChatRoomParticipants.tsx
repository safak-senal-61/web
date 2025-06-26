// components/chat/ChatRoomParticipants.tsx

import React, { useState, useEffect } from 'react';
import { ChatRoom, ChatParticipant } from '../../../types/chatroomTypes';
import { 
  Crown, 
  Shield, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  MoreVertical,
  UserPlus,
  Users,
  Hand,
  Sparkles,
  Zap
} from 'lucide-react';

interface ChatRoomParticipantsProps {
  room: ChatRoom;
  currentUserId: string;
  onInviteUser?: () => void;
}

const ChatRoomParticipants: React.FC<ChatRoomParticipantsProps> = ({ 
  room, 
  currentUserId, 
  onInviteUser 
}) => {
  const [participants, setParticipants] = useState<ChatParticipant[]>([]);
  const [speakers, setSpeakers] = useState<ChatParticipant[]>([]);
  const [listeners, setListeners] = useState<ChatParticipant[]>([]);

  // Mock participants data
  useEffect(() => {
    const mockParticipants: ChatParticipant[] = [
      {
        id: room.owner.id,
        username: room.owner.username,
        nickname: room.owner.nickname,
        profilePictureUrl: room.owner.profilePictureUrl,
        role: 'OWNER',
        joinedAt: room.createdAt,
        isMuted: false,
        speakerSeatIndex: 0
      },
      {
        id: 'participant2',
        username: 'oyuncu123',
        nickname: 'Oyuncu123',
        profilePictureUrl: undefined,
        role: 'MODERATOR',
        joinedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        isMuted: false,
        speakerSeatIndex: 1
      },
      {
        id: 'participant3',
        username: 'gamemaster',
        nickname: 'GameMaster',
        profilePictureUrl: undefined,
        role: 'SPEAKER',
        joinedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        isMuted: true,
        speakerSeatIndex: 2
      },
      {
        id: 'participant4',
        username: 'dinleyici1',
        nickname: 'Dinleyici1',
        profilePictureUrl: undefined,
        role: 'LISTENER',
        joinedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
        isMuted: false
      },
      {
        id: 'participant5',
        username: 'dinleyici2',
        nickname: 'Dinleyici2',
        profilePictureUrl: undefined,
        role: 'LISTENER',
        joinedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
        isMuted: false
      }
    ];

    setParticipants(mockParticipants);
    
    // Separate speakers and listeners
    const speakerRoles = ['OWNER', 'MODERATOR', 'SPEAKER'];
    setSpeakers(mockParticipants.filter(p => speakerRoles.includes(p.role)));
    setListeners(mockParticipants.filter(p => p.role === 'LISTENER'));
  }, [room]);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'OWNER':
        return <Crown className="h-4 w-4 text-amber-500" />;
      case 'MODERATOR':
        return <Shield className="h-4 w-4 text-cyan-500" />;
      default:
        return null;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'OWNER':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 ring-1 ring-amber-200/50 shadow-sm">
            👑 Sahip
          </span>
        );
      case 'MODERATOR':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 ring-1 ring-cyan-200/50 shadow-sm">
            🛡️ Moderatör
          </span>
        );
      case 'SPEAKER':
        return (
          <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 ring-1 ring-emerald-200/50 shadow-sm">
            🎤 Konuşmacı
          </span>
        );
      default:
        return null;
    }
  };

  const ParticipantCard: React.FC<{ participant: ChatParticipant; showSeatNumber?: boolean }> = ({ 
    participant, 
    showSeatNumber = false 
  }) => {
    const isCurrentUser = participant.id === currentUserId;
    const canManage = currentUserId === room.ownerId || room.moderators?.includes(currentUserId);

    return (
      <div className={`group relative flex items-center space-x-4 p-4 rounded-2xl transition-all duration-500 backdrop-blur-sm border ${
        isCurrentUser 
          ? 'bg-gradient-to-r from-cyan-50/80 via-blue-50/60 to-indigo-50/80 border-cyan-200/50 shadow-lg shadow-cyan-500/10' 
          : 'bg-white/80 hover:bg-gradient-to-r hover:from-slate-50/80 hover:to-gray-50/60 border-white/30 hover:border-cyan-200/30 hover:shadow-xl hover:shadow-cyan-500/5'
      }`}>
        
        {/* Floating particle for current user */}
        {isCurrentUser && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-pulse" />
        )}

        {/* Seat Number (for speakers) */}
        {showSeatNumber && participant.speakerSeatIndex !== undefined && (
          <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center shadow-sm ring-1 ring-cyan-200/30">
            <span className="text-sm font-bold text-cyan-700">{participant.speakerSeatIndex + 1}</span>
          </div>
        )}

        {/* Avatar */}
        <div className="relative">
          <div className="h-12 w-12 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-200 to-gray-300 flex items-center justify-center shadow-lg ring-2 ring-white/50 group-hover:ring-cyan-200/50 transition-all duration-300">
            {participant.profilePictureUrl ? (
              <img 
                src={participant.profilePictureUrl} 
                alt={participant.nickname}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-slate-600">
                {participant.nickname.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          
          {/* Speaking indicator */}
          {!participant.isMuted && ['OWNER', 'MODERATOR', 'SPEAKER'].includes(participant.role) && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white shadow-sm flex items-center justify-center">
              <Mic className="h-2.5 w-2.5 text-white" />
            </div>
          )}
          
          {/* Role crown/shield overlay */}
          {(participant.role === 'OWNER' || participant.role === 'MODERATOR') && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-white to-gray-100 rounded-full border border-white/50 shadow-lg flex items-center justify-center">
              {getRoleIcon(participant.role)}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            <p className="text-sm font-bold text-slate-800 truncate group-hover:text-cyan-700 transition-colors">
              {participant.nickname}
              {isCurrentUser && <span className="text-cyan-600 font-medium"> (Sen)</span>}
            </p>
            {participant.role === 'OWNER' && <Sparkles className="h-3 w-3 text-amber-500" />}
            {participant.role === 'MODERATOR' && <Zap className="h-3 w-3 text-cyan-500" />}
          </div>
          
          <div className="flex items-center space-x-2">
            {getRoleBadge(participant.role)}
            
            {/* Mic status */}
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-lg ${
              participant.isMuted 
                ? 'bg-red-100 text-red-600' 
                : 'bg-emerald-100 text-emerald-600'
            }`}>
              {participant.isMuted ? (
                <MicOff className="h-3 w-3" />
              ) : (
                <Mic className="h-3 w-3" />
              )}
              <span className="text-xs font-medium">
                {participant.isMuted ? 'Susturuldu' : 'Aktif'}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {canManage && !isCurrentUser && (
          <button className="p-2.5 rounded-xl hover:bg-slate-100/80 transition-all duration-200 hover:scale-110">
            <MoreVertical className="h-4 w-4 text-slate-600" />
          </button>
        )}
      </div>
    );
  };

  const EmptySeat: React.FC<{ seatNumber: number }> = ({ seatNumber }) => (
    <div className="group flex items-center space-x-4 p-4 rounded-2xl border-2 border-dashed border-cyan-200/60 hover:border-cyan-400/80 bg-gradient-to-r from-cyan-50/30 to-blue-50/20 hover:from-cyan-50/60 hover:to-blue-50/40 transition-all duration-500 cursor-pointer backdrop-blur-sm">
      <div className="flex-shrink-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-100 to-gray-200 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300">
        <span className="text-sm font-bold text-slate-500 group-hover:text-cyan-600">{seatNumber}</span>
      </div>
      
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-600 group-hover:text-cyan-700 transition-colors">✨ Boş Koltuk</p>
        <p className="text-xs text-slate-500 group-hover:text-cyan-600 transition-colors">Konuşmacı olmak için tıklayın</p>
      </div>
      
      <Hand className="h-5 w-5 text-slate-400 group-hover:text-cyan-500 transition-colors animate-bounce" />
    </div>
  );

  return (
    <div className="h-full bg-white/90 backdrop-blur-xl rounded-3xl border border-white/30 shadow-2xl shadow-cyan-500/10 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 bg-gradient-to-r from-cyan-50/80 via-blue-50/60 to-indigo-50/80 border-b border-white/30 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl shadow-sm">
              <Users className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">Katılımcılar</h2>
              <p className="text-sm text-slate-600 font-medium">{participants.length} kişi katılım sağlıyor</p>
            </div>
          </div>
          <button 
            onClick={onInviteUser}
            className="px-4 py-2.5 text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white rounded-2xl font-bold transition-all duration-300 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 flex items-center space-x-2 hover:scale-105"
          >
            <UserPlus className="h-4 w-4" />
            <span>Davet Et</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-200 scrollbar-track-transparent">
          {/* Speakers Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl shadow-sm">
                  <Mic className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">🎤 Konuşmacılar</h3>
                  <p className="text-sm text-slate-600">{speakers.length}/{room.speakerSeatCount} koltuk dolu</p>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700 rounded-xl text-sm font-bold shadow-sm">
                {speakers.filter(s => !s.isMuted).length} aktif
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Occupied speaker seats */}
              {speakers.map(speaker => (
                <ParticipantCard 
                  key={speaker.id} 
                  participant={speaker} 
                  showSeatNumber={true}
                />
              ))}
              
              {/* Empty speaker seats */}
              {Array.from({ length: room.speakerSeatCount - speakers.length }, (_, index) => (
                <EmptySeat key={`empty-${index}`} seatNumber={speakers.length + index + 1} />
              ))}
            </div>
          </div>

          {/* Elegant Divider */}
          <div className="mx-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-cyan-200/50 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-white px-4 py-1 rounded-xl shadow-sm border border-cyan-100/50">
                <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Listeners Section */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl shadow-sm">
                  <Users className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">👥 Dinleyiciler</h3>
                  <p className="text-sm text-slate-600">{listeners.length} kişi dinliyor</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {listeners.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-gray-200 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Users className="h-10 w-10 text-slate-400" />
                  </div>
                  <p className="text-slate-500 font-medium text-lg mb-2">✨ Henüz dinleyici yok</p>
                  <p className="text-slate-400 text-sm">İlk dinleyici olmak için odaya katılın!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {listeners.map(listener => (
                    <ParticipantCard key={listener.id} participant={listener} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Room Stats */}
          <div className="p-6 bg-gradient-to-r from-slate-50/80 to-gray-50/60 border-t border-white/30 backdrop-blur-sm">
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-white/90 to-cyan-50/50 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Users className="h-6 w-6 text-cyan-600" />
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-1">
                  {participants.length}
                </p>
                <p className="text-sm text-slate-600 font-semibold">Toplam Katılımcı</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-white/90 to-emerald-50/50 rounded-2xl shadow-lg backdrop-blur-sm border border-white/30">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <Mic className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-1">
                  {speakers.filter(s => !s.isMuted).length}
                </p>
                <p className="text-sm text-slate-600 font-semibold">Aktif Konuşmacı</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomParticipants;