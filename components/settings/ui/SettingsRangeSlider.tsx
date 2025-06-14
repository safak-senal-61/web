// components/settings/ui/SettingsRangeSlider.tsx
import React from 'react';

interface SettingsRangeSliderProps {
  label: string;
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  colorScheme?: string; // Slider'ın aktif kısmının rengi için kullanılabilir
}

const SettingsRangeSlider: React.FC<SettingsRangeSliderProps> = ({
  label,
  id,
  value,
  onChange,
  min = 0,
  max = 100,
  colorScheme = 'blue', // Varsayılan renk şeması
}) => {
  // colorScheme'e göre Tailwind renklerini oluşturuyoruz.
  // Bu, Tailwind'in JIT modunda dinamik olarak sınıf üretmesini sağlar.
  // Önemli: Bu renklerin Tailwind config'inizde veya varsayılan Tailwind paletinde olması gerekir.
  const accentColorClass = `accent-${colorScheme}-500 dark:accent-${colorScheme}-400`;

  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2" // Label metin rengi
      >
        {label}
      </label>
      <div className="flex items-center space-x-4">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer
                     bg-slate-300 dark:bg-slate-700               // Track (kaydırma yolu) arka planı
                     ${accentColorClass}                           // Thumb (kaydırma topuzu) ve aktif track rengi
                     slider                                       // Özel stiller için hala bu class'ı tutabiliriz
                    `}
          // style={{ accentColor: 'your_color' }} // JavaScript ile de ayarlanabilir ama class daha iyi
        />
        <span className="font-medium w-12 text-right text-slate-700 dark:text-slate-200"> {/* Yüzde metin rengi */}
          {value}%
        </span>
      </div>
    </div>
  );
};

export default SettingsRangeSlider;

// Ek olarak, daha iyi tarayıcı uyumluluğu için `globals.css`'e bazı temel slider stilleri ekleyebilirsiniz:
/*
.slider {
  // Webkit (Chrome, Safari, Edge)
  &::-webkit-slider-thumb {
    -webkit-appearance: none; // Varsayılan görünümü kaldır
    appearance: none;
    width: 16px; // Thumb genişliği
    height: 16px; // Thumb yüksekliği
    border-radius: 50%; // Yuvarlak thumb
    // background: currentColor; // accent-color bunu yönetir, ama fallback olarak eklenebilir
    cursor: pointer;
    margin-top: -7px; // Dikey olarak ortalamak için (track yüksekliğinin yarısı eksi thumb yüksekliğinin yarısı)
                      // (track h-2 yani 8px, thumb 16px -> (8-16)/2 = -4, ama border vs. ile oynayabilir)
                      // Bu değer track'in yüksekliğine (h-2) ve thumb'ın boyutuna göre ayarlanmalı.
  }

  // Firefox
  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    // background: currentColor; // accent-color bunu yönetir
    cursor: pointer;
    border: none; // Firefox bazen kenarlık ekler
  }

  // Firefox için track'in dolan kısmını stillendirmek daha zordur,
  // accent-color genellikle hem thumb hem de dolan kısmı yönetir.
  // &::-moz-range-progress {
  //   background-color: currentColor; // accent-color bunu yönetir
  // }
}
*/