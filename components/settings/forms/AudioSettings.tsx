// components/settings/forms/AudioSettings.tsx
import React from 'react';
import SettingsRangeSlider from '../ui/SettingsRangeSlider';
import SettingsToggle from '../ui/SettingsToggle';
import { getCategoryDetails } from '../../../constants/settingsConfig'; // Adjust path if needed

interface AudioSettingsData { // More specific type for this component's settings
  microphoneVolume: number;
  speakerVolume: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
}

interface AudioSettingsProps {
  settings: AudioSettingsData;
  onSettingChange: (key: keyof AudioSettingsData, value: string | number | boolean | React.ChangeEvent<HTMLInputElement>) => void;
}

const audioToggleOptions = [
  { key: 'echoCancellation' as const, title: 'Yankı Önleme', desc: 'Ses yankısını otomatik olarak filtrele' },
  { key: 'noiseSuppression' as const, title: 'Gürültü Bastırma', desc: 'Arka plan gürültüsünü azalt' },
];

const AudioSettings: React.FC<AudioSettingsProps> = ({ settings, onSettingChange }) => {
  const categoryDetails = getCategoryDetails('audio');
  const colorScheme = categoryDetails?.color || 'green';
  const focusRingColor = categoryDetails?.focusRingColor || 'peer-focus:ring-green-800';

  return (
    <div className="space-y-6">
      <SettingsRangeSlider
        label="Mikrofon Seviyesi"
        id="microphoneVolume"
        value={settings.microphoneVolume}
        onChange={(value) => onSettingChange('microphoneVolume', value)}
      />
      <SettingsRangeSlider
        label="Hoparlör Seviyesi"
        id="speakerVolume"
        value={settings.speakerVolume}
        onChange={(value) => onSettingChange('speakerVolume', value)}
      />
      <div className="space-y-4">
        {audioToggleOptions.map(item => (
          <SettingsToggle
            key={item.key}
            id={item.key}
            title={item.title}
            description={item.desc}
            // TypeScript now knows item.key is 'echoCancellation' or 'noiseSuppression'
            // and settings[item.key] will be a boolean
            checked={settings[item.key]}
            onChange={(checked) => onSettingChange(item.key, checked)}
            colorScheme={colorScheme}
            focusRingColor={focusRingColor}
          />
        ))}
      </div>
    </div>
  );
};

export default AudioSettings;