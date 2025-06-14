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
import OtherUserProfileHeader, {  } from '../../components/profile/OtherUserProfileHeader';
import GiftsTab from '../../components/profile/tabs/GiftsTab';
import AchievementsTab from '../../components/profile/tabs/AchievementsTab';
import FollowersTab from '../../components/profile/tabs/FollowersTab';
import FollowingTab from '../../components/profile/tabs/FollowingTab';

const LOG_PREFIX = "[UserProfilePage]";

// Tipler
interface Achievement { id: string | number; title: string; icon: string; description: string; }
interface Gift { id: string | number; name: string; icon: string; fromUsername: string; receivedAt: string; }

interface UserProfileApiResponse {
  basarili: boolean;
  mesaj: string;
  veri?: User;
}

interface FollowActionApiResponse {
  basarili: boolean;
  mesaj: string;
}

interface PaginatedUserApiResponse {
  basarili: boolean;
  mesaj: string;
  veri?: {
    kullanicilar: User[];
    meta: { toplamKayit: number; suankiSayfa: number; sayfaBasiOge: number; toplamSayfa: number; };
  };
}

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

  console.log(
    `${LOG_PREFIX} Rendering. Viewed: ${viewedUsername}, AuthUser: ${authUser?.username}, ` +
    `isOwnProfile: ${calculatedIsOwnProfile}, AuthLoading: ${authIsLoading}, RouterReady: ${router.isReady}, ` +
    `isLoadingProfile: ${isLoadingProfile}, profileUser: ${profileUser ? profileUser.id : null}`
  );

  // 1. Auth kontrolü ve profil bilgilerini çekme
  useEffect(() => {
    console.log(`${LOG_PREFIX} PROFILE_EFFECT triggered. AuthLoading: ${authIsLoading}, RouterReady: ${router.isReady}, viewedUsername: ${viewedUsername}`);
    if (authIsLoading || !router.isReady) {
      console.log(`${LOG_PREFIX} PROFILE_EFFECT: Auth or Router not ready. Aborting.`);
      return;
    }

    if (!authUser) {
      console.log(`${LOG_PREFIX} PROFILE_EFFECT: User not authenticated, redirecting to login.`);
      const currentPath = router.asPath;
      router.replace(`/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }

    if (viewedUsername) {
      // Eğer görüntülenen kullanıcı değiştiyse veya authUser değiştiyse (örn: yeni login) profili yeniden çek
      // Bu, viewedUsername değiştiğinde önceki profil verisinin temizlenmesini de sağlar.
      if (profileUser?.username !== viewedUsername || (profileUser && authUser && profileUser.id === authUser.id && !calculatedIsOwnProfile)) {
        // Görüntülenen kullanıcı adı değiştiyse veya mevcut profil kendi profilimizdi ama artık değilse (ya da tam tersi)
        // state'leri sıfırlayıp yeniden çek.
         console.log(`${LOG_PREFIX} PROFILE_EFFECT: viewedUsername changed or context changed. Resetting and fetching for: ${viewedUsername}`);
         setProfileUser(null); // Önceki profili temizle
         setIsFollowing(false);
         setFollowRequestStatus(null);
         // Sekme verilerini de sıfırlamak isteyebiliriz, çünkü yeni kullanıcıya ait olmalılar
         setFollowers([]);
         setFollowing([]);
         setAchievements([]);
         setGifts([]);
      }

      console.log(`${LOG_PREFIX} PROFILE_EFFECT: Fetching profile for: ${viewedUsername}`);
      setIsLoadingProfile(true);
      setProfileError(null);
      // setProfileUser(null); // Zaten yukarıda yapıldı

      apiClient.get<UserProfileApiResponse>(`/users/${viewedUsername}/profile`)
        .then(response => {
          console.log(`${LOG_PREFIX} PROFILE_EFFECT: Profile API response for ${viewedUsername}:`, response.data);
          if (response.data && response.data.basarili && response.data.veri) {
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
          console.error(`${LOG_PREFIX} PROFILE_EFFECT: Error fetching profile for ${viewedUsername}:`, error);
          const errMsg = error.response?.data?.mesaj || error.message || "Profil bilgileri alınırken bir hata oluştu.";
          setProfileError(errMsg);
          setProfileUser(null);
        })
        .finally(() => {
          console.log(`${LOG_PREFIX} PROFILE_EFFECT: Finished fetching profile for ${viewedUsername}. Setting isLoadingProfile to false.`);
          setIsLoadingProfile(false);
        });
    } else { // viewedUsername yoksa (örn: /profile/ gibi bir yola gelinmişse)
      console.warn(`${LOG_PREFIX} PROFILE_EFFECT: Username is not available in router.query, but user is logged in.`);
      setProfileError("Görüntülenecek kullanıcı adı belirtilmemiş.");
      setIsLoadingProfile(false);
    }
  }, [viewedUsername, router, authUser, authIsLoading, calculatedIsOwnProfile, profileUser]);


  // 2. Sekme verilerini çek
  const fetchTabData = useCallback(async (tabKey: TabKey, currentProfileUserId: string | null) => {
    if (!currentProfileUserId) {
        console.log(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): ABORTED - no currentProfileUserId. Tab: ${tabKey}`);
        return;
    }

    console.log(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): STARTED for tab: ${tabKey}, User ID: ${currentProfileUserId}. Setting isLoadingTabsData to true.`);
    setIsLoadingTabsData(true);

    try {
      const userId = currentProfileUserId;
      let success = false;
      switch (tabKey) {
        case 'gifts':
          console.log(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): Fetching gifts for ${userId}`);
          const giftsRes = await Promise.resolve({ data: { basarili: true, veri: [{ id: 'gift_mock_1', name: 'Gül', icon: '🌹', fromUsername: 'sistem', receivedAt: new Date().toISOString() }] as Gift[] } });
          if(giftsRes.data.basarili) setGifts(giftsRes.data.veri || []); else setGifts([]);
          success = giftsRes.data.basarili;
          console.log(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): Gifts fetched for ${userId}, success: ${success}`, giftsRes.data.veri);
          break;
        case 'achievements':
          console.log(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): Fetching achievements for ${userId}`);
          const achievementsRes = await Promise.resolve({ data: { basarili: true, veri: [{ id: 'ach_mock_1', title: 'İlk Adım', icon: '🏆', description: 'Uygulamaya hoş geldin!' }] as Achievement[] } });
          if(achievementsRes.data.basarili) setAchievements(achievementsRes.data.veri || []); else setAchievements([]);
          success = achievementsRes.data.basarili;
          console.log(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): Achievements fetched for ${userId}, success: ${success}`, achievementsRes.data.veri);
          break;
        case 'followers':
          console.log(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): Fetching followers for ${userId}`);
          const followersRes = await apiClient.get<PaginatedUserApiResponse>(`/follows/user/${userId}/followers`);
          setFollowers(followersRes.data.basarili && followersRes.data.veri ? followersRes.data.veri.kullanicilar : []);
          success = followersRes.data.basarili;
          console.log(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): Followers fetched for ${userId}, success: ${success}`, followersRes.data);
          break;
        case 'following':
          console.log(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): Fetching following for ${userId}`);
          const followingRes = await apiClient.get<PaginatedUserApiResponse>(`/follows/user/${userId}/following`);
          setFollowing(followingRes.data.basarili && followingRes.data.veri ? followingRes.data.veri.kullanicilar : []);
          success = followingRes.data.basarili;
          console.log(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): Following fetched for ${userId}, success: ${success}`, followingRes.data);
          break;
      }
      if (!success) {
        console.warn(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): API call for tab ${tabKey} was not successful or returned no data.`);
      }
    } catch (error) {
      console.error(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): Error fetching data for tab ${tabKey} (User ID: ${currentProfileUserId}):`, error);
      if (tabKey === 'followers') setFollowers([]);
      if (tabKey === 'following') setFollowing([]);
      if (tabKey === 'gifts') setGifts([]);
      if (tabKey === 'achievements') setAchievements([]);
    } finally {
      console.log(`${LOG_PREFIX} TAB_DATA_EFFECT (fetchTabData): FINISHED for tab: ${tabKey}, User ID: ${currentProfileUserId}. Setting isLoadingTabsData to false.`);
      setIsLoadingTabsData(false);
    }
  }, [/* apiClient sabitse bağımlılığa gerek yok */]);

  useEffect(() => {
    console.log(
        `${LOG_PREFIX} TAB_EFFECT triggered. profileUser.id: ${profileUser?.id}, activeTab: ${activeTab}, isLoadingProfile: ${isLoadingProfile}, isLoadingTabsData: ${isLoadingTabsData}`
    );
    if (profileUser && profileUser.id && !isLoadingProfile) {
      if (!isLoadingTabsData) {
        console.log(`${LOG_PREFIX} TAB_EFFECT: Conditions met. Calling fetchTabData(${activeTab}, profileUser.id).`);
        fetchTabData(activeTab, profileUser.id);
      } else {
        console.log(`${LOG_PREFIX} TAB_EFFECT: Conditions NOT met because isLoadingTabsData is true.`);
      }
    } else {
        let reason = '';
        if (!profileUser || !profileUser.id) reason += 'profileUser or profileUser.id not available. ';
        if (isLoadingProfile) reason += 'isLoadingProfile is true. ';
        console.log(`${LOG_PREFIX} TAB_EFFECT: Conditions NOT met for fetchTabData. Reason: ${reason.trim()}`);
    }
  // fetchTabData'yı useCallback ile sardığımız için ve onun bağımlılıkları (idealde) sabit olduğu için,
  // fetchTabData'nın referansı değişmemeli. Bu yüzden onu buraya ekleyebiliriz.
  // Temel tetikleyiciler profileUser (özellikle id'si) ve activeTab.
  }, [profileUser, activeTab, isLoadingProfile, isLoadingTabsData, fetchTabData]);


  const handleFollowToggle = async () => {
    if (!authUser || !profileUser || calculatedIsOwnProfile || isProcessingFollowAction) {
      return;
    }

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
        setFollowRequestStatus(null);
        setProfileUser(prev => prev ? ({ ...prev, followerCount: Math.max(0, (prev.followerCount || 1) - 1), amIFollowingThisUser: false, followRequestStatusToThisUser: null }) : null);
      };
    } else if (followRequestStatus === 'PENDING') {
      endpoint = `/follows/requests/cancel/${targetUserId}`;
      method = 'delete';
      successCallback = () => {
        setFollowRequestStatus(null);
        setProfileUser(prev => prev ? ({ ...prev, followRequestStatusToThisUser: null }) : null);
      };
    } else {
      endpoint = `/follows/user/${targetUserId}`;
      method = 'post';
      successCallback = () => {
        if (profileUser.isPrivate) {
          setFollowRequestStatus('PENDING');
          setProfileUser(prev => prev ? ({ ...prev, followRequestStatusToThisUser: 'PENDING' }) : null);
        } else {
          setIsFollowing(true);
          setProfileUser(prev => prev ? ({ ...prev, followerCount: (prev.followerCount || 0) + 1, amIFollowingThisUser: true }) : null);
        }
      };
    }

    try {
      const response = method === 'post'
        ? await apiClient.post<FollowActionApiResponse>(endpoint, {})
        : await apiClient.delete<FollowActionApiResponse>(endpoint);
      
      if (response.data.basarili) {
        successCallback();
      } else {
        alert(`İşlem Başarısız: ${response.data.mesaj}`);
      }
    } catch (error: unknown) {
      const isApiError = (err: unknown): err is { response?: { data?: { mesaj?: string } }, message?: string } =>
        typeof err === 'object' && err !== null && 'message' in err;
      alert(`Bir hata oluştu: ${isApiError(error) && error.response?.data?.mesaj ? error.response.data.mesaj : (isApiError(error) ? error.message : 'Bilinmeyen bir hata oluştu')}`);
    } finally {
      setIsProcessingFollowAction(false);
    }
  };

  // ----- RENDER KISMI -----

  if (authIsLoading || !router.isReady || (isLoadingProfile && !profileError && !profileUser) ) {
    // !profileUser eklendi, çünkü isLoadingProfile false olup profileError yokken profileUser null olabilir (API'den henüz dönmemiş)
    console.log(`${LOG_PREFIX} Global loading state. AuthLoading: ${authIsLoading}, RouterReady: ${router.isReady}, isLoadingProfile: ${isLoadingProfile}, profileError: ${!!profileError}, profileUser: ${!!profileUser}`);
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-300 text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!authIsLoading && !authUser && router.isReady) {
    console.log(`${LOG_PREFIX} Fallback redirect to login. AuthLoading: ${authIsLoading}, AuthUser: ${!!authUser}, RouterReady: ${router.isReady}`);
    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            <p className="text-slate-300 text-lg">Giriş yapmanız gerekiyor, yönlendiriliyorsunuz...</p>
        </div>
    );
  }

  if (profileError) {
    console.log(`${LOG_PREFIX} Rendering profileError: ${profileError}`);
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Profil Yüklenemedi</h1>
        <p className="text-slate-300 mb-6 text-center">{profileError}</p>
        <Link href="/" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  if (!isLoadingProfile && !profileUser) {
    // API'den veri gelmedi ama hata da yoksa (örn: kullanıcı bulunamadı mesajı API'den geldi ama profileError set edilmediyse)
    console.log(`${LOG_PREFIX} Rendering 'no profileUser' after loading finished without error.`);
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <p className="text-slate-300 text-lg">Kullanıcı profili bulunamadı veya yüklenemedi.</p>
      </div>
    );
  }
  
  // profileUser var ama auth hala yükleniyorsa (normalde ilk yükleme bloğu yakalar ama güvenlik için)
  // VEYA profileUser var ama authUser yoksa (ki bu durum login'e yönlendirmeli)
  // Bu blok aslında gereksiz olabilir, çünkü yukarıdaki auth kontrolü ve yükleme kontrolü bunları kapsamalı.
  if (!profileUser || (!authIsLoading && !authUser)) {
     console.log(`${LOG_PREFIX} Fallback for !profileUser or (!authIsLoading && !authUser). ProfileUser: ${!!profileUser}, AuthLoading: ${authIsLoading}, AuthUser: ${!!authUser}`);
     // Bu durumda, eğer authUser yoksa zaten login'e yönlendirilmiş olmalı.
     // Eğer profileUser yoksa, hata veya yükleniyor ekranı gösterilmiş olmalı.
     // Bu sadece bir son çare.
     return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
            <p className="text-slate-300 text-lg">Veriler yüklenirken bir sorun oluştu.</p>
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
            aria-label="Geri dön"
          >
            <FaArrowLeft className="h-5 w-5 mr-1 transform group-hover:-translate-x-1 transition-transform" />
            Geri
          </button>
        </div>

        <OtherUserProfileHeader
            profileUser={profileUser} // profileUser artık null değil
            isOwnProfile={calculatedIsOwnProfile}
            isFollowing={isFollowing}
            followRequestStatus={followRequestStatus}
            onFollowToggle={handleFollowToggle}
            isProcessingFollowAction={isProcessingFollowAction}
            onTabChange={(tab) => setActiveTab(tab as TabKey)}
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
                className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-all relative hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800
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