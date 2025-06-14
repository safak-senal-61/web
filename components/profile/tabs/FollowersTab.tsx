// components/profile/tabs/FollowersTab.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaUser } from 'react-icons/fa';
// User tipini veya sadece gerekli alanları içeren bir ProfileUserListItem tipini import edin
import { User as ProfileUserListItem } from '../../../types/userTypes'; // Örnek yol

interface FollowersTabProps {
  followers: ProfileUserListItem[];
  isLoading: boolean;
}

const FollowersTab: React.FC<FollowersTabProps> = ({ followers, isLoading }) => {
  if (isLoading) {
    return <p className="text-center text-slate-400 py-8">Takipçiler yükleniyor...</p>;
  }

  if (followers.length === 0) {
    return <p className="text-center text-slate-400 py-8">Henüz hiç takipçi yok.</p>;
  }

  return (
    <div className="space-y-3 animate-fade-in-short">
      {followers.map(follower => (
        <Link
          href={`/profile/${follower.username}`} // Dinamik profil linki
          key={follower.id}
          className="flex items-center p-3 bg-slate-700/40 rounded-lg hover:bg-slate-700/70 transition-colors"
        >
          <div className="relative">
            {follower.profilePictureUrl ? (
              <Image
                src={follower.profilePictureUrl}
                alt={follower.username}
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
                         ${follower.profilePictureUrl ? 'hidden' : 'flex'}`}
            >
              <FaUser className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            </div>
          </div>
          
          <div className="ml-3">
            <p className="text-sm font-medium text-white">{follower.nickname || follower.username}</p>
            <p className="text-xs text-slate-400">@{follower.username}</p>
          </div>
          {/* İsteğe bağlı: Takip Et/Takipten Çık butonu (eğer kendi takipçileriniz değilse) */}
        </Link>
      ))}
    </div>
  );
};

export default FollowersTab;