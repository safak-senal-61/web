import React from 'react';
import { Apple, PlayCircle, Download, Users, Star, BookOpen, Code } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';

const CallToAction = () => {
  const router = useRouter();

  return (
    <section id="download" className="py-16 md:py-24 bg-gradient-to-br from-purple-600 via-pink-600 to-violet-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="md:w-1/2 mb-12 md:mb-0">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
                🎓 Kodlama Yolculuğunuz Başlasın
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              WebsaChat Academy&apos;ye Katıl,
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Geleceğini Kodla!
              </span>
            </h2>
            <p className="text-white text-lg opacity-90 mb-8 leading-relaxed">
              Sınırsız kurs içeriği, canlı bootcamp'ler ve uzman mentor desteği ile kodlama öğren. 
              Arkadaşlarınla sesli sohbet odalarında buluş, birlikte projeler geliştir!
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => router.push('/register')}
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all flex items-center justify-center group hover:scale-105 transform"
              >
                <BookOpen className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span>Hemen Başla</span>
              </button>
              <button 
                onClick={() => router.push('/courses')}
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-all flex items-center justify-center group hover:scale-105 transform"
              >
                <Code className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span>Kursları İncele</span>
              </button>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-white mr-2" />
                <span className="text-white opacity-90">
                  10,000+ Öğrenci
                </span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-300 mr-2" />
                <span className="text-white opacity-90">
                  4.9/5 Puan
                </span>
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-white/20 to-white/10 rounded-3xl transform rotate-6 scale-95 backdrop-blur-sm"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-tl from-yellow-300/20 to-orange-300/10 rounded-3xl transform -rotate-3 scale-90 backdrop-blur-sm"></div>
              
              <div className="relative z-10 w-[300px] h-[400px] md:w-[400px] md:h-[500px] group">
                <Image 
                  src="https://images.pexels.com/photos/3861958/pexels-photo-3861958.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="WebsaChat Academy - Kodlama Eğitimi" 
                  fill
                  className="rounded-3xl shadow-2xl object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 bg-white rounded-full p-3 shadow-lg animate-bounce">
                  <Code className="h-6 w-6 text-purple-600" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-3 shadow-lg animate-pulse">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;