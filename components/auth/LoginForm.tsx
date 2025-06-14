// components/auth/LoginForm.tsx
import { useState, FormEvent } from 'react';
import { useAuth } from '../../hooks/useAuth'; // Kendi hook yolunuzu doğrulayın
import { useRouter } from 'next/router';
import { FaUserAlt, FaLock, FaGoogle, FaArrowRight, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa'; // FaSpinner eklendi
import Link from 'next/link';

const LoginForm = () => {
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formLoading, setFormLoading] = useState(false); // AuthContext'teki isLoading ile karışmaması için farklı isim
  const { login } = useAuth(); // login fonksiyonunu AuthContext'ten alıyoruz
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFormLoading(true);
    console.log("%c[LoginForm] handleSubmit START. formLoading: true", "color: #B8860B;"); // DarkGoldenRod

    if (!loginIdentifier || !password) {
      setError('Kullanıcı adı/E-posta ve şifre alanları zorunludur.');
      setFormLoading(false);
      console.log("%c[LoginForm] Validation Error. formLoading: false", "color: #B8860B;");
      return;
    }

    console.log("%c[LoginForm] Calling login function from AuthContext...", "color: #B8860B;");
    const result = await login({ loginIdentifier, password });
    // login fonksiyonu AuthContext'teki user ve isAuthenticated state'lerini güncelleyecek.
    // O state'lerin güncellenmesi biraz zaman alabilir (asenkron).
    console.log(`%c[LoginForm] AuthContext login result: success=${result.success}, message=${result.message}, 2FA=${result.twoFactorRequired}`, "color: #B8860B;");

    setFormLoading(false); // Yönlendirmeden önce formu tekrar aktif hale getir
    console.log("%c[LoginForm] handleSubmit AFTER login call. formLoading: false", "color: #B8860B;");

    if (result.success) {
      if (result.twoFactorRequired) {
        console.log("%c[LoginForm] 2FA required. Setting error. TODO: Redirect to 2FA page.", "color: #B8860B;");
        setError("İki faktörlü doğrulama gerekiyor. Bu özellik henüz tamamlanmadı.");
        // Örnek: router.push(`/verify-2fa?userId=${result.userId}`); // userId gibi bir bilgiye ihtiyaç olabilir
      } else {
        console.log("%c[LoginForm] Login successful! ATTEMPTING router.push('/home')...", "color: green; font-weight: bold; font-size: 14px;");
        // Yönlendirme burada yapılıyor. AuthContext'in güncellenmiş state'i
        // /home sayfası render edilirken AuthGuard tarafından okunacak.
        router.push('/home');
        // Bu log genellikle görünmez çünkü sayfa hemen değişir.
        // console.log("%c[LoginForm] AFTER router.push('/home') call.", "color: green;");
      }
    } else {
      console.log(`%c[LoginForm] Login FAILED. Error: ${result.message}`, "color: red;");
      setError(result.message);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl w-full max-w-xs mx-auto">
      <div className="p-6">
      <div className="text-center mb-5">
  <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-3 shadow-lg">
    <img
      src="/assets/logo.png"
      alt="Logo"
      className="w-8 h-8 object-contain"
    />
  </div>
  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
    WebsaChat
  </h1>
  <p className="text-sm text-slate-300 mt-1">Hoş Geldiniz</p>
</div>

        {error && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-300 p-3 rounded-lg mb-4 text-sm">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
              <span className="text-xs leading-relaxed">{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserAlt className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="loginIdentifier"
              value={loginIdentifier}
              onChange={(e) => setLoginIdentifier(e.target.value)}
              placeholder="Kullanıcı adı veya e-posta"
              required
              disabled={formLoading}
              className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              required
              disabled={formLoading}
              className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-400 transition-colors duration-200"
              disabled={formLoading}
            >
              {showPassword ? 
                <FaEyeSlash className="h-4 w-4" /> : 
                <FaEye className="h-4 w-4" />
              }
            </button>
          </div>

          <button
            type="submit"
            disabled={formLoading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] text-sm"
          >
            {formLoading ? (
              <div className="flex items-center space-x-2">
                <FaSpinner className="w-4 h-4 animate-spin" /> {/* FaSpinner kullanıldı */}
                <span>Giriş Yapılıyor...</span>
              </div>
            ) : (
              <>
                <span>Giriş Yap</span>
                <FaArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="my-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/20"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-white/5 text-slate-300 rounded">VEYA</span>
          </div>
        </div>

        <button
          onClick={() => alert('Google ile Giriş Yap özelliği henüz aktif değil.')}
          disabled={formLoading}
          className="w-full py-2.5 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98] text-sm"
        >
          <FaGoogle className="h-4 w-4 text-red-400" />
          <span>Google ile Giriş</span>
        </button>

        <div className="mt-4 text-center space-y-2">
          <a 
            href="#" // Şifremi unuttum için uygun bir yola yönlendirilmeli
            className="block text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 hover:underline"
          >
            Şifremi Unuttum
          </a>
          <Link href="/register/" className="text-blue-400 hover:text-blue-300">
            Hesabınız yok mu? Kayıt olun
          </Link>
        </div>
      </div>
      <div className="text-center py-4 relative z-20">
        <p className="text-xs text-slate-400">© 2025 WebsaChat. Tüm hakları saklıdır.</p>
      </div>
    </div>
  );
};

export default LoginForm;