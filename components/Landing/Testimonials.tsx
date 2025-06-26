import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Mehmet Y.',
    role: 'Öğrenci',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    quote: 'WebsaChat sayesinde uzaktaki arkadaşlarımla her gün sesli sohbet ediyorum. Mini oyunlar da çok eğlenceli!',
    stars: 5
  },
  {
    id: 2,
    name: 'Ayşe K.',
    role: 'Grafik Tasarımcı',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    quote: 'İş arkadaşlarımla iletişim kurmak için harika bir platform. Hem güvenli hem de kullanımı çok kolay!',
    stars: 5
  },
  {
    id: 3,
    name: 'Emre T.',
    role: 'Yazılım Geliştirici',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    quote: 'WebsaChat ile yeni arkadaşlar edindim ve hobilerimi paylaşabildiğim bir topluluk buldum. Sesli sohbet kalitesi inanılmaz!',
    stars: 4
  },
  {
    id: 4,
    name: 'Zeynep B.',
    role: 'İçerik Üreticisi',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    quote: 'İçerik üreticisi olarak takipçilerimle iletişimde kalmak için en iyi uygulama. Ödül sistemi de motivasyonumu artırıyor!',
    stars: 5
  },
  {
    id: 5,
    name: 'Ali R.',
    role: 'Oyun Tutkunu',
    avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    quote: 'Mini oyunlar o kadar eğlenceli ki saatlerce arkadaşlarımla oynuyoruz. Kesinlikle en iyi sosyal medya uygulaması!',
    stars: 5
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-8 md:py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
      </div>
      
      <style jsx>{`
        @keyframes infiniteSlide {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        
        .infinite-slide {
          animation: infiniteSlide 60s linear infinite;
          display: flex;
          width: calc(100% * 2);
        }
        
        .infinite-slide:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 768px) {
          .infinite-slide {
            animation-duration: 30s;
          }
        }
        
        @media (max-width: 480px) {
          .infinite-slide {
            animation-duration: 25s;
          }
        }
      `}</style>
      
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8 md:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 md:mb-6 shadow-lg">
            <Star className="w-6 h-6 md:w-8 md:h-8 text-white fill-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 px-2">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Kullanıcılarımız Ne Diyor?
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-2 md:px-4 leading-relaxed">
            Binlerce mutlu kullanıcımızın deneyimlerini keşfedin ve topluluğumuza katılın
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="infinite-slide">
            {/* İlk set */}
            {testimonials.map((testimonial) => (
              <div
                key={`first-${testimonial.id}`}
                className="min-w-[260px] sm:min-w-[300px] md:min-w-[380px] lg:min-w-[420px] px-2 sm:px-3 flex-shrink-0"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-white/50 hover:border-purple-200 group hover:scale-105">
                  {/* Header */}
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover ring-2 sm:ring-4 ring-white shadow-lg group-hover:ring-purple-200 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">{testimonial.name}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium">{testimonial.role}</p>
                      <div className="flex mt-1 sm:mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-colors duration-200 ${
                              i < testimonial.stars 
                                ? 'text-amber-400 fill-amber-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quote */}
                  <div className="flex-grow">
                    <div className="relative">
                      <div className="absolute -top-1 -left-1 text-2xl sm:text-3xl md:text-4xl text-purple-200 font-serif">&ldquo;</div>
                      <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed pl-4 sm:pl-6 pr-2 font-medium">
                        {testimonial.quote}
                      </p>
                      <div className="absolute -bottom-1 -right-1 text-2xl sm:text-3xl md:text-4xl text-purple-200 font-serif transform rotate-180">&ldquo;</div>
                    </div>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60"></div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Doğrulanmış Kullanıcı</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* İkinci set (sonsuz döngü için) */}
            {testimonials.map((testimonial) => (
              <div
                key={`second-${testimonial.id}`}
                className="min-w-[260px] sm:min-w-[300px] md:min-w-[380px] lg:min-w-[420px] px-2 sm:px-3 flex-shrink-0"
              >
                <div className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col border border-white/50 hover:border-purple-200 group hover:scale-105">
                  {/* Header */}
                  <div className="flex items-center mb-4 sm:mb-6">
                    <div className="relative">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl object-cover ring-2 sm:ring-4 ring-white shadow-lg group-hover:ring-purple-200 transition-all duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                    </div>
                    <div className="ml-3 sm:ml-4 flex-1">
                      <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">{testimonial.name}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm md:text-base font-medium">{testimonial.role}</p>
                      <div className="flex mt-1 sm:mt-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 transition-colors duration-200 ${
                              i < testimonial.stars 
                                ? 'text-amber-400 fill-amber-400' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  {/* Quote */}
                  <div className="flex-grow">
                    <div className="relative">
                      <div className="absolute -top-1 -left-1 text-2xl sm:text-3xl md:text-4xl text-purple-200 font-serif">&ldquo;</div>
                      <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed pl-4 sm:pl-6 pr-2 font-medium">
                        {testimonial.quote}
                      </p>
                      <div className="absolute -bottom-1 -right-1 text-2xl sm:text-3xl md:text-4xl text-purple-200 font-serif transform rotate-180">&ldquo;</div>
                    </div>
                  </div>
                  
                  {/* Bottom accent */}
                  <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full opacity-60"></div>
                        ))}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">Doğrulanmış Kullanıcı</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Bottom info */}
        <div className="text-center mt-6 md:mt-12">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 shadow-lg border border-white/50">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">
              Animasyonu durdurmak için kartların üzerine gelin
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;