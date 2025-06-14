// components/auth/RegisterForm.tsx
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FaUserAlt, FaEnvelope, FaLock, FaUserTag, FaArrowRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import apiClient from '../../lib/apiClient';
import { useAuth } from '../../hooks/useAuth';

interface RegisterResponse {
  basarili: boolean;
  mesaj: string;
}

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    if (!username || !email || !password || !nickname) {
      setError('Tüm alanlar zorunludur.');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
        setError('Şifre en az 8 karakter olmalıdır.');
        setLoading(false);
        return;
    }

    try {
      const response = await apiClient.post<RegisterResponse>('/auth/register', {
        username,
        email,
        password,
        nickname,
      });

      if (response.data.basarili) {
        setSuccessMessage(response.data.mesaj + " Giriş sayfasına yönlendiriliyorsunuz...");
        setTimeout(() => {
          router.push('/login');
        }, 4000); 
      } else {
        setError(response.data.mesaj || 'Kayıt sırasında bir hata oluştu.');
      }
    } catch (err: unknown) {
      console.error("Register error:", err);
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'mesaj' in err.response.data) {
        setError(err.response.data.mesaj as string);
      } else {
        setError('Kayıt sırasında bir ağ hatası veya bilinmeyen bir sorun oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl w-full max-w-xs mx-auto">
      <div className="p-6">
        {/* Kompakt Header */}
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
  <p className="text-sm text-slate-300 mt-1">Hesap Oluştur</p>
</div>


        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-300 p-3 rounded-lg mb-4 text-sm">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-red-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
              <span className="text-xs leading-relaxed">{error}</span>
            </div>
          </div>
        )}
        {/* Success Message */}
        {successMessage && (
           <div className="bg-green-500/10 border border-green-400/30 text-green-300 p-3 rounded-lg mb-4 text-sm">
            <div className="flex items-start">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-2 mt-1.5 flex-shrink-0"></div>
              <span className="text-xs leading-relaxed">{successMessage}</span>
            </div>
          </div>
        )}

        {/* Kompakt Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Nickname Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserTag className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Takma Adınız"
              required
              disabled={loading}
              className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Username Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaUserAlt className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Kullanıcı adı"
              required
              disabled={loading}
              className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresi"
              required
              disabled={loading}
              className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre (En az 8 karakter)"
              required
              disabled={loading}
              className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-400 transition-colors duration-200"
              disabled={loading}
              aria-label={showPassword ? "Şifreyi gizle" : "Şifreyi göster"}
            >
              {showPassword ? 
                <FaEyeSlash className="h-4 w-4" /> : 
                <FaEye className="h-4 w-4" />
              }
            </button>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] text-sm mt-4"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Hesap Oluşturuluyor...</span>
              </div>
            ) : (
              <>
                <span>Kayıt Ol</span>
                <FaArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

            {/* Links */}
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-slate-300">
                Zaten bir hesabın var mı?{' '}
                <Link 
                  href="/login" 
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 hover:underline"
                >
                  Giriş Yap
                </Link>
              </p>
            </div>
          </div>
          
    

      {/* Footer */}
      <div className="text-center py-4 relative z-20">
        <p className="text-xs text-slate-400">© 2025 WebsaChat. Tüm hakları saklıdır.</p>
      </div>
      </div>
  );
};

export default RegisterForm;