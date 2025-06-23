// pages/payment/success.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';

export default function PaymentSuccessPage() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // Yönlendirme mantığı sadece tarayıcıda çalışacak
        const timer = setTimeout(() => {
            router.push('/transactions');
        }, 4000);
        return () => clearTimeout(timer);
    }, [router]);

    // Sunucuda veya ilk hidrasyon sırasında yükleme ekranı göster
    if (!isClient) {
        return (
             <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
                <FaSpinner className="w-20 h-20 text-blue-400 animate-spin" />
            </div>
        );
    }

    // Tarayıcıda asıl içeriği göster
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <FaCheckCircle className="w-20 h-20 text-green-400 mb-6 animate-pulse" />
            <h1 className="text-3xl font-bold mb-2">Ödeme Başarılı!</h1>
            <p className="text-slate-300 mb-8">Jetonlarınız hesabınıza eklendi. Yönlendiriliyorsunuz...</p>
            <Link href="/transactions" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors">
                İşlemlerime Git
            </Link>
        </div>
    );
};

PaymentSuccessPage.isPublic = true;