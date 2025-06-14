// components/profile/ProfileHeader.tsx
import Link from 'next/link';
import {
  FaUserPlus,
  FaUserEdit,
  FaCrown,
} from 'react-icons/fa';
import { User } from '../../types/userTypes'; // User tipinizin doğru yolu
import Image from 'next/image';

interface ProfileHeaderProps {
  profileUser: User;
  isOwnProfile: boolean;
  onFollow?: () => void; // Opsiyonel, eğer takip etme fonksiyonu varsa
  onTabChange: (tab: 'followers' | 'following') => void; // Takipçi/takip edilen sekmelerine tıklanınca
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileUser,
  isOwnProfile,
  onFollow,
  onTabChange,
}) => {
  // XP ve Level bar için hesaplama
  const xpPercentage =
    profileUser && typeof profileUser.level === 'number' &&
    profileUser.xpToNextLevel && typeof profileUser.xpToNextLevel !== 'undefined' &&
    profileUser.xp && typeof profileUser.xp !== 'undefined'
      ? (parseInt(String(profileUser.xp)) / parseInt(String(profileUser.xpToNextLevel))) * 100
      : 0;

  const followersCount = profileUser.followerCount != null ? profileUser.followerCount : 0; // Örnek varsayılan
  const followingCount = profileUser.followingCount != null ? profileUser.followingCount : 0; // Örnek varsayılan

  return (
    <div className="relative bg-slate-800/70 rounded-2xl p-6 backdrop-blur-lg border border-slate-700/50 shadow-2xl mb-6">
      <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Profil Fotoğrafı */}
        <div className="relative flex-shrink-0">
          <Image
            src={profileUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.nickname || profileUser.username)}&background=0D8ABC&color=fff&size=128&font-size=0.5&bold=true`}
            alt={profileUser.nickname || profileUser.username}
            width={120}
            height={120}
            className="rounded-full border-4 border-blue-500 shadow-xl object-cover bg-slate-700"
          />
          {/* Online Durumu (Opsiyonel) */}
          {/* <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-3 border-slate-800 animate-pulse"></div> */}
        </div>

        {/* Profil Bilgileri */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
            <div className="mb-2 sm:mb-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">{profileUser.nickname || profileUser.username}</h1>
              <p className="text-slate-400 text-sm">@{profileUser.username}</p>
            </div>
            <div className="flex gap-3 mt-2 sm:mt-0">
              {isOwnProfile ? (
                <Link
                  href="/settings" // Ayarlar/Profil düzenleme sayfasına yönlendir
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm shadow-md hover:shadow-lg"
                >
                  <FaUserEdit className="w-4 h-4" />
                  <span>Profili Düzenle</span>
                </Link>
              ) : (
                onFollow && ( // onFollow prop'u varsa göster
                  <button
                    onClick={onFollow}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm shadow-md hover:shadow-lg"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    <span>Takip Et</span>
                    {/* TODO: Takip ediliyorsa "Takipten Çık" butonu gösterilmeli */}
                  </button>
                )
              )}
            </div>
          </div>

          {profileUser.bio && (
            <p className="text-slate-300 text-sm mb-4 max-w-md">{profileUser.bio}</p>
          )}

          {/* Level Bar */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <FaCrown className="text-yellow-400 w-5 h-5" />
              <span className="font-semibold text-white">Seviye {profileUser.level || 1}</span>
            </div>
            <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden w-full sm:w-2/3">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${xpPercentage.toFixed(2)}%` }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {profileUser.xp ? parseInt(String(profileUser.xp)) : 0} / {profileUser.xpToNextLevel ? parseInt(String(profileUser.xpToNextLevel)) : (100 * (profileUser.level || 1))} XP
            </p>
          </div>

          {/* Takipçi Bilgileri */}
          <div className="flex gap-4 sm:gap-6 text-sm">
            <button onClick={() => onTabChange('followers')} className="text-slate-300 hover:text-blue-400 transition-colors">
              <span className="font-bold text-white">{followersCount}</span>
              <span className="ml-1">Takipçi</span>
            </button>
            <button onClick={() => onTabChange('following')} className="text-slate-300 hover:text-blue-400 transition-colors">
              <span className="font-bold text-white">{followingCount}</span>
              <span className="ml-1">Takip Edilen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;