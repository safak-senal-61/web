// components/settings/SettingsSidebar.tsx
import React from 'react';
import { SettingCategory } from '../../constants/settingsConfig'; // Adjust path as needed

interface SettingsSidebarProps {
  categories: SettingCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    // Ana sarmalayıcı
    <div className="bg-white/70 dark:bg-slate-800/40 
                   backdrop-blur-xl rounded-2xl p-6 
                   border border-slate-200 dark:border-slate-700/50 
                   sticky top-8 shadow-lg dark:shadow-md"> {/* sticky top-20 veya Header yüksekliğine göre ayarla */}
      
      {/* Başlık */}
      <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Kategoriler</h3>
      
      <div className="space-y-2">
        {categories.map((category) => {
          const isActive = activeCategory === category.id;

          // Aktif buton için gradyan. category.gradient'ın "from-color-xxx to-color-yyy" formatında olduğunu varsayıyoruz.
          // Karanlık mod için farklı bir gradyan tanımlayabiliriz veya aynı gradyanı kullanabiliriz.
          // Eğer category objesinde darkGradient gibi bir alan varsa onu kullanabiliriz.
          // Şimdilik, category.gradient'ı olduğu gibi kullanıp, opaklığı veya parlaklığı ayarlayabiliriz.
          // Veya doğrudan tema için farklı gradyanlar tanımlayabiliriz.
          // Örneğin, category.gradient = "from-blue-500 to-blue-600" ise,
          // aydınlık modda: "from-blue-500 to-blue-600"
          // karanlık modda: "dark:from-blue-500 dark:to-blue-600" (aynı kalabilir) veya "dark:from-blue-400 dark:to-blue-500"
          // Bu, category.gradient string'inin dark: prefix'ini desteklemesine bağlı.
          // En temizi, category.gradient'ın sadece renkleri içermesi ve dark: prefix'ini burada eklemek.
          // Örnek: category.gradient = "blue-500 blue-600" ise,
          // `bg-gradient-to-r from-${category.gradient.split(' ')[0]} to-${category.gradient.split(' ')[1]}`
          // `dark:from-${category.gradient.split(' ')[0]} dark:to-${category.gradient.split(' ')[1]}` (renk tonları ayarlanabilir)
          // Mevcut yapıda category.gradient "from-color-xxx to-color-yyy" içeriyor.

          const activeClasses = isActive 
            ? `bg-gradient-to-r ${category.gradient} shadow-lg text-white` // Aktifken metin beyaz
            : `bg-slate-100 dark:bg-slate-700/30 
               text-slate-700 dark:text-slate-300 
               hover:bg-slate-200 dark:hover:bg-slate-700/50 
               hover:text-slate-900 dark:hover:text-white
               border border-transparent hover:border-slate-300 dark:hover:border-slate-600`; // Aktif değilken kenarlık ve hover

          const iconContainerActiveClasses = isActive 
            ? 'bg-white/20 dark:bg-white/10' // Aktifken ikon sarmalayıcı
            : 'bg-slate-200 dark:bg-slate-600/50 group-hover:bg-slate-300 dark:group-hover:bg-slate-500/50'; // Pasifken ikon sarmalayıcı

          const iconActiveClasses = isActive 
            ? 'text-white' // Aktifken ikon rengi
            : 'text-slate-500 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-white'; // Pasifken ikon rengi

          const titleActiveClasses = isActive 
            ? 'text-white' // Aktifken başlık rengi
            : 'text-slate-800 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white'; // Pasifken başlık rengi

          const descriptionActiveClasses = isActive
            ? 'text-white/80 dark:text-white/70' // Aktifken açıklama rengi
            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'; // Pasifken açıklama rengi

          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`w-full flex items-center space-x-3 p-3 sm:p-4 rounded-xl transition-all duration-200 ease-in-out group 
                         ${activeClasses}`}
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center transition-colors duration-200
                             ${iconContainerActiveClasses}`}>
                <category.icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-200
                                         ${iconActiveClasses}`} />
              </div>
              <div className="flex-1 text-left">
                <h4 className={`font-semibold text-sm sm:text-base transition-colors duration-200
                               ${titleActiveClasses}`}>
                  {category.title}
                </h4>
                <p className={`text-xs sm:text-sm transition-colors duration-200
                              ${descriptionActiveClasses}`}>
                  {category.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsSidebar;