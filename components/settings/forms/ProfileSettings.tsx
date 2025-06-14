// components/settings/forms/ProfileSettings.tsx
import React from 'react';
import SettingsInput from '../ui/SettingsInput';
import SettingsTextarea from '../ui/SettingsTextarea';
import SettingsToggle from '../ui/SettingsToggle';
import { getCategoryDetails } from '../../../constants/settingsConfig'; // Adjust path

// Define the shape of settings this component deals with
interface ProfileSettingsData {
  nickname: string;
  bio: string;
  showOnlineStatus: boolean;
  showLevel: boolean;
}

interface ProfileSettingsProps {
  settings: ProfileSettingsData; // Use the more specific type
  // Make onSettingChange expect keys specific to ProfileSettingsData
  onSettingChange: (key: keyof ProfileSettingsData, value: string | boolean) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ settings, onSettingChange }) => {
  const categoryDetails = getCategoryDetails('profile');
  const colorScheme = categoryDetails?.color || 'blue';
  const focusRingColor = categoryDetails?.focusRingColor || 'peer-focus:ring-blue-800';

  return (
    <div className="space-y-6">
      <SettingsInput
        label="Kullanıcı Adı"
        id="nickname"
        value={settings.nickname}
        onChange={(value) => onSettingChange('nickname', value)} // 'nickname' is keyof ProfileSettingsData
        placeholder="Kullanıcı adınız"
        colorScheme={colorScheme}
      />
      <SettingsTextarea
        label="Biyografi"
        id="bio"
        value={settings.bio}
        onChange={(value) => onSettingChange('bio', value)} // 'bio' is keyof ProfileSettingsData
        placeholder="Kendinizden bahsedin..."
        colorScheme={colorScheme}
      />
      <div className="space-y-4">
        <SettingsToggle
          id="showOnlineStatus"
          title="Çevrimiçi Durumunu Göster"
          description="Diğer kullanıcılar çevrimiçi olduğunuzu görebilir"
          checked={settings.showOnlineStatus}
          onChange={(checked) => onSettingChange('showOnlineStatus', checked)} // 'showOnlineStatus' is keyof ProfileSettingsData
          colorScheme={colorScheme}
          focusRingColor={focusRingColor}
        />
        <SettingsToggle
          id="showLevel"
          title="Seviyeni Göster"
          description="Profilinde seviye bilgisi görünsün"
          checked={settings.showLevel}
          onChange={(checked) => onSettingChange('showLevel', checked)} // 'showLevel' is keyof ProfileSettingsData
          colorScheme={colorScheme}
          focusRingColor={focusRingColor}
        />
      </div>
    </div>
  );
};

export default ProfileSettings;