import React from 'react';
import { Apple, PlayCircle, Download, Users, Star, MessageSquare, Gamepad2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const CallToAction = () => {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section id="download" className="py-16 md:py-24 bg-gradient-to-br from-purple-600 via-pink-600 to-violet-600 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="flex flex-col md:flex-row items-center justify-between"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={itemVariants} className="md:w-1/2 mb-12 md:mb-0">
            <div className="mb-4">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 text-white border border-white/30">
                🚀 WebsaChat'i İndir
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              WebsaChat ile Bağlantıda Kal,
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Eğlenceye Katıl!
              </span>
            </h2>
            <p className="text-white text-lg opacity-90 mb-8 leading-relaxed">
              Arkadaşlarınla sesli sohbet et, yeni topluluklar keşfet, mini oyunlar oyna ve anlık mesajlaşmanın keyfini çıkar.
              WebsaChat ile sosyalleşmenin yeni boyutunu deneyimle!
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button 
                onClick={() => router.push('/download-app')}
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all flex items-center justify-center group hover:scale-105 transform"
              >
                <Download className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span>Hemen İndir</span>
              </button>
              <button 
                onClick={() => router.push('/features')}
                className="bg-white/20 backdrop-blur-sm text-white border-2 border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/30 transition-all flex items-center justify-center group hover:scale-105 transform"
              >
                <PlayCircle className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span>Nasıl Çalışır?</span>
              </button>
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-6">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-white mr-2" />
                <span className="text-white opacity-90">
                  100,000+ Kullanıcı
                </span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 text-yellow-300 mr-2" />
                <span className="text-white opacity-90">
                  4.8/5 Puan
                </span>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="md:w-1/2 flex justify-center">
            <div className="relative">
              {/* Background decorative elements */}
              <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-white/20 to-white/10 rounded-3xl transform rotate-6 scale-95 backdrop-blur-sm"></div>
              <div className="absolute -bottom-4 -right-4 w-full h-full bg-gradient-to-tl from-yellow-300/20 to-orange-300/10 rounded-3xl transform -rotate-3 scale-90 backdrop-blur-sm"></div>
              
              <div className="relative z-10 w-[300px] h-[400px] md:w-[400px] md:h-[500px] group">
                <Image 
                  src="https://images.pexels.com/photos/7176318/pexels-photo-7176318.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                  alt="WebsaChat Uygulaması" 
                  fill
                  className="rounded-3xl shadow-2xl object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Floating elements */}
                <div className="absolute -top-6 -right-6 bg-white rounded-full p-3 shadow-lg animate-bounce">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full p-3 shadow-lg animate-pulse">
                  <Gamepad2 className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;
