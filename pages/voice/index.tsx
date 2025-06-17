// pages/voice/index.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'; // DİNAMİK IMPORT İÇİN GEREKLİ
import { useAuth } from '../../hooks/useAuth';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { FaPlusCircle, FaSatelliteDish, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

import { getLiveStreams } from '../../services/streamService';
import { Stream, AgoraConfig } from '../../types/streamTypes';
import StreamCard from '@/components/streams/StreamCard';

// CreateStreamForm component'ini sadece istemci tarafında yüklenecek şekilde dinamik olarak import ediyoruz.
const CreateStreamForm = dynamic(() => import('@/components/streams/CreateStreamForm'), {
    ssr: false, // Sunucu tarafında render etmeyi engelle
    loading: () => ( // Form yüklenirken gösterilecek içerik
        <div className="flex justify-center items-center h-40">
            <FaSpinner className="animate-spin h-8 w-8 text-slate-400" />
        </div>
    ),
});

const VoiceStreamsPage = () => {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  const [streams, setStreams] = useState<Stream[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    if (!authIsLoading && !user) {
      router.push('/login?redirect=/voice');
      return;
    }

    if (user) {
      const fetchStreams = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await getLiveStreams();
          if (response.basarili && response.veri) {
            setStreams(response.veri.yayinlar);
          } else {
            setError(response.mesaj || "Yayınlar alınamadı.");
          }
        } catch (error) {
          console.error("Canlı yayınlar alınırken hata oluştu:", error);
          setError("Yayınlar yüklenirken bir ağ hatası oluştu.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchStreams();
    }
  }, [user, authIsLoading]);

  const handleStreamCreated = (data: { yayin: Stream; agora: AgoraConfig }) => {
    setIsCreateModalOpen(false);
    const { yayin, agora } = data;
    
    router.push({
        pathname: `/voice/${yayin.id}`,
        query: {
            agoraAppId: agora.appId,
            agoraToken: agora.token
        }
    });
  };

  if (authIsLoading || isLoading) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-slate-700 dark:text-slate-300 text-lg">Yayınlar Yükleniyor...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
              Canlı Yayınları Keşfet
            </h1>
            <p className="mt-1 sm:mt-2 text-md text-slate-600 dark:text-slate-400 max-w-xl">
              Popüler yayınlara katıl, yeni yayıncılar keşfet veya kendi yayınını başlat.
            </p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="self-start md:self-center flex-shrink-0 bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-105 transition-transform"
          >
            <FaPlusCircle className="mr-2 h-5 w-5" />
            Yayın Başlat
          </Button>
        </div>

        {error && (
            <div className="text-center py-16 bg-red-500/10 text-red-400 rounded-xl border border-red-500/30">
                <FaExclamationTriangle className="mx-auto h-12 w-12 mb-4" />
                <p className="text-xl font-medium mb-2">Bir Sorun Oluştu</p>
                <p>{error}</p>
            </div>
        )}

        {!error && (
            streams.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {streams.map((stream) => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-100 dark:bg-slate-800/30 rounded-xl">
                <FaSatelliteDish className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 mb-4" />
                <p className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Şu Anda Aktif Yayın Yok
                </p>
                <p className="text-md text-slate-500 dark:text-slate-400">
                  İlk yayını sen başlatmak ister misin?
                </p>
              </div>
            )
        )}
      </main>

      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[525px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-slate-800 dark:text-white text-2xl">Yeni Yayın Başlat</DialogTitle>
            <DialogDescription className="text-slate-600 dark:text-slate-400">
              Yayın bilgilerini girerek hemen canlı yayına geç.
            </DialogDescription>
          </DialogHeader>
          {/* Sadece modal açıkken CreateStreamForm'u render etmeye çalış. */}
          {isCreateModalOpen && (
            <CreateStreamForm
                onSuccess={handleStreamCreated}
                onCancel={() => setIsCreateModalOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VoiceStreamsPage;