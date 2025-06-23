// components/admin/AdminSidebar.tsx

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaTachometerAlt, FaUsers, FaGamepad, FaGift, FaExclamationTriangle, FaBullhorn } from 'react-icons/fa';

const menuItems = [
    { href: '/admin', label: 'Dashboard', icon: FaTachometerAlt },
    { href: '/admin/users', label: 'Kullanıcılar', icon: FaUsers },
    { href: '/admin/games', label: 'Oyun Yönetimi', icon: FaGamepad },
    { href: '/admin/gifts', label: 'Hediye Yönetimi', icon: FaGift }, // <-- BU SATIR EKLENDİ
    { href: '/admin/reports', label: 'Raporlar', icon: FaExclamationTriangle },
    { href: '/admin/announcements', label: 'Duyurular', icon: FaBullhorn },
];

const AdminSidebar: React.FC = () => {
  const router = useRouter();

  return (
    <aside className="w-64 bg-slate-800 text-slate-200 flex flex-col p-4 border-r border-slate-700">
      <div className="text-2xl font-bold text-white p-4 text-center">Admin Paneli</div>
      <nav className="flex-1 mt-6">
        <ul>
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={`flex items-center gap-3 px-4 py-3 my-1 rounded-lg transition-colors ${
                  router.pathname === item.href
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-slate-700 hover:text-white'
                }`}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 text-center text-xs text-slate-500">
        WebsaChat &copy; {new Date().getFullYear()}
      </div>
    </aside>
  );
};

export default AdminSidebar;