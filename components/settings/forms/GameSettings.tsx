// components/settings/forms/GameSettings.tsx
import React from 'react';
import SettingsToggle from '../ui/SettingsToggle';
import { getCategoryDetails } from '../../../constants/settingsConfig'; // Adjust path

interface GameSettingsData {
  autoJoinGames: boolean;
  gameNotifications: boolean;
  performanceMode: boolean;
}

interface GameSettingsProps {
  settings: GameSettingsData;
  onSettingChange: (key: keyof GameSettingsData, value: boolean) => void;
}

// Define the type for an individual game option
interface GameToggleOption {
  key: 'autoJoinGames' | 'gameNotifications' | 'performanceMode'; // Explicitly list boolean keys
  title: string;
  desc: string;
}

const gameOptions: GameToggleOption[] = [
  { key: 'autoJoinGames', title: 'Otomatik Oyun Katılımı', desc: 'Davetlere otomatik katıl' },
  { key: 'gameNotifications', title: 'Oyun Bildirimleri', desc: 'Oyun davetleri ve sonuçları için bildirim al' },
  { key: 'performanceMode', title: 'Performans Modu', desc: 'Oyun sırasında düşük gecikme için optimize et' },
];

const GameSettings: React.FC<GameSettingsProps> = ({ settings, onSettingChange }) => {
  const categoryDetails = getCategoryDetails('gaming');
  const colorScheme = categoryDetails?.color || 'pink';
  const focusRingColor = categoryDetails?.focusRingColor || 'peer-focus:ring-pink-800';

  return (
    <div className="space-y-4">
      {gameOptions.map((item) => ( // item is now strongly typed as GameToggleOption
        <SettingsToggle
          key={item.key}
          id={item.key}
          title={item.title}
          description={item.desc}
          checked={settings[item.key]} // Access is now type-safe
          onChange={(checked) => onSettingChange(item.key, checked)}
          colorScheme={colorScheme}
          focusRingColor={focusRingColor}
        />
      ))}
    </div>
  );
};

export default GameSettings;