import React, { Suspense, Component, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, RoundedBox, Text } from '@react-three/drei';
import { Color } from 'three';
import * as THREE from 'three';

// --- Hata Sınırı Bileşeni ---
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

// --- Modern WebSaChat Ekran İçeriği ---
const PhoneScreen = () => {
  return (
    <group position={[0, 0, 0.26]}>
      {/* Ana ekran - modern gradyan */}
      <RoundedBox args={[3.2, 6.4, 0.01]} radius={0.3} smoothness={4}>
        <meshStandardMaterial 
          color="#0a0a0f"
          emissive={new Color("#1a1a2e")} 
          emissiveIntensity={0.4}
        />
      </RoundedBox>
      
      {/* Header */}
      <group position={[0, 2.6, 0.02]}>
        <Text
          fontSize={0.3}
          color="#9B177E"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.02}
        >
          WEBSACHAT
        </Text>
        
        {/* Online indicator */}
        <mesh position={[1, 0, 0]}>
          <sphereGeometry args={[0.05]} />
          <meshStandardMaterial 
            color="#00ff88" 
            emissive={new Color("#00ff88")}
            emissiveIntensity={0.6}
          />
        </mesh>
      </group>
      
      {/* Chat messages */}
      <group position={[0, 0.5, 0.02]}>
        {/* Incoming message */}
        <group position={[-0.6, 1.2, 0]}>
          <RoundedBox args={[1.8, 0.3, 0.04]} radius={0.15}>
            <meshStandardMaterial color="#2a2a3e" />
          </RoundedBox>
          <Text
            position={[0, 0, 0.025]}
            fontSize={0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Merhaba! 👋
          </Text>
        </group>
        
        {/* Outgoing message */}
        <group position={[0.6, 0.7, 0]}>
          <RoundedBox args={[1.6, 0.3, 0.04]} radius={0.15}>
            <meshStandardMaterial 
              color="#4a90e2"
              emissive={new Color("#2563eb")}
              emissiveIntensity={0.2}
            />
          </RoundedBox>
          <Text
            position={[0, 0, 0.025]}
            fontSize={0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Selam! 😊
          </Text>
        </group>
        
        {/* Another incoming */}
        <group position={[-0.5, 0.2, 0]}>
          <RoundedBox args={[2, 0.3, 0.04]} radius={0.15}>
            <meshStandardMaterial color="#2a2a3e" />
          </RoundedBox>
          <Text
            position={[0, 0, 0.025]}
            fontSize={0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            Nasılsın? ✨
          </Text>
        </group>
        
        {/* Typing indicator */}
        <group position={[-0.8, -0.3, 0]}>
          <RoundedBox args={[1.2, 0.25, 0.04]} radius={0.12}>
            <meshStandardMaterial color="#2a2a3e" opacity={0.8} transparent />
          </RoundedBox>
          <Text
            position={[0, 0, 0.025]}
            fontSize={0.06}
            color="#888"
            anchorX="center"
            anchorY="middle"
          >
            yazıyor...
          </Text>
        </group>
      </group>
      
      {/* Input area */}
      <group position={[0, -2.4, 0.02]}>
        <RoundedBox args={[2.8, 0.3, 0.03]} radius={0.15}>
          <meshStandardMaterial color="#1a1a2e" />
        </RoundedBox>
        <Text
          position={[-0.6, 0, 0.02]}
          fontSize={0.07}
          color="#666"
          anchorX="left"
          anchorY="middle"
        >
          Mesaj yazın...
        </Text>
        
        {/* Send button */}
        <mesh position={[1, 0, 0.02]}>
          <sphereGeometry args={[0.12]} />
          <meshStandardMaterial 
            color="#4a90e2" 
            emissive={new Color("#2563eb")}
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>
    </group>
  );
};

// --- 3D Telefon Modeli ---
function CustomPhone(props: any) {
  const group = useRef<THREE.Group>(null);
  
  // Hafif sallanma animasyonu
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={group} {...props}>
      {/* Ana telefon gövdesi */}
      <RoundedBox args={[3.6, 7.2, 0.4]} radius={0.4} smoothness={8}>
        <meshStandardMaterial 
          color="#1a1a1a"
          metalness={0.9}
          roughness={0.1}
          emissive={new Color("#0a0a0a")}
          emissiveIntensity={0.1}
        />
      </RoundedBox>
      
      {/* Ekran çerçevesi */}
      <RoundedBox args={[3.4, 6.6, 0.02]} radius={0.35} position={[0, 0, 0.21]}>
        <meshStandardMaterial color="#000000" />
      </RoundedBox>
      
      {/* Ekran içeriği */}
      <PhoneScreen />
      
      {/* Üst sensör/hoparlör */}
      <RoundedBox args={[0.8, 0.06, 0.02]} radius={0.03} position={[0, 2.8, 0.22]}>
        <meshStandardMaterial color="#333" />
      </RoundedBox>
      
      {/* Kamera */}
      <mesh position={[-0.8, 2.8, 0.22]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} />
        <meshStandardMaterial color="#111" metalness={1} roughness={0} />
      </mesh>
      
      {/* Home düğmesi */}
      <mesh position={[0, -3, 0.22]}>
        <cylinderGeometry args={[0.2, 0.2, 0.03, 32]} />
        <meshStandardMaterial 
          color="#2a2a2a"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      
      {/* Yan düğmeler */}
      <RoundedBox args={[0.04, 0.6, 0.08]} radius={0.02} position={[-1.82, 1, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </RoundedBox>
      
      <RoundedBox args={[0.04, 0.3, 0.08]} radius={0.02} position={[-1.82, 0.2, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </RoundedBox>
      
      <RoundedBox args={[0.04, 0.3, 0.08]} radius={0.02} position={[-1.82, -0.2, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </RoundedBox>
      
      {/* Power düğmesi */}
      <RoundedBox args={[0.04, 0.4, 0.08]} radius={0.02} position={[1.82, 1, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.9} roughness={0.1} />
      </RoundedBox>
    </group>
  );
}

// --- Loading ve Error Components ---
const Loader = () => (
  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl">
    <div className="text-center">
      <div className="relative">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin mx-auto" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
      </div>
      <p className="mt-4 text-sm text-slate-300 font-medium">WebSaChat Yükleniyor...</p>
    </div>
  </div>
);

const ErrorFallback = () => (
  <div className="flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br from-red-900/20 to-slate-900 p-6 border border-red-500/20">
    <div className="text-center">
      <div className="text-5xl mb-4">📱</div>
      <p className="font-semibold text-slate-200 text-lg">3D Model Yüklenemedi</p>
      <p className="text-sm text-slate-400 mt-2">Tarayıcınız WebGL desteklemiyor olabilir.</p>
    </div>
  </div>
);

// --- Ana Component ---
const PhoneAnimation = () => {
  return (
    <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] mx-auto touch-none">
      <ErrorBoundary fallback={<ErrorFallback />}>
        <Suspense fallback={<Loader />}>
          <Canvas 
            camera={{ position: [0, 0, 12], fov: 25 }} 
            gl={{ 
              preserveDrawingBuffer: true,
              antialias: true,
              alpha: true 
            }}
            className="rounded-2xl overflow-hidden"
            style={{ touchAction: 'none' }}
          >
            {/* Gelişmiş aydınlatma */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.8} color="#ffffff" />
            <directionalLight position={[-3, -3, -3]} intensity={0.3} color="#4a90e2" />
            <spotLight 
              position={[0, 0, 10]} 
              intensity={1.2} 
              angle={0.4} 
              penumbra={0.3}
              color="#ffffff"
            />
            
            {/* Telefon modeli - çok daha küçük */}
            <CustomPhone scale={0.6} position={[0, 0, 0]} />
            
            {/* Sınırlı kontroller - mobil dostu */}
            <OrbitControls 
              enableZoom={false}
              enablePan={false}
              autoRotate={false}
              enableRotate={true}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
              minAzimuthAngle={-Math.PI / 6}
              maxAzimuthAngle={Math.PI / 6}
              enableDamping={true}
              dampingFactor={0.05}
              touches={{
                ONE: THREE.TOUCH.ROTATE,
                TWO: THREE.TOUCH.DOLLY_PAN
              }}
            />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default PhoneAnimation;