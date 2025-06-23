// pages/payment/failed.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaTimesCircle, FaSpinner } from 'react-icons/fa';

export default function PaymentFailedPage() {
    const router = useRouter();
    const { reason } = router.query;
    const [isClient, setIsClient] = useState(false);

    // Bu useEffect, bileşenin sadece tarayıcıya yüklendiğinde çalışır.
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Sunucuda veya ilk hidrasyon sırasında bir yükleme ekranı göster.
    // Bu, sunucu ve istemci HTML'inin her zaman aynı olmasını garanti eder.
    if (!isClient) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
                <FaSpinner className="w-20 h-20 text-blue-400 animate-spin" />
            </div>
        );
    }

    // Bileşen tarayıcıya yüklendikten sonra asıl içeriği göster.
    // Bu aşamada router.query gibi tarayıcıya özel bilgilere güvenle erişilebilir.
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4 text-center">
            <FaTimesCircle className="w-20 h-20 text-red-400 mb-6" />
            <h1 className="text-3xl font-bold mb-2">Ödeme Başarısız</h1>
            <p className="text-slate-300 mb-2 max-w-md">
                Ödeme işleminiz tamamlanamadı. Lütfen tekrar deneyin veya farklı bir ödeme yöntemi kullanın.
            </p>
            {reason && (
                <p className="text-xs text-slate-500 bg-black/20 px-2 py-1 rounded-md mb-8">
                    Hata Detayı: {String(reason)}
                </p>
            )}
            <Link 
                href="/transactions" 
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
            >
                Cüzdanıma Geri Dön
            </Link>
        </div>
    );
}

PaymentFailedPage.isPublic = true;