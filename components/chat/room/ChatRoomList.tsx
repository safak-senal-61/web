import React, { useState, useEffect } from 'react';
import { Search, Filter, Users, Clock, Star, Loader2, X, Sparkles } from 'lucide-react';
import { ChatRoom } from '../../../types/chatroomTypes';
import JoinChatRoom from '../forms/JoinChatRoom';
import LeaveChatRoom from '../forms/LeaveChatRoom';
import MessageList from '../messages/MessageList';
import ChatRoomFilters from './ChatRoomFilters';
import { getChatRooms, searchChatRooms } from '../../../services/chatroomService';

interface ChatRoomListProps {
  onRoomSelect?: (room: ChatRoom) => void;
}

// ChatRoomCard component with simplified actions
const ChatRoomCard = ({ room, onClick, onDelete, onJoin, onLeave, onViewMessages }: {
  room: ChatRoom;
  onClick?: () => void;
  onDelete?: (roomId: string) => void;
  onJoin?: (room: ChatRoom) => void;
  onLeave?: (room: ChatRoom) => void;
  onViewMessages?: (room: ChatRoom) => void;
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Az önce';
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    } else {
      return `${Math.floor(diffInHours / 24)} gün önce`;
    }
  };

  const getParticipantPercentage = (room: ChatRoom): number => {
    return Math.round((room.activeParticipants.length / room.maxParticipants) * 100);
  };

  const handleDeleteRoom = async () => {
    try {
      setIsDeleting(true);
      // Mock delete operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (onDelete) {
        onDelete(room.id);
      }
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Oda silinirken hata:', error);
      alert('Oda silinirken bir hata oluştu.');
    } finally {
      setIsDeleting(false);
    }
  };

  const isRoomFull = room.activeParticipants.length >= room.maxParticipants;
  const participantPercentage = getParticipantPercentage(room);

  return (
    <>
      <div 
        onClick={onClick}
        className="group relative bg-white/80 backdrop-blur-sm rounded-3xl border border-white/20 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden hover:scale-[1.02] hover:bg-white/95"
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 to-purple-50/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Animated border glow */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm" />
        
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center space-x-4">
              {/* Avatar */}
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-md">
                  <span className="text-blue-700 font-bold text-lg">
                    {room.title.charAt(0).toUpperCase()}
                  </span>
                </div>
                {/* Online indicator */}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  room.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-gray-400'
                }`} />
              </div>
              
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors duration-300 text-lg">
                  {room.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                  {room.description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Room type badge */}
              <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm ${
                room.type === 'PUBLIC' 
                  ? 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 border border-emerald-300' 
                  : 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border border-amber-300'
              }`}>
                {room.type === 'PUBLIC' ? '🌍 Herkese Açık' : '🔒 Özel'}
              </div>
              
              {/* Delete button (mock - always show for demo) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200"
                title="Odayı Sil"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-100">
              <Users className="h-4 w-4 text-blue-500" />
              <div className="text-sm">
                <span className="font-bold text-gray-800">{room.activeParticipants.length}</span>
                  <span className="text-gray-500">/{room.maxParticipants}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-100">
              <Clock className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-medium text-gray-700">
                {formatDate(room.createdAt)}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-xl px-3 py-2 border border-gray-100">
              <div className={`w-2 h-2 rounded-full ${room.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium text-gray-600">
                  {room.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
              </span>
            </div>
          </div>

          {/* Capacity Progress Bar */}
          <div className="mb-5">
            <div className="flex justify-between text-xs text-gray-600 mb-2">
              <span className="font-medium">Kapasite Kullanımı</span>
              <span className="font-bold">{participantPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-2 transition-all duration-700 rounded-full ${
                  participantPercentage >= 90 
                    ? 'bg-gradient-to-r from-red-400 to-red-600' 
                    : participantPercentage >= 70 
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                    : 'bg-gradient-to-r from-blue-400 to-purple-600'
                }`}
                style={{ width: `${participantPercentage}%` }}
              />
            </div>
          </div>

          {/* Tags */}
          {room.tags && room.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {room.tags.slice(0, 3).map((tag: string) => (
                <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 hover:from-blue-100 hover:to-purple-100 transition-all duration-200">
                  #{tag}
                </span>
              ))}
              {room.tags.length > 3 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                  +{room.tags.length - 3} daha
                </span>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-2">
            {/* Join Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onJoin && onJoin(room);
              }}
              className={`w-full py-3 px-6 rounded-2xl font-semibold transition-all duration-300 shadow-md ${
                isRoomFull || room.status !== 'ACTIVE'
                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
              }`}
              disabled={isRoomFull || room.status !== 'ACTIVE'}
            >
              {isRoomFull ? '🚫 Oda Dolu' : room.status !== 'ACTIVE' ? '⏸️ Pasif' : '🚀 Katıl'}
            </button>

            {/* Secondary Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onLeave && onLeave(room);
                }}
                className="py-2 px-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-medium transition-all duration-200 text-sm"
                title="Odadan Ayrıl"
              >
                🚪 Ayrıl
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewMessages && onViewMessages(room);
                }}
                className="py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium transition-all duration-200 text-sm"
                title="Mesajları Görüntüle"
              >
                💬 Mesajlar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/20" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-6">
              <div className="p-4 bg-gradient-to-r from-red-100 to-red-200 rounded-2xl w-fit mx-auto mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Odayı Sil</h3>
              <p className="text-gray-600 leading-relaxed">
                <span className="font-semibold">"{room.title}"</span> odasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all duration-200 font-medium"
                disabled={isDeleting}
              >
                İptal
              </button>
              <button
                onClick={handleDeleteRoom}
                disabled={isDeleting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  '🗑️ Sil'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};



const ChatRoomList: React.FC<ChatRoomListProps> = ({ onRoomSelect }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'participants'>('newest');
  const [filterType, setFilterType] = useState<'all' | 'PUBLIC' | 'PRIVATE'>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showPublicOnly, setShowPublicOnly] = useState(false);
  
  // Modal states
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showMessageListModal, setShowMessageListModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);

  // API'den sohbet odalarını çek
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        let response;
        
        // Eğer arama terimi varsa arama API'sini kullan, yoksa public odaları getir
        if (searchTerm && searchTerm.trim()) {
          response = await searchChatRooms(searchTerm.trim(), 1, 50);
        } else {
          response = await getChatRooms(1, 50);
        }
        
        if (response.basarili && response.veri) {
          setRooms(response.veri.odalar || []);
          // Mevcut tagları güncelle
          const allTags = response.veri.odalar?.flatMap(room => room.tags || []) || [];
          const uniqueTags = Array.from(new Set(allTags));
          setAvailableTags(uniqueTags);
        } else {
          console.error('Sohbet odaları yüklenirken hata:', response.mesaj);
          setRooms([]);
          setAvailableTags([]);
        }
      } catch (error) {
        console.error('Sohbet odaları yüklenirken hata:', error);
        setRooms([]);
        setAvailableTags([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce arama için timeout kullan
    const timeoutId = setTimeout(() => {
      fetchRooms();
    }, searchTerm ? 500 : 0); // Arama varsa 500ms bekle, yoksa hemen çalıştır

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    filterAndSortRooms();
  }, [rooms, sortBy, filterType, selectedTags, searchTerm]);

  const filterAndSortRooms = () => {
    let filtered = [...rooms];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(room => 
        room.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(room => room.type === filterType);
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(room => 
        selectedTags.some(tag => room.tags?.includes(tag))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.activeParticipants.length - a.activeParticipants.length;
      case 'participants':
         return b.activeParticipants.length - a.activeParticipants.length;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredRooms(filtered);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter((t: string) => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('newest');
    setFilterType('all');
    setSelectedTags([]);
    setShowPublicOnly(false);
  };

  const handleRoomDelete = (roomId: string) => {
    setRooms(prev => prev.filter(room => room.id !== roomId));
    setFilteredRooms(prev => prev.filter(room => room.id !== roomId));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-6 text-blue-600" />
            <div className="absolute inset-0 h-12 w-12 mx-auto rounded-full bg-blue-100 animate-pulse" />
          </div>
          <p className="text-white-600 font-medium">Sohbet odaları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Sohbet Odaları
          </h1>
          <p className="text-white-600 max-w-2xl mx-auto">
            İlginizi çeken konularda diğer kullanıcılarla bağlantı kurun ve keyifli sohbetler yaşayın
          </p>
        </div>

        {/* Search and Filters */}
        <ChatRoomFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          searchLoading={searchLoading}
          sortBy={sortBy}
          setSortBy={setSortBy}
          filterType={filterType}
          setFilterType={setFilterType}
          showPublicOnly={showPublicOnly}
          setShowPublicOnly={setShowPublicOnly}
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          availableTags={availableTags}
          clearFilters={clearFilters}
        />


        {/* Results Summary */}
        <div className="flex items-center justify-between bg-white/50 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/20 shadow-sm">
          <div className="flex items-center space-x-3 text-gray-700">
            <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
            <span className="font-medium">
              {filteredRooms.length} oda bulundu
              {rooms.length !== filteredRooms.length && (
                <span className="text-gray-500 ml-1">({rooms.length} toplam)</span>
              )}
            </span>
          </div>
          
          {selectedTags.length > 0 && (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600">Seçili etiketler:</span>
              <div className="flex space-x-2">
                {selectedTags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Room List */}
        {filteredRooms.length === 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
            <div className="py-16">
              <div className="text-center">
                <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl w-fit mx-auto mb-6">
                  <Users className="h-12 w-12 text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-800">Sohbet odası bulunamadı</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  {searchTerm || selectedTags.length > 0 || filterType !== 'all'
                    ? 'Arama kriterlerinize uygun oda bulunamadı. Filtreleri değiştirmeyi deneyin.'
                    : 'Henüz hiç sohbet odası oluşturulmamış.'}
                </p>
                {(searchTerm || selectedTags.length > 0 || filterType !== 'all') && (
                  <button 
                    onClick={clearFilters}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg font-medium"
                  >
                    Filtreleri Temizle
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map(room => (
              <ChatRoomCard
                key={room.id}
                room={room}
                onClick={() => onRoomSelect?.(room)}
                onDelete={handleRoomDelete}
                onJoin={(room) => {
                  setSelectedRoom(room);
                  setShowJoinModal(true);
                }}
                onLeave={(room) => {
                  setSelectedRoom(room);
                  setShowLeaveModal(true);
                }}
                onViewMessages={(room) => {
                  setSelectedRoom(room);
                  setShowMessageListModal(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal handlers */}
      {showJoinModal && selectedRoom && (
        <JoinChatRoom
          room={selectedRoom}
          onJoinSuccess={async () => {
            setShowJoinModal(false);
            setSelectedRoom(null);
            // Refresh room data
            const response = await getChatRooms(1, 50);
            if (response.basarili && response.veri) {
              setRooms(response.veri.odalar || []);
            }
          }}
          onCancel={() => {
            setShowJoinModal(false);
            setSelectedRoom(null);
          }}
        />
      )}

      {showLeaveModal && selectedRoom && (
        <LeaveChatRoom
          room={selectedRoom}
          onLeaveSuccess={async () => {
            setShowLeaveModal(false);
            setSelectedRoom(null);
            // Refresh room data
            const response = await getChatRooms(1, 50);
            if (response.basarili && response.veri) {
              setRooms(response.veri.odalar || []);
            }
          }}
          onCancel={() => {
            setShowLeaveModal(false);
            setSelectedRoom(null);
          }}
        />
      )}

      {/* Message List Modal */}
      {showMessageListModal && selectedRoom && (
        <MessageList
          roomId={selectedRoom.id}
          isOpen={showMessageListModal}
          onClose={() => {
            setShowMessageListModal(false);
            setSelectedRoom(null);
          }}
        />
      )}
    </div>
  );
};

export default ChatRoomList;