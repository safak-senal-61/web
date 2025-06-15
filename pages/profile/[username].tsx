// pages/profile/[username].tsx

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  FaGift,
  FaTrophy,
  FaHeart,
  FaUserFriends,
  FaArrowLeft,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types/userTypes';
import apiClient from '../../lib/apiClient';
import OtherUserProfileHeader from '../../components/profile/OtherUserProfileHeader';
import GiftsTab from '../../components/profile/tabs/GiftsTab';
import AchievementsTab from '../../components/profile/tabs/AchievementsTab';
import FollowersTab from '../../components/profile/tabs/FollowersTab';
import FollowingTab from '../../components/profile/tabs/FollowingTab';
import { ApiResponse, PaginationMeta } from '../../types/apiTypes'; // MERKEZİ TİPLERİ IMPORT ET

const LOG_PREFIX = "[UserProfilePage]";

// Bu tipler ortak bir dosyada veya burada kalabilir
interface Achievement { id: string | number; title: string; icon: string; description: string; }
interface Gift { id: string | number; name: string; icon: string; fromUsername: string; receivedAt: string; }

// Bu arayüzler artık merkezi tiplerle yönetiliyor, bu yüzden kaldırılabilir.
/*
interface UserProfileApiResponse { ... }
interface FollowActionApiResponse { ... }
interface PaginatedUserApiResponse { ... }
*/

interface ApiError {
  response?: {
    data?: {
      mesaj?: string;
    };
  };
  message?: string;
}

type TabKey = 'gifts' | 'achievements' | 'followers' | 'following';

const UserProfilePage = () => {
  const router = useRouter();
  const { username: viewedUsernameFromQuery } = router.query;
  const { user: authUser, isLoading: authIsLoading } = useAuth();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followRequestStatus, setFollowRequestStatus] = useState<'PENDING' | null>(null);
  const [isProcessingFollowAction, setIsProcessingFollowAction] = useState(false);

  const [activeTab, setActiveTab] = useState<TabKey>('gifts');
  const [isLoadingTabsData, setIsLoadingTabsData] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);

  const viewedUsername = router.isReady && typeof viewedUsernameFromQuery === 'string' ? viewedUsernameFromQuery : null;
  const calculatedIsOwnProfile: boolean = !authIsLoading && authUser != null && viewedUsername != null
    ? authUser.username === viewedUsername
    : false;

  useEffect(() => {
    if (authIsLoading || !router.isReady || !viewedUsername) {
      return;
    }

    if (!authUser) {
      const currentPath = router.asPath;
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    setIsLoadingProfile(true);
    setProfileError(null);

    apiClient.get<ApiResponse<User>>(`/users/${viewedUsername}/profile`)
      .then(response => {
        if (response.data?.basarili && response.data.veri) {
          const fetchedUser = response.data.veri;
          setProfileUser(fetchedUser);
          setIsFollowing(fetchedUser.amIFollowingThisUser || false);
          setFollowRequestStatus(fetchedUser.followRequestStatusToThisUser || null);
        } else {
          setProfileError(response.data.mesaj || "Kullanıcı profili bulunamadı.");
          setProfileUser(null);
        }
      })
      .catch((error: ApiError) => {
        const errMsg = error.response?.data?.mesaj || error.message || "Profil bilgileri alınırken bir hata oluştu.";
        setProfileError(errMsg);
        setProfileUser(null);
      })
      .finally(() => {
        setIsLoadingProfile(false);
      });
  }, [viewedUsername, router, authUser, authIsLoading]);

  const fetchTabData = useCallback(async (tabKey: TabKey, currentProfileUserId: string | null) => {
    if (!currentProfileUserId) return;
    setIsLoadingTabsData(true);

    try {
      const userId = currentProfileUserId;
      switch (tabKey) {
        case 'gifts':
          // Mock/gerçek API çağrısı
          break;
        case 'achievements':
          // Mock/gerçek API çağrısı
          break;
        case 'followers':
          const followersRes = await apiClient.get<ApiResponse<{ kullanicilar: User[], meta: PaginationMeta }>>(`/follows/user/${userId}/followers`);
          if (followersRes.data.basarili && followersRes.data.veri) {
            setFollowers(followersRes.data.veri.kullanicilar);
          }
          break;
        case 'following':
          const followingRes = await apiClient.get<ApiResponse<{ kullanicilar: User[], meta: PaginationMeta }>>(`/follows/user/${userId}/following`);
          if (followingRes.data.basarili && followingRes.data.veri) {
            setFollowing(followingRes.data.veri.kullanicilar);
          }
          break;
      }
    } catch (error) {
      console.error(`Error fetching data for tab ${tabKey}:`, error);
    } finally {
      setIsLoadingTabsData(false);
    }
  }, []);

  useEffect(() => {
    if (profileUser && profileUser.id && !isLoadingProfile) {
      fetchTabData(activeTab, profileUser.id);
    }
  }, [profileUser, activeTab, isLoadingProfile, fetchTabData]);


  const handleFollowToggle = async () => {
    if (!authUser || !profileUser || calculatedIsOwnProfile || isProcessingFollowAction) return;

    setIsProcessingFollowAction(true);
    const targetUserId = profileUser.id;
    let endpoint = '';
    let method: 'post' | 'delete' = 'post';
    let successCallback = () => {};

    if (isFollowing) {
      endpoint = `/follows/user/${targetUserId}/unfollow`;
      method = 'post';
      successCallback = () => {
        setIsFollowing(false);
        setProfileUser(prev => prev ? ({ ...prev, followerCount: Math.max(0, (prev.followerCount || 1) - 1), amIFollowingThisUser: false, followRequestStatusToThisUser: null }) : null);
      };
    } else if (followRequestStatus === 'PENDING') {
      endpoint = `/follows/requests/cancel/${targetUserId}`;
      method = 'delete';
      successCallback = () => setFollowRequestStatus(null);
    } else {
      endpoint = `/follows/user/${targetUserId}`;
      method = 'post';
      successCallback = () => {
        if (profileUser.isPrivate) {
          setFollowRequestStatus('PENDING');
        } else {
          setIsFollowing(true);
          setProfileUser(prev => prev ? ({ ...prev, followerCount: (prev.followerCount || 0) + 1, amIFollowingThisUser: true }) : null);
        }
      };
    }

    try {
      const response = await (method === 'post'
        ? apiClient.post<ApiResponse>(endpoint, {})
        : apiClient.delete<ApiResponse>(endpoint));
      
      if (response.data.basarili) {
        successCallback();
      } else {
        alert(`İşlem Başarısız: ${response.data.mesaj}`);
      }
    } catch (error: any) {
      alert(`Bir hata oluştu: ${error.response?.data?.mesaj || error.message}`);
    } finally {
      setIsProcessingFollowAction(false);
    }
  };


  if (authIsLoading || isLoadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
          <svg className="animate-spin h-10 w-10 text-blue-400 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Profil Yüklenemedi</h1>
        <p className="text-slate-300 mb-6 text-center">{profileError}</p>
        <Link href="/" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">Ana Sayfaya Dön</Link>
      </div>
    );
  }
  
  if (!profileUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <p className="text-slate-300 text-lg">Kullanıcı bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="mb-6">
          <button 
            onClick={() => router.back()} 
            className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center text-sm group"
          >
            <FaArrowLeft className="h-5 w-5 mr-1 transform group-hover:-translate-x-1 transition-transform" />
            Geri
          </button>
        </div>

        <OtherUserProfileHeader
            profileUser={profileUser}
            isOwnProfile={calculatedIsOwnProfile}
            isFollowing={isFollowing}
            followRequestStatus={followRequestStatus}
            onFollowToggle={handleFollowToggle}
            isProcessingFollowAction={isProcessingFollowAction}
            onTabChange={(tab) => setActiveTab(tab)}
        />

        <div className="bg-slate-800/70 rounded-2xl backdrop-blur-lg border border-slate-700/50 shadow-xl overflow-hidden mt-6">
          <div className="flex border-b border-slate-700/50 overflow-x-auto whitespace-nowrap thin-scrollbar">
            {[
              { key: 'gifts', label: 'Hediyeler', icon: FaGift },
              { key: 'achievements', label: 'Başarımlar', icon: FaTrophy },
              { key: 'followers', label: `Takipçiler (${profileUser.followerCount || 0})`, icon: FaUserFriends },
              { key: 'following', label: `Takip Edilenler (${profileUser.followingCount || 0})`, icon: FaHeart },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as TabKey)}
                className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-all relative hover:bg-slate-700/50 focus:outline-none
                  ${activeTab === tab.key ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {activeTab === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 rounded-full"></span>}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6 min-h-[200px] relative">
            {isLoadingTabsData && (
                <div className="absolute inset-0 flex justify-center items-center bg-slate-800/50 backdrop-blur-sm z-10 rounded-b-2xl">
                    <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}
            {!isLoadingTabsData && activeTab === 'gifts' && <GiftsTab gifts={gifts} isLoading={false} />}
            {!isLoadingTabsData && activeTab === 'achievements' && <AchievementsTab achievements={achievements} isLoading={false} />}
            {!isLoadingTabsData && activeTab === 'followers' && <FollowersTab followers={followers} isLoading={false} />}
            {!isLoadingTabsData && activeTab === 'following' && <FollowingTab following={following} isLoading={false} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;