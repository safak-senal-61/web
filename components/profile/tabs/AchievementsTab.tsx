// components/profile/tabs/AchievementsTab.tsx
import React from 'react';

interface Achievement { // ProfilePage.tsx'den alınabilir veya ortak tip
  id: string | number;
  title: string;
  icon: string;
  description: string;
}

interface AchievementsTabProps {
  achievements: Achievement[];
  isLoading: boolean;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ achievements, isLoading }) => {
  if (isLoading) {
    return <p className="text-center text-slate-400 py-8">Başarımlar yükleniyor...</p>;
  }

  if (achievements.length === 0) {
    return <p className="text-center text-slate-400 py-8">Henüz hiç başarım kazanılmamış.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in-short">
      {achievements.map(achievement => (
        <div
          key={achievement.id}
          className="bg-slate-700/40 rounded-xl p-4 flex items-start space-x-3 hover:bg-slate-700/70 transition-all duration-200 transform hover:scale-105 cursor-pointer"
        >
          <div className="text-3xl sm:text-4xl mt-1 flex-shrink-0">{achievement.icon}</div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-white mb-1">{achievement.title}</h3>
            <p className="text-xs sm:text-sm text-slate-400">{achievement.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AchievementsTab;