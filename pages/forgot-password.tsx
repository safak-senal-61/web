// pages/forgot-password.tsx
import Head from 'next/head';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';

const ForgotPasswordPage = () => {
  return (
    <>
      <Head>
        <title>Şifremi Unuttum - WebsaChat</title>
        <meta name="description" content="WebsaChat şifre sıfırlama" />
      </Head>
      <div className="flex justify-center items-center min-h-screen p-5 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <ForgotPasswordForm />
      </div>
    </>
  );
};

ForgotPasswordPage.isPublic = true; // _app.tsx'in bu sayfayı korumamasını sağlar
export default ForgotPasswordPage;