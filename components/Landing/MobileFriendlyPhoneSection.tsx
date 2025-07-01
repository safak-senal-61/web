import React from 'react';
import PhoneAnimation from './PhoneAnimation';

// Ana sayfa veya landing page'inizde kullanacağınız wrapper
const MobileFriendlyPhoneSection = () => {
  return (
    <section className="w-full py-8 px-4 overflow-hidden">
      {/* Container - mobil scroll'u engellemeyecek */}
      <div 
        className="relative w-full max-w-lg mx-auto"
        style={{
          // Canvas'ın scroll'u engellemesini önle
          touchAction: 'pan-y pinch-zoom'
        }}
      >
        {/* 3D Animation Container */}
        <div 
          className="relative"
          onTouchStart={(e) => {
            // Canvas alanında touch event'i yakala
            e.currentTarget.style.touchAction = 'none';
          }}
          onTouchEnd={(e) => {
            // Touch bittiğinde scroll'u tekrar aç
            e.currentTarget.style.touchAction = 'pan-y pinch-zoom';
          }}
        >
          <PhoneAnimation />
        </div>
        
        {/* Açıklama metni - scroll test için */}
        <div className="mt-6 text-center space-y-3">
          <h3 className="text-xl font-bold text-gray-800">
            WebSaChat Mobil Uygulaması
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed">
            Modern ve kullanıcı dostu arayüzü ile anında mesajlaşma deneyimi. 
            Telefonunuzu hareket ettirerek 3D modelini inceleyebilirsiniz.
          </p>
          
          {/* Test için ekstra içerik */}
          <div className="pt-8 space-y-4 text-gray-500 text-xs">
            <p>📱 Responsive tasarım</p>
            <p>🎨 Modern arayüz</p>
            <p>⚡ Hızlı performans</p>
            <p>🔒 Güvenli mesajlaşma</p>
            <p>🌟 Kullanıcı dostu</p>
          </div>
          
          {/* Scroll test alanı */}
          <div className="pt-12 pb-8">
            <div className="h-32 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg flex items-center justify-center">
              <p className="text-blue-600 font-medium">
                ⬇️ Aşağı kaydırabilirsiniz
              </p>
            </div>
          </div>
          
          <div className="space-y-6 text-left">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-gray-800 mb-2">Özellikler</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Gerçek zamanlı mesajlaşma</li>
                <li>• Dosya paylaşımı</li>
                <li>• Grup sohbetleri</li>
                <li>• Sesli mesaj</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-gray-800 mb-2">Güvenlik</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Uçtan uca şifreleme</li>
                <li>• İki faktörlü doğrulama</li>
                <li>• Gizlilik kontrolü</li>
                <li>• Güvenli bulut yedekleme</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-gray-800 mb-2">Platform Desteği</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• iOS & Android</li>
                <li>• Web tarayıcısı</li>
                <li>• Desktop uygulaması</li>
                <li>• Tablet optimizasyonu</li>
              </ul>
            </div>
          </div>
          
          {/* Alt boşluk - scroll test */}
          <div className="h-20"></div>
        </div>
      </div>
    </section>
  );
};

export default MobileFriendlyPhoneSection;