// pages/admin/index.tsx

import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';

const AdminDashboardPage = () => {
  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat Kartları (Örnek) */}
        <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-400 text-sm">Toplam Kullanıcı</h3>
            <p className="text-3xl font-bold text-white">1,234</p>
        </div>
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-400 text-sm">Aktif Yayın</h3>
            <p className="text-3xl font-bold text-white">15</p>
        </div>
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-400 text-sm">Bekleyen Rapor</h3>
            <p className="text-3xl font-bold text-red-400">5</p>
        </div>
         <div className="bg-slate-800 p-6 rounded-xl border border-slate-700">
            <h3 className="text-slate-400 text-sm">Günlük Gelir</h3>
            <p className="text-3xl font-bold text-green-400">₺1,250</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;