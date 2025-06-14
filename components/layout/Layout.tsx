// components/layout/Layout.tsx
import React, { useState, ReactNode } from 'react';
import Drawer from '../common/Drawer'; // Drawer component'inizin yolu
import { useAuth } from '../../hooks/useAuth'; // useAuth hook'unuzun yolu

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth(); // isLoading'i de alalım, belki drawer gösterimi için kullanılır
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Drawer'ın açık/kapalı durumu

  // Yükleme sırasında veya kullanıcı yoksa (ve login sayfasına yönlendirilmiyorsa)
  // Drawer'ın davranışını veya layout'un genelini farklı yönetmek isteyebilirsiniz.
  // Ancak _app.tsx zaten bu durumları ele alıyor, bu yüzden burada basit tutabiliriz.

  return (
    // Ana sarmalayıcı div. Tema duyarlı arka plan.
    // Mevcut gradyanınız karanlık tema için güzel, aydınlık tema için farklı bir şey isteyebilirsiniz.
    // Veya aydınlık temada düz bir renk kullanabilirsiniz.
    <div className="min-h-screen 
                   bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:via-blue-900 dark:to-slate-900 
                   text-slate-800 dark:text-white 
                   overflow-x-hidden transition-colors duration-300">
      <div className="flex h-screen overflow-hidden">
        {/* 
          Drawer component'i de kendi içinde tema duyarlı olmalı.
          Arka planı, metin renkleri vb. dark: prefix'leri ile güncellenmeli.
        */}
        {user && ( // Sadece kullanıcı giriş yapmışsa Drawer'ı göster
          <Drawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            user={user}
          />
        )}

        {/* Ana içerik alanı */}
        <main className={`
          flex-1 
          flex 
          flex-col 
          overflow-hidden 
          transition-all 
          duration-300 
          ease-in-out
          ${user && isDrawerOpen ? 'md:ml-64' : 'md:ml-0'} // Drawer açıkken md ekranlarda sola kaydırma (isteğe bağlı)
                                                          // Eğer Drawer'ınız sabit genişlikteyse (örn: w-64)
                                                          // Veya Drawer'ınız overlay ise bu ml- class'ına gerek yok.
                                                          // Sizin yapınızda Drawer overlay gibi duruyor, ml-0 kalabilir.
          ${user ? 'md:ml-0' : ''} // Kullanıcı varsa ve drawer hep overlay ise bu satır kalabilir veya kaldırılabilir.
                                    // Eğer drawer'ınız her zaman overlay ise (içeriği itmiyorsa),
                                    // bu satıra ve yukarıdaki ml-64'e gerek yok.
          max-w-full 
        `}>
          {/* 
            Header olmadığı için doğrudan içeriğe odaklanıyoruz.
            _app.tsx içindeki ana sarmalayıcı zaten temel arka planı sağlıyor.
            Bu Layout component'i daha çok Drawer ve ana içerik alanını düzenlemek için.
          */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            {/* 
              Sayfa içeriğinin container'ı.
              Padding değerleri ve max-width _app.tsx veya HomePage gibi sayfa component'lerinde
              zaten yönetiliyor olabilir. Buradaki container'ın amacı, Drawer varsa içeriği
              doğru konumlandırmak olabilir.
              Eğer _app.tsx'deki sarmalayıcı zaten bg-white dark:bg-slate-900 yapıyorsa,
              buradaki container'a ayrıca arka plan vermeye gerek olmayabilir,
              ya da daha spesifik bir iç arka plan isteniyorsa eklenebilir.
            */}
            <div className="">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;