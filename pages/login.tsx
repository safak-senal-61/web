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
  
  // URL'den gelen mesajı kontrol et
  const message = router.query.message as string;

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
        <div className="w-full max-w-md">
          {/* Session expired mesajı */}
          {message === 'session-expired' && (
            <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Oturum süreniz doldu. Lütfen tekrar giriş yapın.
                  </p>
                </div>
              </div>
            </div>
          )}
          <LoginForm />
        </div>
      </div>
    </>
  );
};

LoginPage.isPublic = true;
export default LoginPage;