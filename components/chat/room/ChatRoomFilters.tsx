import React from 'react';
import { Search, Filter, Users, Clock, X, Loader2 } from 'lucide-react';

interface ChatRoomFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  searchLoading: boolean;
  sortBy: 'newest' | 'popular' | 'participants';
  setSortBy: (value: 'newest' | 'popular' | 'participants') => void;
  filterType: 'all' | 'PUBLIC' | 'PRIVATE';
  setFilterType: (value: 'all' | 'PUBLIC' | 'PRIVATE') => void;
  showPublicOnly: boolean;
  setShowPublicOnly: (value: boolean) => void;
  selectedTags: string[];
  toggleTag: (tag: string) => void;
  availableTags: string[];
  clearFilters: () => void;
}

const ChatRoomFilters: React.FC<ChatRoomFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  searchLoading,
  sortBy,
  setSortBy,
  filterType,
  setFilterType,
  showPublicOnly,
  setShowPublicOnly,
  selectedTags,
  toggleTag,
  availableTags,
  clearFilters
}) => {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl">
      <div className="p-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
    <Search className="h-5 w-5 text-gray-700" />
  </div>
  {searchLoading && (
    <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
    </div>
  )}
  <input
    type="text"
    placeholder="Hangi konuda sohbet etmek istiyorsunuz?"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="w-full pl-12 pr-12 py-4 bg-gray-50 hover:bg-gray-100 border-2 border-blue-400 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 placeholder-gray-600 text-gray-900 shadow-sm"
  />
</div>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">
            {/* Sort */}
            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200 shadow-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'popular' | 'participants')}
                className="bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer pr-2"
              >
                <option value="newest">En Yeni</option>
                <option value="popular">En Popüler</option>
                <option value="participants">Katılımcı Sayısı</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200 shadow-sm">
              <Filter className="h-4 w-4 text-gray-500" />
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value as 'all' | 'PUBLIC' | 'PRIVATE')}
                className="bg-transparent border-none outline-none text-gray-700 font-medium cursor-pointer pr-2"
              >
                <option value="all">Tümü</option>
                <option value="PUBLIC">Herkese Açık</option>
                <option value="PRIVATE">Özel</option>
              </select>
            </div>

            {/* Public Rooms Toggle */}
            <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-200 shadow-sm">
              <Users className="h-4 w-4 text-gray-500" />
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPublicOnly}
                  onChange={(e) => setShowPublicOnly(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm font-medium text-gray-700">Sadece Herkese Açık</span>
              </label>
            </div>

            {/* Clear Filters */}
            {(searchTerm || sortBy !== 'newest' || filterType !== 'all' || selectedTags.length > 0 || showPublicOnly) && (
              <button 
                onClick={clearFilters}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl transition-all duration-200 border border-gray-300 shadow-sm"
              >
                <X className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Temizle</span>
              </button>
            )}
          </div>

          {/* Tags Filter */}
          {availableTags.length > 0 && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                <span>🏷️</span>
                <span>Etiketler:</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 ${
                      selectedTags.includes(tag)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                       : 'bg-white/60 hover:bg-white/80 text-gray-600 hover:text-blue-600 border border-gray-200'
                     }`}
                     onClick={() => toggleTag(tag)}
                   >
                     {tag}
                   </button>
                 ))}
               </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default ChatRoomFilters;