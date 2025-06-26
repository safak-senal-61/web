// pages/admin/login.tsx

import React from 'react';
import Head from 'next/head';
import AdminLoginForm from '@/components/admin/AdminLoginForm';

const AdminLoginPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Admin Girişi | Gaming Platform</title>
        <meta name="description" content="Yönetici paneli giriş sayfası" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <AdminLoginForm />
      </div>
    </>
  );
};



export default AdminLoginPage;