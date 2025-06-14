// components/games/PopularGames.tsx
import React from 'react';
import { Game } from '../../types/gameTypes'; // Yolu güncelleyin
import GameCard from './GameCard';
import { FaFire } from 'react-icons/fa';

interface PopularGamesProps {
  games: Game[];
  title?: string;
  onPlayClick?: (gameId: string) => void;
  onDetailsClick?: (gameId: string) => void;
}

const PopularGames: React.FC<PopularGamesProps> = ({ games, title = "Popüler Oyunlar", onPlayClick, onDetailsClick }) => {
  if (!games || games.length === 0) return null;

  return (
    <section>
      <div className="flex items-center mb-4 sm:mb-6">
        <FaFire className="text-2xl sm:text-3xl text-red-500 mr-2 sm:mr-3" />
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white">{title}</h2>
      </div>
      {/* Yatay kaydırmalı veya daha az öğe için grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5">
        {games.slice(0,5).map(game => ( // İlk 5 popüler oyunu gösterelim
          <GameCard key={game.id} game={game} onPlayClick={onPlayClick} onDetailsClick={onDetailsClick} />
        ))}
      </div>
    </section>
  );
};

export default PopularGames;