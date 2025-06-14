// components/profile/tabs/GiftsTab.tsx
import React from 'react';

interface Gift { // Bu tip ProfilePage.tsx'den alınabilir veya ortak bir types dosyasında olabilir
  id: string | number;
  name: string;
  icon: string;
  fromUsername: string;
  receivedAt: string;
}

interface GiftsTabProps {
  gifts: Gift[];
  isLoading: boolean; // Bu sekme için özel yükleme durumu olabilir
}

const GiftsTab: React.FC<GiftsTabProps> = ({ gifts, isLoading }) => {
  if (isLoading) {
    return <p className="text-center text-slate-400 py-8">Hediyeler yükleniyor...</p>;
  }

  if (gifts.length === 0) {
    return <p className="text-center text-slate-400 py-8">Henüz hiç hediye alınmamış.</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 animate-fade-in-short">
      {gifts.map(gift => (
        <div
          key={gift.id}
          className="bg-slate-700/40 rounded-xl p-4 text-center hover:bg-slate-700/70 transition-all duration-200 transform hover:scale-105 cursor-pointer"
          title={`Kimden: ${gift.fromUsername} - Tarih: ${new Date(gift.receivedAt).toLocaleDateString()}`}
        >
          <div className="text-3xl sm:text-4xl mb-2">{gift.icon}</div>
          <h3 className="text-sm font-medium text-white mb-0.5 truncate">{gift.name}</h3>
          {/* İsteğe bağlı olarak gönderen ve tarih bilgisi burada da gösterilebilir */}
        </div>
      ))}
    </div>
  );
};

export default GiftsTab;