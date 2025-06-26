// pages/admin/index.tsx

import React from 'react';
import Head from 'next/head';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const AdminDashboardPage: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login');
    } else if (!isLoading && isAuthenticated && user?.role !== 'ADMIN') {
      // Kullanıcı giriş yapmış ama admin değil
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return null; // Redirect will happen in useEffect
  }

  return (
    <>
      <Head>
        <title>Admin Dashboard | Gaming Platform</title>
        <meta name="description" content="Yönetici paneli ana sayfası" />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminDashboard />
    </>
  );
};



export default AdminDashboardPage;