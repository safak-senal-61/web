// pages/404.tsx
import Link from "next/link"
import { Home, MessageCircle, Users, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Animation */}
          <div className="relative mb-8">
            <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse">
              404
            </div>
            <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-blue-100 -z-10 blur-sm">404</div>
          </div>

          {/* Brand */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <MessageCircle className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">WebsaChat</h1>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Sayfa Bulunamadı</h2>
            <p className="text-gray-600 text-lg mb-2">Aradığınız sayfa mevcut değil veya taşınmış olabilir.</p>
            <p className="text-gray-500">Belki arkadaşlarınızla sohbet etmeye geri dönmek istersiniz?</p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/" className="flex items-center gap-2">
                <Home className="h-5 w-5" />
                Ana Sayfaya Dön
              </Link>
            </Button>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto">
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white text-black py-4 text-center">
        <p className="text-sm">© 2025 WebsaChat. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  )
}

// BU SATIRI EKLEYİN
NotFound.isPublic = true;