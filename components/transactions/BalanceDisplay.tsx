// components/transactions/BalanceDisplay.tsx
import React from 'react';
import { Balance } from '../../types/transactionTypes';
import { FaCoins, FaGem, FaSpinner, FaArrowRight } from 'react-icons/fa';

interface BalanceDisplayProps {
  balance: Balance | null;
  isLoading: boolean;
  onConvertClick: () => void;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balance, isLoading, onConvertClick }) => {
  if (isLoading) {
    return (
      <div className="relative bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-8 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl"></div>
        <div className="relative flex justify-center items-center h-32">
          <div className="relative">
            <FaSpinner className="animate-spin h-10 w-10 text-blue-400" />
            <div className="absolute inset-0 animate-pulse bg-blue-400/20 rounded-full blur-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Main Container */}
      <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90 backdrop-blur-xl border border-slate-600/30 rounded-3xl p-8 shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          {/* Jeton Bakiyesi */}
          <div className="group/item relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl blur-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/20 rounded-2xl p-6 hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-2xl blur-md animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-yellow-400 to-orange-500 p-4 rounded-2xl shadow-lg">
                    <FaCoins className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 text-sm font-medium tracking-wide">Jeton Bakiyeniz</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      {balance?.jetonlar || '0'}
                    </p>
                    <span className="text-slate-500 text-sm">JTN</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Elmas Bakiyesi */}
          <div className="group/item relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-lg opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
            <div className="relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-600/20 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-md animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-2xl shadow-lg">
                    <FaGem className="w-8 h-8 text-white" />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 text-sm font-medium tracking-wide">Elmas Bakiyeniz</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      {balance?.elmaslar || '0'}
                    </p>
                    <span className="text-slate-500 text-sm">ELM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dönüştürme Butonu */}
          <div className="lg:flex lg:justify-end">
            <div className="relative group/button w-full lg:w-auto">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-75 group-hover/button:opacity-100 transition-opacity duration-300"></div>
              <button
                onClick={onConvertClick}
                className="relative w-full lg:min-w-[240px] bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white font-semibold px-8 py-6 rounded-2xl hover:scale-105 active:scale-95 transition-all duration-200 shadow-xl"
              >
                <div className="flex items-center justify-center gap-3 mb-1">
                  <FaGem className="w-5 h-5" />
                  <FaArrowRight className="w-4 h-4" />
                  <FaCoins className="w-5 h-5" />
                </div>
                <span className="block text-base font-medium">Elmasları Çevir</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Line */}
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-slate-600/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default BalanceDisplay;