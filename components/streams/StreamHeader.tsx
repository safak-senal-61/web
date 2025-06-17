// components/streams/StreamHeader.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaEye, FaGem } from 'react-icons/fa';
import { Stream } from '../../types/streamTypes';

interface StreamHeaderProps {
  stream: Stream;
}

const StreamHeader: React.FC<StreamHeaderProps> = ({ stream }) => {
  return (
    <div className="p-4 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link href={`/profile/${stream.broadcaster.username}`}>
            <Image
              src={stream.broadcaster.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(stream.broadcaster.nickname || stream.broadcaster.username)}`}
              alt={stream.broadcaster.nickname || stream.broadcaster.username}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
            />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-white truncate">{stream.title}</h1>
          <p className="text-sm text-slate-300">{stream.broadcaster.nickname}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5 text-slate-300">
          <FaEye />
          <span>{stream.currentViewers}</span>
        </div>
        <div className="flex items-center gap-1.5 text-yellow-400">
          <FaGem />
          <span>{stream.totalDiamondsReceived}</span>
        </div>
      </div>
    </div>
  );
};

export default StreamHeader;