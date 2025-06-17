// components/auth/ForgotPasswordForm.tsx

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { FaEnvelope, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { requestPasswordReset } from '../../services/authService';

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!email) {
      setError('E-posta alanı zorunludur.');
      setLoading(false);
      return;
    }

    const result = await requestPasswordReset(email);
    setLoading(false);

    if (result.basarili) {
      setMessage(result.mesaj);
    } else {
      setError(result.mesaj);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl shadow-xl w-full max-w-xs mx-auto">
      <div className="p-6">
        <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-white">Şifremi Unuttum</h1>
            <p className="text-sm text-slate-300 mt-1">Sıfırlama linki e-postanıza gönderilecek.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-400/30 text-red-300 p-3 rounded-lg mb-4 text-xs leading-relaxed">{error}</div>
        )}
        {message && (
           <div className="bg-green-500/10 border border-green-400/30 text-green-300 p-3 rounded-lg mb-4 text-xs leading-relaxed">{message}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Kayıtlı e-posta adresiniz"
              required
              disabled={loading}
              className="w-full pl-10 pr-3 py-2.5 bg-white/5 border border-white/20 rounded-lg text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 transition-all duration-200 disabled:opacity-50"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 shadow-lg hover:shadow-xl text-sm"
          >
            {loading ? <FaSpinner className="w-4 h-4 animate-spin" /> : <FaPaperPlane className="h-4 w-4" />}
            <span>{loading ? 'Gönderiliyor...' : 'Sıfırlama Linki Gönder'}</span>
          </button>
        </form>

        <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-400 hover:text-blue-300 transition-colors hover:underline">
                Giriş sayfasına dön
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;