// components/common/Drawer.tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  FaGamepad,
  FaUsers,
  FaVolumeUp,
  FaShoppingCart,
  FaTimes,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaSearch,
  FaUser, // Default avatar icon
} from 'react-icons/fa';
import { User as UserType } from '../../types/userTypes';
import { useAuth } from '../../hooks/useAuth';
import { IconType } from 'react-icons';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

interface MenuItem {
  name: string;
  href: string;
  icon: IconType;
  color: string;
  darkColor?: string;
  gradient: string;
  darkGradient?: string;
}

const menuItemsConfig: MenuItem[] = [
  { name: 'Sesli Sohbet Odaları', href: '/voice-rooms', icon: FaVolumeUp, color: 'text-orange-600', darkColor: 'dark:text-orange-400', gradient: 'from-orange-500 to-amber-500', darkGradient: 'dark:from-orange-600 dark:to-amber-400' },
  { name: 'Oyunlar', href: '/games', icon: FaGamepad, color: 'text-green-600', darkColor: 'dark:text-green-400', gradient: 'from-green-500 to-emerald-500', darkGradient: 'dark:from-green-600 dark:to-emerald-400' },
  { name: 'Sohbetler', href: '/chats', icon: FaUsers, color: 'text-purple-600', darkColor: 'dark:text-purple-400', gradient: 'from-purple-500 to-violet-500', darkGradient: 'dark:from-purple-600 dark:to-violet-400' },
  { name: 'Kullanıcı Ara', href: '/search-users', icon: FaSearch, color: 'text-teal-600', darkColor: 'dark:text-teal-400', gradient: 'from-teal-500 to-cyan-500', darkGradient: 'dark:from-teal-600 dark:to-cyan-400' },
  { name: 'Mağaza', href: '/store', icon: FaShoppingCart, color: 'text-pink-600', darkColor: 'dark:text-pink-400', gradient: 'from-pink-500 to-rose-500', darkGradient: 'dark:from-pink-600 dark:to-rose-400' },
];

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, user }) => {
  const { logout: authLogout } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Resize handler
  useEffect(() => {
    if (!isMounted) return;

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isMounted]);

  // Body scroll lock for mobile
  useEffect(() => {
    if (!isMounted) return;

    if (isOpen && window.innerWidth < 768) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        const bodyStyle = document.body.style;
        const scrollPosition = parseInt(bodyStyle.top || '0') * -1;
        
        bodyStyle.position = '';
        bodyStyle.top = '';
        bodyStyle.width = '';
        bodyStyle.overflow = '';
        
        window.scrollTo(0, scrollPosition);
      };
    }
  }, [isOpen, isMounted]);

  if (!isMounted) {
    return null;
  }

  const handleToggleCollapse = () => {
    if (window.innerWidth >= 768) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleLogout = async () => {
    onClose();
    await authLogout();
  };

  const profileHref = user ? `/profile/` : '/login';

  // Dinamik class'lar
  const drawerWidthClass = isCollapsed && window.innerWidth >= 768 ? 'md:w-20' : 'w-72 sm:w-80';
  const drawerTransitionClass = isOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full shadow-2xl border-r 
                   border-slate-200/70 dark:border-slate-700/30 
                   transform transition-transform duration-300 ease-in-out z-50 
                   md:sticky md:translate-x-0 
                   ${drawerTransitionClass} 
                   ${drawerWidthClass}
                   bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 
                   text-slate-800 dark:text-white`}
        aria-label="Ana Menü"
      >
        {/* Arka plan desenleri */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 via-white/20 to-slate-50/30 dark:from-slate-800/40 dark:via-slate-900/30 dark:to-slate-800/40 backdrop-blur-md dark:backdrop-blur-xl opacity-70 dark:opacity-100" />
        <div
          className="absolute inset-0 opacity-30 dark:opacity-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2394a3b8' fill-opacity='0.03' dark:fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />

        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className={`flex items-center justify-between border-b 
                         border-slate-200/70 dark:border-slate-700/30 
                         flex-shrink-0 h-16
                         ${isCollapsed && window.innerWidth >= 768 ? 'px-2.5' : 'px-4'}`}>
            {(!isCollapsed || window.innerWidth < 768) && (
              <Link
                href="/"
                onClick={onClose}
                className="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity duration-300"
              >
                
              </Link>
            )}
            
         

            <div className="flex items-center">
              <button
                onClick={handleToggleCollapse}
                className={`p-2.5 rounded-lg transition-all duration-300 backdrop-blur-sm
                           text-slate-500 dark:text-slate-400 
                           hover:bg-slate-200 dark:hover:bg-slate-700/40 
                           hover:text-slate-700 dark:hover:text-white hover:scale-105
                           ${window.innerWidth < 768 ? 'hidden' : 'flex'}`}
                aria-label={isCollapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
              >
                {isCollapsed ? <FaChevronRight className="w-10 h-7" /> : <FaChevronLeft className="w-10 h-7" />}
              </button>
              <button
                onClick={onClose}
                className={`p-2.5 rounded-lg transition-all duration-300
                           text-slate-500 dark:text-slate-400 
                           hover:bg-red-100 dark:hover:bg-red-500/20 
                           hover:text-red-500 dark:hover:text-red-300 hover:rotate-90
                           ${window.innerWidth >= 768 ? 'hidden' : 'flex'}`}
                aria-label="Menüyü kapat"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Profile Section */}
          {user && (
            <div className={`border-b border-slate-200/70 dark:border-slate-700/30 
                           flex-shrink-0
                           ${isCollapsed && window.innerWidth >= 768 ? 'py-4 px-2.5' : 'p-5 sm:p-6'}`}>
              <div className={`${isCollapsed && window.innerWidth >= 768 ? 'flex flex-col items-center' : 'text-center'}`}>
                <Link
                  href={profileHref}
                  className="block group relative mb-2 sm:mb-3 hover:scale-105 transition-transform duration-300"
                  onClick={onClose}
                  title={(isCollapsed && window.innerWidth >= 768 && user) ? (user.nickname || user.username || '') : undefined}
                >
                  <div className="relative">
                    {user.profilePictureUrl ? (
                      <Image
                        src={user.profilePictureUrl}
                        alt={`${user.nickname || user.username || ''}'s avatar`}
                        width={40}
                        height={40}
                        className={`rounded-full object-cover border-2 
                                   border-slate-300 dark:border-slate-600/50 
                                   group-hover:border-blue-500 dark:group-hover:border-blue-400 
                                   transition-all duration-300 shadow-lg group-hover:shadow-blue-500/20 dark:group-hover:shadow-blue-400/25 
                                   ${isCollapsed && window.innerWidth >= 768 ? 'w-10 h-10' : 'w-16 h-16 sm:w-20 sm:h-20 mx-auto'}`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            const defaultAvatar = parent.querySelector('.default-avatar');
                            if (defaultAvatar) {
                              (defaultAvatar as HTMLElement).style.display = 'flex';
                            }
                          }
                        }}
                      />
                    ) : null}
                    
                    <div 
                      className={`default-avatar rounded-full border-2 
                                 border-slate-300 dark:border-slate-600/50 
                                 group-hover:border-blue-500 dark:group-hover:border-blue-400 
                                 transition-all duration-300 shadow-lg group-hover:shadow-blue-500/20 dark:group-hover:shadow-blue-400/25 
                                 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700
                                 flex items-center justify-center
                                 ${isCollapsed && window.innerWidth >= 768 ? 'w-10 h-10' : 'w-16 h-16 sm:w-20 sm:h-20 mx-auto'}
                                 ${user.profilePictureUrl ? 'hidden' : 'flex'}`}
                    >
                      <FaUser className={`text-slate-500 dark:text-slate-400 ${isCollapsed && window.innerWidth >= 768 ? 'w-4 h-4' : 'w-6 h-6 sm:w-8 sm:h-8'}`} />
                    </div>
                    
                    <div className={`absolute -bottom-0.5 -right-0.5 bg-green-500 dark:bg-green-400 rounded-full border-2 
                                   border-white dark:border-slate-800 animate-pulse 
                                   ${isCollapsed && window.innerWidth >= 768 ? 'w-3 h-3' : 'w-3.5 h-3.5 sm:w-4 sm:h-4'}`} />
                  </div>
                </Link>

                {(!isCollapsed || window.innerWidth < 768) && (
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <h2 className="text-md sm:text-lg font-semibold text-slate-800 dark:text-white truncate">
                        {user.nickname || user.username}
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Seviye: {user.level || 1}</p>
                    </div>
                    <div className="flex justify-center space-x-2 sm:space-x-3">
                      <div className="flex items-center space-x-1.5 sm:space-x-2 bg-yellow-50 dark:bg-yellow-600/30 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-yellow-300 dark:border-yellow-500/30 hover:scale-105 transition-transform duration-300">
                        <span className="text-md sm:text-lg">💰</span>
                        <span className="text-yellow-700 dark:text-yellow-300 font-bold text-xs sm:text-sm">{user.coins || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 sm:space-x-2 bg-purple-50 dark:bg-purple-600/30 backdrop-blur-sm px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full border border-purple-300 dark:border-purple-500/30 hover:scale-105 transition-transform duration-300">
                        <span className="text-md sm:text-lg">💎</span>
                        <span className="text-purple-700 dark:text-purple-300 font-bold text-xs sm:text-sm">{user.diamonds || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto custom-scrollbar 
                         ${isCollapsed && window.innerWidth >= 768 ? 'px-2 py-4' : 'px-3 sm:px-4 py-4 sm:py-6'}`}>
            <div className="space-y-1.5 sm:space-y-2">
              {menuItemsConfig.map((item) => {
                const isActive = router.pathname === item.href || (item.href !== '/' && router.pathname.startsWith(item.href));
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center transition-all duration-200 ease-in-out relative overflow-hidden group rounded-lg border backdrop-blur-sm
                        ${isActive
                          ? `bg-gradient-to-r ${item.gradient} ${item.darkGradient || ''} text-white shadow-md dark:shadow-lg border-transparent scale-100`
                          : `text-slate-600 dark:text-slate-300 
                             bg-slate-100/50 dark:bg-slate-800/30 
                             hover:bg-slate-200/70 dark:hover:bg-slate-700/50 
                             border-slate-200/50 dark:border-slate-700/30 
                             hover:border-slate-300 dark:hover:border-slate-600/50 hover:scale-[1.02]`
                        }
                        ${isCollapsed && window.innerWidth >= 768 ? 'justify-center p-2.5 sm:p-3' : 'space-x-3 sm:space-x-4 py-2.5 sm:py-3 px-3 sm:px-4'}`}
                      title={isCollapsed && window.innerWidth >= 768 ? item.name : undefined}
                    >
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-white animate-pulse' : `${item.color} ${item.darkColor || ''}`} group-hover:scale-105 transition-transform duration-200 flex-shrink-0`} />
                      {(!isCollapsed || window.innerWidth < 768) && (
                        <span className={`font-medium text-sm truncate ${isActive ? 'text-white' : 'text-slate-700 dark:text-slate-200'}`}>{item.name}</span>
                      )}
                      {isActive && (!isCollapsed || window.innerWidth < 768) && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white dark:bg-opacity-80 rounded-full animate-ping" />
                      )}
                    </Link>

                    {isCollapsed && window.innerWidth >= 768 && (
                      <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 dark:bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150 pointer-events-none whitespace-nowrap z-50 border border-slate-700 dark:border-slate-700/50">
                        {item.name}
                        <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-slate-800 dark:border-r-slate-900/95 -mr-1"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Bottom Actions */}
          {user && (
            <div className={`border-t border-slate-200/70 dark:border-slate-700/30 
                           backdrop-blur-sm bg-white/30 dark:bg-slate-800/10 
                           flex-shrink-0 
                           ${isCollapsed && window.innerWidth >= 768 ? 'p-2 py-3' : 'p-3 sm:p-4'}`}>
              <div className="space-y-1.5 sm:space-y-2">
                <div className="relative group">
                  <Link
                    href="/settings"
                    onClick={onClose}
                    className={`group w-full flex items-center transition-all duration-200 ease-in-out rounded-lg border backdrop-blur-sm
                      ${router.pathname.startsWith('/settings')
                        ? 'bg-slate-200 dark:bg-slate-700/60 text-slate-800 dark:text-white border-slate-300 dark:border-slate-600/50'
                        : `text-slate-500 dark:text-slate-400 
                           bg-slate-100/50 dark:bg-slate-800/30 
                           hover:bg-slate-200/70 dark:hover:bg-slate-700/40 
                           hover:text-slate-700 dark:hover:text-white 
                           border-slate-200/50 dark:border-slate-700/30 
                           hover:border-slate-300 dark:hover:border-slate-600/50 hover:scale-[1.02]`
                      }
                      ${isCollapsed && window.innerWidth >= 768 ? 'justify-center p-2.5 sm:p-3' : 'space-x-3 sm:space-x-4 py-2.5 sm:py-3 px-3 sm:px-4'}`}
                    title={isCollapsed && window.innerWidth >= 768 ? "Ayarlar" : undefined}
                  >
                    <FaCog className={`w-5 h-5 group-hover:rotate-90 transition-transform duration-300 flex-shrink-0 ${router.pathname.startsWith('/settings') ? 'text-slate-700 dark:text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'}`} />
                    {(!isCollapsed || window.innerWidth < 768) && <span className={`text-sm font-medium ${router.pathname.startsWith('/settings') ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300 group-hover:text-slate-700 dark:group-hover:text-white'}`}>Ayarlar</span>}
                  </Link>
                  {isCollapsed && window.innerWidth >= 768 && (
                    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 dark:bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150 pointer-events-none whitespace-nowrap z-50 border border-slate-700 dark:border-slate-700/50">
                      Ayarlar
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-slate-800 dark:border-r-slate-900/95 -mr-1"></div>
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <button
                    onClick={handleLogout}
                    className={`group w-full flex items-center transition-all duration-200 ease-in-out rounded-lg border backdrop-blur-sm
                      text-red-500 dark:text-red-400 
                      bg-red-50/50 dark:bg-red-500/10 
                      hover:bg-red-100 dark:hover:bg-red-500/20 
                      hover:text-red-600 dark:hover:text-red-300 
                      border-red-200/50 dark:border-red-500/30 
                      hover:border-red-300 dark:hover:border-red-400/50 hover:scale-[1.02]
                      ${isCollapsed && window.innerWidth >= 768 ? 'justify-center p-2.5 sm:p-3' : 'space-x-3 sm:space-x-4 py-2.5 sm:py-3 px-3 sm:px-4'}`}
                    title={isCollapsed && window.innerWidth >= 768 ? "Çıkış Yap" : undefined}
                  >
                    <FaSignOutAlt className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200 flex-shrink-0" />
                    {(!isCollapsed || window.innerWidth < 768) && <span className="text-sm font-medium">Çıkış Yap</span>}
                  </button>
                  {isCollapsed && window.innerWidth >= 768 && (
                     <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 dark:bg-slate-900/95 backdrop-blur-md text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-150 pointer-events-none whitespace-nowrap z-50 border border-slate-700 dark:border-slate-700/50">
                      Çıkış Yap
                      <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-y-4 border-y-transparent border-r-4 border-r-slate-800 dark:border-r-slate-900/95 -mr-1"></div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.5);
        }
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.3) transparent;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.4);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.6);
        }
        .dark .custom-scrollbar {
          scrollbar-color: rgba(71, 85, 105, 0.4) transparent;
        }
      `}</style>
    </>
  );
};

export default Drawer;