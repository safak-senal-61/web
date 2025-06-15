import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { ThemeProvider } from '../contexts/ThemeContext';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import React, { useEffect, ReactNode, useState } from 'react';

// AuthGuard bileşeni aynı kalabilir.
const AuthGuard: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // AuthContext hala ilk oturumu kontrol ediyorsa bekle.
    if (isLoading) {
      return;
    }

    // Yükleme bittiğinde, kullanıcı giriş yapmamışsa login sayfasına yönlendir.
    if (!isAuthenticated) {
      router.replace('/login'); // Geçmişe eklemeden yönlendir.
    }
    
  }, [isLoading, isAuthenticated, router]);

  // Yükleme tamamlandıysa VE kullanıcı giriş yapmışsa, korumalı içeriği göster.
  if (!isLoading && isAuthenticated) {
    return <>{children}</>;
  }

  // Diğer tüm durumlarda (ilk yükleme anı veya yönlendirme öncesi),
  // genel bir yükleme ekranı göster. Bu, erken yönlendirmeyi önler.
  return (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
};

// ClientOnly bileşeni aynı kalabilir.
const ClientOnly: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) {
    return null;
  }
  return <>{children}</>;
};

// Ana AppProps tipimiz
interface AppPageProps extends AppProps {
  Component: AppProps['Component'] & {
    isPublic?: boolean;
  };
}

// DÜZELTME 1: AppContent için yeni, daha spesifik bir prop tipi oluşturuyoruz.
// Bu tip, router'ı prop olarak BEKLEMEZ.
interface AppContentProps {
  Component: AppPageProps['Component'];
  pageProps: Record<string, unknown>;
}

// AppContent bileşeni, hangi sayfanın render edileceğine karar verir.
const AppContent: React.FC<AppContentProps> = ({ Component, pageProps }) => {
  // router'ı prop olarak almak yerine, hook ile kendi içinde oluşturur.
  const router = useRouter();

  const PUBLIC_PATHS = ['/welcome', '/login', '/register'];
  const isPublicPage = PUBLIC_PATHS.includes(router.pathname) || Component.isPublic === true;

  // PUBLIC SAYFALAR İÇİN RENDER BLOĞU
  if (isPublicPage) {
    return (
        <div className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Component {...pageProps} />
        </div>
    );
  }

  // KORUMALI SAYFALAR İÇİN RENDER BLOĞU
  return (
    <div className="min-h-screen overflow-x-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Layout>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </Layout>
    </div>
  );
}

// MyApp artık sadece Provider'ları ayarlıyor.
function MyApp({ Component, pageProps }: AppPageProps) {
  return (
    <>
      <Head>
        <title>WebsaChat</title>
        <meta name="description" content="WebsaChat Platformu" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ClientOnly>
        <ThemeProvider>
          <AuthProvider>
            {/* DÜZELTME 2: Artık bu çağrı, AppContent'in beklediği prop'larla eşleşiyor. */}
            <AppContent Component={Component} pageProps={pageProps} />
          </AuthProvider>
        </ThemeProvider>
      </ClientOnly>
    </>
  );
}

export default MyApp;