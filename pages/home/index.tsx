// pages/home/index.tsx
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FaComments,
  FaGamepad,
  FaUsers,
  FaShoppingCart,
  FaArrowRight,
  FaFire,
  FaClock,
} from 'react-icons/fa';
import { Header } from '@/components/layout/Header';
import { User } from '@/types/userTypes';
import { Tokens } from '@/types/authTypes';
import Drawer from '../../components/common/Drawer'; // Drawer'ı import et

const homeCards = [
    {
        title: 'Sohbet Odaları',
        description: 'Canlı sohbet odalarına katılın ve yeni insanlarla tanışın.',
        icon: FaComments,
        href: '/voice-rooms',
        stats: '25 aktif oda',
        isPopular: true,
        isNew: false,
        colorClasses: 'blue'
    },
    {
        title: 'Oyunlar',
        description: 'Eğlenceli oyunlar oynayın ve arkadaşlarınızla yarışın.',
        icon: FaGamepad,
        href: '/games',
        stats: '12 oyun',
        isNew: true,
        isPopular: false,
        colorClasses: 'green'
    },
    {
        title: 'Kullanıcıları Keşfet',
        description: 'Yeni arkadaşlar bulun ve topluluklara katılın.',
        icon: FaUsers,
        href: '/search-users',
        stats: 'Binlerce kullanıcı',
        isPopular: false,
        isNew: false,
        colorClasses: 'orange'
    },
    {
        title: 'Mağaza',
        description: 'Özel eşyalar ve özellikler satın alın.',
        icon: FaShoppingCart,
        href: '/store',
        stats: 'Yeni ürünler',
        isNew: true,
        isPopular: false,
        colorClasses: 'pink'
    },
];

const colorMap = {
    blue: {
        gradientFrom: 'from-blue-500', gradientTo: 'to-blue-600',
        darkGradientFrom: 'dark:from-blue-400', darkGradientTo: 'dark:to-blue-500',
        text: 'text-blue-600 dark:text-blue-400',
        hoverText: 'group-hover:text-blue-700 dark:group-hover:text-blue-300',
        hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-500',
    },
    green: {
        gradientFrom: 'from-green-500', gradientTo: 'to-green-600',
        darkGradientFrom: 'dark:from-green-400', darkGradientTo: 'dark:to-green-500',
        text: 'text-green-600 dark:text-green-400',
        hoverText: 'group-hover:text-green-700 dark:group-hover:text-green-300',
        hoverBorder: 'hover:border-green-400 dark:hover:border-green-500',
    },
    orange: {
        gradientFrom: 'from-orange-500', gradientTo: 'to-orange-600',
        darkGradientFrom: 'dark:from-orange-400', darkGradientTo: 'dark:to-orange-500',
        text: 'text-orange-600 dark:text-orange-400',
        hoverText: 'group-hover:text-orange-700 dark:group-hover:text-orange-300',
        hoverBorder: 'hover:border-orange-400 dark:hover:border-orange-500',
    },
    pink: {
        gradientFrom: 'from-pink-500', gradientTo: 'to-pink-600',
        darkGradientFrom: 'dark:from-pink-400', darkGradientTo: 'dark:to-pink-500',
        text: 'text-pink-600 dark:text-pink-400',
        hoverText: 'group-hover:text-pink-700 dark:group-hover:text-pink-300',
        hoverBorder: 'hover:border-pink-400 dark:hover:border-pink-500',
    }
};

const HomePage = () => {
  const { user, isLoading, isAuthenticated, handleOauthCallback } = useAuth();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState('');
  
  // Drawer'ın durumunu yönetmek için state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Auth ve veri yönetimi için useEffect'ler
  useEffect(() => {
    if (!router.isReady) return;
    const { accessToken, user: userString } = router.query;
    if (accessToken && userString) {
      try {
        const oauthUser = JSON.parse(userString as string) as User;
        const oauthTokens: Tokens = { accessToken: accessToken as string, accessExpiresIn: '' };
        handleOauthCallback({ kullanici: oauthUser, tokenlar: oauthTokens });
        router.replace('/home', undefined, { shallow: true });
        return;
      } catch (e) {
        console.error("OAuth data processing error:", e);
        router.push('/login');
        return;
      }
    }
    if (isLoading) return;
    if (!isAuthenticated) {
      router.push('/login?redirect=/home');
    }
  }, [router.isReady, router.query, isLoading, isAuthenticated, handleOauthCallback]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleString('tr-TR', {
        hour: '2-digit', minute: '2-digit', day: '2-digit',
        month: 'long', year: 'numeric'
      }));
    };
    updateTime();
    const intervalId = setInterval(updateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  // Yükleme durumu
  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-white dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mb-4"></div>
          <p className="text-slate-700 dark:text-slate-300 text-lg">Oturum kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  const mainContentPaddingTop = "pt-20";
  const pageContainerClasses = "container mx-auto px-4 sm:px-6 lg:px-8 pb-12";

  return (
    <div className="flex h-screen overflow-hidden">
        <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            user={user}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
            <Header onMenuClick={() => setIsDrawerOpen(!isDrawerOpen)} />

            <main className={`flex-1 overflow-y-auto animate-fade-in space-y-10 ${mainContentPaddingTop} ${pageContainerClasses}`}>
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
                        <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Özellikler</h2>
                        <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
                        <FaFire className="w-5 h-5 text-red-500 dark:text-red-400" />
                        <span className="text-sm font-medium">Popüler</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {homeCards.map((card) => {
                            const colors = colorMap[card.colorClasses as keyof typeof colorMap];
                            return (
                            <Link
                                key={card.title}
                                href={card.href}
                                className="group relative overflow-hidden block h-full rounded-2xl"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} ${colors.darkGradientFrom} ${colors.darkGradientTo} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-0`}></div>
                                <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} ${colors.darkGradientFrom} ${colors.darkGradientTo} opacity-0 group-hover:opacity-5 blur-xl transition-opacity duration-300 -z-0`}></div>
                                <div className="relative p-6 shadow-lg hover:shadow-xl transform group-hover:-translate-y-1 transition-all duration-300 bg-white/80 dark:bg-slate-800/70 backdrop-blur-md border border-slate-200 dark:border-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600 h-full flex flex-col rounded-2xl">
                                <div className="flex-grow">
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors.gradientFrom} ${colors.gradientTo} flex items-center justify-center mb-4 shadow-lg`}>
                                        <card.icon className="w-6 h-6 text-white"/>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{card.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">{card.description}</p>
                                </div>
                                <div className="flex items-center justify-between mt-4 text-xs text-slate-500 dark:text-slate-400">
                                    <span>{card.stats}</span>
                                    <div className="flex items-center text-blue-500 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
                                        <span className="mr-1">Git</span>
                                        <FaArrowRight/>
                                    </div>
                                </div>
                                </div>
                            </Link>
                            )
                        })}
                    </div>
                </section>
            </main>
        </div>
    </div>
  );
};

export default HomePage;