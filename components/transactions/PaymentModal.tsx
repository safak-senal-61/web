// components/transactions/PaymentModal.tsx

import React, { useEffect, useRef } from 'react';
import { FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  paymentHtml: string | null;
  isLoading: boolean;
  error: string | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onOpenChange, paymentHtml, isLoading, error }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!paymentHtml || !iframeRef.current) return;

    const iframe = iframeRef.current;
    
    // Iframe yüklendiğinde çalışacak fonksiyon
    const handleIframeLoad = () => {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!iframeDoc) return;

        // Ödeme başarılı olduğunda popup'ı kapatma
        const checkPaymentStatus = () => {
          // Iyzico başarı sayfası kontrolü
          const successElements = iframeDoc.querySelectorAll('[class*="success"], [class*="Success"], [id*="success"], [id*="Success"]');
          const urlCheck = iframe.contentWindow?.location.href?.includes('success') || 
                          iframe.contentWindow?.location.href?.includes('callback');
          
          // Başarılı ödeme mesajı kontrolü
          const bodyText = iframeDoc.body?.textContent?.toLowerCase() || '';
          const successKeywords = ['başarılı', 'success', 'tamamlandı', 'completed', 'onaylandı', 'approved'];
          const hasSuccessText = successKeywords.some(keyword => bodyText.includes(keyword));
          
          if (successElements.length > 0 || urlCheck || hasSuccessText) {
            // 3 saniye bekleyip modalı kapat
            setTimeout(() => {
              onOpenChange(false);
            }, 3000);
          }
        };

        // Sayfa değişikliklerini izleme
        const observer = new MutationObserver(checkPaymentStatus);
        observer.observe(iframeDoc.body, { 
          childList: true, 
          subtree: true, 
          attributes: true,
          attributeFilter: ['class', 'id']
        });

        // URL değişikliklerini izleme
        const checkUrlChange = setInterval(() => {
          try {
            checkPaymentStatus();
          } catch (e) {
            // Cross-origin hatalarını sessizce yakala
          }
        }, 1000);

        // Cleanup fonksiyonu
        return () => {
          observer.disconnect();
          clearInterval(checkUrlChange);
        };

      } catch (error) {
        console.warn('Iframe içeriğine erişim hatası:', error);
      }
    };

    // Iframe load event listener
    iframe.addEventListener('load', handleIframeLoad);

    return () => {
      iframe.removeEventListener('load', handleIframeLoad);
    };
  }, [paymentHtml, onOpenChange]);

  // Modal açık değilse hiçbir şey render etme
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Kapatma butonu */}
      <button
        onClick={() => onOpenChange(false)}
        className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-900 text-white rounded-full p-2 shadow-lg transition-colors"
        aria-label="Kapat"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {isLoading && (
        <div className="flex flex-col justify-center items-center h-full bg-white">
          <FaSpinner className="animate-spin h-12 w-12 text-blue-500" />
          <p className="mt-4 text-slate-600 font-medium text-lg">Ödeme formu yükleniyor...</p>
        </div>
      )}
      
      {error && !isLoading && (
        <div className="flex flex-col justify-center items-center h-full p-4 text-center bg-white">
          <FaExclamationTriangle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-slate-800">Bir Hata Oluştu</h3>
          <p className="text-slate-600 mt-2 text-lg">{error}</p>
        </div>
      )}
      
      {!isLoading && paymentHtml && (
        <iframe
          ref={iframeRef}
          srcDoc={paymentHtml}
          title="Iyzico Ödeme Formu"
          className="w-full h-full border-0"
          sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups allow-modals"
        />
      )}
    </div>
  );
};

export default PaymentModal;