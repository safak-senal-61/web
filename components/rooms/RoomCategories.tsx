// components/rooms/RoomCategories.tsx
import React from 'react';
import { Button } from '@/components/ui/button'; // Veya özel stil butonlar
import { FaComments, FaHashtag } from 'react-icons/fa'; // Veya kategoriye özel ikonlar

interface RoomCategoriesProps {
  categories: string[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}

const RoomCategories: React.FC<RoomCategoriesProps> = ({ categories, selectedCategory, onSelectCategory }) => {
  if (!categories || categories.length === 0) return null;

  // Her kategori için bir renk/ikon eşlemesi yapılabilir
  const categoryStyles: Record<string, { icon?: React.ElementType, color?: string, darkColor?: string }> = {
    'Sohbet': { icon: FaComments, color: 'blue' },
    'Oyun': { icon: FaGamepad, color: 'green' },
    'Müzik': { icon: FaVolumeUp, color: 'purple' },
    'Teknoloji': { icon: FaLaptopCode, color: 'teal' }, // FaLaptopCode örneği
    'Dil Öğrenimi': { icon: FaLanguage, color: 'orange' }, // FaLanguage örneği
    'Sanat': { icon: FaPaintBrush, color: 'pink' }, // FaPaintBrush örneği
    // ... diğer kategoriler
  };


  return (
    <section className="mb-8 sm:mb-10">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-xl sm:text-2xl font-semibold text-slate-800 dark:text-white flex items-center">
            <FaHashtag className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 dark:text-sky-400 mr-2 sm:mr-2.5" />
            Kategoriler
        </h2>
        {/* Opsiyonel: Tüm kategorileri göster/gizle butonu */}
      </div>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {categories.map(category => {
          const isActive = selectedCategory === category;
          const styleInfo = categoryStyles[category] || {};
          const IconComponent = styleInfo.icon || FaHashtag; // Varsayılan ikon

          return (
            <Button
              key={category}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={`transition-all duration-200 
                         ${isActive 
                            ? `bg-${styleInfo.color || 'blue'}-500 dark:bg-${styleInfo.color || 'blue'}-600 hover:bg-${styleInfo.color || 'blue'}-600 dark:hover:bg-${styleInfo.color || 'blue'}-700 text-white dark:text-white border-${styleInfo.color || 'blue'}-500 dark:border-${styleInfo.color || 'blue'}-600 shadow-md`
                            : `text-slate-700 dark:text-slate-300 
                               border-slate-300 dark:border-slate-600 
                               hover:bg-slate-100 dark:hover:bg-slate-700/50 
                               hover:border-${styleInfo.color || 'slate'}-400 dark:hover:border-${styleInfo.color || 'slate'}-500
                               hover:text-${styleInfo.color || 'slate'}-700 dark:hover:text-${styleInfo.color || 'slate'}-200`
                         }`}
              onClick={() => onSelectCategory(category)}
            >
              <IconComponent className={`w-3.5 h-3.5 mr-1.5 opacity-80 ${isActive ? 'text-white' : `text-${styleInfo.color || 'slate'}-500 dark:text-${styleInfo.color || 'slate'}-400`}`} />
              {category}
            </Button>
          );
        })}
      </div>
    </section>
  );
};

// Örnek ikonları import etmeyi unutmayın (eğer FaLaptopCode, FaLanguage, FaPaintBrush kullanacaksanız)
import { FaGamepad, FaVolumeUp, FaLaptopCode, FaLanguage, FaPaintBrush } from 'react-icons/fa'; 

export default RoomCategories;