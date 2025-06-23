// components/transactions/CoinPackages.tsx
import React from 'react';
import { CoinPackage } from '../../types/transactionTypes';
import { Button } from '@/components/ui/button';
import { FaCoins, FaStar, FaCrown, FaFire, FaGem, FaRocket, FaBolt } from 'react-icons/fa';

interface ExtendedCoinPackage extends CoinPackage {
  icon?: string;
  gradient?: string;
  isVip?: boolean;
}

interface CoinPackagesProps {
  onPackageSelect: (packageId: string) => void;
  isLoading: boolean;
}

// Backend'den çekilene kadar örnek veri
const samplePackages: ExtendedCoinPackage[] = [
  { 
    id: 'PKG15', 
    name: 'Deneme Paketi', 
    description: 'İlk adımını at!', 
    coins: 50, 
    price: 15.00, 
    currency: 'TRY', 
    bonusCoins: 5,
    icon: 'coins',
    gradient: 'from-blue-500 to-cyan-500'
  },
  { 
    id: 'PKG25', 
    name: 'Başlangıç Paketi', 
    description: 'Sohbete hızlı başla!', 
    coins: 100, 
    price: 25.00, 
    currency: 'TRY', 
    bonusCoins: 10,
    icon: 'rocket',
    gradient: 'from-green-500 to-emerald-500'
  },
  { 
    id: 'PKG50', 
    name: 'Popüler Paket', 
    description: 'En çok tercih edilen!', 
    coins: 250, 
    price: 50.00, 
    currency: 'TRY', 
    bonusCoins: 50, 
    isPopular: true,
    icon: 'fire',
    gradient: 'from-orange-500 to-red-500'
  },
  { 
    id: 'PKG95', 
    name: 'Fenomen Paketi', 
    description: 'Popülerliğini artır!', 
    coins: 500, 
    price: 95.00, 
    currency: 'TRY', 
    bonusCoins: 100,
    icon: 'star',
    gradient: 'from-purple-500 to-pink-500'
  },
  { 
    id: 'PKG180', 
    name: 'VIP Paketi', 
    description: 'Özel ayrıcalıklar!', 
    coins: 1000, 
    price: 180.00, 
    currency: 'TRY', 
    bonusCoins: 250,
    icon: 'crown',
    gradient: 'from-yellow-500 to-orange-500'
  },
  { 
    id: 'PKG400', 
    name: 'Premium Paket', 
    description: 'Lüks deneyim yaşa!', 
    coins: 2500, 
    price: 400.00, 
    currency: 'TRY', 
    bonusCoins: 750,
    icon: 'gem',
    gradient: 'from-indigo-500 to-purple-600'
  },
  { 
    id: 'PKG750', 
    name: 'Elite Paketi', 
    description: 'Elit kullanıcı ol!', 
    coins: 5000, 
    price: 750.00, 
    currency: 'TRY', 
    bonusCoins: 2000,
    icon: 'bolt',
    gradient: 'from-cyan-500 to-blue-600'
  },
  { 
    id: 'PKG1400', 
    name: 'İmparator Paketi', 
    description: 'Platformun kralı!', 
    coins: 10000, 
    price: 1400.00, 
    currency: 'TRY', 
    bonusCoins: 5000,
    icon: 'crown',
    gradient: 'from-pink-500 to-rose-600',
    isVip: true
  },
];

const getIcon = (iconName: string = 'coins') => {
  const iconProps = { className: "w-8 h-8 text-white" };
  switch (iconName) {
    case 'coins': return <FaCoins {...iconProps} />;
    case 'rocket': return <FaRocket {...iconProps} />;
    case 'fire': return <FaFire {...iconProps} />;
    case 'star': return <FaStar {...iconProps} />;
    case 'crown': return <FaCrown {...iconProps} />;
    case 'gem': return <FaGem {...iconProps} />;
    case 'bolt': return <FaBolt {...iconProps} />;
    default: return <FaCoins {...iconProps} />;
  }
};

const CoinPackages: React.FC<CoinPackagesProps> = ({ onPackageSelect, isLoading }) => {
  return (
    <div className="relative">
      {/* Background Glow */}
      <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl"></div>
      
      <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-8 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Jeton Paketleri
          </h2>
          <p className="text-slate-400 text-lg">Size özel hazırlanmış paketlerle avantajlı alışveriş yapın</p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mt-4"></div>
        </div>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {samplePackages.map((pkg) => (
            <div 
              key={pkg.id} 
              className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2"
            >
              {/* Card Glow Effect */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${pkg.gradient || 'from-blue-500 to-purple-500'} rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-500`}></div>
              
              {/* Main Card */}
              <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-5 h-full flex flex-col min-h-[400px]">
                
                {/* Popular Badge */}
                {pkg.isPopular && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <FaFire className="w-2 h-2" />
                      POPÜLER
                    </div>
                  </div>
                )}

                {/* VIP Badge */}
                {pkg.isVip && (
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                      <FaCrown className="w-2 h-2" />
                      VIP PAKET
                    </div>
                  </div>
                )}

                {/* Icon */}
                <div className="relative mx-auto mb-4 mt-3">
                  <div className={`absolute inset-0 bg-gradient-to-r ${pkg.gradient || 'from-blue-500 to-purple-500'} rounded-xl blur-md opacity-50`}></div>
                  <div className={`relative bg-gradient-to-r ${pkg.gradient || 'from-blue-500 to-purple-500'} p-3 rounded-xl shadow-xl`}>
                    {getIcon(pkg.icon)}
                  </div>
                </div>

                {/* Package Info */}
                <div className="text-center flex-grow flex flex-col">
                  <h3 className="text-lg font-bold text-white mb-1">{pkg.name}</h3>
                  <p className="text-slate-400 text-xs mb-4 h-8 flex items-center justify-center px-2">
                    {pkg.description}
                  </p>

                  {/* Coins Display */}
                  <div className="bg-slate-800/50 rounded-xl p-3 mb-4 border border-slate-700/30 flex-grow flex flex-col justify-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaCoins className="w-4 h-4 text-yellow-400" />
                      <span className="text-2xl font-bold text-white">
                        {pkg.coins.toLocaleString()}
                      </span>
                    </div>
                    {pkg.bonusCoins && (
                      <div className="flex items-center justify-center gap-1">
                        <span className="text-green-400 font-semibold text-xs">
                          +{pkg.bonusCoins.toLocaleString()} Bonus
                        </span>
                        <FaGem className="w-2 h-2 text-green-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Purchase Button */}
                <div className="mt-auto">
                  <div className="relative group/btn">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r ${pkg.gradient || 'from-blue-500 to-purple-500'} rounded-xl blur opacity-50 group-hover/btn:opacity-75 transition-opacity duration-300`}></div>
                    <Button 
                      onClick={() => onPackageSelect(pkg.id)} 
                      disabled={isLoading}
                      className={`relative w-full bg-gradient-to-r ${pkg.gradient || 'from-blue-500 to-purple-500'} hover:scale-105 active:scale-95 transition-all duration-200 border-0 text-white font-semibold py-3 rounded-xl shadow-xl h-auto`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="text-base font-bold">
                          ₺{pkg.price.toFixed(2)}
                        </span>
                        <span className="text-xs opacity-90 mt-0.5">Satın Al</span>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* WIP Notice */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-2xl px-6 py-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-yellow-400 font-medium">
              🚧 Yeni paketler yakında ekleniyor! Gelişim aşamasında...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoinPackages;