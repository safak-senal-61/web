import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic'; // DİNAMİK İMPORT İÇİN GEREKLİ
import { MessageSquare, Users, Gamepad2, Menu, X, Download, LogIn, Plus, Mic, Sparkles, Compass } from 'lucide-react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { motion } from 'framer-motion';

// PhoneAnimation bileşenini sadece tarayıcıda yüklenecek şekilde (ssr: false) dinamik olarak import ediyoruz.
const PhoneAnimation = dynamic(() => import('./PhoneAnimation'), {
    ssr: false, // Sunucu tarafında render etmeyi engelle!
    loading: () => (
        <div className="flex h-full w-full items-center justify-center text-purple-500">
            <svg className="animate-spin h-8 w-8 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
    )
});

// TypewriterEffect bileşeni (değişiklik yok)
interface TypewriterEffectProps {
  texts: string[];
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ texts }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentText = texts[currentTextIndex];
      
      if (!isDeleting && currentCharIndex < currentText.length) {
        setCurrentCharIndex(currentCharIndex + 1);
      } else if (isDeleting && currentCharIndex > 0) {
        setCurrentCharIndex(currentCharIndex - 1);
      } else if (!isDeleting && currentCharIndex === currentText.length) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && currentCharIndex === 0) {
        setIsDeleting(false);
        setCurrentTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
      }
    }, isDeleting ? 60 : 120);

    return () => clearTimeout(timeout);
  }, [currentCharIndex, isDeleting, currentTextIndex, texts]);

  return (
    <div className="text-2xl md:text-3xl lg:text-4xl font-medium bg-gradient-to-r from-purple-600 via-pink-500 to-violet-600 bg-clip-text text-transparent min-h-[3rem]">
      {texts[currentTextIndex].substring(0, currentCharIndex)}
      <span className="animate-pulse bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">|</span>
    </div>
  );
};


const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

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
    <div className="relative w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-2xl shadow-xl border-b border-purple-100/50 py-3' 
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer" onClick={() => router.push('/')}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-purple-300 to-pink-300 p-2 rounded-full">
                  <Image 
                    src="/assets/logo.png"
                    alt="Logo"
                    width={40}
                    height={40}
                    className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                  />
                </div>
              </div>
              <span className="ml-3 text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent whitespace-nowrap group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-violet-500 transition-all duration-300">
                WebsaChat
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 lg:space-x-12">
              {[
                { text: 'Özellikler', href: '#features' },
                { text: 'Topluluk', href: '#community' },
                { text: 'İndir', href: '#download' }
              ].map((item) => (
                <button 
                  key={item.text}
                  onClick={() => scrollToSection(item.href)}
                  className="relative font-semibold text-slate-700 hover:text-purple-600 transition-all duration-300 whitespace-nowrap group"
                >
                  {item.text}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                 onClick={() => router.push('/login')}
                className="relative px-6 py-2.5 rounded-full font-semibold text-purple-600 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Giriş Yap</span>
                </div>
              </button>

              <button
                onClick={() => scrollToSection('#download')}
                className="relative px-6 py-2.5 rounded-full font-semibold text-white overflow-hidden group shadow-lg hover:shadow-pink-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 transition-all duration-300 group-hover:from-purple-500 group-hover:via-pink-500 group-hover:to-violet-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span>Uygulamayı İndir</span>
                </div>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-purple-50 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div className={`md:hidden transition-all duration-500 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'
          }`}>
            <div className="flex flex-col space-y-4 p-6 bg-white/95 backdrop-blur-xl rounded-2xl border border-purple-100 shadow-xl">
              {[
                { text: 'Özellikler', href: '#features' },
                { text: 'Topluluk', href: '#community' },
                { text: 'İndir', href: '#download' }
              ].map((item) => (
                <button
                  key={item.text}
                  onClick={() => scrollToSection(item.href)}
                  className="relative text-slate-700 hover:text-purple-600 font-semibold transition-all duration-300 group text-left py-2"
                >
                  {item.text}
                </button>
              ))}
              
              <div className="flex flex-col space-y-3 pt-4 border-t border-purple-100">
                <button
                  onClick={() => router.push('/login')}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-purple-600 border-2 border-purple-200"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Giriş Yap</span>
                </button>
                
                <button
                  onClick={() => scrollToSection('#download')}
                  className="relative flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <Download className="h-4 w-4" />
                  <span>Uygulamayı İndir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
      {/* Hero Section */}
      <div className="pt-32 pb-16 md:pt-40 md:pb-20 lg:pb-28">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.div variants={itemVariants} className="mb-4 sm:mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200">
                  ✨ Arkadaşlarınla. Sesli. Anında.
                </span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 sm:mb-8">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">Sohbetin</span>
                <br />
                <span className="text-slate-800">Yeni Boyutu</span>
              </motion.h1>
              
              <motion.div variants={itemVariants} className="h-20 sm:h-24 md:h-28 mb-6 sm:mb-8">
                <TypewriterEffect 
                  texts={[
                    "Kristal Netliğinde Ses",
                    "Topluluklar Oluştur",
                    "Mini Oyunlar Oyna",
                    "Anlık Mesajlaşma",
                    "Yeni İnsanlarla Tanış"
                  ]}
                />
              </motion.div>
              
              <motion.p variants={itemVariants} className="text-slate-600 text-lg sm:text-xl mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                WebsaChat ile sesli sohbet odalarında buluş, topluluklara katıl, oyunlar oyna ve yeni arkadaşlıklar kur. 
                Sınırsız eğlence seni bekliyor!
              </motion.p>
              
              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={() => router.push('/register')}
                  className="relative px-8 py-4 rounded-full font-semibold text-white overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <Plus className="h-5 w-5" />
                    <span>Hemen Katıl</span>
                  </div>
                </button>
                
                <button 
                  onClick={() => scrollToSection('#features')}
                  className="bg-white/80 backdrop-blur-sm text-slate-700 px-8 py-4 rounded-full font-semibold hover:bg-white hover:shadow-lg transition-all duration-300 border border-purple-100"
                >
                  Daha Fazla Bilgi
                </button>
              </motion.div>
            </div>
            
            {/* Animasyonun çağrıldığı yer */}
            <div className="w-full lg:w-1/2 h-[400px] md:h-[500px] lg:h-[600px]">
              <PhoneAnimation />
            </div>
          </div>
        </motion.div>
      </div>

      {/* App Features Quick Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {[
            { icon: Mic, title: "Sesli Sohbet" },
            { icon: Users, title: "Topluluklar" },
            { icon: Gamepad2, title: "Mini Oyunlar" },
            { icon: MessageSquare, title: "Anlık Mesaj" },
            { icon: Compass, title: "Keşfet" },
          ].map((feature, i) => (
            <motion.div 
              key={feature.title} 
              className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-2 border border-purple-50"
              variants={itemVariants}
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 sm:p-4 rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-700 group-hover:text-purple-600 transition-colors duration-300">{feature.title}</h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Header;