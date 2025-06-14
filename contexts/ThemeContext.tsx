// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme; // Kullanıcının seçtiği tema (light, dark, auto)
  setTheme: (theme: Theme) => void; // Temayı değiştirmek için fonksiyon
  resolvedTheme: 'light' | 'dark'; // Gerçekte uygulanan tema (light veya dark)
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    console.error('useTheme çağrısı ThemeProvider dışında yapıldı!'); // Hata durumunda daha açıklayıcı log
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark', // Varsayılan tema 'auto'
  storageKey = 'websachat-theme', // localStorage için anahtar
}) => {
  // 1. Başlangıç Temasını Yükleme (localStorage veya varsayılan)
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      console.log('[ThemeProvider] SSR: Pencere nesnesi yok, varsayılan tema kullanılacak:', defaultTheme);
      return defaultTheme; // Sunucu tarafında localStorage'a erişilemez
    }
    try {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      console.log(`[ThemeProvider] localStorage'dan okunan tema: ${storedTheme}`);
      if (storedTheme && ['light', 'dark', 'auto'].includes(storedTheme)) {
        console.log(`[ThemeProvider] Geçerli depolanmış tema bulundu ve kullanılıyor: ${storedTheme}`);
        return storedTheme;
      } else {
        console.log(`[ThemeProvider] Depolanmış tema geçersiz veya yok, varsayılan tema kullanılacak: ${defaultTheme}`);
      }
    } catch (e) {
      console.error("[ThemeProvider] localStorage'dan tema okunurken hata:", e);
    }
    return defaultTheme;
  });

  // 2. Çözümlenmiş (Gerçekte Uygulanan) Tema Durumu
  // 'auto' seçildiğinde sistem tercihine göre 'light' veya 'dark' olur.
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    // Başlangıçta resolvedTheme'i de doğru ayarlamak önemli
    if (theme === 'auto' && typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return theme === 'dark' ? 'dark' : 'light';
  });

  console.log(`[ThemeProvider] Başlangıç durumu - Seçilen tema: ${theme}, Çözümlenen tema: ${resolvedTheme}`);

  // 3. Temayı Uygulama Fonksiyonu (<html> elementine class ekler)
  const applyTheme = useCallback((currentThemeToApply: Theme) => {
    if (typeof window === 'undefined') {
      console.log('[ThemeProvider] applyTheme: Pencere nesnesi yok, işlem atlanıyor.');
      return;
    }

    let newResolvedTheme: 'light' | 'dark';

    if (currentThemeToApply === 'auto') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      newResolvedTheme = systemPrefersDark ? 'dark' : 'light';
      console.log(`[ThemeProvider] applyTheme: 'auto' modu. Sistem tercihi koyu: ${systemPrefersDark}. Çözümlenen: ${newResolvedTheme}`);
    } else {
      newResolvedTheme = currentThemeToApply;
      console.log(`[ThemeProvider] applyTheme: Manuel mod. Seçilen: ${currentThemeToApply}. Çözümlenen: ${newResolvedTheme}`);
    }

    // Sadece gerçekten değiştiyse güncelle
    if (resolvedTheme !== newResolvedTheme) {
        setResolvedTheme(newResolvedTheme);
        console.log(`[ThemeProvider] applyTheme: resolvedTheme state güncellendi: ${newResolvedTheme}`);
    }


    const root = window.document.documentElement;
    const classToRemove = newResolvedTheme === 'dark' ? 'light' : 'dark';
    
    if (root.classList.contains(classToRemove)) {
      root.classList.remove(classToRemove);
      console.log(`[ThemeProvider] applyTheme: <html> elementinden class kaldırıldı: ${classToRemove}`);
    }
    if (!root.classList.contains(newResolvedTheme)) {
      root.classList.add(newResolvedTheme);
      console.log(`[ThemeProvider] applyTheme: <html> elementine class eklendi: ${newResolvedTheme}`);
    }
    console.log(`[ThemeProvider] applyTheme: <html> elementinin son classList'i:`, Array.from(root.classList));

  }, [resolvedTheme]); // resolvedTheme'i dependency array'e ekledik, böylece sadece değiştiğinde güncellenir.

  // 4. İlk Yüklemede ve `theme` State'i Değiştiğinde Temayı Uygula
  useEffect(() => {
    console.log(`[ThemeProvider] useEffect [theme]: Seçilen tema (${theme}) değişti, applyTheme çağrılıyor.`);
    applyTheme(theme);
  }, [theme, applyTheme]); // applyTheme'i dependency array'e eklemek önemli

  // 5. Sistem Tema Tercihi Değişikliklerini Dinleme ('auto' modu için)
  useEffect(() => {
    if (typeof window === 'undefined' || theme !== 'auto') {
      // Eğer SSR ise, pencere yoksa veya tema 'auto' değilse bir şey yapma
      if (theme !== 'auto') console.log(`[ThemeProvider] useEffect [system theme listener]: Tema 'auto' değil (${theme}), dinleyici pasif.`);
      return;
    }

    console.log("[ThemeProvider] useEffect [system theme listener]: 'auto' modu aktif, sistem tema değişiklikleri için dinleyici ayarlanıyor.");
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      console.log(`[ThemeProvider] Sistem tema tercihi değişti! Yeni tercih koyu mu: ${event.matches}. 'auto' için applyTheme yeniden çağrılıyor.`);
      applyTheme('auto'); // 'auto' temasını yeniden değerlendir ve uygula
    };

    mediaQuery.addEventListener('change', handleChange);
    console.log("[ThemeProvider] Sistem tema değişiklikleri dinleyicisi eklendi.");

    // Cleanup fonksiyonu: Component unmount olduğunda dinleyiciyi kaldır
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      console.log("[ThemeProvider] Sistem tema değişiklikleri dinleyicisi kaldırıldı.");
    };
  }, [theme, applyTheme]); // applyTheme'i dependency array'e eklemek önemli

  // 6. Kullanıcının Seçtiği Temayı Değiştirme Fonksiyonu
  const setTheme = (newThemeToSet: Theme) => {
    console.log(`[ThemeProvider] setTheme çağrıldı. Ayarlanmak istenen yeni tema: ${newThemeToSet}`);
    try {
      localStorage.setItem(storageKey, newThemeToSet);
      console.log(`[ThemeProvider] Tema localStorage'a kaydedildi: ${storageKey} -> ${newThemeToSet}`);
    } catch (e) {
      console.error("[ThemeProvider] Temayı localStorage'a kaydederken hata:", e);
    }
    // Sadece gerçekten değiştiyse state'i güncelle
    if (theme !== newThemeToSet) {
        setThemeState(newThemeToSet); // Bu, yukarıdaki useEffect [theme]'i tetikleyecek
        console.log(`[ThemeProvider] theme state güncellendi: ${newThemeToSet}`);
    } else {
        console.log(`[ThemeProvider] Ayarlanmak istenen tema (${newThemeToSet}) zaten mevcut tema. State güncellenmedi.`);
        // Eğer tema aynıysa ama çözümlenmiş tema farklı olabilir (örneğin auto'dan manuele geçişte),
        // yine de applyTheme'i çağırmak isteyebiliriz.
        // Ancak mevcut mantıkta setThemeState tetiklemesi yeterli olmalı.
        // Eğer tema aynı kalıyorsa (örneğin kullanıcı tekrar 'auto'ya bastı), yine de applyTheme'i tetiklemek için:
        applyTheme(newThemeToSet); 
    }
  };
  
  // FOUC (Flash Of Unstyled Content) Önleme Notu:
  // Bu useEffect tabanlı yaklaşım çoğu durumda işe yarar ancak mükemmel FOUC önlemesi için
  // <Head> içine bir inline script eklemek veya `next-themes` gibi bir kütüphane kullanmak daha iyidir.
  // O script, React hidrasyonundan önce localStorage'dan temayı okuyup <html>'e class ekler.

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};