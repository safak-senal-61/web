import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import Head from 'next/head';
import React from 'react';

// Ana AppProps tipimiz
interface AppPageProps extends AppProps {
  Component: AppProps['Component'] & {
    isPublic?: boolean;
  };
}

// MyApp artık sadece Provider'ları sarmalıyor.
// AuthGuard ve Layout gibi yapılar, zamanlama sorunlarına yol açtığı için kaldırıldı.
// Bu sadeleştirme, kimlik doğrulama akışını daha sağlam hale getirir.
function MyApp({ Component, pageProps }: AppPageProps) {
  return (
    <>
      <Head>
        <title>WebsaChat</title>
        <meta name="description" content="WebsaChat Platformu" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <ThemeProvider>
        <AuthProvider>
          {/*
            Artık bir sarmalayıcı Layout veya AuthGuard yok.
            Her sayfa kendi kimlik denetimini ve düzenini yönetir.
            Bu, özellikle home ve login sayfaları arasındaki geçişi hatasız hale getirir.
          */}
          <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
             <Component {...pageProps} />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;