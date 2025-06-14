// components/rooms/RoomCard.tsx
import React from 'react';
import Link from 'next/link'; // Link importu
import { FaUsers, FaLock, FaComments } from 'react-icons/fa';
import Image from 'next/image';

export interface Room {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  tags?: string[];
  isPrivate: boolean;
  imageUrl?: string;
}

interface RoomCardProps {
  room: Room;
}

const RoomCard: React.FC<RoomCardProps> = ({ room }) => {
  return (
    // legacyBehavior kaldırıldı, className doğrudan Link'e verildi.
    // Link artık kendi <a> etiketini render edecek ve bu class'ları ona uygulayacak.
    <Link
      href={`/rooms/${room.id}`}
      className="block group relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl 
                 transition-all duration-300 ease-in-out transform hover:-translate-y-1 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900" // Focus stilleri eklendi
    >
      {/* Link'in TEK DOĞRUDAN ÇOCUĞU bu div olmalı */}
      <div>
        {/* Arka Plan ve Resim */}
        <div className="relative w-full h-40 sm:h-48 bg-slate-300 dark:bg-slate-700">
          {room.imageUrl ? (
            <Image
              src={room.imageUrl}
              alt={room.name}
              width={400}
              height={200}
              className="w-full h-40 object-cover rounded-md"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 dark:from-blue-500 dark:via-purple-600 dark:to-pink-600 flex items-center justify-center">
              {/* Resim yoksa bir placeholder ikon eklenebilir */}
              <FaComments className="w-12 h-12 text-white/30" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/20 dark:bg-black/30 group-hover:bg-black/30 dark:group-hover:bg-black/40 transition-colors duration-300"></div>
          <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
            {room.isPrivate && (
              <div className="p-1.5 bg-black/50 dark:bg-black/60 backdrop-blur-sm rounded-full" title="Özel Oda">
                <FaLock className="w-3.5 h-3.5 text-white/90" />
              </div>
            )}
            {/* Popülerlik/Yeni badge'leri buraya eklenebilir */}
          </div>
        </div>

        {/* İçerik Alanı */}
        <div className="p-4 bg-white dark:bg-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-1 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {room.name}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2 h-8"> {/* Sabit yükseklik eklendi */}
            {room.description}
          </p>

          {room.tags && room.tags.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-1.5 h-5 overflow-hidden"> {/* Sabit yükseklik ve overflow */}
              {room.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700/60">
            <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <FaUsers className="w-3.5 h-3.5 mr-1.5" />
              <span>{room.memberCount} / {room.maxMembers}</span>
            </div>
            {/* Katıl butonu tıklanabilirliği için Link'in içinde olmaması daha iyi olabilir,
                ancak şimdilik Link tüm kartı sarıyor. Butonun tıklama olayı Link'i tetikler.
                Eğer butona özel bir eylem (modal açma vb.) atanacaksa,
                butonun Link dışında olması veya e.preventDefault() kullanması gerekir.
                Mevcut durumda Link'in içine tıklanabilir bir buton koymak sorun yaratabilir.
                Şimdilik "Katıl"ı bir span olarak değiştirelim veya tıklama olayını kaldıralım.
            */}
            <span // Buton yerine span, çünkü tüm kart zaten bir link
              className="px-3 py-1.5 text-xs font-semibold text-white
                         bg-blue-500 group-hover:bg-blue-600
                         dark:bg-blue-600 dark:group-hover:bg-blue-700
                         rounded-md transition-colors cursor-pointer" // cursor-pointer eklendi
            >
              Katıl
            </span>
          </div>
        </div>
      </div> {/* Bu div Link'in tek çocuğu */}
    </Link>
  );
};

export default RoomCard;