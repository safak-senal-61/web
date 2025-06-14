// components/settings/forms/AppearanceSettings.tsx
import React from 'react';
import SettingsSelect from '../ui/SettingsSelect';
import SettingsToggle from '../ui/SettingsToggle';
import ThemeButton from '../ui/ThemeButton';
import { getCategoryDetails } from '../../../constants/settingsConfig'; // Adjust path if needed
import { IconType } from 'react-icons';
import { useTheme, Theme } from '../../../contexts/ThemeContext'; // Import useTheme and Theme type

interface AppearanceSettingsProps {
  // The 'settings' prop related to theme can be removed if managed globally by ThemeContext
  // settings: {
  //   theme: 'dark' | 'light' | 'auto'; // This will come from useTheme()
  //   language: string;
  //   animations: boolean;
  // };
  // onSettingChange: (key: string, value: any) => void; // Theme changes handled by useTheme()

  // Props for language and animations if they are still part of local settings state
  language: string;
  animations: boolean;
  onLanguageChange: (language: string) => void;
  onAnimationsChange: (animations: boolean) => void;

  themeIcons: { FaMoon: IconType; FaSun: IconType; FaDesktop: IconType };
}

const languageOptions = [
  { value: 'tr', label: 'Türkçe' },
  { value: 'en', label: 'English' },
  { value: 'de', label: 'Deutsch' },
  { value: 'fr', label: 'Français' },
];

const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  language,
  animations,
  onLanguageChange,
  onAnimationsChange,
  themeIcons,
}) => {
  const { theme: currentSelectedTheme, setTheme: setGlobalTheme } = useTheme(); // Use the theme context

  const categoryDetails = getCategoryDetails('appearance');
  const colorScheme = categoryDetails?.color || 'purple';
  const focusRingColor = categoryDetails?.focusRingColor || 'peer-focus:ring-purple-800';
  const { FaMoon, FaSun, FaDesktop } = themeIcons;

  const themeOptions: { value: Theme; label: string; icon: IconType }[] = [
    { value: 'dark', label: 'Karanlık', icon: FaMoon },
    { value: 'light', label: 'Aydınlık', icon: FaSun },
    { value: 'auto', label: 'Otomatik', icon: FaDesktop },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-4">Tema</label>
        <div className="grid grid-cols-3 gap-4">
          {themeOptions.map(option => (
            <ThemeButton
              key={option.value}
              value={option.value}
              label={option.label}
              icon={option.icon}
              isActive={currentSelectedTheme === option.value}
              onClick={(value) => setGlobalTheme(value as Theme)} // Call context's setTheme
              colorScheme={colorScheme}
            />
          ))}
        </div>
      </div>

      <SettingsSelect
        label="Dil"
        id="language"
        value={language} // Assuming language is still managed by parent SettingsPage
        onChange={onLanguageChange}
        options={languageOptions}
        colorScheme={colorScheme}
      />

      <div className="space-y-4">
        <SettingsToggle
          id="animations"
          title="Animasyonlar"
          description="Sayfa geçişleri ve hover efektleri"
          checked={animations} // Assuming animations is still managed by parent SettingsPage
          onChange={onAnimationsChange}
          colorScheme={colorScheme}
          focusRingColor={focusRingColor}
        />
      </div>
    </div>
  );
};

export default AppearanceSettings;