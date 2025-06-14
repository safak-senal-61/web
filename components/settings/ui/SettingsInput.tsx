// components/settings/ui/SettingsInput.tsx
import React from 'react';

interface SettingsInputProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  colorScheme?: string; // e.g., 'blue', 'red' (for focus ring)
  suffix?: React.ReactNode;
  // Temayı doğrudan prop olarak almasına gerek yok, Tailwind class'ları halledecek.
}

const SettingsInput: React.FC<SettingsInputProps> = ({
  label,
  id,
  value,
  onChange,
  type = 'text',
  placeholder,
  colorScheme = 'blue', // Bu hala focus rengi için kullanılabilir
  suffix,
}) => {
  // Odaklanma halkası rengi, colorScheme prop'una göre dinamik kalabilir.
  // Tailwind JIT derleyicisi bu dinamik class'ları üretecektir.
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
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full p-3 rounded-xl transition-all
                     bg-slate-100 dark:bg-slate-700/50                     // Arka plan rengi
                     border border-slate-300 dark:border-slate-600/50     // Kenarlık rengi
                     text-slate-900 dark:text-white                         // Metin rengi
                     placeholder-slate-400 dark:placeholder-slate-500     // Placeholder metin rengi
                     focus:outline-none focus:ring-2 focus:border-transparent // Temel focus stilleri
                     ${focusRingColorLight}                                 // Aydınlık mod focus rengi
                     ${focusRingColorDark}                                  // Karanlık mod focus rengi
                     ${suffix ? 'pr-12' : ''}`}
          placeholder={placeholder}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"> {/* Suffix ikon rengi */}
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsInput;