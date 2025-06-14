// components/profile/tabs/FollowingTab.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
import { User as ProfileUserListItem } from '../../../types/userTypes'; // Örnek yol

interface FollowingTabProps {
  following: ProfileUserListItem[];
  isLoading: boolean;
}

const FollowingTab: React.FC<FollowingTabProps> = ({ following, isLoading }) => {
  if (isLoading) {
    return <p className="text-center text-slate-400 py-8">Takip edilenler yükleniyor...</p>;
  }

  if (following.length === 0) {
    return <p className="text-center text-slate-400 py-8">Henüz kimse takip edilmiyor.</p>;
  }

  return (
    <div className="space-y-3 animate-fade-in-short">
      {following.map(followedUser => (
        <Link
          href={`/profile/${followedUser.username}`} // Dinamik profil linki
          key={followedUser.id}
          className="flex items-center p-3 bg-slate-700/40 rounded-lg hover:bg-slate-700/70 transition-colors"
        >
          <div className="relative">
            {followedUser.profilePictureUrl ? (
              <Image
                src={followedUser.profilePictureUrl}
                alt={followedUser.username}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
                onError={(e) => {
                  // If image fails to load, hide it and show default avatar
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    const defaultAvatar = parent.querySelector('.default-avatar');
                    if (defaultAvatar) {
                      (defaultAvatar as HTMLElement).style.display = 'flex';
                    }
                  }
                }}
              />
            ) : null}
            
            {/* Default avatar fallback */}
            <div 
              className={`default-avatar w-12 h-12 rounded-full 
                         bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700
                         flex items-center justify-center
                         ${followedUser.profilePictureUrl ? 'hidden' : 'flex'}`}
            >
              <FaUser className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </div>
          </div>
          
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{followedUser.nickname || followedUser.username}</p>
            <p className="text-xs text-slate-400">@{followedUser.username}</p>
          </div>
          {/* İsteğe bağlı: Takipten Çık butonu */}
          {/* <button className="ml-auto bg-red-500/50 hover:bg-red-500/80 text-white px-2 py-1 rounded text-xs">Takipten Çık</button> */}
        </Link>
      ))}
    </div>
  );
};

export default FollowingTab;