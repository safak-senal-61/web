import React, { Suspense, Component, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, RoundedBox, Text } from '@react-three/drei';
import { Color } from 'three';

// --- Hata Sınırı Bileşeni (Değişiklik Yok) ---
class ErrorBoundary extends Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: any) { return { hasError: true }; }
  componentDidCatch(error: any, errorInfo: any) { console.error("3D Model Render Hatası:", error, errorInfo); }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

// --- WebSaChat Ekran İçeriği ---
const PhoneScreen = () => {
  return (
    <group position={[0, 0, 0.51]}>
      {/* Ana ekran arka planı - yuvarlatılmış köşeler */}
      <RoundedBox args={[3.4, 6.8, 0.01]} radius={0.3} smoothness={4}>
        <meshStandardMaterial 
          color="#1a1a2e"
          emissive={new Color("#0f0f1e")} 
          emissiveIntensity={0.5}
        />
      </RoundedBox>
      
      {/* WebSaChat Logo Metni */}
      <Text
        position={[0, 2, 0.02]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        font="/fonts/Inter-Bold.woff"
        outlineWidth={0.02}
        outlineColor="#4a90e2"
      >
        WebSaChat
      </Text>
      
      {/* Alt metin */}
      <Text
        position={[0, 1.5, 0.02]}
        fontSize={0.15}
        color="#a0a0a0"
        anchorX="center"
        anchorY="middle"
      >
        Mobil Sohbet Uygulaması
      </Text>
      
      {/* Sohbet balonları simülasyonu */}
      <group position={[0, 0, 0.02]}>
        {/* Sol taraf mesaj */}
        <RoundedBox args={[2.5, 0.4, 0.05]} radius={0.2} position={[-0.4, 0.5, 0]}>
          <meshStandardMaterial color="#4a90e2" />
        </RoundedBox>
        
        {/* Sağ taraf mesaj */}
        <RoundedBox args={[2.2, 0.4, 0.05]} radius={0.2} position={[0.5, 0, 0]}>
          <meshStandardMaterial color="#34d399" />
        </RoundedBox>
        
        {/* Sol taraf mesaj 2 */}
        <RoundedBox args={[2.8, 0.4, 0.05]} radius={0.2} position={[-0.2, -0.5, 0]}>
          <meshStandardMaterial color="#4a90e2" />
        </RoundedBox>
      </group>
      
      {/* Alt çubuk (iOS benzeri) */}
      <RoundedBox args={[1, 0.1, 0.02]} radius={0.05} position={[0, -3, 0.02]}>
        <meshStandardMaterial color="#ffffff" opacity={0.8} transparent />
      </RoundedBox>
    </group>
  );
};

// --- 3D Telefon Modeli (Özelleştirilmiş) ---
function CustomPhone(props: any) {
  const group = useRef<any>();
  
  // Yavaşça döndürme animasyonu
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <group ref={group} {...props}>
      {/* Ana telefon gövdesi - yuvarlatılmış köşeler */}
      <RoundedBox args={[4, 8, 0.5]} radius={0.4} smoothness={8}>
        <meshStandardMaterial 
          color="#2c2c2c"
          metalness={0.8}
          roughness={0.2}
          emissive={new Color("#1a1a1a")}
          emissiveIntensity={0.1}
        />
      </RoundedBox>
      
      {/* Ekran çerçevesi */}
      <RoundedBox args={[3.6, 7.2, 0.02]} radius={0.35} position={[0, 0, 0.26]}>
        <meshStandardMaterial color="#000000" />
      </RoundedBox>
      
      {/* WebSaChat ekran içeriği */}
      <PhoneScreen />
      
      {/* Üst hoparlör */}
      <RoundedBox args={[1.2, 0.1, 0.05]} radius={0.05} position={[0, 3.2, 0.26]}>
        <meshStandardMaterial color="#1a1a1a" />
      </RoundedBox>
      
      {/* Ana butun (iPhone benzeri) */}
      <mesh position={[0, -3.5, 0.26]} geometry={new THREE.CylinderGeometry(0.25, 0.25, 0.05, 32)}>
        <meshStandardMaterial 
          color="#333333"
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* Ses düğmeleri */}
      <RoundedBox args={[0.05, 0.8, 0.1]} radius={0.025} position={[-2.05, 1.5, 0]}>
        <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      
      <RoundedBox args={[0.05, 0.4, 0.1]} radius={0.025} position={[-2.05, 0.3, 0]}>
        <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      
      <RoundedBox args={[0.05, 0.4, 0.1]} radius={0.025} position={[-2.05, -0.3, 0]}>
        <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      
      {/* Power düğmesi */}
      <RoundedBox args={[0.05, 0.6, 0.1]} radius={0.025} position={[2.05, 1.5, 0]}>
        <meshStandardMaterial color="#2c2c2c" metalness={0.8} roughness={0.2} />
      </RoundedBox>
    </group>
  );
}

// --- Yükleniyor ve Hata Göstergeleri ---
const Loader = () => (
  <div className="flex h-full w-full items-center justify-center">
    <div className="text-center">
      <svg className="mx-auto h-12 w-12 animate-spin text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-2 text-sm text-slate-500">WebSaChat Yükleniyor...</p>
    </div>
  </div>
);

const ErrorFallback = () => (
  <div className="flex h-full w-full items-center justify-center rounded-3xl bg-slate-100 p-4">
    <div className="text-center">
      <div className="text-4xl mb-2">😕</div>
      <p className="font-semibold text-slate-700">Animasyon Yüklenemedi</p>
      <p className="text-xs text-slate-500">Model yüklenirken bir sorun oluştu.</p>
    </div>
  </div>
);

// --- Ana Animasyon Bileşeni ---
const PhoneAnimation = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Loader />}>
        <Canvas camera={{ position: [0, 1, 12], fov: 30 }} gl={{ preserveDrawingBuffer: true }}>
          {/* Aydınlatma düzenlemesi */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={0.4} color="#4a90e2" />
          <spotLight position={[0, 0, 15]} intensity={1.5} angle={0.3} penumbra={0.5} />
          
          {/* Özelleştirilmiş telefon modeli */}
          <CustomPhone scale={1.2} rotation={[0.1, -0.2, 0]} />
          
          <OrbitControls 
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 2.5}
          />
        </Canvas>
      </Suspense>
    </ErrorBoundary>
  );
};

export default PhoneAnimation;