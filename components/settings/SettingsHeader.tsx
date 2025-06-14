// components/settings/SettingsHeader.tsx
import React from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaSave } from 'react-icons/fa';

interface SettingsHeaderProps {
  onSave: () => void;
  isSaving: boolean;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onSave, isSaving }) => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 to-slate-800/10 rounded-3xl"></div>
      <div className="relative p-6 bg-slate-800/60 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              href="/"
              className="p-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-xl transition-colors"
              aria-label="Geri dön"
            >
              <FaArrowLeft className="w-5 h-5 text-slate-300" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-white">Ayarlar</h1>
              <p className="text-slate-400">Hesabını ve uygulamayı kişiselleştir</p>
            </div>
          </div>
          
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 px-6 py-3 rounded-xl text-white font-medium transition-all transform hover:scale-105 disabled:scale-100"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <FaSave className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsHeader;