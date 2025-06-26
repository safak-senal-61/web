// pages/search-users.tsx
import { useState, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { FaSearch, FaArrowLeft, FaUserPlus, FaUsers } from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import { User } from '../types/userTypes';
import apiClient from '../lib/apiClient';
import { useRouter } from 'next/router';
import Image from 'next/image';

const LOG_PREFIX = "[SearchUsersPage]";

interface UserSearchResult extends Pick<User, 'id' | 'username' | 'nickname' | 'profilePictureUrl'> {
  isFollowing?: boolean;
}

interface SearchApiResponse {
  basarili: boolean;
  mesaj: string;
  veri?: {
    kullanicilar: UserSearchResult[];
  };
}

const SearchUsersPage = () => {
  const { user: authUser, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
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
      const response = await apiClient.get<SearchApiResponse>(`/follows/search?searchTerm=${encodeURIComponent(trimmedSearchTerm)}`);
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
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-300 text-lg font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950">
        <div className="text-center space-y-4 p-8 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50">
          <FaUsers className="w-16 h-16 text-blue-400 mx-auto" />
          <p className="text-slate-300 text-lg font-medium">Bu sayfayı görmek için giriş yapmalısınız.</p>
          <Link 
            href="/login" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-all duration-200 text-sm font-medium group mb-6"
            >
              <FaArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
              Ana Sayfaya Dön
            </Link>
            
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                Kullanıcı Ara
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                Platformdaki diğer kullanıcıları keşfedin ve bağlantı kurun
              </p>
            </div>
          </div>

          {/* Search Form */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity duration-300"></div>
                <div className="relative flex items-center bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-2 shadow-2xl">
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaSearch className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Kullanıcı adı veya takma ad ile ara..."
                      className="w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-slate-400 focus:outline-none text-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isLoadingSearch}
                    className="ml-2 py-4 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    {isLoadingSearch ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <span className="flex items-center">
                        <FaSearch className="w-4 h-4 mr-2" />
                        Ara
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Loading State */}
          {isLoadingSearch && hasSearched && (
            <div className="text-center py-16">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-500 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              </div>
              <p className="mt-6 text-slate-400 text-lg font-medium">Kullanıcılar aranıyor...</p>
            </div>
          )}

          {/* Error State */}
          {!isLoadingSearch && searchError && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-red-500/10 border border-red-400/30 rounded-2xl p-6 backdrop-blur-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaSearch className="w-6 h-6 text-red-400" />
                  </div>
                  <p className="text-red-400 text-lg font-medium">{searchError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search Results */}
          {!isLoadingSearch && !searchError && searchResults.length > 0 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Arama Sonuçları
                </h2>
                <p className="text-slate-400">
                  <span className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium">
                    <FaUsers className="w-4 h-4 mr-2" />
                    {searchResults.length} kullanıcı bulundu
                  </span>
                </p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((foundUser, index) => (
                  <Link
                    href={`/profile/${foundUser.username}`}
                    key={foundUser.id}
                    className="group relative"
                    style={{animationDelay: `${index * 100}ms`}}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 transition-all duration-300 group-hover:bg-slate-800/80 group-hover:border-slate-600/50 group-hover:transform group-hover:scale-105 shadow-lg group-hover:shadow-2xl">
                      <div className="flex items-center space-x-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-slate-700 group-hover:ring-blue-500/50 transition-all duration-300">
                            <Image
                              src={foundUser.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(foundUser.nickname || foundUser.username)}&background=random&color=fff&size=64&font-size=0.5&bold=true`}
                              alt={foundUser.nickname || foundUser.username}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        
                        <div className="flex-grow min-w-0">
                          <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors duration-200 truncate">
                            {foundUser.nickname || foundUser.username}
                          </h3>
                          <p className="text-slate-400 text-sm truncate">@{foundUser.username}</p>
                          {foundUser.isFollowing && (
                            <span className="inline-flex items-center mt-2 px-2 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">
                              <FaUserPlus className="w-3 h-3 mr-1" />
                              Takip Ediliyor
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-slate-800 group-hover:bg-blue-600 rounded-full flex items-center justify-center transition-all duration-200">
                            <FaArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-white rotate-180 transition-all duration-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Empty States */}
          {!isLoadingSearch && !searchError && searchResults.length === 0 && hasSearched && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaSearch className="w-12 h-12 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Sonuç Bulunamadı</h3>
                <p className="text-slate-400">
                  {searchTerm.trim() ? `"${searchTerm}" ile eşleşen kullanıcı bulunamadı.` : "Kullanıcı aramak için yukarıdaki alanı kullanın."}
                </p>
              </div>
            </div>
          )}
          
          {!isLoadingSearch && !searchError && !hasSearched && (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUsers className="w-12 h-12 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Kullanıcıları Keşfedin</h3>
                <p className="text-slate-400 mb-6">
                  Platformdaki diğer kullanıcıları kullanıcı adı veya takma ad ile arayarak keşfedin.
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm">
                  <span className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full">Kullanıcı adı</span>
                  <span className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full">Takma ad</span>
                  <span className="px-3 py-1 bg-slate-800/50 text-slate-300 rounded-full">İsim</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchUsersPage;