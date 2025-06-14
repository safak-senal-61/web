// components/settings/ui/SettingsTextarea.tsx
import React from 'react';

interface SettingsTextareaProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  colorScheme?: string; // Focus rengi için
}

const SettingsTextarea: React.FC<SettingsTextareaProps> = ({
  label,
  id,
  value,
  onChange,
  rows = 4,
  placeholder,
  colorScheme = 'blue', // Varsayılan renk (genellikle focus için kullanılır)
}) => {
  const focusRingColorLight = `focus:ring-${colorScheme}-500/50`;
  const focusRingColorDark = `dark:focus:ring-${colorScheme}-400/50`; // Karanlık modda biraz daha açık bir ton olabilir

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" // Label metin rengi tema duyarlı
      >
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full p-3 rounded-xl transition-all resize-none
                   bg-slate-100 dark:bg-slate-700/50                     // Arka plan rengi
                   border border-slate-300 dark:border-slate-600/50     // Kenarlık rengi
                   text-slate-900 dark:text-white                         // Metin rengi
                   placeholder-slate-400 dark:placeholder-slate-500     // Placeholder metin rengi
                   focus:outline-none focus:ring-2 focus:border-transparent // Temel focus stilleri
                   ${focusRingColorLight}                                 // Aydınlık mod focus rengi
                   ${focusRingColorDark}                                  // Karanlık mod focus rengi
                  `}
        placeholder={placeholder}
      />
    </div>
  );
};

export default SettingsTextarea;