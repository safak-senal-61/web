// pages/search-users.tsx
import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types/userTypes'; // User tipini kullanıyoruz
import apiClient from '../lib/apiClient';
import { useRouter } from 'next/router';
import Image from 'next/image';

const LOG_PREFIX = "[SearchUsersPage]";

// Arama sonucu için User tipinin bir alt kümesi veya tam User tipi
// Eğer arama sonucu daha az bilgi içeriyorsa ayrı bir tip daha iyi olabilir.
// Bu örnekte User'dan Pick ile alıyoruz.
interface UserSearchResult extends Pick<User, 'id' | 'username' | 'nickname' | 'profilePictureUrl'> {
  // Arama sonuçlarında göstermek isteyeceğiniz ek alanlar (backend'den geliyorsa)
  // Örneğin: isFollowing?: boolean;
  isFollowing?: boolean;
}

interface SearchApiResponse {
  basarili: boolean;
  mesaj: string;
  veri?: {
    kullanicilar: UserSearchResult[];
    // meta?: { toplamKayit: number, ... } // Eğer sayfalamalı ise
  };
}

const SearchUsersPage = () => {
  const { user: authUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false); // Arama için spesifik loading
  const [searchError, setSearchError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!authIsLoading && !authUser) {
      console.log(`${LOG_PREFIX} Not authenticated, redirecting to login.`);
      router.push('/login?redirect=/search-users');
    }
  }, [authUser, authIsLoading, router]);

  const handleSearch = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (!trimmedSearchTerm) {
      setSearchResults([]);
      setHasSearched(true);
      setSearchError("Lütfen bir arama terimi girin.");
      return;
    }

    setIsLoadingSearch(true);
    setSearchError(null);
    setHasSearched(true);
    console.log(`${LOG_PREFIX} Searching for users with term: ${trimmedSearchTerm}`);

    try {
      const response = await apiClient.get<SearchApiResponse>(`/follows/search?query=${encodeURIComponent(trimmedSearchTerm)}`);
      console.log(`${LOG_PREFIX} Search API response:`, response.data);

      if (response.data && response.data.basarili && response.data.veri) {
        setSearchResults(response.data.veri.kullanicilar || []);
        if ((response.data.veri.kullanicilar || []).length === 0) {
          setSearchError(`"${trimmedSearchTerm}" ile eşleşen kullanıcı bulunamadı.`);
        }
      } else {
        setSearchResults([]);
        setSearchError(response.data.mesaj || "Arama sırasında bir hata oluştu.");
      }
    } catch (error: unknown) {
      console.error(`${LOG_PREFIX} Error searching users:`, error);
      setSearchResults([]);
      const errorMessage = error instanceof Error ? error.message : "Kullanıcı aranırken bir ağ hatası veya beklenmedik bir sorun oluştu.";
      setSearchError(errorMessage);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  if (authIsLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <p className="text-slate-300 text-lg">Yükleniyor...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <p className="text-slate-300 text-lg">Bu sayfayı görmek için giriş yapmalısınız.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="mb-6">
          <Link href="/" className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Ana Sayfaya Dön
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white mb-6 text-center sm:text-left">Kullanıcı Ara</h1>

        <form onSubmit={handleSearch} className="mb-8 flex gap-2 items-center sticky top-4 bg-slate-900/80 backdrop-blur-md p-3 rounded-xl shadow-lg z-10">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kullanıcı adı veya takma ad..."
              className="w-full pl-10 pr-3 py-2.5 bg-slate-800/70 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={isLoadingSearch}
            className="py-2.5 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoadingSearch ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              "Ara"
            )}
          </button>
        </form>

        {/* Arama Sonuçları */}
        {/* Yükleme göstergesi sadece arama aktifken ve bir arama yapılmışsa gösterilir */}
        {isLoadingSearch && hasSearched && (
           <div className="text-center py-10">
             <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
             <p className="mt-2 text-slate-400">Kullanıcılar aranıyor...</p>
           </div>
        )}

        {!isLoadingSearch && searchError && (
          <p className="text-center text-red-400 py-8 bg-red-500/10 border border-red-400/30 rounded-lg p-4">{searchError}</p>
        )}

        {!isLoadingSearch && !searchError && searchResults.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white mb-3">Arama Sonuçları ({searchResults.length}):</h2>
            {searchResults.map((foundUser) => (
              <Link
                href={`/profile/${foundUser.username}`}
                key={foundUser.id}
                className="flex items-center p-3 bg-slate-800/60 hover:bg-slate-700/80 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
              >
                <div className="relative w-12 h-12 mr-4">
                  <Image
                    src={foundUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(foundUser.nickname || foundUser.username)}&background=random&color=fff&size=48&font-size=0.5&bold=true`}
                    alt={foundUser.nickname || foundUser.username}
                    fill
                    className="rounded-full object-cover bg-slate-700"
                  />
                </div>
                <div>
                  <p className="text-base font-medium text-white hover:text-blue-300 transition-colors">{foundUser.nickname || foundUser.username}</p>
                  <p className="text-sm text-slate-400">@{foundUser.username}</p>
                </div>
                
              </Link>
            ))}
          </div>
        )}
        
        {/* Arama yapılmadıysa veya arama yapılıp sonuç bulunamadıysa (ve hata yoksa) */}
        {!isLoadingSearch && !searchError && searchResults.length === 0 && hasSearched && (
            <p className="text-center text-slate-400 py-8">
                {searchTerm.trim() ? `"${searchTerm}" ile eşleşen kullanıcı bulunamadı.` : "Kullanıcı aramak için yukarıdaki alanı kullanın."}
            </p>
        )}
         {!isLoadingSearch && !searchError && !hasSearched && ( // Henüz hiç arama yapılmadıysa
            <p className="text-center text-slate-400 py-8">Kullanıcıları kullanıcı adı veya takma ad ile arayın.</p>
        )}
      </div>
    </div>
  );
};

export default SearchUsersPage;