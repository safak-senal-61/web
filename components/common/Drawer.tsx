// components/common/Drawer.tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  Gamepad2,
  Users,
  Volume2,
  ShoppingCart,
  X,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  User,
  Sparkles,
  Coins,
  Gem,
  Activity,
  LucideIcon
} from 'lucide-react';
import { User as UserType } from '../../types/userTypes';
import { useAuth } from '../../hooks/useAuth';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType | null;
}

interface MenuItem {
  name: string;
  href: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
}

const menuItemsConfig: MenuItem[] = [
  { 
    name: 'Sesli Sohbet Odaları', 
    href: '/voice', 
    icon: Volume2, 
    color: 'text-orange-500', 
    gradient: 'from-orange-500 via-amber-500 to-yellow-500' 
  },
  { 
    name: 'Oyunlar', 
    href: '/games', 
    icon: Gamepad2, 
    color: 'text-emerald-500', 
    gradient: 'from-emerald-500 via-green-500 to-teal-500' 
  },
  { 
    name: 'Sohbetler', 
    href: '/chat', 
    icon: Users, 
    color: 'text-purple-500', 
    gradient: 'from-purple-500 via-violet-500 to-indigo-500' 
  },
  { 
    name: 'Kullanıcı Ara', 
    href: '/search-users', 
    icon: Search, 
    color: 'text-cyan-500', 
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500' 
  },
  { 
    name: 'Mağaza', 
    href: '/transactions', 
    icon: ShoppingCart, 
    color: 'text-pink-500', 
    gradient: 'from-pink-500 via-rose-500 to-red-500' 
  },
];

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, user }) => {
  const { logout: authLogout } = useAuth();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const handleResize = () => {
      if (window.innerWidth < 768) setIsCollapsed(false);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [isMounted]);

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

  if (!isMounted) return null;

  const handleToggleCollapse = () => {
    if (window.innerWidth >= 768) setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    onClose();
    await authLogout();
  };

  const profileHref = user ? `/profile/` : '/login';
  const drawerWidthClass = isCollapsed && window.innerWidth >= 768 ? 'md:w-20' : 'w-72 sm:w-80';
  const drawerTransitionClass = isOpen ? 'translate-x-0' : '-translate-x-full';

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full shadow-2xl border-r 
                   border-slate-200/20 dark:border-slate-700/50 
                   transform transition-all duration-500 ease-out z-50 
                   md:sticky md:translate-x-0 
                   ${drawerTransitionClass} 
                   ${drawerWidthClass}
                   bg-white/95 dark:bg-slate-900/95 
                   backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 
                   dark:supports-[backdrop-filter]:bg-slate-900/80
                   text-slate-800 dark:text-white`}
        aria-label="Ana Menü"
      >
        {/* Modern glassmorphism effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/10 to-purple-50/30 dark:from-slate-800/20 dark:via-slate-900/10 dark:to-blue-900/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-white/10 dark:from-transparent dark:via-slate-800/5 dark:to-slate-700/10" />
        <div className="relative z-10 h-full flex flex-col">
          {/* Header */}
          <div className={`flex items-center justify-between border-b 
                         border-slate-200/30 dark:border-slate-700/50 
                         flex-shrink-0 h-16 backdrop-blur-sm
                         ${isCollapsed && window.innerWidth >= 768 ? 'px-3' : 'px-5'}`}>
            
            {/* Logo with modern styling */}
            {(!isCollapsed || window.innerWidth < 768) && (
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center space-x-2 group"
              >
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                  <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity duration-300">
                  WebsaChat
                </span>
              </Link>
            )}

            {/* Control buttons */}
            <div className={`flex items-center ${isCollapsed && window.innerWidth >= 768 ? 'w-full justify-center' : ''}`}>
              {/* Desktop collapse/expand button */}
              <button
                onClick={handleToggleCollapse}
                className={`p-2 rounded-xl transition-all duration-300
                           text-slate-500 dark:text-slate-400 
                           hover:bg-slate-200/70 dark:hover:bg-slate-700/50 
                           hover:text-slate-700 dark:hover:text-white hover:scale-105
                           focus:outline-none focus:ring-2 focus:ring-blue-500/30
                           ${window.innerWidth < 768 ? 'hidden' : 'flex'}`}
                aria-label={isCollapsed ? 'Menüyü genişlet' : 'Menüyü daralt'}
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              {/* Mobile close button */}
              <button
                onClick={onClose}
                className={`p-2 rounded-xl transition-all duration-300
                           text-slate-500 dark:text-slate-400 
                           hover:bg-red-100 dark:hover:bg-red-500/20 
                           hover:text-red-500 dark:hover:text-red-300 hover:rotate-90
                           focus:outline-none focus:ring-2 focus:ring-red-500/30
                           ${window.innerWidth >= 768 ? 'hidden' : 'flex'}`}
                aria-label="Menüyü kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Profile, Navigation ve Bottom Actions kısımları aynı kalacak */}
          {/* ... (geri kalan tüm kod aynı) ... */}
           {/* User Profile Section */}
          {user && (
            <div className={`border-b border-slate-200/30 dark:border-slate-700/50 
                           flex-shrink-0
                           ${isCollapsed && window.innerWidth >= 768 ? 'px-3 py-4' : 'px-5 py-5'}`}>
              <div className={`${isCollapsed && window.innerWidth >= 768 ? 'flex flex-col items-center' : 'text-center'}`}>
                <Link
                  href={profileHref}
                  className="block group relative mb-2 sm:mb-3 hover:scale-105 transition-transform duration-300"
                  onClick={onClose}
                  title={(isCollapsed && window.innerWidth >= 768 && user) ? (user.nickname || user.username || '') : undefined}
                >
                  <div className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-75 group-hover:opacity-100 transition duration-300 blur-sm"></div>
                    <div className="relative">
                      {user.profilePictureUrl ? (
                        <Image
                        src={user.profilePictureUrl}
                          alt={`${user.nickname || user.username || ''}'s avatar`}
                          width={isCollapsed && window.innerWidth >= 768 ? 36 : 48}
                          height={isCollapsed && window.innerWidth >= 768 ? 36 : 48}
                          className={`rounded-full object-cover ring-2 ring-white dark:ring-slate-800 
                                     ${isCollapsed && window.innerWidth >= 768 ? 'w-9 h-9' : 'w-12 h-12 sm:w-16 sm:h-16 mx-auto'}`}
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
                        className={`default-avatar rounded-full ring-2 ring-white dark:ring-slate-800 
                                   bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700
                                   flex items-center justify-center
                                   ${isCollapsed && window.innerWidth >= 768 ? 'w-9 h-9' : 'w-12 h-12 sm:w-16 sm:h-16 mx-auto'}
                                   ${user.profilePictureUrl ? 'hidden' : 'flex'}`}
                      >
                        <User className={`text-slate-500 dark:text-slate-400 ${isCollapsed && window.innerWidth >= 768 ? 'w-4 h-4' : 'w-6 h-6 sm:w-8 sm:h-8'}`} />
                      </div>
                      
                      <div className={`absolute -bottom-1 -right-1 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full flex items-center justify-center 
                                     ${isCollapsed && window.innerWidth >= 768 ? 'w-4 h-4' : 'w-4 h-4 sm:w-5 sm:h-5'}`}>
                        <div className={`bg-green-400 rounded-full animate-pulse ${isCollapsed && window.innerWidth >= 768 ? 'w-2 h-2' : 'w-2 h-2 sm:w-2.5 sm:h-2.5'}`}></div>
                      </div>
                    </div>
                  </div>
                </Link>

                {(!isCollapsed || window.innerWidth < 768) && (
                  <div className="space-y-2 sm:space-y-3">
                    <div>
                      <div className="flex items-center justify-center space-x-2">
                        <h2 className="text-md sm:text-lg font-bold text-slate-900 dark:text-white truncate">
                          {user.nickname || user.username}
                        </h2>
                        <div className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full">
                          <span className="text-xs font-medium text-white">
                            Lv.{user.level || 1}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center space-x-4">
                      <div className="flex items-center space-x-1.5 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-1 rounded-lg">
                        <Coins className="w-3.5 h-3.5 text-yellow-500" />
                        <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">{user.coins || 0}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 rounded-lg">
                        <Gem className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs font-medium text-blue-700 dark:text-blue-400">{user.diamonds || 0}</span>
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
            <div className="space-y-2">
              {menuItemsConfig.map((item) => {
                const isActive = router.pathname === item.href || (item.href !== '/' && router.pathname.startsWith(item.href));
                return (
                  <div key={item.name} className="relative group">
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center transition-all duration-300 rounded-2xl relative overflow-hidden
                                 ${isCollapsed && window.innerWidth >= 768 ? 'justify-center p-3' : 'px-4 py-3.5'}
                                 ${isActive 
                                   ? `bg-gradient-to-r ${item.gradient} text-white shadow-xl shadow-blue-500/25 transform scale-[1.02] border border-white/20` 
                                   : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-700/60 hover:text-slate-900 dark:hover:text-white backdrop-blur-sm'
                                 }
                                 hover:scale-[1.02] hover:shadow-lg group`}
                      title={isCollapsed && window.innerWidth >= 768 ? item.name : undefined}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
                      )}
                      
                      <div className={`relative flex items-center justify-center rounded-lg p-1.5
                                     ${isActive ? 'bg-white/20' : 'bg-slate-100/50 dark:bg-slate-600/30 group-hover:bg-slate-200/70 dark:group-hover:bg-slate-600/50'}
                                     transition-all duration-300`}>
                        <item.icon 
                          className={`flex-shrink-0 transition-all duration-300
                                     ${isCollapsed && window.innerWidth >= 768 ? 'w-5 h-5' : 'w-5 h-5'}
                                     ${isActive ? 'text-white' : item.color}`} 
                        />
                      </div>
                      
                      {(!isCollapsed || window.innerWidth < 768) && (
                        <span className={`ml-3 font-semibold transition-all duration-300 relative
                                         ${isActive ? 'text-white' : ''}`}>
                          {item.name}
                        </span>
                      )}
                      
                      {/* Hover effect */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%]"></div>
                      )}
                    </Link>
                    
                    {/* Enhanced tooltip for collapsed state */}
                    {isCollapsed && window.innerWidth >= 768 && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-slate-900/95 dark:bg-slate-700/95 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm border border-slate-700/50 shadow-xl">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-slate-900/95 dark:bg-slate-700/95 rotate-45 border-l border-b border-slate-700/50"></div>
                        {item.name}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* Bottom Actions */}
          {user && (
            <div className={`border-t border-slate-200/30 dark:border-slate-700/50 
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
                    <Settings className={`w-5 h-5 group-hover:rotate-90 transition-transform duration-300 flex-shrink-0 ${router.pathname.startsWith('/settings') ? 'text-slate-700 dark:text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-white'}`} />
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
                    <LogOut className="w-5 h-5 group-hover:translate-x-0.5 transition-transform duration-200 flex-shrink-0" />
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
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100, 116, 139, 0.3); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(100, 116, 139, 0.5); }
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: rgba(100, 116, 139, 0.3) transparent; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(71, 85, 105, 0.4); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(71, 85, 105, 0.6); }
        .dark .custom-scrollbar { scrollbar-color: rgba(71, 85, 105, 0.4) transparent; }
      `}</style>
    </>
  );
};

export default Drawer;