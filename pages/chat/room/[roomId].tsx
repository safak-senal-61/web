// pages/chat/room/[roomId].tsx

import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../../hooks/useAuth';
import Layout from '../../../components/layout/Layout';
import ChatRoomMessages from '../../../components/chat/messages/ChatRoomMessages';
import ChatRoomParticipants from '../../../components/chat/room/ChatRoomParticipants';
// Removed Shadcn UI imports - using native HTML and Tailwind CSS
import { ChatRoom } from '../../../types/chatroomTypes';
import { chatroomService } from '../../../services/chatroomService';
import { 
  ArrowLeft, 
  Settings, 
  Share2, 
  Heart, 
  Flag, 
  Users, 
  Globe, 
  Lock,
  Loader2,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

const ChatRoomPage: NextPage = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const { roomId } = router.query;
  
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login?message=auth-required');
    }
  }, [isAuthenticated, authLoading, router]);

  // Load room data
  useEffect(() => {
    if (roomId && typeof roomId === 'string') {
      loadRoom(roomId);
    }
  }, [roomId]);

  const loadRoom = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await chatroomService.getChatRoom(id);
      
      if (response.basarili && response.veri?.oda) {
        setRoom(response.veri.oda);
        // Check if user is already in the room
        const activeParticipants = response.veri.oda.activeParticipants;
        const isOwner = user?.id === response.veri.oda.owner.id;
        const isInRoom = Array.isArray(activeParticipants) && activeParticipants.includes(user?.id || '');
        
        // Oda sahibi otomatik olarak katılmış sayılır
        setHasJoined(isOwner || isInRoom);
        
        // Eğer oda sahibi ama activeParticipants listesinde değilse, otomatik katıl
        if (isOwner && !isInRoom) {
          handleAutoJoinAsOwner(response.veri.oda.id);
        }
      } else {
        setError('Sohbet odası bulunamadı.');
      }
    } catch (error) {
      console.error('Oda yükleme hatası:', error);
      setError('Sohbet odası yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoJoinAsOwner = async (roomId: string) => {
    try {
      const response = await chatroomService.joinChatRoom(roomId);
      if (response.basarili) {
        // Sessizce katıl, toast gösterme
        loadRoom(roomId);
      }
    } catch (error) {
      console.error('Oda sahibi otomatik katılma hatası:', error);
    }
  };

  const handleJoinRoom = async () => {
    if (!room || !user) return;
    
    console.log('Room page join attempt:', {
      roomId: room.id,
      userId: user.id,
      roomStatus: room.status,
      activeParticipants: room.activeParticipants
    });
    
    try {
      setIsJoining(true);
      
      const response = await chatroomService.joinChatRoom(room.id);
      console.log('Room page join response:', response);
      
      if (response.basarili) {
        console.log('Room join successful, updating state');
        setHasJoined(true);
        toast.success('Sohbet odasına katıldınız!');
        // Reload room data to get updated participant count
        loadRoom(room.id);
      } else {
        console.error('Room join failed:', response.mesaj);
        toast.error(response.mesaj || 'Sohbet odasına katılamadınız.');
      }
    } catch (error) {
      console.error('Oda katılma hatası:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!room || !user) return;
    
    try {
      const response = await chatroomService.leaveChatRoom(room.id);
      
      if (response.basarili) {
        toast.success('Sohbet odasından ayrıldınız.');
        router.push('/chat');
      } else {
        toast.error('Sohbet odasından ayrılamadınız.');
      }
    } catch (error) {
      console.error('Oda ayrılma hatası:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleShare = async () => {
    if (!room) return;
    
    const shareUrl = `${window.location.origin}/chat/room/${room.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: room.title,
          text: room.description || 'Bu sohbet odasına katıl!',
          url: shareUrl
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Oda linki panoya kopyalandı!');
      } catch (error) {
        toast.error('Link kopyalanamadı.');
      }
    }
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Sohbet odası yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  if (error || !room) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
          <div className="max-w-md mx-auto text-center">
            {/* Error Icon with Animation */}
            <div className="relative mb-8">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                <AlertCircle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute inset-0 w-24 h-24 mx-auto bg-red-200 rounded-full -z-10 blur-xl opacity-50"></div>
            </div>

            {/* Brand */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <MessageCircle className="h-6 w-6 text-blue-600" />
              <h1 className="text-lg font-bold text-gray-900">WebsaChat</h1>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Sohbet Odası Bulunamadı</h2>
              <p className="text-gray-600 mb-2">
                {error || 'Aradığınız sohbet odası mevcut değil veya erişim izniniz yok.'}
              </p>
              <p className="text-gray-500 text-sm">Belki başka bir odaya katılmak istersiniz?</p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => router.push('/chat')}
                className="w-full inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-medium rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Sohbet Odalarına Git
              </button>
              <button 
                onClick={() => router.back()}
                className="w-full inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 font-medium rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Geri Dön
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Head>
        <title>{room.title} - Sohbet Odası</title>
        <meta name="description" content={room.description || 'Sesli sohbet odası'} />
      </Head>
      
      <Layout>
        <div className="h-screen flex flex-col">
          {/* Header */}
          <div className="border-b bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button 
                    onClick={() => router.back()}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {room.type === 'PRIVATE' ? (
                        <Lock className="h-5 w-5 text-blue-600" />
                      ) : (
                        <Globe className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    
                    <div>
                      <h1 className="text-xl font-semibold">{room.title}</h1>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <span>@{room.owner.nickname}</span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(room.createdAt), {
                            addSuffix: true,
                            locale: tr
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    room.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {room.status === 'ACTIVE' ? 'Aktif' : 'Pasif'}
                  </span>
                  
                  <button 
                    onClick={handleShare}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                  
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <Heart className="h-4 w-4" />
                  </button>
                  
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                    <Flag className="h-4 w-4" />
                  </button>
                  
                  {(user?.id === room.ownerId || room.moderators?.includes(user?.id || '')) && (
                    <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                      <Settings className="h-4 w-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => setShowParticipants(!showParticipants)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {room.currentParticipantCount}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {hasJoined ? (
                <ChatRoomMessages room={room} currentUserId={user?.id || ''} />
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="bg-white rounded-lg border shadow-sm max-w-md mx-4">
                    <div className="p-8 text-center">
                      <div className="p-4 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                        {room.type === 'PRIVATE' ? (
                          <Lock className="h-8 w-8 text-blue-600" />
                        ) : (
                          <Globe className="h-8 w-8 text-blue-600" />
                        )}
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-2">
                        {room.type === 'PRIVATE' ? 'Özel Sohbet Odası' : 'Sohbet Odasına Katıl'}
                      </h3>
                      
                      <p className="text-gray-600 mb-6">
                        {room.description || 'Bu sohbet odasına katılarak diğer kullanıcılarla sohbet edebilirsiniz.'}
                      </p>
                      
                      {room.tags && room.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center mb-6">
                          {room.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <button 
                          onClick={handleJoinRoom} 
                          disabled={isJoining}
                          className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg transition-colors duration-200"
                        >
                          {isJoining ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Katılıyor...
                            </>
                          ) : (
                            'Sohbet Odasına Katıl'
                          )}
                        </button>
                        
                        <button onClick={() => router.push('/chat')} className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors duration-200">
                          Geri Dön
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Participants Sidebar */}
            {showParticipants && hasJoined && (
              <>
                <div className="w-px bg-gray-200"></div>
                <div className="w-80 bg-gray-50 overflow-y-auto">
                  <div className="p-4">
                    <ChatRoomParticipants 
                      room={room} 
                      currentUserId={user?.id || ''}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions (when joined) */}
          {hasJoined && (
            <div className="border-t bg-white">
              <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{room.currentParticipantCount} / {room.maxParticipants} katılımcı</span>
                  </div>
                  
                  <button onClick={handleLeaveRoom} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 text-sm font-medium rounded-lg transition-colors duration-200">
                    Odadan Ayrıl
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
};

export default ChatRoomPage;