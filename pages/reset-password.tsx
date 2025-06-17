// pages/reset-password.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import ResetPasswordForm from '../components/auth/ResetPasswordForm';
import { validateResetToken } from '../services/authService';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

const ResetPasswordPage = () => {
  const router = useRouter();
  const { token } = router.query;

  const [isTokenValid, setIsTokenValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!router.isReady) return; // router.query'nin dolu olduğundan emin ol

    const tokenString = Array.isArray(token) ? token[0] : token;

    if (!tokenString) {
      setErrorMessage('Geçersiz veya eksik sıfırlama linki.');
      setIsLoading(false);
      return;
    }

    const checkToken = async () => {
      const result = await validateResetToken(tokenString);
      if (result.basarili) {
        setIsTokenValid(true);
      } else {
        setErrorMessage(result.mesaj);
      }
      setIsLoading(false);
    };

    checkToken();
  }, [router.isReady, token]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center text-white">
          <FaSpinner className="w-8 h-8 mx-auto animate-spin mb-4" />
          <p>Token doğrulanıyor...</p>
        </div>
      );
    }
    if (errorMessage) {
      return (
         <div className="bg-red-500/10 border border-red-400/30 text-red-300 p-6 rounded-xl text-center max-w-sm mx-auto">
              <FaExclamationTriangle className="w-8 h-8 mx-auto mb-4 text-red-400"/>
              <h2 className="font-bold mb-2">Hata</h2>
              <p className="text-sm mb-4">{errorMessage}</p>
              <Link href="/forgot-password" legacyBehavior>
                <a className="text-sm text-blue-400 hover:underline">Yeni bir link talep et</a>
              </Link>
          </div>
      )
    }
    if (isTokenValid) {
      return <ResetPasswordForm token={token as string} />;
    }
    return null;
  };


  return (
    <>
      <Head>
        <title>Şifre Sıfırla - WebsaChat</title>
      </Head>
      <div className="flex justify-center items-center min-h-screen p-5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        {renderContent()}
      </div>
    </>
  );
};

ResetPasswordPage.isPublic = true;
export default ResetPasswordPage;