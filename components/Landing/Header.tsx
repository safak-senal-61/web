import React, { useState, useEffect } from 'react';
import { MessageSquare, Users, Gamepad2, Gift, Zap, Menu, X, Download, LogIn, Plus, Code, BookOpen, Star } from 'lucide-react';
import { useRouter } from 'next/router';
import Image from 'next/image';

// TypewriterEffect component
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
        setTimeout(() => setIsDeleting(true), 1500);
      } else if (isDeleting && currentCharIndex === 0) {
        setIsDeleting(false);
        setCurrentTextIndex((currentTextIndex + 1) % texts.length);
      }
    }, isDeleting ? 50 : 100);

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
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/30">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-700 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-2xl shadow-xl border-b border-purple-100/50 py-3' 
          : 'bg-white/80 backdrop-blur-xl py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-full blur-md opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative bg-gradient-to-r from-purple-300 to-pink-300 p-2 rounded-full">
                  <Image 
                    src="../../../assets/logo.png"
                    alt="Logo"
                    width={30}
                    height={30}
                    className="h-10 w-10 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
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
                { text: 'Yorumlar', href: '#reviews' },
                { text: 'İndir', href: '#download' }
              ].map((item) => (
                <button 
                  key={item.text}
                  onClick={() => scrollToSection(item.href)}
                  className="relative font-semibold text-slate-700 hover:text-purple-600 transition-all duration-300 whitespace-nowrap group"
                >
                  {item.text}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-110"></span>
                </button>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Giriş Yap Button */}
              <button
                 onClick={() => {
                  router.push('/login'); // yönlendir
                  setIsMobileMenuOpen(false);
                }}
                className="relative px-6 py-2.5 rounded-full font-semibold text-purple-600 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span>Giriş Yap</span>
                </div>
              </button>

              {/* Uygulama İndir Button */}
              <button
                onClick={() => scrollToSection('#download')}
                className="relative px-6 py-2.5 rounded-full font-semibold text-white overflow-hidden group"
              >
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 transition-all duration-300"></div>
                
                {/* Hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-300 scale-150"></div>
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                
                {/* Text */}
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
                { text: 'Yorumlar', href: '#reviews' },
                { text: 'İndir', href: '#download' }
              ].map((item) => (
                <button
                  key={item.text}
                  onClick={() => {
                    scrollToSection(item.href);
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative text-slate-700 hover:text-purple-600 font-semibold transition-all duration-300 group text-left"
                >
                  {item.text}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </button>
              ))}
              
              {/* Mobile CTA Buttons */}
              <div className="flex flex-col space-y-3 pt-4 border-t border-purple-100">
                <button
                  onClick={() => {
                    router.push('/login'); // yönlendir
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-purple-600 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Giriş Yap</span>
                </button>
                
                <button
                  onClick={() => {
                    scrollToSection('#download');
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-white overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600"></div>
                  <div className="relative z-10 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Uygulamayı İndir</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-28 pb-16 md:pt-36 md:pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <div className="mb-4 sm:mb-6">
                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200">
                  ✨ Kodlama yolculuğunuz burada başlıyor. Bootcamp'lerimizi keşfedin!
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 sm:mb-8">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">WebsaChat'in</span>
                <br />
                <span className="text-slate-800">En Kapsamlı</span>
                <br />
                <span className="text-slate-800">Online Akademisi</span>
              </h1>
              
              <div className="h-20 sm:h-24 md:h-28 mb-6 sm:mb-8">
                <TypewriterEffect 
                  texts={[
                    "Sınırsız Kurs İmkanı",
                    "Canlı Bootcamp'ler",
                    "Uzman Destek",
                    "Sesli Sohbet Deneyimi",
                    "Eğlenceli Mini Oyunlar",
                    "Geleceğinizi Birlikte Kodlayalım"
                  ]}
                />
              </div>
              
              <p className="text-slate-600 text-lg sm:text-xl mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Sınırsız kurs, canlı bootcamp'ler ve uzman destek ile arkadaşlarınla bağlantı kur, 
                eğlenceli sohbetlere katıl ve geleceğinizi birlikte kodlayın!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
              </div>
            </div>
            
            <div className="w-full lg:w-1/2">
              <div className="relative max-w-lg mx-auto lg:max-w-none">
                {/* Animated background blobs */}
                <div className="absolute -top-4 -left-4 w-72 h-72 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
                <div className="absolute -bottom-8 right-4 w-72 h-72 bg-gradient-to-r from-pink-300 to-violet-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 -left-20 w-72 h-72 bg-gradient-to-r from-violet-300 to-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>
                
                {/* Main image */}
                <div className="relative z-10 p-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-1 rounded-3xl shadow-2xl">
                    <Image 
                      src="https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" 
                      alt="People chatting and having fun" 
                      className="w-full h-auto rounded-3xl"
                      width={500}
                      height={333}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Features Quick Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 lg:gap-8">
          {[
            { icon: Code, title: "Bootcamp'ler", color: "purple", bgColor: "from-purple-500 to-purple-600" },
            { icon: BookOpen, title: "Sınırsız Kurs", color: "pink", bgColor: "from-pink-500 to-pink-600" },
            { icon: Users, title: "Uzman Destek", color: "violet", bgColor: "from-violet-500 to-violet-600" },
            { icon: MessageSquare, title: "Sesli Sohbet", color: "indigo", bgColor: "from-indigo-500 to-indigo-600" },
            { icon: Gamepad2, title: "Mini Oyunlar", color: "purple", bgColor: "from-purple-500 to-pink-500" },
            { icon: Star, title: "Premium Deneyim", color: "blue", bgColor: "from-purple-500 to-pink-500" }
          ].map((feature) => (
            <div key={feature.title} className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center group hover:-translate-y-2 border border-purple-50">
              <div className={`bg-gradient-to-r ${feature.bgColor} p-3 sm:p-4 rounded-2xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
              <h3 className="font-semibold text-sm sm:text-base text-slate-700 group-hover:text-purple-600 transition-colors duration-300">{feature.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Header;