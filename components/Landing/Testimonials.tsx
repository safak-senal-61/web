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
    <section id="testimonials" className="py-8 sm:py-12 md:py-16 bg-gradient-to-b from-white to-indigo-50 overflow-hidden">
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
          animation: infiniteSlide 40s linear infinite;
          display: flex;
          width: calc(100% * 2);
        }
        
        .infinite-slide:hover {
          animation-play-state: paused;
        }
        
        @media (max-width: 640px) {
          .infinite-slide {
            animation-duration: 5s;
          }
        }
      `}</style>
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 px-2">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Kullanıcılarımız Ne Diyor?
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-2">
            Binlerce mutlu kullanıcımızın deneyimlerini keşfedin
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="infinite-slide">
            {/* İlk set */}
            {testimonials.map((testimonial) => (
              <div
                key={`first-${testimonial.id}`}
                className="min-w-[260px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[350px] px-2 sm:px-3 flex-shrink-0"
              >
                <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border border-gray-100">
                  <div className="flex items-start sm:items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4 ring-2 ring-indigo-100 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{testimonial.name}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm truncate">{testimonial.role}</p>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${i < testimonial.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic text-xs sm:text-sm leading-relaxed flex-grow">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
            
            {/* İkinci set (sonsuz döngü için) */}
            {testimonials.map((testimonial) => (
              <div
                key={`second-${testimonial.id}`}
                className="min-w-[260px] sm:min-w-[280px] md:min-w-[320px] lg:min-w-[350px] px-2 sm:px-3 flex-shrink-0"
              >
                <div className="bg-white rounded-xl p-4 sm:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col border border-gray-100">
                  <div className="flex items-start sm:items-center mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover mr-3 sm:mr-4 ring-2 ring-indigo-100 flex-shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{testimonial.name}</h4>
                      <p className="text-gray-600 text-xs sm:text-sm truncate">{testimonial.role}</p>
                      <div className="flex mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 sm:h-4 sm:w-4 ${i < testimonial.stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 italic text-xs sm:text-sm leading-relaxed flex-grow">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs sm:text-sm text-gray-500 px-2">
            Animasyonu durdurmak için kartların üzerine gelin
          </p>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;