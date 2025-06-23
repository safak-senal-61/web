// components/admin/AdminRegistrationForm.tsx

import React, { useState, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { registerAdmin } from '@/services/authService';
import { FaUserShield, FaEnvelope, FaLock, FaKey } from 'react-icons/fa';

const AdminRegistrationForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    registrationSecret: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    const response = await registerAdmin(formData);
    if (response.basarili) {
        setSuccess(response.mesaj);
    } else {
        setError(response.mesaj);
    }
    setIsLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-800 p-8 rounded-2xl shadow-lg border border-slate-700">
      <h1 className="text-3xl font-bold text-white text-center mb-6">Admin Kaydı</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Diğer inputlar */}
        <Input name="username" placeholder="Username" value={formData.username} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-white" />
        <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-white" />
        <Input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-white" />
        <Input name="registrationSecret" type="password" placeholder="Gizli Kayıt Anahtarı" value={formData.registrationSecret} onChange={handleChange} required className="bg-slate-700 border-slate-600 text-white" />
        
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {success && <p className="text-green-400 text-sm">{success}</p>}
        
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? 'Kaydediliyor...' : 'Admin Oluştur'}
        </Button>
      </form>
    </div>
  );
};

export default AdminRegistrationForm;