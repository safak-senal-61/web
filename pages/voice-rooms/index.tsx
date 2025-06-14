// pages/voice-rooms/index.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router'; // useRouter import edildi
import { useAuth } from '../../hooks/useAuth'; // useAuth import edildi (yolunuzu kontrol edin)
import { Header } from '@/components/layout/Header';
import { FaComments as FaCommentsIcon, FaClock } from 'react-icons/fa'; // FaClock ve FaSpinner eklendi
import RoomCard from '@/components/rooms/RoomCard';
import TrendingRooms from '@/components/rooms/TrendingRooms';
import RoomsSearchBar, { Filters } from '@/components/rooms/RoomsSearchBar';
import CreateRoomButton from '@/components/rooms/CreateRoomButton';
import RoomCategories from '@/components/rooms/RoomCategories';
import UserRoomSuggestions from '@/components/rooms/UserRoomSuggestions';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CreateRoomForm from '@/components/rooms/CreateRoomForm';
import { Room, UserProfileTeaser } from '../../types/roomTypes'; // Yolu kontrol edin

// --- ÖRNEK VERİLER ---
const sampleUsers: UserProfileTeaser[] = [
  { id: 'user1', username: 'AhmetTR', avatarUrl: 'https://source.unsplash.com/random/50x50?person,1' },
  { id: 'user2', username: 'ZeynepCan', avatarUrl: 'https://source.unsplash.com/random/50x50?person,2' },
];
const sampleRoomsData: Room[] = [
  { id: '1', name: 'Geyik Muhabbeti 🍻', description: 'Her telden sohbet, rahat bir ortam.', memberCount: 42, maxMembers: 100, tags: ['sohbet', 'eğlence'], isPrivate: false, imageUrl: 'https://source.unsplash.com/random/400x200?chat,social', category: 'Sohbet', language: 'tr', createdBy: sampleUsers[0], lastActivity: new Date(Date.now() - 1000 * 60 * 5), isPopular: true, isNew: false },
  { id: '2', name: 'Oyun Gecesi Lobisi 🎮', description: 'Valorant, LoL, CS:GO... Takımını kur!', memberCount: 88, maxMembers: 150, tags: ['oyun', 'valorant'], isPrivate: false, imageUrl: 'https://source.unsplash.com/random/400x200?gaming,esports', category: 'Oyun', language: 'tr', createdBy: sampleUsers[1], lastActivity: new Date(Date.now() - 1000 * 60 * 30), isPopular: true, isNew: true },
  { id: '3', name: 'Müzik Tutkunları 🎶', description: 'Yeni çıkan albümler, favori sanatçılar.', memberCount: 120, maxMembers: 200, tags: ['müzik', 'pop'], isPrivate: true, imageUrl: 'https://source.unsplash.com/random/400x200?music,concert', category: 'Müzik', language: 'en', createdBy: sampleUsers[0], lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 2), isPopular: false, isNew: false },
  { id: '4', name: 'Kodlama ve Geliştirme 💻', description: 'Yazılım projeleri ve teknoloji sohbetleri.', memberCount: 75, maxMembers: 100, tags: ['yazılım', 'react'], isPrivate: false, imageUrl: 'https://source.unsplash.com/random/400x200?coding,software', category: 'Teknoloji', language: 'en', createdBy: sampleUsers[1], lastActivity: new Date(Date.now() - 1000 * 60 * 15), isPopular: false, isNew: true },
  { id: '5', name: 'English Chat Corner 🇬🇧', description: 'Practice your English with native speakers and learners.', memberCount: 60, maxMembers: 100, tags: ['english', 'language', 'practice'], isPrivate: false, category: 'Dil Öğrenimi', language: 'en', createdBy: sampleUsers[0], lastActivity: new Date(Date.now() - 1000 * 60 * 45), isPopular: true, isNew: false },
  { id: '6', name: 'Sanat ve Tasarım Atölyesi 🎨', description: 'Çizimlerini paylaş, ilham al, yeni teknikler öğren.', memberCount: 25, maxMembers: 50, tags: ['sanat', 'çizim', 'tasarım'], isPrivate: false, category: 'Sanat', language: 'tr', createdBy: sampleUsers[1], lastActivity: new Date(Date.now() - 1000 * 60 * 60 * 5), isPopular: false, isNew: true },
];
// --- ÖRNEK VERİLER SONU ---

const VoiceRoomPage = () => {
  const { user, isLoading: authIsLoading } = useAuth(); // Auth hook'undan user ve isLoading alındı
  const router = useRouter(); // Router hook'u

  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [trendingRooms, setTrendingRooms] = useState<Room[]>([]);
  const [userSuggestedRooms, setUserSuggestedRooms] = useState<Room[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Filters>({});
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(true); // Odaları yükleme durumu için ayrı bir state
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const availableTags = useMemo(() => Array.from(new Set(allRooms.flatMap((r: Room) => r.tags || []).filter(Boolean))), [allRooms]);

  // Auth Yönlendirmesi
  useEffect(() => {
    if (!authIsLoading && !user) {
      router.push('/login?redirect=/voice-rooms');
    }
  }, [user, authIsLoading, router]);

  const categories = useMemo(() => {
    if (isLoadingData) return []; // isLoadingData'ya göre kontrol
    const uniqueCategories = new Set(allRooms.map(room => room.category).filter(Boolean) as string[]);
    return Array.from(uniqueCategories);
  }, [allRooms, isLoadingData]);
 
  // Oda Verilerini Yükleme
  useEffect(() => {
    if (user) { // Sadece kullanıcı varsa verileri yükle
        setIsLoadingData(true);
        const timer = setTimeout(() => {
        setAllRooms(sampleRoomsData);
        setTrendingRooms(sampleRoomsData.filter(r => r.isPopular).slice(0, 6));
        setUserSuggestedRooms(sampleRoomsData.filter(r => r.language === 'tr' && !r.isPopular).slice(0, 3));
        setIsLoadingData(false);
        }, 700);
        return () => clearTimeout(timer);
    }
  }, [user]); // user değiştiğinde tetiklenir

  const applyFiltersAndSearch = useCallback(() => {
    if (isLoadingData || !user) { // Eğer ana veri yükleniyorsa veya kullanıcı yoksa filtreleme yapma
        setFilteredRooms([]);
        return;
    }
    // ... (geri kalan filtreleme ve arama mantığı aynı)
    let tempRooms = [...allRooms];

    if (selectedCategory) {
      tempRooms = tempRooms.filter(room => room.category === selectedCategory);
    }

    if (activeFilters.roomType === 'private') {
      tempRooms = tempRooms.filter(room => room.isPrivate);
    } else if (activeFilters.roomType === 'public') {
      tempRooms = tempRooms.filter(room => !room.isPrivate);
    }
    
    if (activeFilters.language && activeFilters.language !== 'all') {
        tempRooms = tempRooms.filter(room => room.language === activeFilters.language);
    }

    if (activeFilters.tags && activeFilters.tags.length > 0) {
        tempRooms = tempRooms.filter(room => 
            activeFilters.tags!.every((filterTag: string) => room.tags?.includes(filterTag))
        );
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempRooms = tempRooms.filter(room =>
        room.name.toLowerCase().includes(lowerSearchTerm) ||
        room.description.toLowerCase().includes(lowerSearchTerm) ||
        (room.tags && room.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))) ||
        (room.category && room.category.toLowerCase().includes(lowerSearchTerm))
      );
    }
    
    if (activeFilters.sortBy === 'members_desc') {
        tempRooms.sort((a, b) => b.memberCount - a.memberCount);
    } else if (activeFilters.sortBy === 'newest') {
        tempRooms.sort((a, b) => {
            const dateA = typeof a.lastActivity === 'string' ? new Date(a.lastActivity) : a.lastActivity || new Date(0);
            const dateB = typeof b.lastActivity === 'string' ? new Date(b.lastActivity) : b.lastActivity || new Date(0);
            return dateB.getTime() - dateA.getTime();
        });
    }
    
    setFilteredRooms(tempRooms);
  }, [allRooms, searchTerm, activeFilters, selectedCategory, isLoadingData, user]); // user eklendi

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, activeFilters, selectedCategory, allRooms, isLoadingData, applyFiltersAndSearch]);


  const handleCreateRoom = (newRoomData: Omit<Room, 'id' | 'createdBy' | 'memberCount' | 'lastActivity' | 'isPopular' | 'isNew'>) => {
    console.log("Yeni oda oluşturuluyor:", newRoomData);
    if (!user) return; // Kullanıcı yoksa oda oluşturma
    const newRoom: Room = {
      ...newRoomData,
      id: String(Date.now()),
      memberCount: 1,
      lastActivity: new Date(),
      createdBy: { id: user.id, username: user.username, avatarUrl: user.avatarUrl }, // Gerçek kullanıcı bilgisi
      isPopular: false,
      isNew: true,
    };
    setAllRooms(prev => [newRoom, ...prev]);
    setIsCreateRoomModalOpen(false);
    setSearchTerm('');
    setActiveFilters({});
    setSelectedCategory(null);
  };

  const mainContentPaddingTop = "pt-20 sm:pt-24";
  const pageContainerClasses = "container mx-auto px-4 sm:px-6 lg:px-8 pb-12";

  // Auth Yükleme Durumu
  if (authIsLoading) {
    return (
      <>
        <Header />
        <div className={`flex justify-center items-center h-[calc(100vh-4rem)] ${mainContentPaddingTop}`}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mb-4"></div>
            <p className="text-slate-700 dark:text-slate-300 text-lg">Oturum kontrol ediliyor...</p>
          </div>
        </div>
      </>
    );
  }

  // Kullanıcı Yoksa (Yönlendirme bekleniyor)
  if (!user) {
    return (
      <>
        <Header />
        <div className={`flex justify-center items-center h-[calc(100vh-4rem)] ${mainContentPaddingTop}`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FaClock className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-lg">Giriş yapmanız gerekiyor. Yönlendiriliyorsunuz...</p>
          </div>
        </div>
      </>
    );
  }

  // Kullanıcı Var, İçeriği Göster
  return (
    <>
      <Header />
      <main className={`animate-fade-in space-y-10 sm:space-y-12 ${mainContentPaddingTop} ${pageContainerClasses}`}>
        <section className="mb-8 sm:mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-white">
                Sohbet Odalarını Keşfet
              </h1>
              <p className="mt-1 sm:mt-2 text-md text-slate-600 dark:text-slate-400 max-w-xl">
                İlgi alanlarınıza uygun canlı odalara katılın, yeni insanlarla tanışın veya kendi topluluğunuzu oluşturun.
              </p>
            </div>
            <CreateRoomButton className="self-start md:self-center flex-shrink-0" onClick={() => setIsCreateRoomModalOpen(true)} />
          </div>
          
          <RoomsSearchBar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            activeFilters={activeFilters}
            onFilterChange={(type: keyof Filters, value: Filters[keyof Filters]) => setActiveFilters((prev: Filters) => {
                const newFilters = { ...prev };
                if (value === undefined || (Array.isArray(value) && value.length === 0) || value === '') {
                    delete newFilters[type];
                } else {
                    (newFilters[type] as Filters[keyof Filters]) = value;
                }
                return newFilters;
            })}
            onClearFilters={() => setActiveFilters({})}
            availableTags={availableTags}
          />
        </section>

        {!isLoadingData && !searchTerm && Object.keys(activeFilters).length === 0 && !selectedCategory && (
          <>
            {trendingRooms.length > 0 && <TrendingRooms rooms={trendingRooms} />}
            {userSuggestedRooms.length > 0 && <UserRoomSuggestions rooms={userSuggestedRooms} title="Sana Özel Odalar" />}
            {categories.length > 0 && 
              <RoomCategories
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(category) => {
                  setSelectedCategory(prev => prev === category ? null : category);
                }}
              />
            }
          </>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-white">
              {selectedCategory 
                ? `${selectedCategory} Odaları` 
                : searchTerm 
                ? `Arama Sonuçları` 
                : "Tüm Odalar"}
            </h2>
            {!isLoadingData && <span className="text-sm text-slate-500 dark:text-slate-400">{filteredRooms.length} oda bulundu</span>}
          </div>
          
          {isLoadingData ? ( // authIsLoading yerine isLoadingData kullanıldı
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="rounded-xl p-4 space-y-3 bg-slate-100 dark:bg-slate-800/50 animate-pulse">
                  <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                  <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-3 w-full bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="flex justify-between items-center pt-2">
                    <div className="h-4 w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    <div className="h-8 w-1/3 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredRooms.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
              {filteredRooms.map(room => (
                <RoomCard key={room.id} room={room} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-100 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
              <FaCommentsIcon className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500 opacity-70 mb-4" />
              <p className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">
                {searchTerm || selectedCategory || Object.keys(activeFilters).length > 0 ? "Uygun Oda Bulunamadı" : "Görünüşe Göre Buralar Biraz Sessiz"}
              </p>
              <p className="text-md text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {searchTerm || selectedCategory || Object.keys(activeFilters).length > 0 ? "Farklı bir arama yapmayı veya filtreleri değiştirmeyi deneyin." : "Henüz hiç oda yok. İlk odayı siz oluşturabilirsiniz!"}
              </p>
              {(searchTerm || selectedCategory || Object.keys(activeFilters).length > 0) && (
                  <Button 
                    variant="outline" 
                    className="mt-6 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                    onClick={() => {
                        setSearchTerm('');
                        setActiveFilters({});
                        setSelectedCategory(null);
                    }}
                  >
                    Tüm Filtreleri Temizle
                  </Button>
              )}
            </div>
          )}
        </section>

        <Dialog open={isCreateRoomModalOpen} onOpenChange={setIsCreateRoomModalOpen}>
          <DialogContent className="sm:max-w-[525px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
            <DialogHeader>
              <DialogTitle className="text-slate-800 dark:text-white text-2xl">Yeni Sohbet Odası Oluştur</DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Odanız için bilgileri girin ve topluluğunuzu başlatın.
              </DialogDescription>
            </DialogHeader>
            <CreateRoomForm 
                onSubmit={handleCreateRoom} 
                onCancel={() => setIsCreateRoomModalOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </main>
    </>
  );
};

export default VoiceRoomPage;