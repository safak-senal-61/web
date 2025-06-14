// components/games/NewReleases.tsx
import React from 'react';
import { Game } from '../../types/gameTypes'; // Yolu kontrol edin, gerekirse ../../types/gameTypes olarak güncelleyin
import GameCard from './GameCard';
import { FaRocket } from 'react-icons/fa'; // Yeni çıkanlar için uygun ikonlar

interface NewReleasesProps {
  games: Game[];
  title?: string;
  onPlayClick?: (gameId: string) => void;
  onDetailsClick?: (gameId: string) => void;
  maxGamesToShow?: number;
}

const NewReleases: React.FC<NewReleasesProps> = ({
  games,
  title = "Yeni Çıkanlar", // Varsayılan başlık
  onPlayClick,
  onDetailsClick,
  maxGamesToShow = 5, // Varsayılan olarak gösterilecek maksimum oyun sayısı
}) => {
  if (!games || games.length === 0) {
    return null; // Gösterilecek oyun yoksa hiçbir şey render etme
  }

  // Prop olarak gelen oyunları al, en yeni olanları üste al (releaseDate'e göre)
  // ve maxGamesToShow kadarını göster. Bu sıralama ana sayfada yapıldıysa burada tekrar yapmaya gerek yok.
  // Ancak burada da yapılabilir, böylece bileşen daha bağımsız olur.
  const sortedGames = [...games]
    .sort((a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime())
    .slice(0, maxGamesToShow);

  return (
    <section>
      <div className="flex items-center mb-4 sm:mb-6">
        {/* Yeni çıkanlar için bir ikon seçin */}
        <FaRocket className="text-2xl sm:text-3xl text-sky-500 dark:text-sky-400 mr-2 sm:mr-3" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
      </div>
      {/* Oyun kartları için grid yapısı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {sortedGames.map(game => (
          <GameCard
            key={game.id}
            game={game}
            onPlayClick={onPlayClick}
            onDetailsClick={onDetailsClick}
          />
        ))}
      </div>
    </section>
  );
};

export default NewReleases;