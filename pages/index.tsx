// pages/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../hooks/useAuth'; // Doğru import yolu

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Kullanıcı giriş yapmışsa home sayfasına yönlendir
        router.replace('/home');
      } else {
        // Kullanıcı giriş yapmamışsa welcome (landing) sayfasına yönlendir
        router.replace('/welcome');
      }
    }
  }, [user, isLoading, isAuthenticated, router]);

  // Loading göstergesi - AuthContext yüklenirken gösterilir
  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-slate-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
      </div>
    </div>
  );
}

// Bu sayfa public olarak işaretlenmeli ki AuthGuard çalışmasın
HomePage.isPublic = true;