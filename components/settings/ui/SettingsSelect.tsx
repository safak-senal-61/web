// components/settings/ui/SettingsSelect.tsx
import React from 'react';
import { FaChevronDown } from 'react-icons/fa'; // Ok ikonu için

interface Option {
  value: string;
  label: string;
}

interface SettingsSelectProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  colorScheme?: string; // Focus rengi için
}

const SettingsSelect: React.FC<SettingsSelectProps> = ({
  label,
  id,
  value,
  onChange,
  options,
  colorScheme = 'purple', // Varsayılan renk (genellikle focus için kullanılır)
}) => {
  const focusRingColorLight = `focus:ring-${colorScheme}-500/50`;
  const focusRingColorDark = `dark:focus:ring-${colorScheme}-400/50`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" // Label metin rengi
      >
        {label}
      </label>
      <div className="relative"> {/* Ok ikonu için sarmalayıcı */}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-3 rounded-xl transition-all appearance-none  // Varsayılan oku gizle
                     bg-slate-100 dark:bg-slate-700/50                     // Arka plan rengi
                     border border-slate-300 dark:border-slate-600/50     // Kenarlık rengi
                     text-slate-900 dark:text-white                         // Metin rengi
                     focus:outline-none focus:ring-2 focus:border-transparent // Temel focus stilleri
                     ${focusRingColorLight}                                 // Aydınlık mod focus rengi
                     ${focusRingColorDark}                                  // Karanlık mod focus rengi
                     pr-10                                                  // Ok ikonu için sağda boşluk bırak
                    `}
        >
          {/* 
            Option elemanlarının stilini doğrudan Tailwind ile değiştirmek zordur.
            Tarayıcılar genellikle kendi varsayılan option stillerini kullanır.
            Bazı tarayıcılarda option'ların arka plan ve metin rengi select'in rengini miras alabilir.
          */}
          {options.map(option => (
            <option
              key={option.value}
              value={option.value}
              // className="bg-white dark:bg-slate-800 text-black dark:text-white" // Bu genellikle çoğu tarayıcıda çalışmaz veya tutarsızdır
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400">
          {/* Özel ok ikonu */}
          <FaChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default SettingsSelect;