// components/settings/ui/SettingsToggle.tsx
import React from 'react';

interface SettingsToggleProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  colorScheme?: string; // Toggle açıkken kullanılacak renk şeması (örn: 'blue', 'orange')
  focusRingColor?: string; // Odaklanma halkası için Tailwind class'ı (örn: 'peer-focus:ring-blue-800')
}

const SettingsToggle: React.FC<SettingsToggleProps> = ({
  id,
  title,
  description,
  checked,
  onChange,
  colorScheme = 'blue', // Varsayılan renk (açıkken)
  focusRingColor = `peer-focus:ring-${colorScheme}-500/50 dark:peer-focus:ring-${colorScheme}-400/50` // Tema duyarlı focus rengi
}) => {
  // Toggle açıkken kullanılacak arka plan rengi. colorScheme'e göre dinamik.
  // Aydınlık modda -600, karanlık modda -500 (biraz daha canlı) tonunu kullanabiliriz.
  const peerCheckedBgColorLight = `peer-checked:bg-${colorScheme}-600`;
  const peerCheckedBgColorDark = `dark:peer-checked:bg-${colorScheme}-500`;

  return (
    <div className="flex items-center justify-between p-4 rounded-xl 
                   bg-slate-100 dark:bg-slate-700/30                 // Ana sarmalayıcı arka planı
                   border border-slate-300 dark:border-slate-600/30  // Ana sarmalayıcı kenarlığı
                  ">
      <div>
        <h4 className="font-medium text-slate-800 dark:text-white">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
      </div>
      <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer" // Ekranda görünmez, sadece state'i yönetir
        />
        {/* Toggle switch'in görsel kısmı */}
        <div
          className={`w-11 h-6 rounded-full peer transition-colors
                     bg-slate-300 dark:bg-slate-600                      // Kapalıykenki arka plan
                     peer-focus:outline-none peer-focus:ring-4 
                     ${focusRingColor}                                  // Dinamik ve tema duyarlı focus rengi
                     ${peerCheckedBgColorLight}                         // Açıkkenki arka plan (Aydınlık Mod)
                     ${peerCheckedBgColorDark}                          // Açıkkenki arka plan (Karanlık Mod)
                     peer-checked:after:translate-x-full 
                     peer-checked:after:border-white                    // Topun kenarlığı (açıkken beyaz)
                     after:content-[''] 
                     after:absolute after:top-[2px] after:left-[2px] 
                     after:bg-white                                     // Topun rengi (genellikle beyaz kalır)
                     after:border-gray-300 dark:after:border-slate-500  // Topun kenarlığı (kapalıyken)
                     after:border after:rounded-full 
                     after:h-5 after:w-5 
                     after:transition-all
                    `}
        ></div>
      </label>
    </div>
  );
};

export default SettingsToggle;