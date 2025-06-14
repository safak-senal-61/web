// components/settings/forms/NotificationSettings.tsx
import React from 'react';
import SettingsToggle from '../ui/SettingsToggle';
import { getCategoryDetails } from '../../../constants/settingsConfig';

// Define the shape of settings this component deals with
interface NotificationSettingsData {
  messageNotifications: boolean;
  soundNotifications: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
}

interface NotificationSettingsProps {
  settings: NotificationSettingsData;
  onSettingChange: (key: keyof NotificationSettingsData, value: boolean) => void;
}

const notificationOptions: { key: keyof NotificationSettingsData, title: string, desc: string }[] = [
  { key: 'messageNotifications', title: 'Mesaj Bildirimleri', desc: 'Yeni mesajlar için bildirim al' },
  { key: 'soundNotifications', title: 'Ses Bildirimleri', desc: 'Bildirimler için ses çal' },
  { key: 'desktopNotifications', title: 'Masaüstü Bildirimleri', desc: 'Tarayıcı bildirimlerini etkinleştir' },
  { key: 'emailNotifications', title: 'E-posta Bildirimleri', desc: 'Önemli güncellemeler için e-posta al' }
];

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ settings, onSettingChange }) => {
  const categoryDetails = getCategoryDetails('notifications');
  const colorScheme = categoryDetails?.color || 'orange';
  const focusRingColor = categoryDetails?.focusRingColor || 'peer-focus:ring-orange-800';

  return (
    <div className="space-y-4">
      {notificationOptions.map(item => (
        <SettingsToggle
          key={item.key}
          id={item.key}
          title={item.title}
          description={item.desc}
          checked={settings[item.key]} // item.key is now correctly typed
          onChange={(checked) => onSettingChange(item.key, checked)}
          colorScheme={colorScheme}
          focusRingColor={focusRingColor}
        />
      ))}
    </div>
  );
};

export default NotificationSettings;