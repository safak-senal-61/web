// components/rooms/TrendingRooms.tsx
import React from 'react';
import RoomCard from './RoomCard';
import { Room } from '../../types/roomTypes'; // RoomCard'dan import ediliyorsa bu satır gereksiz olabilir.
import { FaArrowRight, FaFire } from 'react-icons/fa';
import Link from 'next/link';

interface TrendingRoomsProps {
  rooms: Room[];
}

const TrendingRooms: React.FC<TrendingRoomsProps> = ({ rooms }) => {
  if (!rooms || rooms.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 sm:mb-12">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-800 dark:text-white flex items-center">
          <FaFire className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 dark:text-red-400 mr-2.5 sm:mr-3" />
          Trend Odalar
        </h2>
        {/* Opsiyonel "Tümünü Gör" linki, gerekirse açılabilir.
        <Link 
          href="/rooms/trending"
          className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center group"
        >
          Tümünü Gör <FaArrowRight className="w-3 h-3 ml-1.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
        */}
      </div>

      <div className="flex overflow-x-auto space-x-4 sm:space-x-6 pb-4 custom-scrollbar -mx-4 px-4 sm:-mx-6 sm:px-6">
        {rooms.slice(0, 5).map(room => (
          <div key={room.id} className="flex-shrink-0 w-72 sm:w-80 md:w-[340px]">
            <RoomCard room={room} />
          </div>
        ))}
        {rooms.length > 5 && (
           // DÜZELTME: `legacyBehavior` ve içindeki `<a>` kaldırıldı.
           <Link 
             href="/rooms/trending" 
             className="flex-shrink-0 w-72 sm:w-80 md:w-[340px] h-full group"
           >
             <div className="h-full flex flex-col items-center justify-center p-6 rounded-xl shadow-lg 
                           bg-slate-100 dark:bg-slate-800/50 
                           border border-slate-200 dark:border-slate-700 
                           hover:bg-slate-200 dark:hover:bg-slate-700/70
                           hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FaArrowRight className="w-7 h-7 text-white"/>
                </div>
                <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">Tüm Trendleri Gör</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Daha fazla popüler oda keşfet</p>
             </div>
           </Link>
        )}
      </div>
    </section>
  );
};

export default TrendingRooms;