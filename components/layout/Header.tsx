// components/layout/Header.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetClose, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  LogOut,
  User,
  Settings,
  Bell,
  X,
  Sparkles,
  Activity,
  Eye,
  Menu,
} from 'lucide-react';

export function Header() {
  const { user, logout, isLoading: authIsLoading } = useAuth(); // isLoading'i authIsLoading olarak yeniden adlandırdım
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1 && parts[0] && parts[parts.length - 1]) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const notifications = [
    { id: 1, title: "Yeni mesaj", content: "Ahmet size bir mesaj gönderdi", time: "2 dakika önce", unread: true },
    { id: 2, title: "Grup daveti", content: "React Geliştiricileri grubuna davet edildiniz", time: "1 saat önce", unread: true },
    { id: 3, title: "Profil güncellemesi", content: "Profil fotoğrafınız güncellendi", time: "3 saat önce", unread: false },
  ];
  const unreadCount = notifications.filter(n => n.unread).length;

  // Header'ın içeriğini sadece authIsLoading bittikten sonra render et
  // Bu, user null olsa bile Giriş/Kayıt butonlarının görünmesini sağlar, ama kullanıcıya özel kısımlar user varsa görünür.
  const renderHeaderContent = () => {
    if (authIsLoading) {
      // Yükleme sırasında sağ tarafta sadece bir placeholder gösterelim
      return (
        <div className="flex items-center gap-x-2 sm:gap-x-3">
          <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 hidden sm:block"></div> {/* Bildirim placeholder */}
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700"></div> {/* Avatar placeholder */}
          <div className="h-8 w-8 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700 lg:hidden"></div> {/* Mobil menü placeholder */}
        </div>
      );
    }

    // Yükleme bitti, kullanıcı durumuna göre render et
    return (
      <div className="flex items-center gap-x-2 sm:gap-x-3">
        {user ? (
          <>
            {/* Bildirimler (Sadece user varsa) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-slate-600 dark:text-slate-400
                             hover:text-slate-900 dark:hover:text-white
                             hover:bg-slate-200/70 dark:hover:bg-slate-700/50
                             hover:scale-105 transition-all duration-300 rounded-xl"
                >
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Bildirimler</span>
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs
                                      bg-gradient-to-r from-red-500 to-pink-500 text-white
                                      border-2 border-white dark:border-slate-900 animate-pulse">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 sm:w-96 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl
                           border border-slate-200 dark:border-slate-700/50
                           shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-2xl p-0 max-h-[70vh] overflow-hidden"
              >
                {/* ... bildirim içeriği ... */}
                <DropdownMenuLabel className="p-4 border-b border-slate-200 dark:border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800 dark:text-white">Bildirimler</h3>
                    {unreadCount > 0 && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-0.5">
                        {unreadCount} 
                      </Badge>
                    )}
                  </div>
                </DropdownMenuLabel>
                <div className="max-h-64 overflow-y-auto no-scrollbar">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => (
                      <DropdownMenuItem
                        key={notification.id}
                        className="p-4 hover:!bg-slate-100 dark:hover:!bg-slate-700/50 focus:!bg-slate-100 dark:focus:!bg-slate-700/50 cursor-pointer border-b border-slate-200/70 dark:border-slate-700/30 last:border-b-0"
                      >
                        <div className="flex items-start space-x-3 w-full">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${notification.unread ? 'bg-blue-500 dark:bg-blue-400' : 'bg-slate-400 dark:bg-slate-600'}`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-800 dark:text-white truncate">{notification.title}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mt-0.5">{notification.content}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{notification.time}</p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Henüz bildirim yok</p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && <DropdownMenuSeparator className="border-slate-200 dark:border-slate-700/50" />}
                <DropdownMenuItem asChild className="p-0">
                  <Link href="/notifications" className="flex items-center justify-center w-full p-3 text-sm text-blue-600 dark:text-blue-400 hover:!bg-slate-100 dark:hover:!bg-slate-700/50 hover:!text-blue-700 dark:hover:!text-blue-300 focus:!bg-slate-100 dark:focus:!bg-slate-700/50 focus:!text-blue-700 dark:focus:!text-blue-300 transition-colors">
                    <Eye className="w-4 h-4 mr-2" /> Tümünü Görüntüle
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Kullanıcı Avatar Dropdown (Sadece user varsa) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0 hover:scale-105 transition-all duration-300 ring-2 ring-transparent hover:ring-blue-500/30 dark:hover:ring-blue-500/50 focus:ring-blue-500/30 dark:focus:ring-blue-500/50">
                  <Avatar className="h-10 w-10 border-2 border-transparent group-hover:border-blue-500">
                    <AvatarImage src={user.avatarUrl || undefined} alt={user.nickname || user.username || 'Kullanıcı'} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-semibold">
                      {getInitials(user.nickname || user.username)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 dark:bg-green-400 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-64 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl border border-slate-200 dark:border-slate-700/50 shadow-2xl shadow-black/20 dark:shadow-black/50 rounded-2xl p-2"
              >
                {/* ... kullanıcı dropdown içeriği ... */}
                 <DropdownMenuLabel className="font-normal p-3 sm:p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-transparent">
                      <AvatarImage src={user.avatarUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                        {getInitials(user.nickname || user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{user.nickname || user.username}</p>
                      {user.email && <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>}
                      <div className="flex items-center space-x-1 mt-1">
                        <Activity className="w-3 h-3 text-green-500 dark:text-green-400" />
                        <span className="text-xs text-green-600 dark:text-green-400">Aktif</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="border-slate-200/70 dark:border-slate-700/50 my-1.5" />
                <DropdownMenuItem asChild className="text-slate-700 dark:text-slate-300 hover:!bg-slate-100 dark:hover:!bg-slate-700/50 hover:!text-slate-900 dark:hover:!text-white focus:!bg-slate-100 dark:focus:!bg-slate-700/50 focus:!text-slate-900 dark:focus:!text-white cursor-pointer rounded-lg m-1 p-2.5 sm:p-3">
                  <Link href="/profile" className="flex items-center w-full">
                    <User className="mr-2.5 h-4 w-4" /> <span>Profil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="text-slate-700 dark:text-slate-300 hover:!bg-slate-100 dark:hover:!bg-slate-700/50 hover:!text-slate-900 dark:hover:!text-white focus:!bg-slate-100 dark:focus:!bg-slate-700/50 focus:!text-slate-900 dark:focus:!text-white cursor-pointer rounded-lg m-1 p-2.5 sm:p-3">
                  <Link href="/settings" className="flex items-center w-full">
                    <Settings className="mr-2.5 h-4 w-4" /> <span>Ayarlar</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="border-slate-200/70 dark:border-slate-700/50 my-1.5" />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400 hover:!bg-red-100 dark:hover:!bg-red-500/20 hover:!text-red-700 dark:hover:!text-red-300 focus:!bg-red-100 dark:focus:!bg-red-500/20 focus:!text-red-700 dark:focus:!text-red-300 cursor-pointer rounded-lg m-1 p-2.5 sm:p-3">
                  <LogOut className="mr-2.5 h-4 w-4" /> <span>Çıkış Yap</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          // Kullanıcı yoksa Giriş/Kayıt butonları
          <div className="">
          
           
          </div>
        )}

        
     
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b
                     border-slate-200 dark:border-slate-800
                     bg-white/80 dark:bg-slate-900/80
                     backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-slate-900/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="mr-auto flex items-center space-x-3 group"> {/* mr-auto eklendi */}
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
            <div className="relative flex items-center justify-center w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent group-hover:opacity-80 transition-all duration-300">
            WebsaChat
          </span>
        </Link>

        {/* Header içeriğini render et */}
        {renderHeaderContent()}
      </div>
    </header>
  );
}