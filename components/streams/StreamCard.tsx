// components/streams/StreamCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser, FaEye } from 'react-icons/fa';
import { Stream } from '../../types/streamTypes';

interface StreamCardProps {
  stream: Stream;
}

const StreamCard: React.FC<StreamCardProps> = ({ stream }) => {
  return (
    <Link href={`/voice/${stream.id}`} className="group block overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-slate-200 dark:border-slate-700/50 bg-white dark:bg-slate-800">
        <div className="relative">
          <div className="w-full aspect-video bg-slate-300 dark:bg-slate-700 relative">
            {stream.coverImageUrl ? (
              <Image
                src={stream.coverImageUrl}
                alt={stream.title}
                fill // layout="fill" yerine
                className="object-cover transition-transform duration-300 group-hover:scale-105" // objectFit="cover" yerine
              />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                    <FaUser className="w-12 h-12 text-white/20" />
                </div>
            )}
          </div>
          <div className="absolute top-2 left-2">
            <span className="px-2.5 py-1 text-xs font-semibold text-white bg-red-600 rounded-md shadow">
              CANLI
            </span>
          </div>
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md">
            <FaEye />
            <span>{stream.currentViewers}</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center space-x-2">
              <Image
                src={stream.broadcaster.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(stream.broadcaster.nickname || stream.broadcaster.username)}&background=random`}
                alt={stream.broadcaster.nickname || stream.broadcaster.username}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover border-2 border-slate-300"
              />
              <div>
                <p className="text-white font-semibold text-sm drop-shadow-md">{stream.broadcaster.nickname}</p>
              </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-slate-800 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {stream.title}
          </h3>
          {stream.tags && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {stream.tags.slice(0, 3).map(tag => (
                <span key={tag} className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
    </Link>
  );
};

export default StreamCard;