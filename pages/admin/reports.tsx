// pages/admin/reports.tsx

import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { getAllReports } from '@/services/adminService';
import { Report } from '@/types/adminTypes';
import { FaSpinner } from 'react-icons/fa';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const statusStyles = {
    PENDING: 'bg-yellow-500/20 text-yellow-400',
    RESOLVED: 'bg-green-500/20 text-green-400',
    REVIEWED_ACCEPTED: 'bg-blue-500/20 text-blue-400',
    REVIEWED_REJECTED: 'bg-gray-500/20 text-gray-400',
};

const ReportsAdminPage = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        const response = await getAllReports({ limit: 50 }); // Son 50 raporu al
        if (response.basarili && response.veri) {
            setReports(response.veri.raporlar);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <AdminLayout>
            <h1 className="text-3xl font-bold text-white mb-6">Kullanıcı Raporları</h1>
            
            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <FaSpinner className="animate-spin text-white h-8 w-8" />
                </div>
            ) : (
                <div className="bg-slate-800 border border-slate-700 rounded-2xl">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-slate-700/50 text-xs uppercase">
                            <tr>
                                <th className="p-4">Raporlayan</th>
                                <th className="p-4">Raporlanan</th>
                                <th className="p-4">Sebep</th>
                                <th className="p-4">Tarih</th>
                                <th className="p-4">Durum</th>
                                <th className="p-4">İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.map((report) => (
                                <tr key={report.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                                    <td className="p-4 font-medium text-white">{report.reporter.username}</td>
                                    <td className="p-4 font-medium text-white">{report.reportedUser?.username || 'N/A'}</td>
                                    <td className="p-4">{report.reason}</td>
                                    <td className="p-4">{format(new Date(report.createdAt), 'dd MMM yyyy, HH:mm', { locale: tr })}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[report.status]}`}>
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <button className="text-blue-400 hover:underline">Detay</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AdminLayout>
    );
};

export default ReportsAdminPage;