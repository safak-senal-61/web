import React from 'react';
import { Mic, Users, Gamepad2, Gift, MessageSquare, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

// 1. Adım: Geçerli renk isimleri için bir tip tanımlayın.
type FeatureColor = "purple" | "blue" | "pink" | "green" | "yellow" | "indigo";

const featureList: {
  icon: React.ElementType;
  title: string;
  description: string;
  // 2. Adım: 'color' özelliğinin tipini 'string' yerine yeni oluşturduğumuz 'FeatureColor' yapın.
  color: FeatureColor;
}[] = [
  {
    icon: Mic,
    title: "Kristal Netliğinde Ses",
    description: "Gecikmesiz ve yüksek kaliteli sesli sohbet ile arkadaşlarınla kesintisiz iletişim kur.",
    color: "purple"
  },
  {
    icon: Users,
    title: "Topluluklar Oluştur ve Katıl",
    description: "İlgi alanlarına göre topluluklar bul, yeni insanlarla tanış ve kendi komüniteni yönet.",
    color: "blue"
  },
  {
    icon: Gamepad2,
    title: "Eğlenceli Mini Oyunlar",
    description: "Sohbete ara verip arkadaşlarınla rekabetçi ve eğlenceli mini oyunlar oyna.",
    color: "pink"
  },
  {
    icon: MessageSquare,
    title: "Anlık Mesajlaşma",
    description: "Yazılı olarak da iletişimde kal. Özel mesajlar ve grup chatleri ile sohbeti sürdür.",
    color: "green"
  },
  {
    icon: Gift,
    title: "Hediyeler Gönder ve Al",
    description: "Arkadaşlarına sanal hediyeler göndererek onları mutlu et ve etkileşimini artır.",
    color: "yellow"
  },
  {
    icon: Compass,
    title: "Yeni Kanalları Keşfet",
    description: "Popüler sohbet odalarını ve yeni toplulukları keşfet, ilgi alanlarına uygun kanallara katıl.",
    color: "indigo"
  }
];

const Features = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9], // Önceki hatayı da burada düzelttim
      },
    },
  };

  // 3. Adım: colorClasses objesinin anahtar tipini belirgin hale getirin.
  const colorClasses: Record<FeatureColor, { bg: string; border: string; iconBg: string; }> = {
    purple: {
      bg: 'hover:from-purple-50 hover:to-indigo-50',
      border: 'hover:border-purple-200',
      iconBg: 'from-purple-500 to-purple-600'
    },
    blue: {
      bg: 'hover:from-blue-50 hover:to-cyan-50',
      border: 'hover:border-blue-200',
      iconBg: 'from-blue-500 to-blue-600'
    },
    pink: {
      bg: 'hover:from-pink-50 hover:to-rose-50',
      border: 'hover:border-pink-200',
      iconBg: 'from-pink-500 to-pink-600'
    },
    green: {
      bg: 'hover:from-green-50 hover:to-emerald-50',
      border: 'hover:border-green-200',
      iconBg: 'from-green-500 to-green-600'
    },
    yellow: {
      bg: 'hover:from-yellow-50 hover:to-amber-50',
      border: 'hover:border-yellow-200',
      iconBg: 'from-yellow-500 to-yellow-600'
    },
    indigo: {
      bg: 'hover:from-indigo-50 hover:to-violet-50',
      border: 'hover:border-indigo-200',
      iconBg: 'from-indigo-500 to-indigo-600'
    },
  };

  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-4">
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 border border-purple-200">
              🚀 Neden WebsaChat?
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Sadece Konuşma,
            </span>
            <br />
            <span className="text-slate-800">Bağlantı Kur</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            WebsaChat, arkadaşlarınla ve yeni insanlarla iletişim kurman için ihtiyacın olan her şeyi sunar. 
            Eğlence ve sosyalleşme bir arada!
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {featureList.map((feature, i) => {
            const Icon = feature.icon;
            // Artık TypeScript 'feature.color'ın geçerli bir anahtar olduğunu biliyor.
            const colors = colorClasses[feature.color]; 
            return (
              <motion.div 
                key={i}
                className={`bg-white rounded-xl p-8 transition-all duration-300 hover:shadow-xl ${colors.bg} border border-gray-100 ${colors.border}`}
                variants={itemVariants}
              >
                <div className={`bg-gradient-to-r ${colors.iconBg} w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-lg`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-800">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;