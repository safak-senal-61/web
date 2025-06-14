// components/games/GameCard.tsx
import React from 'react';
import Image from 'next/image';
import { Game } from '../../types/gameTypes'; // Yolu güncelleyin
import { Button } from '@/components/ui/button';
import { FaPlaystation, FaWindows, FaXbox, FaMobileAlt, FaStar, FaRocket } from 'react-icons/fa'; // İkonları ekleyin
import { GiGamepad } from 'react-icons/gi'; // Genel oyun ikonu

interface GameCardProps {
  game: Game;
  onPlayClick?: (gameId: string) => void;
  onDetailsClick?: (gameId: string) => void;
}

const PlatformIcon: React.FC<{ slug: string }> = ({ slug }) => {
  switch (slug) {
    case 'pc': return <FaWindows className="text-blue-500" title="PC" />;
    case 'ps5':
    case 'ps4': return <FaPlaystation className="text-blue-700" title="PlayStation" />;
    case 'xbox-series-xs':
    case 'xbox-one': return <FaXbox className="text-green-500" title="Xbox" />;
    case 'nintendo-switch': return <FaMobileAlt className="text-red-600" title="Nintendo Switch" />; // FaNintendoSwitch yok, alternatif
    default: return <GiGamepad className="text-gray-500" title="Diğer Platform" />;
  }
};

const GameCard: React.FC<GameCardProps> = ({ game, onPlayClick, onDetailsClick }) => {
  return (
    <div className="group relative flex flex-col bg-slate-50 dark:bg-slate-800/50 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl overflow-hidden h-full">
      <div className="relative w-full aspect-[3/4] sm:aspect-[4/5]">
        <Image
          src={game.coverImageUrl}
          alt={game.title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-105"
        />
        {game.isNewRelease && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
            YENİ
          </span>
        )}
         {game.isPopular && !game.isNewRelease && (
          <span className="absolute top-2 right-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
            POPÜLER
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {game.title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">
          {game.developer}
        </p>
        
        <div className="flex flex-wrap gap-1.5 mb-3">
          {game.genres.slice(0, 2).map(genre => (
            <span key={genre.id} className="text-xs bg-blue-100 dark:bg-blue-900/70 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">
              {genre.name}
            </span>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-300 mb-3">
          {game.platforms.slice(0,3).map(platform => (
            <PlatformIcon key={platform.id} slug={platform.slug} />
          ))}
          {game.platforms.length > 3 && <span className="text-xs">+{game.platforms.length - 3}</span>}
        </div>
        
        {game.rating && (
          <div className="flex items-center text-sm text-amber-500 dark:text-amber-400 mb-1">
            <FaStar className="mr-1" />
            <span>{(game.rating / 20).toFixed(1)} / 5</span> 
            {/* Veya doğrudan rating/100 ise game.rating */}
          </div>
        )}

        <p 
          className="text-sm text-slate-600 dark:text-slate-400"
          dangerouslySetInnerHTML={{ __html: game.description.replace(/'/g, "&apos;") }}
        />

        <div className="mt-auto pt-3">
          {game.isPlayableOnWebsaChat && onPlayClick ? (
            <Button 
              onClick={() => onPlayClick(game.id)}
              className="w-full bg-green-500 hover:bg-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700"
            >
              <FaRocket className="mr-2" /> WebsaChat&apos;de Oyna
            </Button>
          ) : onDetailsClick ? (
            <Button 
              variant="outline" 
              onClick={() => onDetailsClick(game.id)}
              className="w-full text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Detayları Gör
            </Button>
          ) : game.storeUrl ? (
             <a href={game.storeUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
                >
                  Mağazada Gör
                </Button>
             </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GameCard;