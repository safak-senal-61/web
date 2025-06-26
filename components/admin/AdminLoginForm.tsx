// components/admin/AdminLoginForm.tsx

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { FaUserShield, FaLock, FaSignInAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';

const AdminLoginForm: React.FC = () => {
  const [formData, setFormData] = useState({
    loginIdentifier: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await login(formData);
      if (result.success) {
        // Admin girişi başarılı, admin paneline yönlendir
        router.push('/admin');
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('Giriş sırasında bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-purple-900/95 backdrop-blur-xl border border-slate-700/50 shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:border-purple-500/30 group">
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
            <FaUserShield className="text-white text-3xl" />
          </div>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
              Admin Girişi
            </CardTitle>
            <p className="text-slate-400 text-sm leading-relaxed">
              Yönetici paneline erişim için giriş yapın
            </p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 tracking-wide">
                Kullanıcı Adı / Email
              </label>
              <div className="relative group">
                <FaUserShield className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors duration-200" />
                <Input
                  name="loginIdentifier"
                  placeholder="Kullanıcı adı veya email"
                  value={formData.loginIdentifier}
                  onChange={handleChange}
                  required
                  className="pl-12 pr-4 py-3 bg-slate-800/60 border-slate-600/50 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl transition-all duration-200 hover:bg-slate-800/80"
                />
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-300 tracking-wide">
                Şifre
              </label>
              <div className="relative group">
                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors duration-200" />
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Şifrenizi girin"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="pl-12 pr-12 py-3 bg-slate-800/60 border-slate-600/50 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 rounded-xl transition-all duration-200 hover:bg-slate-800/80"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-purple-400 transition-colors duration-200"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm animate-pulse">
                <p className="text-red-300 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="tracking-wide">Giriş yapılıyor...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-3">
                  <FaSignInAlt className="text-lg" />
                  <span className="tracking-wide">Giriş Yap</span>
                </div>
              )}
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-slate-400 text-sm">
              Admin kaydı için{' '}
              <button
                onClick={() => router.push('/admin/register')}
                className="text-purple-400 hover:text-purple-300 underline decoration-2 underline-offset-2 transition-all duration-200 hover:decoration-purple-300 font-medium"
              >
                buraya tıklayın
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
  );
};

export default AdminLoginForm;