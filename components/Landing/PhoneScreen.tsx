import React from 'react';
import { useTexture } from '@react-three/drei';
import { Color } from 'three';

// Bu bileşen, telefon ekranında görünecek içeriği oluşturur.
// Logo ve arka plan gradyanını birleştirir.
const PhoneScreen = () => {
  // Logonuzu public klasöründen yüklüyoruz.
  // Projenizin yapısına göre yolun doğru olduğundan emin olun.
  const logoTexture = useTexture('/assets/logo.png');

  return (
    <meshStandardMaterial emissive={new Color("#4a0072")} emissiveIntensity={1.5}>
      {/* Ekranın kendisine bir gradyan ve logo ekliyoruz.
        Bu, ekranın statik olmasından daha canlı bir görünüm kazandırır.
      */}
      <planeGeometry args={[3.6, 7.8]} /> 
      {/* `emissive` özelliği, malzemenin ışık kaynağı gibi parlamasını sağlar.
        Bu sayede ekran, karanlıkta bile canlı görünür.
      */}
      <meshStandardMaterial
        map={logoTexture} // Logoyu ekranın dokusu olarak ata
        transparent={true}
        opacity={0.9}
        emissive={new Color("#ffffff")} // Logoya hafif bir parlaklık ver
        emissiveIntensity={0.6}
      />
    </meshStandardMaterial>
  );
};

export default PhoneScreen;