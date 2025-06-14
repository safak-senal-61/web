// pages/index.tsx veya ilgili sayfa dosyanız
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaComments,
  FaGamepad,
  FaUsers,
  FaVolumeUp,
  FaShoppingCart,
  FaArrowRight,
  FaFire,
  FaClock,
  FaStar,
  FaCog,
  FaBell
} from 'react-icons/fa';
import { Header } from '@/components/layout/Header';

// homeCards verisinden darkGradient kaldırıldı, className içinde halledilecek
const homeCards = [

  {
    title: 'Oyunlar',
    description: 'Eğlenceli oyunlar oynayın ve arkadaşlarınızla yarışın.',
    icon: FaGamepad,
    href: '/games',
    color: 'green',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-green-600',
    darkGradientFrom: 'dark:from-green-400',
    darkGradientTo: 'dark:to-green-500',
    stats: '12 oyun',
    isNew: true
  },
  {
    title: 'Aktif Sohbetler',
    description: 'Devam eden özel sohbetlerinizi görüntüleyin.',
    icon: FaUsers,
    href: '/chats',
    color: 'purple',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-purple-600',
    darkGradientFrom: 'dark:from-purple-400',
    darkGradientTo: 'dark:to-purple-500',
    stats: '3 aktif sohbet',
    isPopular: false
  },
  {
    title: 'Sesli Odalar',
    description: 'Gerçek zamanlı sesli iletişim kurun.',
    icon: FaVolumeUp,
    href: '/voice-rooms',
    color: 'orange',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-orange-600',
    darkGradientFrom: 'dark:from-orange-400',
    darkGradientTo: 'dark:to-orange-500',
    stats: '8 aktif oda',
    isPopular: false
  },
  {
    title: 'Mağaza',
    description: 'Özel eşyalar ve özellikler satın alın.',
    icon: FaShoppingCart,
    href: '/store',
    color: 'pink',
    gradientFrom: 'from-pink-500',
    gradientTo: 'to-pink-600',
    darkGradientFrom: 'dark:from-pink-400',
    darkGradientTo: 'dark:to-pink-500',
    stats: 'Yeni ürünler',
    isNew: true
  },
];

const HomePage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      }));
    };
    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login?redirect=/home');
    }
  }, [user, isLoading, router]);

  const mainContentPaddingTop = "pt-20";
  const pageContainerClasses = "container mx-auto px-4 sm:px-6 lg:px-8 pb-12";

  if (isLoading) {
    return (
      <>
        <Header />
        <div className={`flex justify-center items-center h-[calc(100vh-4rem)] ${mainContentPaddingTop}`}>
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mb-4"></div>
            <p className="text-slate-700 dark:text-slate-300 text-lg">İçerik yükleniyor...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Header />
        <div className={`flex justify-center items-center h-[calc(100vh-4rem)] ${mainContentPaddingTop}`}>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto">
              <FaClock className="w-8 h-8 text-white" />
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-lg">Giriş yapmanız gerekiyor. Yönlendiriliyorsunuz...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className={`animate-fade-in space-y-10 ${mainContentPaddingTop} ${pageContainerClasses}`}> {/* space-y-8'den 10'a artırıldı, isteğe bağlı */}

        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-600/10 dark:via-purple-600/10 dark:to-pink-600/10 rounded-3xl -z-10"></div>
          <div className="relative p-6 md:p-8 bg-white/70 dark:bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700/50">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-6 lg:mb-0">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-2.5 h-2.5 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-slate-600 dark:text-slate-400 text-sm">{currentTime}</span>
                </div>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 dark:text-white mb-4">
                  Hoşgeldin, <br />
                  <span className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-500 dark:to-pink-500 bg-clip-text text-transparent">
                    {user.nickname || user.username}
                  </span>
                  !
                </h1>
                <p className="text-slate-700 dark:text-slate-300 text-lg lg:text-xl mb-6 max-w-2xl">
                  WebsaChat&apos;te neler olup bitiyor keşfet ve sosyalleş.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4">
                  <div className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-500/30 px-4 py-2 rounded-full border border-blue-300 dark:border-blue-500/40">
                    <FaUsers className="w-4 h-4 text-blue-600 dark:text-blue-300" />
                    <span className="text-blue-700 dark:text-blue-300 text-sm font-medium">1,247 çevrimiçi</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-green-100 dark:bg-green-500/30 px-4 py-2 rounded-full border border-green-300 dark:border-green-500/40">
                    <FaComments className="w-4 h-4 text-green-600 dark:text-green-300" />
                    <span className="text-green-700 dark:text-green-300 text-sm font-medium">156 aktif sohbet</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 lg:mt-0 lg:ml-6 flex-shrink-0 bg-white/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-600/50 shadow-lg">
                <h3 className="text-slate-800 dark:text-white text-lg font-semibold mb-4">Hesap Durumun</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">Seviye</span>
                    <span className="text-slate-700 dark:text-white font-medium">{user.level || 1}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">Coin</span>
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">{user.coins || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 dark:text-slate-400 text-sm">Elmas</span>
                    <span className="text-purple-600 dark:text-purple-400 font-medium">{user.diamonds || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-100 dark:text-white">Özellikler</h2>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
              <FaFire className="w-5 h-5 text-red-500 dark:text-red-400" />
              <span className="text-sm font-medium">Popüler</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {homeCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group relative overflow-hidden block h-full rounded-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} ${card.darkGradientFrom} ${card.darkGradientTo} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-0`}></div>
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradientFrom} ${card.gradientTo} ${card.darkGradientFrom} ${card.darkGradientTo} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-300 -z-0`}></div>

                <div className="relative p-6 shadow-lg hover:shadow-xl transform group-hover:-translate-y-1 transition-all duration-300 bg-white/80 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600 h-full flex flex-col rounded-2xl">
                  <div className="absolute top-4 right-4 flex space-x-2 z-10">
                    {card.isPopular && (
                      <div className="flex items-center space-x-1 bg-red-100 dark:bg-red-500/30 px-2.5 py-1 rounded-full border border-red-300 dark:border-red-500/40">
                        <FaFire className="w-3.5 h-3.5 text-red-500 dark:text-red-400" />
                        <span className="text-red-600 dark:text-red-300 text-xs font-semibold">Popüler</span>
                      </div>
                    )}
                    {card.isNew && (
                      <div className="flex items-center space-x-1 bg-green-100 dark:bg-green-500/30 px-2.5 py-1 rounded-full border border-green-300 dark:border-green-500/40">
                        <FaStar className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                        <span className="text-green-600 dark:text-green-300 text-xs font-semibold">Yeni</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-grow"> {/* Bu div tüm içeriği sarmalı */}
                    <div className={`w-14 h-14 bg-gradient-to-r ${card.gradientFrom} ${card.gradientTo} ${card.darkGradientFrom} ${card.darkGradientTo} rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300 mb-4`}>
                      <card.icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className={`text-xl font-semibold text-slate-800 dark:text-white mb-2 group-hover:text-${card.color}-600 dark:group-hover:text-${card.color}-400 transition-colors`}>
                      {card.title}
                    </h3>

                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-5 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors line-clamp-2 flex-grow">
                      {card.description}
                    </p>

                    <div className="flex items-center justify-between mt-auto border-t border-slate-200/70 dark:border-slate-700/50 pt-4">
                      <span className="text-slate-500 dark:text-slate-500 text-xs font-medium">
                        {card.stats}
                      </span>
                      <div className={`flex items-center space-x-1.5 text-${card.color}-600 dark:text-${card.color}-400 group-hover:text-${card.color}-700 dark:group-hover:text-${card.color}-300 transition-colors`}>
                        <span className="text-sm font-semibold">Keşfet</span>
                        <FaArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="bg-white/60 dark:bg-slate-800/50 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50 shadow-lg">
          <h3 className="text-2xl font-semibold text-slate-800 dark:text-white mb-5">Hızlı İşlemler</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { href: "/profile", icon: FaUsers, label: "Profil", color: "blue" },
              { href: "/notifications", icon: FaBell, label: "Bildirimler", color: "orange" },
              { href: "/settings", icon: FaCog, label: "Ayarlar", color: "purple" },
              { href: "/store", icon: FaShoppingCart, label: "Mağaza", color: "pink" },
            ].map(action => (
              <Link
                key={action.label}
                href={action.href}
                className={`flex flex-col items-center justify-center p-4 rounded-xl bg-slate-100 dark:bg-slate-700/70 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent hover:border-${action.color}-400 dark:hover:border-${action.color}-500 transition-all duration-200 group transform hover:scale-105`}
              >
                <action.icon className={`w-7 h-7 text-${action.color}-500 dark:text-${action.color}-400 mb-2 group-hover:scale-110 transition-transform`} />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">{action.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
};

export default HomePage;