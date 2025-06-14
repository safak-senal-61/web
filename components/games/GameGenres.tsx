// components/games/GameGenres.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { GameGenre } from '../../types/gameTypes'; // Yolu güncelleyin


// İkonları türe göre eşleştirmek için bir map (veya switch case GameGenre içinde)
// const genreIcons: { [key: string]: React.ElementType } = {
//   action: GiCrosshair, // react-icons'dan import
//   rpg: GiCrystalBall,
//   // ...
// };

interface GameGenresProps {
  genres: GameGenre[];
  selectedGenreSlug: string | null;
  onSelectGenre: (slug: string | null) => void;
}

const GameGenres: React.FC<GameGenresProps> = ({ genres, selectedGenreSlug, onSelectGenre }) => {
  if (!genres || genres.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-white mb-4 sm:mb-6">
        Türlere Göz At
      </h2>
      <div className="flex flex-wrap gap-2 sm:gap-3">
        {genres.map(genre => {
          // const IconComponent = genre.icon ? require('react-icons/gi')[genre.icon] : GiGamepad; // Dinamik import daha karmaşık olabilir
          return (
            <Button
              key={genre.id}
              variant={selectedGenreSlug === genre.slug ? 'default' : 'outline'}
              onClick={() => onSelectGenre(selectedGenreSlug === genre.slug ? null : genre.slug)}
              className={`
                px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base rounded-lg transition-all
                ${selectedGenreSlug === genre.slug
                  ? 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600'
                  : 'bg-slate-200 hover:bg-slate-300 text-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200 border-slate-300 dark:border-slate-600'
                }
              `}
            >
              {/* <IconComponent className="mr-2 h-4 w-4 sm:h-5 sm:w-5" /> */}
              {genre.name}
            </Button>
          );
        })}
      </div>
    </section>
  );
};

export default GameGenres;