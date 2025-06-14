import React from 'react';
import { Shield, Globe, Headphones, Lock, Clock, Award } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Güvenilir ve Eğlenceli
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            WebsaChat ile iletişim kurmanın ve sosyalleşmenin en güvenli yolunu keşfedin
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-50 rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Güvenli Sohbet</h3>
            <p className="text-gray-600">
              Uçtan uca şifreleme ile tüm konuşmalarınız güvende. Verileriniz yalnızca sizin kontrolünüzde.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-gray-50 rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Global Topluluk</h3>
            <p className="text-gray-600">
              Dünyanın her yerinden insanlarla tanışın ve ilgi alanlarınıza göre topluluklar keşfedin.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-gray-50 rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50">
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Headphones className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">HD Sesli Sohbet</h3>
            <p className="text-gray-600">
              Kristal netliğinde ses kalitesi ile arkadaşlarınızla kesintisiz sohbetler yapın.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-gray-50 rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50">
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Lock className="h-8 w-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Gizlilik Kontrolü</h3>
            <p className="text-gray-600">
              Profilinizi ve paylaşımlarınızı kimlerin görebileceğini tamamen siz kontrol edin.
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-gray-50 rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">7/24 Erişim</h3>
            <p className="text-gray-600">
              İstediğiniz her an bağlanın, online olun ve arkadaşlarınızla iletişimde kalın.
            </p>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-gray-50 rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Award className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold mb-3">Ödüller Kazanın</h3>
            <p className="text-gray-600">
              Aktif olun, etkinliklere katılın ve özel ödüller kazanma şansı yakalayın.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;