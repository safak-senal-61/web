// pages/protected-page.tsx
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Link from 'next/link'; // next/link importu doğru

const ProtectedPage = () => {
  const { user, isLoading, accessToken } = useAuth(); // accessToken'ı da useAuth'tan alalım
  const router = useRouter();

  // Konsol logları (Hata ayıklama için, üretimde kaldırılabilir)
  console.log("[ProtectedPage] Rendering. isLoading:", isLoading, "User:", user ? user.username : null);

  useEffect(() => {
    console.log("[ProtectedPage] useEffect triggered. isLoading:", isLoading, "User:", user ? user.username : null);
    if (!isLoading && !user) {
      console.log("[ProtectedPage] User not found and not loading, redirecting to /login?redirect=/protected-page");
      router.push('/login?redirect=/protected-page');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    console.log("[ProtectedPage] isLoading is true, showing 'Yükleniyor...'");
    return <p className="p-5 text-white">Yükleniyor...</p>;
  }

  if (!user) {
    console.log("[ProtectedPage] User is null (and not loading), showing 'Bu sayfayı görmek için giriş yapmalısınız...'");
    return <p className="p-5 text-white">Bu sayfayı görmek için giriş yapmalısınız. Yönlendiriliyorsunuz...</p>;
  }

  // Kullanıcı varsa ve yükleme tamamlandıysa, korumalı sayfa içeriği
  console.log("[ProtectedPage] User found, rendering content for:", user.username);
  return (
    // Ana div için Tailwind sınıfları kullanmak daha iyi olur: className="p-5 text-white bg-dark-bg min-h-screen" gibi
    <div style={{ padding: '20px', color: 'white' /* Arka plan rengini de ayarlamak isteyebilirsiniz */ }}>
      <h1 className="text-3xl font-bold mb-4">Korumalı Sayfa</h1>
      <p className="mb-2">
        Merhaba {user.username}, burası sadece giriş yapanların görebileceği özel bir alan.
      </p>
      <p className="mb-4">
        Access Token (Normalde gösterilmez, test amaçlı):{" "}
        <code
          // Tailwind ile stil vermek daha iyi olur: className="bg-gray-700 p-1 rounded text-sm break-all"
          style={{ backgroundColor: '#333', padding: '2px 4px', borderRadius: '4px', wordBreak: 'break-all' }}
        >
          {accessToken ? accessToken.substring(0, 30) + "..." : "Yok"}
        </code>
      </p>
      {/* GÜNCELLENMİŞ Link KULLANIMI */}
      <Link
        href="/"
        // Stil doğrudan Link'e veya Tailwind sınıflarıyla verin
        // className="text-brand-primary hover:underline" // tailwind.config.js'de 'brand-primary' tanımlıysa
        style={{ color: '#64ffda', textDecoration: 'none' }}
        onMouseOver={(e) => (e.currentTarget.style.textDecoration = 'underline')}
        onMouseOut={(e) => (e.currentTarget.style.textDecoration = 'none')}
      >
        Ana Sayfaya Dön
      </Link>
    </div>
  );
};

export default ProtectedPage;