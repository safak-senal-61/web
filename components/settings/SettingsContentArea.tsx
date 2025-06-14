// components/settings/SettingsContentArea.tsx
import React from 'react';
import { FaCog } from 'react-icons/fa'; // Default icon
import { getCategoryDetails } from '../../constants/settingsConfig'; // Adjust path

interface SettingsContentAreaProps {
  activeCategory: string;
  children: React.ReactNode;
}

const SettingsContentArea: React.FC<SettingsContentAreaProps> = ({ activeCategory, children }) => {
  const category = getCategoryDetails(activeCategory);
  const IconComponent = category?.icon || FaCog;

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
      {category && (
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${category.gradient} flex items-center justify-center`}>
              <IconComponent className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              {category.title}
            </h2>
          </div>
          <p className="text-slate-400">
            {category.description}
          </p>
        </div>
      )}
      {children}
    </div>
  );
};

export default SettingsContentArea;