// components/profile/OtherUserProfileHeader.tsx
import {
    FaUserPlus,
    FaUserMinus,
    FaCrown,
    // FaCheckCircle, // Kullanılmıyorsa kaldırılabilir
    FaHourglassHalf,
    // FaEdit, // Profili düzenle butonu için
    // FaUserCircle,
    // FaEnvelope,
    // FaCalendarAlt
  } from 'react-icons/fa';
  import { User } from '../../types/userTypes';
  import Image from 'next/image';
  export interface OtherUserProfileHeaderProps { // Export edildiğinden emin ol
    profileUser: User;
    isOwnProfile: boolean | null; // EKLENDİ: Bu profilin giriş yapmış kullanıcıya ait olup olmadığını belirtir
    isFollowing: boolean;
    followRequestStatus: 'PENDING' | null;
    onFollowToggle: () => void;
    isProcessingFollowAction: boolean;
    onTabChange: (tab: 'gifts' | 'achievements' | 'followers' | 'following') => void;
    // onEditProfile?: () => void; // Opsiyonel: Kendi profilini düzenleme fonksiyonu için
  }
  
  const OtherUserProfileHeader: React.FC<OtherUserProfileHeaderProps> = ({
    profileUser,
    isOwnProfile, // Prop olarak alındı
    isFollowing,
    followRequestStatus,
    onFollowToggle,
    isProcessingFollowAction,
    onTabChange,
    // onEditProfile, // Eğer kullanılacaksa
  }) => {
    const parseSafeInt = (value: string | number | null | undefined): number => {
      if (value === null || typeof value === 'undefined') return 0;
      const num = parseInt(String(value), 10);
      return isNaN(num) ? 0 : num;
    };
  
    const currentXP = parseSafeInt(profileUser.xp);
    const nextLevelXP = parseSafeInt(profileUser.xpToNextLevel);
    
    const xpPercentage =
      nextLevelXP > 0 ? (currentXP / nextLevelXP) * 100 : 0;
  
    const followersCount = profileUser.followerCount ?? 0;
    const followingCount = profileUser.followingCount ?? 0;
  
    const renderFollowOrEditButton = () => {
      if (isOwnProfile) {
       
      }
      // Başkasının profili ise takip butonlarını göster
      if (isFollowing) {
        return (
          <button
            onClick={onFollowToggle}
            disabled={isProcessingFollowAction}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {isProcessingFollowAction ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <FaUserMinus className="w-4 h-4" />}
            <span>Takipten Çık</span>
          </button>
        );
      } else if (followRequestStatus === 'PENDING') {
        return (
          <button
            onClick={onFollowToggle}
            disabled={isProcessingFollowAction}
            className="bg-yellow-500 hover:bg-yellow-600 text-slate-900 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {isProcessingFollowAction ? <div className="w-4 h-4 border-2 border-slate-800/50 border-t-slate-800 rounded-full animate-spin"></div> : <FaHourglassHalf className="w-4 h-4" />}
            <span>İstek Gönderildi</span>
          </button>
        );
      } else {
        return (
          <button
            onClick={onFollowToggle}
            disabled={isProcessingFollowAction}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {isProcessingFollowAction ? <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div> : <FaUserPlus className="w-4 h-4" />}
            <span>Takip Et</span>
          </button>
        );
      }
    };
  
    return (
      <div className="relative bg-slate-800/70 rounded-2xl p-6 backdrop-blur-lg border border-slate-700/50 shadow-2xl mb-6">
        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative flex-shrink-0">
            <Image
              src={profileUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.nickname || profileUser.username)}&background=0D8ABC&color=fff&size=128&font-size=0.5&bold=true`}
              alt={profileUser.nickname || profileUser.username}
              width={128}
              height={128}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-blue-500 shadow-xl object-cover bg-slate-700"
            />
            {/* VIP Rozeti gibi şeyler buraya eklenebilir */}
          </div>
          <div className="flex-1 text-center sm:text-left w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-3">
              <div className="mb-2 sm:mb-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-white break-all">
                  {profileUser.nickname || profileUser.username}
                </h1>
                <p className="text-slate-400 text-sm">@{profileUser.username}</p>
              </div>
              <div className="flex gap-3 mt-3 sm:mt-0 flex-shrink-0">
                {renderFollowOrEditButton()}
              </div>
            </div>
            {profileUser.bio && (
              <p className="text-slate-300 text-sm mb-4 max-w-md mx-auto sm:mx-0">{profileUser.bio}</p>
            )}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <FaCrown className="text-yellow-400 w-5 h-5 flex-shrink-0" />
                <span className="font-semibold text-white">Seviye {profileUser.level || 1}</span>
              </div>
              <div className="h-2.5 bg-slate-700 rounded-full overflow-hidden w-full">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${Math.min(100, Math.max(0, xpPercentage)).toFixed(2)}%` }} // %0 ile %100 arasında kalmasını sağla
                />
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {currentXP} / {nextLevelXP > 0 ? nextLevelXP : (100 * (profileUser.level || 1))} XP
              </p>
            </div>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6 text-sm">
              <button 
                onClick={() => onTabChange('followers')} 
                className="text-slate-300 hover:text-blue-400 transition-colors focus:outline-none focus:text-blue-400"
                aria-label={`${followersCount} takipçi, takipçileri görüntüle`}
              >
                <span className="font-bold text-white">{followersCount}</span>
                <span className="ml-1">Takipçi</span>
              </button>
              <button 
                onClick={() => onTabChange('following')} 
                className="text-slate-300 hover:text-blue-400 transition-colors focus:outline-none focus:text-blue-400"
                aria-label={`${followingCount} takip edilen, takip edilenleri görüntüle`}
              >
                <span className="font-bold text-white">{followingCount}</span>
                <span className="ml-1">Takip Edilen</span>
              </button>
              {/* İsteğe bağlı olarak gönderi sayısı da eklenebilir */}
              {typeof profileUser.postCount === 'number' && (
                  <div className="text-slate-300">
                      <span className="font-bold text-white">{profileUser.postCount}</span>
                      <span className="ml-1">Gönderi</span>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default OtherUserProfileHeader;