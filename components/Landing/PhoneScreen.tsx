import React from 'react';
import { RoundedBox, Text } from '@react-three/drei';
import { Color } from 'three';

// WebSaChat mobil uygulaması için ekran içeriği
const PhoneScreen = () => {
  return (
    <group position={[0, 0, 0.51]}>
      {/* Ana ekran arka planı */}
      <RoundedBox args={[3.4, 6.8, 0.01]} radius={0.3} smoothness={4}>
        <meshStandardMaterial 
          color="#0f0f23"
          emissive={new Color("#1a1a2e")} 
          emissiveIntensity={0.3}
        />
      </RoundedBox>
      
      {/* Header - WebSaChat Logo */}
      <group position={[0, 2.8, 0.02]}>
        <Text
          fontSize={0.35}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Bold.woff"
        >
          WebSaChat
        </Text>
        
        {/* Online durum göstergesi */}
        <mesh position={[1.2, 0, 0]} geometry={new THREE.SphereGeometry(0.06)}>
          <meshStandardMaterial 
            color="#00ff88" 
            emissive={new Color("#00ff88")}
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      
      {/* Chat container */}
      <group position={[0, 0.2, 0.02]}>
        {/* Gelen mesaj 1 */}
        <group position={[-0.8, 1.5, 0]}>
          <RoundedBox args={[2.2, 0.4, 0.05]} radius={0.15}>
            <meshStandardMaterial color="#2d3748" />
          </RoundedBox>
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Merhaba! Nasılsın?
          </Text>
        </group>
        
        {/* Giden mesaj 1 */}
        <group position={[0.8, 0.8, 0]}>
          <RoundedBox args={[2.0, 0.4, 0.05]} radius={0.15}>
            <meshStandardMaterial color="#4a90e2" />
          </RoundedBox>
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            İyiyim, sen?
          </Text>
        </group>
        
        {/* Gelen mesaj 2 */}
        <group position={[-0.7, 0.1, 0]}>
          <RoundedBox args={[2.4, 0.4, 0.05]} radius={0.15}>
            <meshStandardMaterial color="#2d3748" />
          </RoundedBox>
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            WebSaChat harika!
          </Text>
        </group>
        
        {/* Giden mesaj 2 */}
        <group position={[0.9, -0.6, 0]}>
          <RoundedBox args={[1.8, 0.4, 0.05]} radius={0.15}>
            <meshStandardMaterial color="#4a90e2" />
          </RoundedBox>
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Kesinlikle! 😊
          </Text>
        </group>
        
        {/* Yazıyor göstergesi */}
        <group position={[-0.8, -1.3, 0]}>
          <RoundedBox args={[1.5, 0.3, 0.05]} radius={0.15}>
            <meshStandardMaterial color="#2d3748" opacity={0.8} transparent />
          </RoundedBox>
          <Text
            position={[0, 0, 0.03]}
            fontSize={0.1}
            color="#a0aec0"
            anchorX="center"
            anchorY="middle"
          >
            yazıyor...
          </Text>
        </group>
      </group>
      
      {/* Alt mesaj yazma alanı */}
      <group position={[0, -2.8, 0.02]}>
        <RoundedBox args={[3.0, 0.4, 0.03]} radius={0.2}>
          <meshStandardMaterial color="#2d3748" />
        </RoundedBox>
        <Text
          position={[-0.8, 0, 0.02]}
          fontSize={0.1}
          color="#a0aec0"
          anchorX="left"
          anchorY="middle"
        >
          Mesaj yazın...
        </Text>
        
        {/* Gönder butonu */}
        <mesh position={[1.2, 0, 0.02]} geometry={new THREE.SphereGeometry(0.15)}>
          <meshStandardMaterial 
            color="#4a90e2" 
            emissive={new Color("#4a90e2")}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
      
      {/* Alt navigasyon çubuğu */}
      <RoundedBox args={[1.2, 0.08, 0.02]} radius={0.04} position={[0, -3.2, 0.02]}>
        <meshStandardMaterial color="#ffffff" opacity={0.6} transparent />
      </RoundedBox>
    </group>
  );
};

export default PhoneScreen;