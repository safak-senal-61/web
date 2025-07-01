import React from 'react';
import { Zap, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, MessageSquare, Users, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
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
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {/* Logo and Description */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                WebsaChat
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Sesli sohbet odalarında buluş, topluluklara katıl, mini oyunlar oyna ve yeni arkadaşlıklar kur.
              Sosyalleşmenin yeni boyutunu keşfet!
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
          </motion.div>
          
          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Users className="h-5 w-5 text-purple-400 mr-2" />
              Özellikler
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Sesli Sohbet</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Topluluklar</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Mini Oyunlar</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Anlık Mesajlaşma</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Keşfet</a>
              </li>
            </ul>
          </motion.div>
          
          {/* Support */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Gamepad2 className="h-5 w-5 text-purple-400 mr-2" />
              Destek
            </h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Yardım Merkezi</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Sıkça Sorulan Sorular</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Gizlilik Politikası</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Kullanım Şartları</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">İletişim</a>
              </li>
            </ul>
          </motion.div>
          
          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-bold mb-4 flex items-center">
              <Zap className="h-5 w-5 text-purple-400 mr-2" />
              Bize Ulaşın
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
                <span className="text-gray-400">support@websachat.com</span>
              </li>
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
                <span className="text-gray-400">+90 (212) 555 01 23</span>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-purple-400 mr-3 mt-0.5" />
                <span className="text-gray-400">
                  Maslak, İstanbul, Türkiye
                </span>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-300 mb-3">Çalışma Saatleri</h4>
              <p className="text-gray-400 text-sm">
                Pazartesi - Cuma: 09:00 - 18:00<br />
                Cumartesi: 10:00 - 16:00
              </p>
            </div>
          </motion.div>
        </motion.div>
        
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
