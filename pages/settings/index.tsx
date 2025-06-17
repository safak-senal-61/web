// pages/settings/index.tsx
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState, ChangeEvent } from 'react';
import React from 'react';

// Constants
import { settingsCategories as allCategories } from '../../constants/settingsConfig';

// Layout and structural components
import LoadingState from '../../components/settings/LoadingState';
import SettingsLayout from '../../components/settings/SettingsLayout';

// Form components
import ProfileSettings from '../../components/settings/forms/ProfileSettings';
import NotificationSettings from '../../components/settings/forms/NotificationSettings';
import SecuritySettings from '../../components/settings/forms/SecuritySettings';
import AppearanceSettings from '../../components/settings/forms/AppearanceSettings';
import AudioSettings from '../../components/settings/forms/AudioSettings';
import GameSettings from '../../components/settings/forms/GameSettings';

// Icons
import { FaEye, FaEyeSlash, FaMoon, FaSun, FaDesktop } from 'react-icons/fa';

// Settings type
export interface SettingsData {
  nickname: string;
  bio: string;
  showOnlineStatus: boolean;
  showLevel: boolean;
  messageNotifications: boolean;
  soundNotifications: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
  twoFactorEnabled: boolean;
  showEmail: boolean;
  blockUnknownUsers: boolean;
  newPassword: string;
  language: string;
  animations: boolean;
  compactMode: boolean;
  microphoneVolume: number;
  speakerVolume: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoJoinGames: boolean;
  gameNotifications: boolean;
  performanceMode: boolean;
}

const settingsPagePath = '/settings';

const SettingsPage = () => {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  const defaultCategory = allCategories.length > 0 ? allCategories[0].id : 'profile';
  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  const [settings, setSettings] = useState<SettingsData>({
    nickname: '',
    bio: '',
    showOnlineStatus: true,
    showLevel: true,
    messageNotifications: true,
    soundNotifications: true,
    desktopNotifications: true,
    emailNotifications: false,
    twoFactorEnabled: false,
    showEmail: false,
    blockUnknownUsers: false,
    newPassword: '',
    language: 'tr',
    animations: true,
    compactMode: false,
    microphoneVolume: 80,
    speakerVolume: 70,
    echoCancellation: true,
    noiseSuppression: true,
    autoJoinGames: false,
    gameNotifications: true,
    performanceMode: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!authIsLoading && !user) {
      router.push('/login?redirect=/settings');
    }
  }, [user, authIsLoading, router]);

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        nickname: user.nickname || '',
        bio: user.bio || '',
      }));
    }
    const timer = setTimeout(() => setPageLoading(false), 300);
    return () => clearTimeout(timer);
  }, [user]);

  useEffect(() => {
    if (router.isReady) {
      const hash = window.location.hash.substring(1);
      if (hash && allCategories.some(cat => cat.id === hash)) {
        if (activeCategory !== hash) {
          setActiveCategory(hash);
        }
      }
    }
  }, [router.isReady, router.asPath, activeCategory]);

  const handleSettingChange = (key: keyof SettingsData, value: string | boolean | number | ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({
      ...prev,
      [key]: typeof value === 'object' && 'target' in value ? value.target.value : value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    console.log('Saving settings:', settings);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Ayarlar kaydedildi!');
  };

  const renderCategoryContent = () => {
    switch (activeCategory) {
      case 'profile':
        return <ProfileSettings settings={settings} onSettingChange={handleSettingChange} />;
      case 'notifications':
        return <NotificationSettings settings={settings} onSettingChange={handleSettingChange} />;
      case 'security':
        return (
          <SecuritySettings
            settings={settings}
            onSettingChange={handleSettingChange}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword(!showPassword)}
            icons={{ FaEye, FaEyeSlash }}
          />
        );
      case 'appearance':
        return (
          <AppearanceSettings
            language={settings.language}
            animations={settings.animations}
            onLanguageChange={(value) => handleSettingChange('language', value)}
            onAnimationsChange={(checked) => handleSettingChange('animations', checked)}
            themeIcons={{ FaMoon, FaSun, FaDesktop }}
          />
        );
      case 'audio':
        return <AudioSettings settings={settings} onSettingChange={handleSettingChange} />;
      case 'gaming':
        return <GameSettings settings={settings} onSettingChange={handleSettingChange} />;
      default:
        return <p className="text-slate-400">Lütfen bir kategori seçin.</p>;
    }
  };

  if (authIsLoading || pageLoading) {
    return <LoadingState />;
  }

  if (!user) {
    return null;
  }

  return (
    // --- YENİ EKLENEN SARMALAYICI ---
    // Bu div, sayfa içeriğini ortalayacak ve kenarlardan boşluk bırakacaktır.
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <SettingsLayout
        onSave={handleSave}
        isSaving={isSaving}
        categories={allCategories}
        activeCategory={activeCategory}
        onCategoryChange={(newCategory) => {
          setActiveCategory(newCategory);
          router.push(`${settingsPagePath}#${newCategory}`, undefined, { shallow: true });
        }}
      >
        {renderCategoryContent()}
      </SettingsLayout>
    </div>
  );
};

export default SettingsPage;