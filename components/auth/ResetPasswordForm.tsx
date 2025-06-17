// components/auth/ResetPasswordForm.tsx

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { FaLock, FaArrowRight, FaSpinner, FaEye, FaEyeSlash } from 'react-icons/fa';
import { resetPassword } from '../../services/authService';

interface ResetPasswordFormProps {
  token: string;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ token }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError('Şifreler eşleşmiyor.');
      return;
    }
    if (password.length < 8) {
      setError('Şifre en az 8 karakter olmalıdır.');
      return;
    }

    setLoading(true);
    const result = await resetPassword(token, password, confirmPassword);
    setLoading(false);

    if (result.basarili) {
      setMessage(result.mesaj + ' Giriş sayfasına yönlendiriliyorsunuz...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } else {
      setError(result.mesaj);
    }
  };

  return (
     <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl w-full max-w-xs mx-auto">
      <div className="p-6">
        <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-white">Yeni Şifre Belirle</h1>
        </div>

        {error && <div className="bg-red-500/10 border border-red-400/30 text-red-300 p-3 rounded-lg mb-4 text-xs">{error}</div>}
        {message && <div className="bg-green-500/10 border border-green-400/30 text-green-300 p-3 rounded-lg mb-4 text-xs">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="h-4 w-4 text-slate-400" /></div>
                <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Yeni Şifre"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-400"><FaEye/></button>
            </div>
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FaLock className="h-4 w-4 text-slate-400" /></div>
                <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Yeni Şifre (Tekrar)"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-10 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                />
                 <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-blue-400">{showPassword ? <FaEyeSlash /> : <FaEye />}</button>
            </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg text-sm"
          >
            {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaArrowRight className="h-4 w-4" />}
            <span>{loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;