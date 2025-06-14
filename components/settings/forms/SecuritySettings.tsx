// components/settings/forms/SecuritySettings.tsx
import React from 'react';
import SettingsToggle from '../ui/SettingsToggle';
import SettingsInput from '../ui/SettingsInput';
import { getCategoryDetails } from '../../../constants/settingsConfig'; // Adjust path if needed
import { IconType } from 'react-icons';

// Define the shape of settings this component deals with
interface SecuritySettingsData {
  twoFactorEnabled: boolean;
  showEmail: boolean;
  blockUnknownUsers: boolean; // Assuming this is part of security settings
  newPassword: string;
}

interface SecuritySettingsProps {
  settings: SecuritySettingsData;
  onSettingChange: (key: keyof SecuritySettingsData, value: boolean | string) => void;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  icons: { FaEye: IconType; FaEyeSlash: IconType };
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  settings,
  onSettingChange,
  showPassword,
  onToggleShowPassword,
  icons,
}) => {
  const categoryDetails = getCategoryDetails('security');
  const colorScheme = categoryDetails?.color || 'red';
  const focusRingColor = categoryDetails?.focusRingColor || 'peer-focus:ring-red-800';
  const { FaEye, FaEyeSlash } = icons;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <SettingsToggle
          id="twoFactorEnabled"
          title="İki Faktörlü Doğrulama"
          description="Hesabını ekstra güvenlik katmanıyla koru"
          checked={settings.twoFactorEnabled}
          onChange={(checked) => onSettingChange('twoFactorEnabled', checked)}
          colorScheme={colorScheme}
          focusRingColor={focusRingColor}
        />
        <SettingsToggle
          id="showEmail"
          title="E-posta Adresini Göster"
          description="Diğer kullanıcılar e-posta adresini görebilir"
          checked={settings.showEmail}
          onChange={(checked) => onSettingChange('showEmail', checked)}
          colorScheme={colorScheme}
          focusRingColor={focusRingColor}
        />
         <SettingsToggle
          id="blockUnknownUsers"
          title="Bilinmeyen Kullanıcıları Engelle"
          description="Tanımadığınız kullanıcılardan gelen mesajları engelle"
          checked={settings.blockUnknownUsers} // Make sure blockUnknownUsers is in SecuritySettingsData
          onChange={(checked) => onSettingChange('blockUnknownUsers', checked)}
          colorScheme={colorScheme}
          focusRingColor={focusRingColor}
        />
      </div>

      <div>
        <SettingsInput
          label="Şifre Değiştir"
          id="newPassword"
          type={showPassword ? "text" : "password"}
          value=""
          onChange={(value) => onSettingChange('newPassword', value)}
          placeholder="Yeni şifre"
          colorScheme={colorScheme}
          suffix={
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="text-slate-400 hover:text-white transition-colors"
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          }
        />
      </div>
    </div>
  );
};

export default SecuritySettings;