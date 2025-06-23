// components/admin/AdminLayout.tsx

import React from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../hooks/useAuth';
import { useRouter } from 'next/router';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    React.useEffect(() => {
        if (!isLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/login?redirect=' + router.pathname);
        }
    }, [user, isLoading, router]);

    if (isLoading || !user || user.role !== 'ADMIN') {
        return (
            <div className="flex justify-center items-center h-screen bg-slate-900 text-white">
                Yetkiniz kontrol ediliyor...
            </div>
        );
    }

  return (
    <div className="flex h-screen bg-slate-900">
      <AdminSidebar />
      <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;