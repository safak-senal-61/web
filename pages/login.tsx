// pages/login.tsx
import LoginForm from '../components/auth/LoginForm';
import Head from 'next/head';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoginPage = () => {
  const { isAuthenticated, isLoading: authContextIsLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // AuthContext'in yüklenmesi bitene ve isAuthenticated durumu netleşene kadar bekle
    if (!authContextIsLoading && isAuthenticated) {
      const redirectPath = (router.query.redirect as string) || '/home';
      router.push(redirectPath);
    }
  }, [isAuthenticated, authContextIsLoading, router]);

  // --- Render Kısmındaki Düzeltme ---
  // Yükleme devam ediyorsa veya yüklendikten sonra kullanıcı giriş yapmışsa (yönlendirme bekleniyor)
  // tam sayfa bir yükleme ekranı göster. Bu, LoginForm'un gereksiz yere render edilmesini önler.
  if (authContextIsLoading || isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-white dark:bg-slate-900">
        <FaSpinner className="animate-spin h-10 w-10 text-blue-500 dark:text-blue-400 mb-4" />
        <p className="text-slate-700 dark:text-slate-300 text-lg">
          {authContextIsLoading ? 'Oturum kontrol ediliyor...' : 'Ana sayfaya yönlendiriliyorsunuz...'}
        </p>
      </div>
    );
  }

  // Sadece yükleme bittiğinde VE kullanıcı giriş yapmamışsa LoginForm'u göster.
  return (
    <>
      <Head>
        <title>Giriş Yap - WebsaChat</title>
        <meta name="description" content="WebsaChat'e giriş yapın veya yeni bir hesap oluşturun." />
      </Head>
      <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8 
                     bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100
                     dark:from-slate-900 dark:via-blue-900 dark:to-slate-800">
        <LoginForm />
      </div>
    </>
  );
};

LoginPage.isPublic = true;
export default LoginPage;