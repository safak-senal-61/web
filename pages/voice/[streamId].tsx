// pages/voice/[streamId].tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic'; // DİNAMİK IMPORT İÇİN GEREKLİ
import { useAuth } from '../../hooks/useAuth';
import { getStreamDetails, getStreamToken } from '../../services/streamService';
import { Stream, AgoraConfig } from '../../types/streamTypes';
import { Header } from '@/components/layout/Header';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
// StreamPlayer artık doğrudan import edilmeyecek
// import StreamPlayer from '@/components/streams/StreamPlayer'; 
import StreamChat from '@/components/streams/StreamChat';
import StreamHeader from '@/components/streams/StreamHeader';

// StreamPlayer component'ini sadece istemci tarafında (client-side) render edilecek şekilde dinamik olarak yüklüyoruz.
// ssr: false seçeneği, bu component'in sunucu tarafında render edilmesini engeller.
const StreamPlayer = dynamic(() => import('@/components/streams/StreamPlayer'), {
  ssr: false, // Sunucu tarafında render etme
  loading: () => ( // Yüklenirken gösterilecek placeholder
    <div className="flex-1 relative bg-black flex items-center justify-center">
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-slate-500 w-full h-full">
            <FaSpinner className="w-8 h-8 text-white animate-spin"/>
            <p className="text-white mt-2">Yayın Oynatıcı Yükleniyor...</p>
        </div>
    </div>
    )
});


const StreamDetailPage = () => {
  const router = useRouter();
  const { streamId } = router.query;
  const { user, isLoading: authIsLoading } = useAuth();
  
  const [stream, setStream] = useState<Stream | null>(null);
  const [agoraConfig, setAgoraConfig] = useState<AgoraConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authIsLoading || typeof streamId !== 'string') return;
    if (!user) {
      router.push(`/login?redirect=/voice/${streamId}`);
      return;
    }

    const fetchAllData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [streamResponse, tokenResponse] = await Promise.all([
          getStreamDetails(streamId),
          getStreamToken(streamId)
        ]);

        if (streamResponse.basarili && streamResponse.veri) {
          setStream(streamResponse.veri.yayin);
        } else {
          throw new Error(streamResponse.mesaj || 'Yayın bulunamadı.');
        }

        if (tokenResponse.basarili && tokenResponse.veri) {
          setAgoraConfig(tokenResponse.veri.agora);
        } else {
          throw new Error(tokenResponse.mesaj || 'Yayın token\'ı alınamadı.');
        }

      } catch (err: any) {
        setError(err.message || 'Veriler alınırken bir hata oluştu.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAllData();
  }, [streamId, user, authIsLoading, router]);

  const renderContent = () => {
    if (isLoading || authIsLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <FaSpinner className="w-10 h-10 text-blue-500 animate-spin" />
        </div>
      );
    }

    if (error) {
        return (
            <div className="flex flex-col justify-center items-center h-full bg-red-500/10 p-8 rounded-lg">
                <FaExclamationTriangle className="w-12 h-12 text-red-400 mb-4"/>
                <p className="text-xl font-semibold text-white">Bir Hata Oluştu</p>
                <p className="text-red-300">{error}</p>
            </div>
        );
    }
    
    if (stream && agoraConfig) {
      const isBroadcaster = user?.id === stream.broadcasterId;
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full">
          <div className="lg:col-span-9 flex flex-col h-full bg-black rounded-xl overflow-hidden">
            <StreamHeader stream={stream} />
            <StreamPlayer 
                stream={stream} 
                isBroadcaster={isBroadcaster}
                agoraAppId={agoraConfig.appId}
                agoraToken={agoraConfig.token}
            />
          </div>
          <div className="lg:col-span-3 flex flex-col h-full">
            <StreamChat stream={stream} />
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-slate-100 dark:bg-slate-900">
      <Header />
      <main className="flex-1 p-4 overflow-hidden">
        {renderContent()}
      </main>
    </div>
  );
};

export default StreamDetailPage;