import React, { Suspense, Component, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

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

// --- 3D Model Bileşeni (GÜNCELLENDİ) ---
useGLTF.preload('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf');

function Model(props: any) {
  // GLTF dosyasından sahnenin tamamını ve node'ları alıyoruz.
  const { scene, nodes } = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/iphone-x/model.gltf');
  
  // Hata ayıklama için: Konsolda modelin hangi parçalara sahip olduğunu görün.
  // Bu satırı geliştirme sırasında açık bırakabilirsiniz.
  console.log("Yüklenen Modelin Parçaları (Nodes):", nodes);

  // Modeli yavaşça döndürmek için useFrame kancasını kullanıyoruz.
  const group = useRef<any>();
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.2;
    }
  });

  // Hatanın çözümü: 'nodes.body.geometry' gibi spesifik bir parçaya erişmek yerine,
  // yüklenen sahnenin tamamını 'primitive' nesnesi ile render ediyoruz.
  // Bu, modelin içindeki tüm parçaları otomatik olarak doğru materyallerle çizer.
  return (
    <group ref={group} {...props}>
      <primitive object={scene} />
    </group>
  );
}

// --- Yükleniyor ve Hata Göstergeleri (Değişiklik Yok) ---
const Loader = () => ( /* ... öncekiyle aynı ... */ 
    <div className="flex h-full w-full items-center justify-center">
    <div className="text-center">
      <svg className="mx-auto h-12 w-12 animate-spin text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-2 text-sm text-slate-500">Animasyon Yükleniyor...</p>
    </div>
  </div>
);
const ErrorFallback = () => ( /* ... öncekiyle aynı ... */ 
    <div className="flex h-full w-full items-center justify-center rounded-3xl bg-slate-100 p-4">
        <div className="text-center">
             <div className="text-4xl mb-2">😕</div>
             <p className="font-semibold text-slate-700">Animasyon Yüklenemedi</p>
             <p className="text-xs text-slate-500">Model yüklenirken bir sorun oluştu.</p>
        </div>
    </div>
);


// --- Ana Animasyon Bileşeni (Değişiklik Yok) ---
const PhoneAnimation = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Loader />}>
        <Canvas camera={{ position: [0, 1, 12], fov: 30 }} gl={{ preserveDrawingBuffer: true }}>
          <ambientLight intensity={1.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-10, -10, -10]} intensity={0.8} color="#c8a2c8" />
          <spotLight position={[5, 0, 15]} intensity={2} angle={0.3} penumbra={0.5} castShadow />
          <Model scale={1.8} rotation={[0.1, -0.2, 0]} />
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