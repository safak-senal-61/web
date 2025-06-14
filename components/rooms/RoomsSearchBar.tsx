// components/rooms/RoomsSearchBar.tsx
import React, { useState } from 'react'; // useState eklendi (filtreler için gerekebilir)
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// BU TİPİ EXPORT EDİN
export interface Filters {
  roomType?: 'public' | 'private' | 'all';
  sortBy?: 'members_desc' | 'newest' | 'activity' | 'name_asc';
  language?: string; // 'all' da olabilir veya boş string
  tags?: string[]; // Seçilen etiketler
}

export interface RoomsSearchBarProps { // BU PROPS INTERFACE'İNİ DE EXPORT EDİN (eğer başka yerde kullanılacaksa)
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  activeFilters: Filters; // Artık bu tanımlı
  onFilterChange: (filterType: keyof Filters, value: string | string[] | undefined) => void; // Değer undefined olabilir (filtreyi temizlemek için)
  onClearFilters: () => void;
  availableTags: string[]; // Filtreleme için mevcut etiketler
}

const RoomsSearchBar: React.FC<RoomsSearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  activeFilters,
  onFilterChange,
  onClearFilters,
  availableTags,
}) => {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const availableLanguages = [
    { value: 'all', label: 'Tüm Diller' },
    { value: 'tr', label: 'Türkçe' },
    { value: 'en', label: 'English' },
    // Diğer diller eklenebilir
  ];

  const sortOptions = [
     { value: 'activity', label: 'Aktiviteye Göre' },
     { value: 'newest', label: 'En Yeni' },
     { value: 'members_desc', label: 'Üye Sayısı (Çoktan Aza)' },
     { value: 'name_asc', label: 'Ada Göre (A-Z)' },
  ];

  const handleTagToggle = (tag: string) => {
     const currentTags = activeFilters.tags || [];
     const newTags = currentTags.includes(tag)
         ? currentTags.filter(t => t !== tag)
         : [...currentTags, tag];
     onFilterChange('tags', newTags.length > 0 ? newTags : undefined); // Boşsa undefined gönder
  };

  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="search"
            placeholder="Oda adı, konu veya etiket ara..."
            className="w-full p-3 sm:p-3.5 pl-10 sm:pl-12 pr-4 text-slate-800 dark:text-white
                       bg-white dark:bg-slate-800/60
                       border border-slate-300 dark:border-slate-700
                       rounded-lg shadow-sm
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       focus:border-transparent outline-none transition-colors"
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="flex-shrink-0 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/50"
        >
          <FaFilter className="h-4 w-4 mr-2" />
          Filtreler {Object.values(activeFilters).filter(v => v !== undefined && (Array.isArray(v) ? v.length > 0 : true)).length > 0 ? `(${Object.values(activeFilters).filter(v => v !== undefined && (Array.isArray(v) ? v.length > 0 : true)).length})` : ''}
        </Button>
      </div>

      {showAdvancedFilters && (
        <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700 space-y-4">
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
             <div>
                 <label htmlFor="roomTypeFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Oda Türü</label>
                 <Select
                     value={activeFilters.roomType || 'all'}
                     onValueChange={(value) => onFilterChange('roomType', value === 'all' ? undefined : value as Filters['roomType'])}
                 >
                     <SelectTrigger id="roomTypeFilter" className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white">
                         <SelectValue placeholder="Oda Türü Seçin" />
                     </SelectTrigger>
                     <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                         <SelectItem value="all">Tümü</SelectItem>
                         <SelectItem value="public">Herkese Açık</SelectItem>
                         <SelectItem value="private">Özel</SelectItem>
                     </SelectContent>
                 </Select>
             </div>
             <div>
                 <label htmlFor="languageFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dil</label>
                 <Select
                     value={activeFilters.language || 'all'}
                     onValueChange={(value) => onFilterChange('language', value === 'all' ? undefined : value)}
                 >
                     <SelectTrigger id="languageFilter" className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white">
                         <SelectValue placeholder="Dil Seçin" />
                     </SelectTrigger>
                     <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                         {availableLanguages.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
                     </SelectContent>
                 </Select>
             </div>
             <div>
                 <label htmlFor="sortByFilter" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sırala</label>
                 <Select
                     value={activeFilters.sortBy || 'activity'}
                     onValueChange={(value) => onFilterChange('sortBy', value as Filters['sortBy'])}
                 >
                     <SelectTrigger id="sortByFilter" className="bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-800 dark:text-white">
                         <SelectValue placeholder="Sıralama Ölçütü" />
                     </SelectTrigger>
                     <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                         {sortOptions.map(opt => <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>)}
                     </SelectContent>
                 </Select>
             </div>
         </div>
         {availableTags.length > 0 && (
             <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Etiketler</label>
                 <div className="flex flex-wrap gap-2">
                     {availableTags.map(tag => (
                         <Button
                             key={tag}
                             variant={(activeFilters.tags || []).includes(tag) ? "default" : "outline"}
                             size="sm"
                             onClick={() => handleTagToggle(tag)}
                             className={`text-xs rounded-full px-3 py-1
                                         ${(activeFilters.tags || []).includes(tag) 
                                             ? 'bg-blue-500 dark:bg-blue-600 text-white dark:text-white hover:bg-blue-600 dark:hover:bg-blue-700 border-blue-500 dark:border-blue-600' 
                                             : 'text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                                         }`}
                         >
                             {tag}
                         </Button>
                     ))}
                 </div>
             </div>
         )}
         {Object.values(activeFilters).some(v => v !== undefined && (Array.isArray(v) ? v.length > 0 : true)) && (
             <Button variant="ghost" onClick={onClearFilters} className="text-sm text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400">
                 <FaTimes className="mr-1.5 h-3.5 w-3.5" />
                 Filtreleri Temizle
             </Button>
         )}
        </div>
      )}
     <div className="mt-3 flex flex-wrap gap-2">
         {activeFilters.roomType && activeFilters.roomType !== 'all' && (
             <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700">
                 Tür: {activeFilters.roomType === 'public' ? 'Herkese Açık' : 'Özel'}
                 <FaTimes className="ml-1.5 h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => onFilterChange('roomType', undefined)}/>
             </Badge>
         )}
         {activeFilters.language && activeFilters.language !== 'all' && (
             <Badge variant="secondary" className="bg-green-100 dark:bg-green-900/70 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700">
                 Dil: {availableLanguages.find(l => l.value === activeFilters.language)?.label}
                 <FaTimes className="ml-1.5 h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => onFilterChange('language', undefined)}/>
             </Badge>
         )}
         {(activeFilters.tags || []).map(tag => (
              <Badge key={tag} variant="secondary" className="bg-purple-100 dark:bg-purple-900/70 text-purple-700 dark:text-purple-300 border border-purple-300 dark:border-purple-700">
                 Etiket: {tag}
                 <FaTimes className="ml-1.5 h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => handleTagToggle(tag)}/>
             </Badge>
         ))}
      </div>
    </div>
  );
};

export default RoomsSearchBar;