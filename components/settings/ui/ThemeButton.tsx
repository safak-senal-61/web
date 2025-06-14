// components/settings/ui/ThemeButton.tsx
import React from 'react';
import { IconType } from 'react-icons';

interface ThemeButtonProps {
  value: string; // e.g., 'light', 'dark', 'auto'
  label: string;
  icon: IconType;
  isActive: boolean;
  onClick: (value: string) => void;
  colorScheme?: string; // Aktif butonun vurgu rengi için (örn: 'purple')
}

const ThemeButton: React.FC<ThemeButtonProps> = ({
  value,
  label,
  icon: Icon,
  isActive,
  onClick,
  colorScheme = 'purple', // Appearance kategorisinin rengiyle uyumlu olabilir
}) => {
  // Aktif buton için stiller (colorScheme'e göre)
  // Aydınlık mod için
  const activeBorderClassLight = `border-${colorScheme}-500`;
  const activeBgClassLight = `bg-${colorScheme}-500/20`; // Hafif bir arka plan
  const activeIconTextClassLight = `text-${colorScheme}-600`; // Daha belirgin bir metin/ikon rengi
  
  // Karanlık mod için (belki biraz daha parlak tonlar)
  const activeBorderClassDark = `dark:border-${colorScheme}-400`;
  const activeBgClassDark = `dark:bg-${colorScheme}-500/30`; // Biraz daha belirgin bir arka plan
  const activeIconTextClassDark = `dark:text-${colorScheme}-300`;

  // Aktif olmayan buton için stiller (tema duyarlı)
  const inactiveBorderClass = "border-slate-300 dark:border-slate-600/50";
  const inactiveBgClass = "bg-slate-100 dark:bg-slate-700/30";
  const inactiveHoverBorderClass = "hover:border-slate-400 dark:hover:border-slate-500/70";
  const inactiveIconClass = "text-slate-500 dark:text-slate-400";
  const inactiveTextClass = "text-slate-700 dark:text-slate-300";


  return (
    <button
      onClick={() => onClick(value)}
      className={`p-4 rounded-xl border-2 transition-all w-full text-center
        ${isActive
          ? `${activeBorderClassLight} ${activeBgClassLight} ${activeBorderClassDark} ${activeBgClassDark}`
          : `${inactiveBorderClass} ${inactiveBgClass} ${inactiveHoverBorderClass}`
        }`}
    >
      <Icon className={`w-6 h-6 mx-auto mb-2 
        ${isActive 
          ? `${activeIconTextClassLight} ${activeIconTextClassDark}` 
          : inactiveIconClass
        }`} 
      />
      <span className={`text-sm font-medium 
        ${isActive 
          ? `${activeIconTextClassLight} ${activeIconTextClassDark}` 
          : inactiveTextClass
        }`}
      >
        {label}
      </span>
    </button>
  );
};

export default ThemeButton;