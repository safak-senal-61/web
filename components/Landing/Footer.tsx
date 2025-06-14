import React from 'react';
import { Zap, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center mb-4">
              <Zap className="h-8 w-8 text-purple-400" />
              <span className="ml-2 text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                WebsaChat
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              WebsaChat ile sosyalleş, sesli sohbet et, mini oyunlar oyna ve yeni arkadaşlıklar kur.
              Herkes için en iyi sosyal medya deneyimi.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Hızlı Erişim</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Anasayfa</a>
              </li>
              <li>
                <a href="#features" className="text-gray-400 hover:text-white transition-colors">Özellikler</a>
              </li>
              <li>
                <a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Yorumlar</a>
              </li>
              <li>
                <a href="#download" className="text-gray-400 hover:text-white transition-colors">İndir</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-4">Destek</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Yardım Merkezi</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Gizlilik Politikası</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Kullanım Şartları</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Sıkça Sorulan Sorular</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">İletişim</a>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4">İletişim</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
                <span className="text-gray-400">info@websachat.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
                <span className="text-gray-400">+90 (212) 123 45 67</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
                <span className="text-gray-400">
                  Levent, İstanbul, Türkiye
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} WebsaChat. Tüm hakları saklıdır.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
                Gizlilik Politikası
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
                Kullanım Şartları
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors text-sm">
                Çerezler
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;