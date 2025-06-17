// components/streams/StreamPlayer.tsx
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack, IAgoraRTCRemoteUser } from 'agora-rtc-sdk-ng';
import { Stream } from '../../types/streamTypes';
import { endStream } from '../../services/streamService';
import { FaMicrophone, FaVideo, FaStopCircle, FaSpinner } from 'react-icons/fa';

interface StreamPlayerProps {
  stream: Stream;
  isBroadcaster: boolean;
  agoraAppId: string;
  agoraToken: string;
}

const StreamPlayer: React.FC<StreamPlayerProps> = ({ stream, isBroadcaster, agoraAppId, agoraToken }) => {
  const router = useRouter();
  const { user } = useAuth();

  const client = useRef<IAgoraRTCClient | null>(null);
  const localTracks = useRef<{ audio: IMicrophoneAudioTrack | null; video: ICameraVideoTrack | null }>({ audio: null, video: null });
  const videoContainerRef = useRef<HTMLDivElement>(null);
  
  const [isConnecting, setIsConnecting] = useState(true);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(false);

  useEffect(() => {
    if (!user || !agoraAppId || !agoraToken) {
      console.log("Gerekli bilgiler eksik, Agora başlatılamadı.");
      return;
    }

    // Yeni bir client oluştur
    client.current = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
    let localClient = client.current; // Kapsam içinde referans oluştur

    const handleUserPublished = async (user: IAgoraRTCRemoteUser, mediaType: 'audio' | 'video') => {
      await localClient.subscribe(user, mediaType);
      if (mediaType === 'video' && videoContainerRef.current) {
        const remotePlayerContainer = document.createElement('div');
        remotePlayerContainer.id = `player-${user.uid}`;
        remotePlayerContainer.className = 'w-full h-full';
        videoContainerRef.current.append(remotePlayerContainer);
        user.videoTrack?.play(remotePlayerContainer);
      }
      if (mediaType === 'audio') {
        user.audioTrack?.play();
      }
    };

    const handleUserUnpublished = (user: IAgoraRTCRemoteUser) => {
      const playerContainer = document.getElementById(`player-${user.uid}`);
      if (playerContainer) {
        playerContainer.remove();
      }
    };

    const joinAndPublish = async () => {
      try {
        localClient.on('user-published', handleUserPublished);
        localClient.on('user-unpublished', handleUserUnpublished);

        await localClient.join(agoraAppId, stream.id, agoraToken, user.id);
        
        if (isBroadcaster) {
          const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
          localTracks.current = { audio: audioTrack, video: videoTrack };
          
          if (videoContainerRef.current) {
             videoTrack.play(videoContainerRef.current);
          }
          await localClient.publish([audioTrack, videoTrack]);
        }
        setIsConnecting(false);
      } catch (error) {
        console.error("Agora bağlantı veya yayınlama hatası:", error);
        setIsConnecting(false);
      }
    };

    joinAndPublish();

    // Temizleme fonksiyonu
    return () => {
      console.log("Temizleme fonksiyonu çalışıyor...");
      localTracks.current.audio?.close();
      localTracks.current.video?.close();
      
      // Client'ın bırakma işlemini asenkron olarak bekleyebiliriz ama then/catch ile hataları yutalım.
      localClient.leave().catch(err => {
          console.warn("Agora'dan ayrılırken hata oluştu (genellikle zararsız):", err);
      });
    };
  }, [stream.id, agoraAppId, agoraToken, isBroadcaster, user]);

  const handleEndStream = async () => {
    if (!client.current || !stream.id) return;
    try {
      await endStream(stream.id);
      await client.current.leave();
      router.push('/voice');
    } catch (error) {
      console.error("Yayın sonlandırılamadı:", error);
    }
  };

  const toggleAudio = async () => {
    if (localTracks.current.audio) {
      await localTracks.current.audio.setMuted(!isAudioMuted);
      setIsAudioMuted(!isAudioMuted);
    }
  };

  const toggleVideo = async () => {
    if (localTracks.current.video) {
      await localTracks.current.video.setMuted(!isVideoMuted);
      setIsVideoMuted(!isVideoMuted);
    }
  };

  return (
    <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
      <div id="video-container" ref={videoContainerRef} className="w-full h-full" />
      
      {isConnecting && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
              <FaSpinner className="w-8 h-8 text-white animate-spin"/>
              <p className="text-white mt-2">Yayına Bağlanılıyor...</p>
          </div>
      )}

      {isBroadcaster && !isConnecting && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-md p-3 rounded-full z-20">
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