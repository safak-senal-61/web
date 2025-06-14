// pages/games/index.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth'; // Yolu kontrol edin
import { Header } from '@/components/layout/Header';
import { FaGamepad as   FaExclamationTriangle } from 'react-icons/fa';
import GameCard from '@/components/games/GameCard';
import PopularGames from '@/components/games/PopularGames';
import NewReleases from '@/components/games/NewReleases'; // Benzer şekilde oluşturun
import GamesSearchBar, { GameFilters } from '@/components/games/GamesSearchBar';
import GameGenres from '@/components/games/GameGenres';
import { Button } from '@/components/ui/button';
import { Game } from '../../types/gameTypes'; // Yolu kontrol edin
import { sampleGamesData, sampleGenres, samplePlatforms } from '../../data/sampleGameData'; // Örnek verileri import edin veya doğrudan burada tanımlayın

// --- ÖRNEK VERİLER (Eğer ayrı dosyada değilse) ---
// const samplePlatforms: GamePlatform[] = [ ... ];
// const sampleGenres: GameGenre[] = [ ... ];
// const sampleGamesData: Game[] = [ ... ];
// --- ÖRNEK VERİLER SONU ---

const GamesPage = () => {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  const [allGames, setAllGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [popularGames, setPopularGames] = useState<Game[]>([]);
  const [newReleaseGames, setNewReleaseGames] = useState<Game[]>([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<GameFilters>({});
  const [selectedGenreSlug, setSelectedGenreSlug] = useState<string | null>(null);

  const [isLoadingData, setIsLoadingData] = useState(true);

  // Auth Yönlendirmesi (VoiceRoomPage'den aynı)
  useEffect(() => {
    if (!authIsLoading && !user) {
      router.push('/login?redirect=/games');
    }
  }, [user, authIsLoading, router]);

  const availableGenres = useMemo(() => {
    if (isLoadingData) return [];
    // Gerçek uygulamada API'den veya sabit bir listeden alınır
    // return Array.from(new Set(allGames.flatMap(game => game.genres.map(g => g.name)))).map(name => ({id: name, name, slug: name.toLowerCase()}));
    return sampleGenres;
  }, [isLoadingData]);

  const availablePlatforms = useMemo(() => {
    if (isLoadingData) return [];
    return samplePlatforms;
  }, [isLoadingData]);
 
  // Oyun Verilerini Yükleme
  useEffect(() => {
    if (user) {
        setIsLoadingData(true);
        // API çağrısı simülasyonu
        const timer = setTimeout(() => {
          setAllGames(sampleGamesData);
          setPopularGames(sampleGamesData.filter(g => g.isPopular).slice(0, 5)); // En fazla 5 popüler
          setNewReleaseGames(sampleGamesData.filter(g => g.isNewRelease).sort((a,b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()).slice(0, 5)); // En fazla 5 yeni
          setIsLoadingData(false);
        }, 700);
        return () => clearTimeout(timer);
    }
  }, [user]);

  const applyFiltersAndSearch = useCallback(() => {
    if (isLoadingData || !user) {
        setFilteredGames([]);
        return;
    }
    let tempGames = [...allGames];

    // Seçili türe göre filtreleme (eğer GameGenres bileşeni kullanılıyorsa)
    if (selectedGenreSlug) {
      tempGames = tempGames.filter(game => game.genres.some(g => g.slug === selectedGenreSlug));
    }
    // GamesSearchBar'dan gelen filtreler
    if (activeFilters.genre) {
      tempGames = tempGames.filter(game => game.genres.some(g => g.slug === activeFilters.genre));
    }
    if (activeFilters.platform) {
      tempGames = tempGames.filter(game => game.platforms.some(p => p.slug === activeFilters.platform));
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      tempGames = tempGames.filter(game =>
        game.title.toLowerCase().includes(lowerSearchTerm) ||
        game.description.toLowerCase().includes(lowerSearchTerm) ||
        (game.developer && game.developer.toLowerCase().includes(lowerSearchTerm)) ||
        (game.tags && game.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))) ||
        (game.genres && game.genres.some(genre => genre.name.toLowerCase().includes(lowerSearchTerm)))
      );
    }
    
    // Sıralama
    if (activeFilters.sortBy) {
        switch (activeFilters.sortBy) {
            case 'popularity': // Popülerlik için özel bir alanınız olmalı (örneğin isPopular veya communitySize)
                tempGames.sort((a, b) => (b.communitySize || 0) - (a.communitySize || 0) || (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
                break;
            case 'release_date_desc':
                tempGames.sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime());
                break;
            case 'rating_desc':
                tempGames.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            case 'title_asc':
                tempGames.sort((a,b) => a.title.localeCompare(b.title));
                break;
        }
    }
    
    setFilteredGames(tempGames);
  }, [allGames, searchTerm, activeFilters, selectedGenreSlug, isLoadingData, user]);

  useEffect(() => {
    applyFiltersAndSearch();
  }, [searchTerm, activeFilters, selectedGenreSlug, allGames, isLoadingData, applyFiltersAndSearch]);


  const handlePlayGame = (gameId: string) => {
    const game = allGames.find(g => g.id === gameId);
    if (game && game.isPlayableOnWebsaChat) {
      console.log(`Oyun başlatılıyor: ${game.title} - Parametreler: ${game.WebsaChatLaunchParams}`);
      // Burada websachat uygulamasını başlatan bir deeplink veya Electron IPC çağrısı yapılabilir.
      // Örnek: window.location.href = game.WebsaChatLaunchParams;
      alert(`${game.title} WebsaChat'de başlatılıyor... (Simülasyon)`);
    }
  };

  const handleGameDetails = (gameId: string) => {
    // Oyun detay sayfasına yönlendirme veya modal açma
    router.push(`/games/${allGames.find(g=>g.id === gameId)?.slug || gameId}`);
    // Veya: setSelectedGameForDetails(gameId); setIsDetailModalOpen(true);
  };

  const mainContentPaddingTop = "pt-20 sm:pt-24";
  const pageContainerClasses = "container mx-auto px-4 sm:px-6 lg:px-8 pb-12";

  // Auth Yükleme Durumu (VoiceRoomPage'den aynı)
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

  // Kullanıcı Yoksa (VoiceRoomPage'den aynı)
  if (!user) {
    return (
      <>
        <Header />
        <div className={`flex justify-center items-center h-[calc(100vh-4rem)] ${mainContentPaddingTop}`}>
          {/* ... (VoiceRoomPage'deki gibi) ... */}
          <p className="text-slate-700 dark:text-slate-300 text-lg">Giriş yapmanız gerekiyor. Yönlendiriliyorsunuz...</p>
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
                Oyunları Keşfet
              </h1>
              <p className="mt-1 sm:mt-2 text-md text-slate-600 dark:text-slate-400 max-w-xl">
                Favori oyunlarını bul, yenilerini keşfet ve WebsaChat topluluğuyla oynamaya başla!
              </p>
            </div>
            {/* İsteğe bağlı: "Oyun Öner" veya "Kütüphanem" butonu */}
            {/* <Button className="self-start md:self-center flex-shrink-0">Kütüphanem</Button> */}
          </div>
          
          <GamesSearchBar
            searchTerm={searchTerm}
            onSearchTermChange={setSearchTerm}
            activeFilters={activeFilters}
            onFilterChange={(type: keyof GameFilters, value: string | string[] | undefined) => setActiveFilters(prev => {
                const newFilters = { ...prev };
                if (value === undefined || value === 'all' || (Array.isArray(value) && value.length === 0) || value === '') {
                    delete newFilters[type];
                } else {
                    (newFilters[type] as string) = Array.isArray(value) ? value[0] : value;
                }
                return newFilters;
            })}
            onClearFilters={() => {
              setSearchTerm('');
              setActiveFilters({});
              setSelectedGenreSlug(null); // Eğer GameGenres kullanılıyorsa bunu da temizle
            }}
            availableGenres={availableGenres}
            availablePlatforms={availablePlatforms}
          />
        </section>

        {/* Arama yapılmıyorsa ve filtre yoksa özel bölümler */}
        {!isLoadingData && !searchTerm && Object.keys(activeFilters).length === 0 && !selectedGenreSlug && (
          <>
            {popularGames.length > 0 && 
              <PopularGames 
                games={popularGames} 
                onPlayClick={handlePlayGame} 
                onDetailsClick={handleGameDetails}
              />
            }
            {newReleaseGames.length > 0 && 
              <NewReleases // Bu bileşeni PopularGames'e benzer şekilde oluşturun
                games={newReleaseGames} 
                title="Yeni Çıkanlar"
                onPlayClick={handlePlayGame} 
                onDetailsClick={handleGameDetails}
              />
            }
            {availableGenres.length > 0 && 
              <GameGenres
                genres={availableGenres}
                selectedGenreSlug={selectedGenreSlug}
                onSelectGenre={(slug) => {
                  setSelectedGenreSlug(prev => prev === slug ? null : slug);
                  // GameGenres seçimi aktif filtreleri temizleyebilir veya onlarla birleştirebilir.
                  // Şimdilik, GameGenres seçimi diğer filtreleri sıfırlasın:
                  setActiveFilters({}); 
                  setSearchTerm('');
                }}
              />
            }
            {/* <GamePlatforms ... /> // İsteğe bağlı */}
          </>
        )}

        {/* Ana Oyun Listesi Bölümü */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-white">
              {selectedGenreSlug
                ? `${availableGenres.find(g => g.slug === selectedGenreSlug)?.name || ''} Oyunları`
                : activeFilters.genre
                ? `${availableGenres.find(g => g.slug === activeFilters.genre)?.name || ''} Oyunları`
                : searchTerm || Object.keys(activeFilters).length > 0
                ? `Arama Sonuçları`
                : "Tüm Oyunlar"}
            </h2>
            {!isLoadingData && <span className="text-sm text-slate-500 dark:text-slate-400">{filteredGames.length} oyun bulundu</span>}
          </div>
          
          {isLoadingData ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
              {Array.from({ length: 10 }).map((_, index) => ( // Skeleton sayısı
                <div key={index} className="rounded-xl p-4 space-y-3 bg-slate-100 dark:bg-slate-800/50 animate-pulse">
                  <div className="aspect-[3/4] bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                  <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-3 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>
                  <div className="h-8 w-full bg-slate-200 dark:bg-slate-700 rounded-md mt-3"></div>
                </div>
              ))}
            </div>
          ) : filteredGames.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
              {filteredGames.map(game => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onPlayClick={handlePlayGame}
                  onDetailsClick={handleGameDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-100 dark:bg-slate-800/30 rounded-xl border border-slate-200 dark:border-slate-700">
              <FaExclamationTriangle className="mx-auto h-16 w-16 text-amber-400 dark:text-amber-500 opacity-70 mb-4" />
              <p className="text-xl font-medium text-slate-700 dark:text-slate-300 mb-2">
                Uygun Oyun Bulunamadı
              </p>
              <p className="text-md text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                Farklı bir arama yapmayı veya filtreleri değiştirmeyi deneyin.
              </p>
              {(searchTerm || Object.keys(activeFilters).length > 0 || selectedGenreSlug) && (
                  <Button 
                    variant="outline" 
                    className="mt-6 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                    onClick={() => {
                        setSearchTerm('');
                        setActiveFilters({});
                        setSelectedGenreSlug(null);
                    }}
                  >
                    Tüm Filtreleri Temizle
                  </Button>
              )}
            </div>
          )}
        </section>
      </main>
    </>
  );
};

export default GamesPage;