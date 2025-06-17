// components/streams/StreamPlayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Stream } from '../../types/streamTypes';
import { FaMicrophone, FaVideo, FaShareSquare, FaStopCircle, FaSpinner } from 'react-icons/fa';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { endStream } from '../../services/streamService'; // endStream servisini import ediyoruz
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

interface StreamPlayerProps {
  stream: Stream;
  isBroadcaster: boolean;
  // createStream'den dönen agora token ve appId'yi almamız gerekecek.
  // Bu bilgiler stream detaylarından veya başka bir context'ten gelebilir.
  // Şimdilik stream objesi içinde olduğunu varsayalım veya prop olarak ekleyelim.
  agoraAppId: string;
  agoraToken: string;
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({ stream, isBroadcaster, agoraAppId, agoraToken }) => {
  const router = useRouter();
  const { user } = useAuth();

  // HATA ÇÖZÜMÜ: useRef'e başlangıç değeri olarak null verip tipini | null olarak güncelliyoruz.
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  const [isConnecting, setIsConnecting] = useState(true);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  // Yayıncının kontrolleri için state'ler
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  useEffect(() => {
    if (!agoraAppId || !agoraToken || !stream.id || !user) return;

    // Yeni bir client oluşturuyoruz
    const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    clientRef.current = client;

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
      await client.subscribe(user, mediaType);
      setRemoteUsers(Array.from(client.remoteUsers));
      
      if (mediaType === 'video' && videoContainerRef.current) {
        // Bu kullanıcı için bir div oluşturup videoyu oynat
        const playerContainer = document.createElement('div');
        playerContainer.id = `user-container-${user.uid}`;
        playerContainer.className = 'w-full h-full';
        videoContainerRef.current.append(playerContainer);
        user.videoTrack?.play(playerContainer);
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    };

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
        const playerContainer = document.getElementById(`user-container-${user.uid}`);
        if(playerContainer) {
            playerContainer.remove();
        }
    };

    const joinChannel = async () => {
      try {
        client.on('user-published', handleUserPublished);
        client.on('user-unpublished', handleUserUnpublished);

        // Kanala katıl
        await client.join(agoraAppId, stream.id, agoraToken, user.id);
        setIsConnecting(false);

        if (isBroadcaster) {
          // Yayıncı ise, kendi medyasını oluştur ve yayınla
          const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
          localAudioTrackRef.current = audioTrack;
          localVideoTrackRef.current = videoTrack;
          
          if (videoContainerRef.current) {
            // Kendi görüntüsünü de ekranda göster
            const localPlayerContainer = document.createElement('div');
            localPlayerContainer.id = `local-player`;
            localPlayerContainer.className = 'w-full h-full';
            videoContainerRef.current.append(localPlayerContainer);
            videoTrack.play(localPlayerContainer);
          }
          // Oluşturulan izleri yayınla
          await client.publish([audioTrack, videoTrack]);
        }
      } catch (error) {
        console.error("Agora kanala katılırken hata:", error);
        setIsConnecting(false);
      }
    };

    joinChannel();

    // Component unmount olduğunda temizlik yap
    return () => {
      localAudioTrackRef.current?.close();
      localVideoTrackRef.current?.close();
      client.leave();
    };
  }, [stream.id, agoraAppId, agoraToken, isBroadcaster, user]);
  
  const handleEndStream = async () => {
      if(!clientRef.current || !stream.id) return;
      try {
        await endStream(stream.id);
        await clientRef.current.leave();
        router.push('/voice');
      } catch (error) {
          console.error("Yayın sonlandırılamadı:", error)
      }
  }

  const toggleAudio = async () => {
      if(localAudioTrackRef.current) {
          await localAudioTrackRef.current.setMuted(!isAudioMuted);
          setIsAudioMuted(!isAudioMuted);
      }
  }

  const toggleVideo = async () => {
      if(localVideoTrackRef.current) {
          await localVideoTrackRef.current.setMuted(!isVideoMuted);
          setIsVideoMuted(!isVideoMuted);
      }
  }

  return (
    <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
      <div id="video-container" ref={videoContainerRef} className="w-full h-full grid grid-cols-1 gap-1">
        {isConnecting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
              <FaSpinner className="w-8 h-8 text-white animate-spin"/>
              <p className="text-white mt-2">Yayına bağlanılıyor...</p>
          </div>
        )}
      </div>

      {isBroadcaster && !isConnecting && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-full">
            <button onClick={toggleAudio} className={`p-3 rounded-full text-white transition-colors ${isAudioMuted ? 'bg-red-600' : 'bg-slate-600/50 hover:bg-slate-500/50'}`}>
                <FaMicrophone />
            </button>
            <button onClick={toggleVideo} className={`p-3 rounded-full text-white transition-colors ${isVideoMuted ? 'bg-red-600' : 'bg-slate-600/50 hover:bg-slate-500/50'}`}>
                <FaVideo />
            </button>
            <button onClick={handleEndStream} className="p-3 bg-red-600 hover:bg-red-500 rounded-full text-white transition-colors">
                <FaStopCircle />
            </button>
        </div>
      )}
    </div>
  );
};

export default StreamPlayer;