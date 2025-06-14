// pages/profile.tsx (veya sizin belirttiğiniz yol)
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  FaGift,
  FaTrophy,
  FaHeart,
  FaUserFriends,
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import { User } from '../../types/userTypes'; // Tam User tipini kullanıyoruz
import apiClient from '../../lib/apiClient';
import ProfileHeader from '../../components/profile/ProfileHeader';

import GiftsTab from '../../components/profile/tabs/GiftsTab';
import AchievementsTab from '../../components/profile/tabs/AchievementsTab';
import FollowersTab from '../../components/profile/tabs/FollowersTab';
import FollowingTab from '../../components/profile/tabs/FollowingTab';

const LOG_PREFIX = "[ProfilePage]";

interface Achievement { id: string | number; title: string; icon: string; description: string; }
interface Gift { id: string | number; name: string; icon: string; fromUsername: string; receivedAt: string; }

interface PaginatedUserApiResponse {
  basarili: boolean;
  mesaj: string;
  veri?: {
    kullanicilar: User[];
    meta: {
      toplamKayit: number;
      suankiSayfa: number;
      sayfaBasiOge: number;
      toplamSayfa: number;
    };
  };
}



const ProfilePage = () => {
  const router = useRouter();
  const { user: authUser, isLoading: authLoading } = useAuth();
  
  const profileUserFromAuth = authUser; // AuthContext'ten gelen temel kullanıcı bilgisi

  const [isLoadingPageData, setIsLoadingPageData] = useState(true);
  const [activeTab, setActiveTab] = useState<'gifts' | 'achievements' | 'followers' | 'following'>('gifts');

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);

  // API'den gelen toplam sayıları tutmak için state'ler
  const [totalFollowersFromAPI, setTotalFollowersFromAPI] = useState<number | null>(null);
  const [totalFollowingFromAPI, setTotalFollowingFromAPI] = useState<number | null>(null);


  const isOwnProfile = true;

  console.log(`${LOG_PREFIX} Rendering - authLoading: ${authLoading}, authUser: ${authUser ? authUser.username : 'null'}`);

  useEffect(() => {
    console.log(`${LOG_PREFIX} useEffect triggered - authLoading: ${authLoading}, authUser: ${authUser ? authUser.username : 'null'}`);
    if (!authLoading && !authUser) {
      console.log(`${LOG_PREFIX} User not authenticated, redirecting to login.`);
      router.push('/login?redirect=/profile');
    } else if (authUser && authUser.id) {
      console.log(`${LOG_PREFIX} User authenticated: ${authUser.username}. Fetching additional profile data for user ID: ${authUser.id}`);
      setIsLoadingPageData(true);

      const fetchAdditionalData = async () => {
        try {
          console.log(`${LOG_PREFIX} Starting to fetch additional data...`);
          const userId = authUser.id;

          const [
            achievementsResponse,
            giftsResponse,
            followersApiResponse, // Bu değişkenler artık bu scope'ta tanımlı
            followingApiResponse
          ] = await Promise.all([
            // Mock başarımlar ve hediyeler (gerçek API çağrıları ile değiştirin)
            // Gerçek API çağrısı örneği: apiClient.get<SimpleApiResponse<Achievement[]>>(`/users/${userId}/achievements`).catch(...)
            Promise.resolve({ data: { basarili: true, mesaj: "Mock başarımlar", veri: [
              { id: 'ach1', title: 'Sohbet Elçisi', icon: '💬', description: 'Platformda 1000 mesaj gönderdi.' },
            ] as Achievement[] } }),
            Promise.resolve({ data: { basarili: true, mesaj: "Mock hediyeler", veri: [
              { id: 'gift1', name: 'Enerji İçeceği', icon: '🥤', fromUsername: 'admin', receivedAt: '2025-05-20T10:00:00Z' },
            ] as Gift[] } }),
            
            apiClient.get<PaginatedUserApiResponse>(`/follows/user/${userId}/followers`).catch(err => { 
              console.error(`${LOG_PREFIX} Followers fetch error:`, err.response?.data || err.message); 
              return { data: { basarili: false, mesaj: "Takipçiler alınamadı.", veri: { kullanicilar: [], meta: { toplamKayit:0, suankiSayfa:1, sayfaBasiOge:20, toplamSayfa:0} } } }; 
            }),
            apiClient.get<PaginatedUserApiResponse>(`/follows/user/${userId}/following`).catch(err => { 
              console.error(`${LOG_PREFIX} Following fetch error:`, err.response?.data || err.message); 
              return { data: { basarili: false, mesaj: "Takip edilenler alınamadı.", veri: { kullanicilar: [], meta: { toplamKayit:0, suankiSayfa:1, sayfaBasiOge:20, toplamSayfa:0} } } }; 
            })
          ]);

          // Başarımlar ve Hediyeler
          if (achievementsResponse.data && achievementsResponse.data.basarili) {
            setAchievements(achievementsResponse.data.veri || []);
          } else {
            console.warn(`${LOG_PREFIX} Failed to process achievements:`, (achievementsResponse.data as { mesaj: string })?.mesaj);
            setAchievements([]);
          }

          if (giftsResponse.data && giftsResponse.data.basarili) {
            setGifts(giftsResponse.data.veri || []);
          } else {
            console.warn(`${LOG_PREFIX} Failed to process gifts:`, (giftsResponse.data as { mesaj: string })?.mesaj);
            setGifts([]);
          }

          // Takipçiler
          console.log(`${LOG_PREFIX} Followers API response data:`, followersApiResponse.data);
          if (followersApiResponse.data && followersApiResponse.data.basarili && followersApiResponse.data.veri) {
            setFollowers(followersApiResponse.data.veri.kullanicilar || []);
            setTotalFollowersFromAPI(followersApiResponse.data.veri.meta.toplamKayit || 0); // State'i güncelle
            console.log(`${LOG_PREFIX} Followers set. Count: ${followersApiResponse.data.veri.kullanicilar?.length || 0}. Meta:`, followersApiResponse.data.veri.meta);
          } else {
            console.warn(`${LOG_PREFIX} Failed to fetch followers:`, followersApiResponse.data.mesaj);
            setFollowers([]);
            setTotalFollowersFromAPI(0);
          }

          // Takip Edilenler
          console.log(`${LOG_PREFIX} Following API response data:`, followingApiResponse.data);
          if (followingApiResponse.data && followingApiResponse.data.basarili && followingApiResponse.data.veri) {
            setFollowing(followingApiResponse.data.veri.kullanicilar || []);
            setTotalFollowingFromAPI(followingApiResponse.data.veri.meta.toplamKayit || 0); // State'i güncelle
            console.log(`${LOG_PREFIX} Following set. Count: ${followingApiResponse.data.veri.kullanicilar?.length || 0}. Meta:`, followingApiResponse.data.veri.meta);
          } else {
            console.warn(`${LOG_PREFIX} Failed to fetch following:`, followingApiResponse.data.mesaj);
            setFollowing([]);
            setTotalFollowingFromAPI(0);
          }

        } catch (error) {
          console.error(`${LOG_PREFIX} Critical error fetching additional profile data:`, error);
          setAchievements([]); setGifts([]); setFollowers([]); setFollowing([]);
          setTotalFollowersFromAPI(0); setTotalFollowingFromAPI(0);
        } finally {
          console.log(`${LOG_PREFIX} Finished fetching additional profile data. Setting isLoadingPageData to false.`);
          setIsLoadingPageData(false);
        }
      };

      fetchAdditionalData();
    }
  }, [authUser, authLoading, router]);


  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-blue-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-slate-300 text-lg">Profil yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!profileUserFromAuth) { // authUser'ı kontrol et
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <p className="text-slate-300 text-lg">Profil bulunamadı veya giriş yapmanız gerekiyor.</p>
      </div>
    );
  }
  
  // ProfileHeader için kullanılacak son kullanıcı objesi
  // AuthUser'dan gelen temel bilgileri ve API'den gelen güncel takipçi sayılarını birleştirir
  const finalProfileUserForHeader: User = {
    ...profileUserFromAuth, // AuthContext'ten gelen tüm alanlar
    followerCount: totalFollowersFromAPI ?? profileUserFromAuth.followerCount ?? 0, // API'den gelen öncelikli
    followingCount: totalFollowingFromAPI ?? profileUserFromAuth.followingCount ?? 0, // API'den gelen öncelikli
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <ProfileHeader
          profileUser={finalProfileUserForHeader} // Güncellenmiş kullanıcı objesini geçir
          isOwnProfile={isOwnProfile}
          onTabChange={(tab) => setActiveTab(tab)}
        />

        <div className="bg-slate-800/70 rounded-2xl backdrop-blur-lg border border-slate-700/50 shadow-xl overflow-hidden mt-6">
          <div className="flex border-b border-slate-700/50 overflow-x-auto whitespace-nowrap thin-scrollbar">
            {[
              { key: 'gifts', label: 'Hediye Duvarı', icon: FaGift },
              { key: 'achievements', label: 'Başarımlar', icon: FaTrophy },
              { key: 'followers', label: 'Takipçiler', icon: FaUserFriends },
              { key: 'following', label: 'Takip Edilenler', icon: FaHeart },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as 'gifts' | 'achievements' | 'followers' | 'following')}
                className={`flex-shrink-0 flex items-center gap-2 px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium transition-all duration-200 ease-in-out relative hover:bg-slate-700/50 focus:outline-none
                  ${activeTab === tab.key ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400 animate-fade-in-short"></span>
                )}
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6 min-h-[200px] relative">
            {isLoadingPageData && (
                <div className="absolute inset-0 flex justify-center items-center bg-slate-800/50 backdrop-blur-sm z-10">
                    <svg className="animate-spin h-8 w-8 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        {/* ... spinner svg ... */}
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                </div>
            )}
            {!isLoadingPageData && activeTab === 'gifts' && <GiftsTab gifts={gifts} isLoading={false} />}
            {!isLoadingPageData && activeTab === 'achievements' && <AchievementsTab achievements={achievements} isLoading={false} />}
            {!isLoadingPageData && activeTab === 'followers' && <FollowersTab followers={followers} isLoading={false} />}
            {!isLoadingPageData && activeTab === 'following' && <FollowingTab following={following} isLoading={false} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;