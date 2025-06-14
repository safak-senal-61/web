// pages/login.tsx
import LoginForm from '../components/auth/LoginForm'; // LoginForm component'inizin yolu
import Head from 'next/head';
import { useAuth } from '../hooks/useAuth'; // Kendi useAuth hook'unuzun yolu
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa'; // Yükleme ikonu için react-icons'tan

const LoginPage = () => {
  const { isAuthenticated, isLoading: authContextIsLoading } = useAuth(); // AuthContext'ten gelen state'ler
  const router = useRouter();

  useEffect(() => {
    console.log(`%c[LoginPage] useEffect - authContextIsLoading: ${authContextIsLoading}, isAuthenticated: ${isAuthenticated}`, "color: sienna;");
    if (!authContextIsLoading && isAuthenticated) {
      // Bu, kullanıcı zaten login ise ve /login sayfasına manuel gelirse onu /home'a atar.
      // Login işlemi sonrası için DEĞİL.
      console.log(`%c[LoginPage] User ALREADY AUTHENTICATED and on /login. Redirecting to /home.`, "color: sienna; font-weight: bold;");
      router.push('/home');
    }
  }, [isAuthenticated, authContextIsLoading, router]); // Bağımlılıklar: bu değerler değiştiğinde useEffect tekrar çalışır

  // --- RENDER KISMI ---

  // Durum 1: AuthContext hala ilk oturum kontrolünü yapıyor.
  if (authContextIsLoading) {
    console.log("%c[LoginPage] Rendering 'Oturum kontrol ediliyor...' (because authContextIsLoading is true)", "color: sienna;");
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-white dark:bg-slate-900">
        <FaSpinner className="animate-spin h-10 w-10 text-blue-500 dark:text-blue-400 mb-4" />
        <p className="text-slate-700 dark:text-slate-300 text-lg">Oturum kontrol ediliyor...</p>
      </div>
    );
  }

  // Durum 2: AuthContext yüklenmesi bitti VE kullanıcı giriş yapmış (isAuthenticated true).
  // Bu durumda yukarıdaki useEffect kullanıcıyı yönlendirecek. Yönlendirme gerçekleşene kadar bu UI gösterilir.
  if (isAuthenticated) {
    console.log("%c[LoginPage] Rendering 'Ana sayfaya yönlendiriliyorsunuz...' (because isAuthenticated is true and authContextIsLoading is false)", "color: sienna;");
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4 bg-white dark:bg-slate-900">
        <FaSpinner className="animate-spin h-10 w-10 text-blue-500 dark:text-blue-400 mb-4" />
        <p className="text-slate-700 dark:text-slate-300 text-lg">Ana sayfaya yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  // Durum 3: AuthContext yüklenmesi bitti VE kullanıcı giriş yapmamış (isAuthenticated false).
  // Bu durumda LoginForm gösterilir.
  console.log("%c[LoginPage] Rendering LoginForm component (auth loading finished, user not authenticated).", "color: sienna; font-weight: bold;");
  return (
    <>
      <Head>
        <title>Giriş Yap - WebsaChat</title>
        <meta name="description" content="WebsaChat'e giriş yapın veya yeni bir hesap oluşturun." />
        {/* Next.js otomatik olarak viewport meta tag'ini ekler ama isterseniz burada da belirtebilirsiniz */}
        {/* <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" /> */}
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>
      {/* Login sayfasının ana sarmalayıcısı ve arka planı */}
      <div className="flex justify-center items-center min-h-screen p-4 sm:p-6 md:p-8 
                     bg-gradient-to-br from-slate-100 via-sky-50 to-blue-100
                     dark:from-slate-900 dark:via-blue-900 dark:to-slate-800">
        <LoginForm />
      </div>
    </>
  );
};

// Bu sayfanın _app.tsx tarafından public olarak tanınmasını sağlar.
LoginPage.isPublic = true;
export default LoginPage;