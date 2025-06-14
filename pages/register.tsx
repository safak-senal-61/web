// pages/register.tsx
import RegisterForm from '../components/auth/RegisterForm';
import Head from 'next/head';
import { useAuth } from '../hooks/useAuth'; // Giriş yapmış kullanıcıyı yönlendirmek için
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const RegisterPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Eğer kullanıcı zaten giriş yapmışsa, ana sayfaya yönlendir
  useEffect(() => {
    if (!isLoading && user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Yükleme sırasında veya kullanıcı zaten giriş yapmışsa "Yönlendiriliyor..." göster
  if (isLoading || (!isLoading && user)) {
    return (
      <div className="flex justify-center items-center min-h-screen p-5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <p className="text-white">Yönlendiriliyor...</p>
      </div>
    );
  }

  // Kullanıcı giriş yapmamışsa ve yükleme bittiyse kayıt formunu göster
  return (
    <>
      <Head>
        <title>Kayıt Ol - WebsaChat</title>
        <meta name="description" content="WebsaChat'e yeni bir hesap oluşturun" />
      </Head>
      {/* Arka plan ve ortalama login sayfasıyla aynı */}
      <div className="flex justify-center items-center min-h-screen p-5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <RegisterForm />
      </div>
    </>
  );
};

export default RegisterPage;