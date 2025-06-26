import React from 'react';
import { Shield, Globe, Headphones, Lock, Clock, Award, Code, BookOpen, Users, Video, Trophy, Zap } from 'lucide-react';

const Features = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200">
              🚀 Özelliklerimiz
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Kodlama Yolculuğunuzda
            </span>
            <br />
            <span className="text-slate-800">İhtiyacınız Olan Her Şey</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            WebsaChat Academy ile hem kodlama öğrenin hem de arkadaşlarınızla sosyalleşin. 
            Eğitim ve eğlenceyi bir arada yaşayın!
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 border border-gray-100 hover:border-purple-200">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Code className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Canlı Bootcamp'ler</h3>
            <p className="text-gray-600">
              Uzman eğitmenlerle canlı bootcamp'lerde kodlama öğrenin. Gerçek projeler üzerinde çalışın ve deneyim kazanın.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="bg-white rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 border border-gray-100 hover:border-purple-200">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Sınırsız Kurs İçeriği</h3>
            <p className="text-gray-600">
              Yüzlerce saat video içerik, interaktif projeler ve kapsamlı eğitim materyalleri ile öğrenin.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="bg-white rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 border border-gray-100 hover:border-purple-200">
            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Uzman Mentor Desteği</h3>
            <p className="text-gray-600">
              Deneyimli mentorlardan birebir destek alın ve kariyerinizde doğru adımları atın.
            </p>
          </div>
          
          {/* Feature 4 */}
          <div className="bg-white rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 border border-gray-100 hover:border-purple-200">
            <div className="bg-gradient-to-r from-pink-500 to-pink-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Video className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Sesli Sohbet Odaları</h3>
            <p className="text-gray-600">
              Arkadaşlarınızla sesli sohbet odalarında buluşun, birlikte kod yazın ve projeler geliştirin.
            </p>
          </div>
          
          {/* Feature 5 */}
          <div className="bg-white rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 border border-gray-100 hover:border-purple-200">
            <div className="bg-gradient-to-r from-green-500 to-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Sertifika Programları</h3>
            <p className="text-gray-600">
              Tamamladığınız kurslar için sertifika alın ve kariyerinizde fark yaratın.
            </p>
          </div>
          
          {/* Feature 6 */}
          <div className="bg-white rounded-xl p-8 transition-all duration-300 hover:shadow-xl hover:bg-gradient-to-br hover:from-purple-50 hover:to-indigo-50 border border-gray-100 hover:border-purple-200">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-800">Eğlenceli Mini Oyunlar</h3>
            <p className="text-gray-600">
              Kodlama becerilerinizi geliştirirken eğlenceli mini oyunlarla stres atın ve arkadaşlarınızla yarışın.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;