import React from 'react';
import { Apple, PlayCircle, Download } from 'lucide-react';
import Image from 'next/image';

const CallToAction = () => {
  return (
    <section id="download" className="py-16 md:py-24 bg-gradient-to-r from-purple-600 to-blue-500">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Hemen WebsaChat&apos;e Katıl ve Sosyalleşmeye Başla!
            </h2>
            <p className="text-white text-lg opacity-90 mb-8">
              Milyonlarca kullanıcı arasına katıl, yeni arkadaşlıklar kur ve eğlenceli mini oyunlar oyna. 
              WebsaChat ile sosyal hayatın daha renkli olacak!
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <a 
                href="#" 
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all flex items-center justify-center"
              >
                <Apple className="h-5 w-5 mr-2" />
                <span>App Store</span>
              </a>
              <a 
                href="#" 
                className="bg-white text-purple-600 px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all flex items-center justify-center"
              >
                <PlayCircle className="h-5 w-5 mr-2" />
                <span>Google Play</span>
              </a>
            </div>
            
            <div className="mt-8 flex items-center">
              <Download className="h-5 w-5 text-white mr-2" />
              <span className="text-white opacity-90">
                500,000+ indirme
              </span>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-full bg-white/20 rounded-3xl transform rotate-6 scale-95"></div>
              <div className="relative z-10 w-[300px] h-[400px] md:w-[400px] md:h-[500px]">
                <Image 
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="WebsaChat on mobile devices" 
                  fill
                  className="rounded-3xl shadow-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;