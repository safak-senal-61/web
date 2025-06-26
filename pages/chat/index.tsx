// pages/chat/index.tsx

import React, { useState } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import Layout from '../../components/layout/Layout';
import ChatRoomList from '../../components/chat/room/ChatRoomList';
import CreateChatRoomForm from '../../components/chat/forms/CreateChatRoomForm';
// Removed Shadcn UI imports - using native HTML with Tailwind CSS
import { ChatRoom, CreateChatRoomRequest } from '../../types/chatroomTypes';
import { chatroomService } from '../../services/chatroomService';
import { Plus, MessageCircle, Users, Mic, Sparkles, X, TrendingUp } from 'lucide-react';
import { toast } from 'react-hot-toast';

const ChatPage: NextPage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?message=auth-required');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleCreateRoom = async (data: CreateChatRoomRequest) => {
    try {
      setIsCreating(true);
      const response = await chatroomService.createChatRoom(data);
      
      if (response.basarili && response.veri?.oda) {
        toast.success('Sohbet odası başarıyla oluşturuldu!');
        setIsCreateDialogOpen(false);
        // Redirect to the new room
        router.push(`/chat/room/${response.veri.oda.id}`);
      } else {
        toast.error('Sohbet odası oluşturulamadı.');
      }
    } catch (error) {
      console.error('Oda oluşturma hatası:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRoomSelect = (room: ChatRoom) => {
    router.push(`/chat/room/${room.id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-violet-500/20 border-t-violet-500 mx-auto mb-6"></div>
            <p className="text-slate-600 text-lg font-medium">Yükleniyor...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return (
    <>
      <Head>
        <title>Sohbet Odaları - Platform</title>
        <meta name="description" content="Sesli sohbet odalarında arkadaşlarınızla buluşun" />
      </Head>
      
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100">
          <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div className="mb-4 lg:mb-0">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-lg shadow-violet-500/25">
                      <MessageCircle className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                        Sohbet Odaları
                      </h1>
                      <p className="text-slate-600 mt-1">
                        Sesli sohbet odalarında arkadaşlarınızla buluşun ve eğlenceli vakit geçirin
                      </p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Oda Oluştur
                </button>
                
                    {/* Modal - Kompakt tasarım */}
                    {isCreateDialogOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div 
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm" 
                      onClick={() => setIsCreateDialogOpen(false)}
                    ></div>
                    <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto border border-white/20">
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                          <h2 className="text-xl font-bold text-slate-800">Yeni Sohbet Odası</h2>
                          <button 
                            onClick={() => setIsCreateDialogOpen(false)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-200"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                        <CreateChatRoomForm 
                          onSubmit={handleCreateRoom} 
                          isLoading={isCreating}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Stats Cards - Daha kompakt yapıldı */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg shadow-slate-500/5 hover:shadow-xl hover:shadow-slate-500/10 transition-all duration-300 transform hover:-translate-y-0.5">
                  <div className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-lg shadow-blue-500/25">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-800">1,234</p>
                        <p className="text-slate-600 text-sm font-medium">Aktif Kullanıcı</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg shadow-slate-500/5 hover:shadow-xl hover:shadow-slate-500/10 transition-all duration-300 transform hover:-translate-y-0.5">
                  <div className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-lg shadow-emerald-500/25">
                        <Mic className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-800">89</p>
                        <p className="text-slate-600 text-sm font-medium">Aktif Oda</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg shadow-slate-500/5 hover:shadow-xl hover:shadow-slate-500/10 transition-all duration-300 transform hover:-translate-y-0.5">
                  <div className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg shadow-lg shadow-violet-500/25">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-slate-800">456</p>
                        <p className="text-slate-600 text-sm font-medium">Bugün Oluşturulan</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="bg-white/80 backdrop-blur-xl p-1.5 rounded-xl border border-white/20 shadow-lg shadow-slate-500/5 inline-flex">
                <button
                  onClick={() => setActiveTab('browse')}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === 'browse'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/25'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Odaları Keşfet
                </button>
                <button
                  onClick={() => setActiveTab('my-rooms')}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === 'my-rooms'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/25'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Odalarım
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    activeTab === 'favorites'
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-md shadow-violet-500/25'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  Favoriler
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'browse' && (
                <div className="space-y-4">
                  <ChatRoomList onRoomSelect={handleRoomSelect} />
                </div>
              )}

              {activeTab === 'my-rooms' && (
                <div className="space-y-4">
                  <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg shadow-slate-500/5">
                    <div className="p-6 border-b border-slate-200/50">
                      <h3 className="text-xl font-bold text-slate-800">Oluşturduğunuz Odalar</h3>
                    </div>
                    <div className="p-6">
                      <div className="text-center py-12">
                        <div className="p-4 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                          <MessageCircle className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Henüz oda oluşturmadınız</h3>
                        <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                          İlk sohbet odanızı oluşturun ve arkadaşlarınızı davet edin
                        </p>
                        <button
                          onClick={() => setIsCreateDialogOpen(true)}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/25 hover:shadow-xl hover:shadow-violet-500/30 transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          İlk Odanızı Oluşturun
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'favorites' && (
                <div className="space-y-4">
                  <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg shadow-slate-500/5">
                    <div className="p-6 border-b border-slate-200/50">
                      <h3 className="text-xl font-bold text-slate-800">Favori Odalarınız</h3>
                    </div>
                    <div className="p-6">
                      <div className="text-center py-12">
                        <div className="p-4 bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                          <Sparkles className="h-10 w-10 text-amber-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Henüz favori odanız yok</h3>
                        <p className="text-slate-600 mb-6 max-w-sm mx-auto">
                          Beğendiğiniz odaları favorilere ekleyerek kolayca erişin
                        </p>
                        <button
                          onClick={() => setActiveTab('browse')}
                          className="inline-flex items-center px-6 py-3 bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-700 hover:bg-white hover:shadow-lg font-semibold rounded-xl transition-all duration-300 transform hover:-translate-y-0.5"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Odaları Keşfet
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default ChatPage;