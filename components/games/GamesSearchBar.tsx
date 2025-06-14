// components/games/GamesSearchBar.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSearch, FaTimes, FaGamepad, FaDesktop, FaStar } from 'react-icons/fa';
import { GameGenre, GamePlatform } from '../../types/gameTypes'; // Yolu güncelleyin

export interface GameFilters {
  genre?: string; // genre slug
  platform?: string; // platform slug
  sortBy?: 'popularity' | 'release_date_desc' | 'rating_desc' | 'title_asc';
  // İleride eklenebilir: tags?: string[]
}

interface GamesSearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  activeFilters: GameFilters;
  onFilterChange: (type: keyof GameFilters, value: string | string[] | undefined) => void;
  onClearFilters: () => void;
  availableGenres: GameGenre[];
  availablePlatforms: GamePlatform[];
}

const GamesSearchBar: React.FC<GamesSearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  activeFilters,
  onFilterChange,
  onClearFilters,
  availableGenres,
  availablePlatforms,
}) => {
  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchTerm;

  return (
    <div className="p-4 sm:p-6 bg-slate-100 dark:bg-slate-800/60 rounded-xl shadow-md space-y-4">
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <Input
          type="text"
          placeholder="Oyun adı, tür, etiket ara..."
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 h-11 text-base bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Tür Filtresi */}
        <Select
          value={activeFilters.genre || ''}
          onValueChange={(value) => onFilterChange('genre', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="h-10 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
            <FaGamepad className="mr-2 text-slate-500" />
            <SelectValue placeholder="Türe Göre Filtrele" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white">
            <SelectItem value="all">Tüm Türler</SelectItem>
            {availableGenres.map(genre => (
              <SelectItem key={genre.id} value={genre.slug}>{genre.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Platform Filtresi */}
        <Select
          value={activeFilters.platform || ''}
          onValueChange={(value) => onFilterChange('platform', value === 'all' ? undefined : value)}
        >
          <SelectTrigger className="h-10 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
            <FaDesktop className="mr-2 text-slate-500" />
            <SelectValue placeholder="Platforma Göre Filtrele" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white">
            <SelectItem value="all">Tüm Platformlar</SelectItem>
            {availablePlatforms.map(platform => (
              <SelectItem key={platform.id} value={platform.slug}>{platform.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sıralama */}
        <Select
          value={activeFilters.sortBy || 'popularity'}
          onValueChange={(value) => onFilterChange('sortBy', value)}
        >
          <SelectTrigger className="h-10 bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600">
            <FaStar className="mr-2 text-slate-500" />
            <SelectValue placeholder="Sırala" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white">
            <SelectItem value="popularity">Popülerliğe Göre</SelectItem>
            <SelectItem value="release_date_desc">Yeni Çıkanlar</SelectItem>
            <SelectItem value="rating_desc">Puana Göre (Yüksek)</SelectItem>
            <SelectItem value="title_asc">Ada Göre (A-Z)</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="h-10 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/70 lg:col-start-4"
          >
            <FaTimes className="mr-2" /> Filtreleri Temizle
          </Button>
        )}
      </div>
    </div>
  );
};

export default GamesSearchBar;