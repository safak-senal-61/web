// components/settings/SettingsLayout.tsx
import React from 'react';
import SettingsHeader from './SettingsHeader';
import SettingsSidebar from './SettingsSidebar';
import SettingsContentArea from './SettingsContentArea';
import DangerZone from './DangerZone';
import { SettingCategory } from '../../constants/settingsConfig'; // Adjust

interface SettingsLayoutProps {
  onSave: () => void;
  isSaving: boolean;
  categories: SettingCategory[];
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  children: React.ReactNode; // This will be the specific settings form
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  onSave,
  isSaving,
  categories,
  activeCategory,
  onCategoryChange,
  children,
}) => {
  return (
    <div className="animate-fade-in space-y-8">
      <SettingsHeader onSave={onSave} isSaving={isSaving} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4">
          <SettingsSidebar
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={onCategoryChange}
          />
        </div>
        <div className="lg:col-span-8">
          <SettingsContentArea activeCategory={activeCategory}>
            {children}
          </SettingsContentArea>
        </div>
      </div>
      
      <DangerZone />
    </div>
  );
};

export default SettingsLayout;