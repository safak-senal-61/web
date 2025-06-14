// constants/settingsConfig.ts
import { 
    FaUser, 
    FaBell, 
    FaLock, 
    FaPalette, 
    FaVolumeUp, 
    FaGamepad
  } from 'react-icons/fa';
  import { IconType } from 'react-icons';
  
  export interface SettingCategory {
    id: string;
    title: string;
    description: string;
    icon: IconType;
    color: string;
    gradient: string;
    focusRingColor?: string; // For toggle switches in specific categories
  }
  
  export const settingsCategories: SettingCategory[] = [
    {
      id: 'profile',
      title: 'Profil Ayarları',
      description: 'Kişisel bilgilerini ve profil görünümünü düzenle',
      icon: FaUser,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
      focusRingColor: 'peer-focus:ring-blue-800',
    },
    {
      id: 'notifications',
      title: 'Bildirimler',
      description: 'Bildirim tercihlerini yönet',
      icon: FaBell,
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600',
      focusRingColor: 'peer-focus:ring-orange-800',
    },
    {
      id: 'security',
      title: 'Güvenlik',
      description: 'Hesap güvenliği ve gizlilik ayarları',
      icon: FaLock,
      color: 'red',
      gradient: 'from-red-500 to-red-600',
      focusRingColor: 'peer-focus:ring-red-800',
    },
    {
      id: 'appearance',
      title: 'Görünüm',
      description: 'Tema ve görsel tercihler',
      icon: FaPalette,
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600',
      focusRingColor: 'peer-focus:ring-purple-800',
    },
    {
      id: 'audio',
      title: 'Ses Ayarları',
      description: 'Mikrofon ve hoparlör ayarları',
      icon: FaVolumeUp,
      color: 'green',
      gradient: 'from-green-500 to-green-600',
      focusRingColor: 'peer-focus:ring-green-800',
    },
    {
      id: 'gaming',
      title: 'Oyun Ayarları',
      description: 'Oyun performansı ve tercihler',
      icon: FaGamepad,
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600',
      focusRingColor: 'peer-focus:ring-pink-800',
    }
  ];
  
  // Helper to get category details by ID
  export const getCategoryDetails = (id: string): SettingCategory | undefined => {
    return settingsCategories.find(cat => cat.id === id);
  };