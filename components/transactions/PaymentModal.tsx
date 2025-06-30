// components/transactions/PaymentModal.tsx

import React, { useEffect, useRef } from 'react';
import { FaSpinner, FaExclamationTriangle, FaTimes, FaCreditCard } from 'react-icons/fa';

interface PaymentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  paymentHtml: string | null;
  isLoading: boolean;
  error: string | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onOpenChange, paymentHtml, isLoading, error }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // ESC tuşu ile kapatma ve mobil optimizasyonu
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
""      
      // Mobil cihazlarda body scroll'u tamamen engelle
      const originalStyle = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        width: document.body.style.width,
        height: document.body.style.height,
        touchAction: document.body.style.touchAction
      };
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';
      document.body.style.touchAction = 'none';
      
      // Mobil viewport ayarları - daha agresif
      const viewport = document.querySelector('meta[name=viewport]');
      const originalViewport = viewport?.getAttribute('content');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
      
      // iOS Safari için ek düzeltmeler
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        document.documentElement.style.height = '100%';
        document.documentElement.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        
        // Orijinal stilleri geri yükle
        document.body.style.overflow = originalStyle.overflow;
        document.body.style.position = originalStyle.position;
        document.body.style.width = originalStyle.width;
        document.body.style.height = originalStyle.height;
        document.body.style.touchAction = originalStyle.touchAction;
        
        // Viewport ayarlarını geri al
        if (viewport && originalViewport) {
          viewport.setAttribute('content', originalViewport);
        }
        
        // iOS Safari düzeltmelerini geri al
        if (isIOS) {
          document.documentElement.style.height = '';
          document.documentElement.style.overflow = '';
        }
      };
    }
  }, [isOpen, onOpenChange]);

  // Modal dışına tıklama ile kapatma
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onOpenChange(false);
    }
  };

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
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-0 sm:p-2 md:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div 
        ref={modalRef}
        className="relative w-full h-full sm:w-[98vw] sm:h-[98vh] md:w-[95vw] md:h-[95vh] lg:w-[90vw] lg:h-[90vh] xl:w-[85vw] xl:h-[85vh] bg-white rounded-none sm:rounded-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-2 sm:p-3 md:p-4 lg:p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="p-1 sm:p-1.5 md:p-2 bg-white/20 rounded-lg">
              <FaCreditCard className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold">Güvenli Ödeme</h2>
              <p className="text-xs sm:text-xs md:text-sm text-blue-100">Iyzico ile güvenli ödeme yapın</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 sm:p-1.5 md:p-2 hover:bg-white/20 rounded-lg transition-colors duration-200 group"
            aria-label="Kapat"
          >
            <FaTimes className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="relative flex-1 min-h-0">
          {isLoading && (
            <div className="flex flex-col justify-center items-center h-full bg-gradient-to-br from-blue-50 to-purple-50">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-pulse"></div>
                <FaSpinner className="absolute inset-0 m-auto animate-spin h-8 w-8 text-blue-600" />
              </div>
              <p className="mt-6 text-slate-700 font-medium text-lg">Ödeme formu hazırlanıyor...</p>
              <p className="mt-2 text-slate-500 text-sm">Lütfen bekleyiniz</p>
            </div>
          )}
          
          {error && !isLoading && (
            <div className="flex flex-col justify-center items-center h-full p-6 text-center bg-gradient-to-br from-red-50 to-orange-50">
              <div className="p-4 bg-red-100 rounded-full mb-4">
                <FaExclamationTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">Ödeme Hatası</h3>
              <p className="text-slate-600 text-base max-w-md">{error}</p>
              <button
                onClick={() => onOpenChange(false)}
                className="mt-6 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200"
              >
                Kapat
              </button>
            </div>
          )}
          
          {!isLoading && paymentHtml && (
            <div className="absolute inset-0 overflow-hidden">
              <iframe
                ref={iframeRef}
                srcDoc={paymentHtml}
                title="Iyzico Ödeme Formu"
                className="w-full h-full border-0 bg-white block"
                sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation allow-popups allow-modals allow-pointer-lock allow-downloads"
                style={{ 
                  minHeight: '100%', 
                  minWidth: '100%',
                  transform: 'translateZ(0)',
                  WebkitTransform: 'translateZ(0)',
                  zoom: '1',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
                allowFullScreen
                scrolling="auto"
              />
            </div>
          )}
        </div>

        {/* Modal Footer - Güvenlik Bilgisi */}
        <div className="flex-shrink-0 px-2 sm:px-3 md:px-4 lg:px-6 py-1.5 sm:py-2 md:py-3 bg-gray-50 border-t">
          <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-gray-600">
            <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs sm:text-sm">SSL ile şifrelenmiş güvenli bağlantı</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;