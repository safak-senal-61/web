// components/admin/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FaUsers, 
  FaGamepad, 
  FaGift, 
  FaChartLine, 
  FaDollarSign, 
  FaExclamationTriangle,
  FaEye,
  FaCog,
  FaSignOutAlt
} from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

interface DashboardStats {
  totalUsers: number;
  totalGames: number;
  totalGifts: number;
  totalRevenue: number;
  activeStreams: number;
  pendingReports: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGames: 0,
    totalGifts: 0,
    totalRevenue: 0,
    activeStreams: 0,
    pendingReports: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { logout, user } = useAuth();

  useEffect(() => {
    // Simulated data loading - replace with actual API calls
    const loadDashboardData = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setStats({
          totalUsers: 1247,
          totalGames: 156,
          totalGifts: 89,
          totalRevenue: 45230,
          activeStreams: 23,
          pendingReports: 7
        });
      } catch (error) {
        console.error('Dashboard verisi yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  const StatCard = ({ title, value, icon: Icon, color, trend }: {
    title: string;
    value: number | string;
    icon: React.ComponentType<any>;
    color: string;
    trend?: string;
  }) => (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
            {trend && (
              <p className="text-green-400 text-xs mt-1">{trend}</p>
            )}
          </div>
          <div className={`p-3 rounded-full ${color}`}>
            <Icon className="text-white text-xl" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, icon: Icon, onClick, color }: {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    onClick: () => void;
    color: string;
  }) => (
    <Card className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all cursor-pointer group" onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${color} group-hover:scale-110 transition-transform`}>
            <Icon className="text-white text-lg" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{title}</h3>
            <p className="text-slate-400 text-sm">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400">Hoş geldiniz, {user?.username || 'Admin'}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-green-400 border-green-400">
              Çevrimiçi
            </Badge>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <FaSignOutAlt className="mr-2" />
              Çıkış
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <StatCard
            title="Toplam Kullanıcı"
            value={stats.totalUsers.toLocaleString()}
            icon={FaUsers}
            color="bg-blue-600"
            trend="+12% bu ay"
          />
          <StatCard
            title="Oyunlar"
            value={stats.totalGames}
            icon={FaGamepad}
            color="bg-green-600"
            trend="+5 yeni"
          />
          <StatCard
            title="Hediyeler"
            value={stats.totalGifts}
            icon={FaGift}
            color="bg-purple-600"
            trend="+8 bu hafta"
          />
          <StatCard
            title="Gelir"
            value={`₺${stats.totalRevenue.toLocaleString()}`}
            icon={FaDollarSign}
            color="bg-yellow-600"
            trend="+18% bu ay"
          />
          <StatCard
            title="Aktif Yayınlar"
            value={stats.activeStreams}
            icon={FaChartLine}
            color="bg-red-600"
          />
          <StatCard
            title="Bekleyen Raporlar"
            value={stats.pendingReports}
            icon={FaExclamationTriangle}
            color="bg-orange-600"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Hızlı İşlemler</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              title="Kullanıcı Yönetimi"
              description="Kullanıcıları görüntüle ve yönet"
              icon={FaUsers}
              onClick={() => router.push('/admin/users')}
              color="bg-blue-600"
            />
            <QuickActionCard
              title="Oyun Yönetimi"
              description="Oyunları ekle, düzenle, sil"
              icon={FaGamepad}
              onClick={() => router.push('/admin/games')}
              color="bg-green-600"
            />
            <QuickActionCard
              title="Hediye Yönetimi"
              description="Hediyeleri yönet"
              icon={FaGift}
              onClick={() => router.push('/admin/gifts')}
              color="bg-purple-600"
            />
            <QuickActionCard
              title="Raporları İncele"
              description="Kullanıcı raporlarını kontrol et"
              icon={FaEye}
              onClick={() => router.push('/admin/reports')}
              color="bg-orange-600"
            />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Son Aktiviteler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: 'Yeni kullanıcı kaydı', user: 'john_doe', time: '5 dakika önce' },
                  { action: 'Oyun eklendi', user: 'admin', time: '1 saat önce' },
                  { action: 'Rapor gönderildi', user: 'user123', time: '2 saat önce' },
                  { action: 'Hediye satın alındı', user: 'gamer_girl', time: '3 saat önce' }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-b-0">
                    <div>
                      <p className="text-white text-sm">{activity.action}</p>
                      <p className="text-slate-400 text-xs">Kullanıcı: {activity.user}</p>
                    </div>
                    <p className="text-slate-400 text-xs">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Sistem Durumu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { service: 'API Sunucusu', status: 'Çevrimiçi', color: 'bg-green-500' },
                  { service: 'Veritabanı', status: 'Çevrimiçi', color: 'bg-green-500' },
                  { service: 'Ödeme Sistemi', status: 'Çevrimiçi', color: 'bg-green-500' },
                  { service: 'Yayın Sunucusu', status: 'Bakımda', color: 'bg-yellow-500' }
                ].map((service, index) => (
                  <div key={index} className="flex items-center justify-between py-2">
                    <p className="text-white text-sm">{service.service}</p>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${service.color}`}></div>
                      <p className="text-slate-400 text-xs">{service.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;