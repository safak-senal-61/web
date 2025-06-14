// pages/settings/index.tsx
import { useAuth } from '../../hooks/useAuth'; // Adjust path
import { useRouter } from 'next/router';
import { useEffect, useState, ChangeEvent } from 'react';
import React from 'react';

// Constants
import { settingsCategories as allCategories } from '../../constants/settingsConfig'; // Adjust

// Layout and structural components
import LoadingState from '../../components/settings/LoadingState'; // Adjust
import SettingsLayout from '../../components/settings/SettingsLayout'; // Adjust

// Form components
import ProfileSettings from '../../components/settings/forms/ProfileSettings'; // Adjust
import NotificationSettings from '../../components/settings/forms/NotificationSettings'; // Adjust
import SecuritySettings from '../../components/settings/forms/SecuritySettings'; // Adjust
import AppearanceSettings from '../../components/settings/forms/AppearanceSettings'; // Adjust
import AudioSettings from '../../components/settings/forms/AudioSettings'; // Adjust
import GameSettings from '../../components/settings/forms/GameSettings'; // Adjust

// Icons
import { FaEye, FaEyeSlash, FaMoon, FaSun, FaDesktop } from 'react-icons/fa';
// Note: ThemeContext is NOT directly used here, AppearanceSettings uses it.

// Define the Settings type
// 'theme' is removed as it's handled globally by ThemeContext
export interface SettingsData {
  // Profile
  nickname: string;
  bio: string;
  showOnlineStatus: boolean;
  showLevel: boolean;
  // Notifications
  messageNotifications: boolean;
  soundNotifications: boolean;
  desktopNotifications: boolean;
  emailNotifications: boolean;
  // Security
  twoFactorEnabled: boolean;
  showEmail: boolean;
  blockUnknownUsers: boolean;
  newPassword: string;
  // Appearance (theme is global)
  language: string;
  animations: boolean;
  compactMode: boolean;
  // Audio
  microphoneVolume: number;
  speakerVolume: number;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  // Gaming
  autoJoinGames: boolean;
  gameNotifications: boolean;
  performanceMode: boolean;
}

const settingsPagePath = '/settings'; // Or your actual settings page path

const SettingsPage = () => {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();

  const defaultCategory = allCategories.length > 0 ? allCategories[0].id : 'profile';
  const [activeCategory, setActiveCategory] = useState(defaultCategory);

  // Initial settings state (theme removed)
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

  // Initialize settings from user (e.g., nickname, bio)
  // and potentially load other preferences from backend
  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        nickname: user.nickname || '',
        bio: user.bio || '',
        // TODO: Load other user-specific settings (language, animations, etc.) from API if they are persisted
        // For example:
        // language: user.preferences?.language || 'tr',
        // animations: user.preferences?.animations !== undefined ? user.preferences.animations : true,
      }));
    }
    const timer = setTimeout(() => setPageLoading(false), 300); // Shortened for quicker load feel
    return () => clearTimeout(timer);
  }, [user]);

  // Handle active category based on URL hash
  useEffect(() => {
    if (router.isReady) {
      const hash = window.location.hash.substring(1);
      if (hash && allCategories.some(cat => cat.id === hash)) {
        if (activeCategory !== hash) {
          setActiveCategory(hash);
        }
      }
      // Optional: You can also check router.query.category if you prefer query params
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
    // TODO: API call to save settings (nickname, bio, language, animations, etc.)
    // Exclude theme from this save payload as it's handled by ThemeContext (localStorage)
    // const { theme, ...settingsToSave } = settings; // This line would be wrong as theme is not in settings
    // await api.saveUserSettings(settings);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Ayarlar kaydedildi!'); // Replace with a proper notification/toast
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
            settings={settings} // Pass the relevant part of settings if needed
            onSettingChange={handleSettingChange}
            showPassword={showPassword}
            onToggleShowPassword={() => setShowPassword(!showPassword)}
            icons={{ FaEye, FaEyeSlash }}
          />
        );
      case 'appearance':
        return (
          <AppearanceSettings
            // Theme is global, pass other appearance settings
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
    return null; // Redirect is handled by useEffect
  }

  return (
    <SettingsLayout
      onSave={handleSave}
      isSaving={isSaving}
      categories={allCategories}
      activeCategory={activeCategory}
      onCategoryChange={(newCategory) => {
        setActiveCategory(newCategory);
        // Update URL hash for better UX (back button, bookmarking)
        router.push(`${settingsPagePath}#${newCategory}`, undefined, { shallow: true });
      }}
    >
      {renderCategoryContent()}
    </SettingsLayout>
  );
};

export default SettingsPage;