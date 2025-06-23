// components/transactions/TransactionHistory.tsx
import React, { useState, useEffect } from 'react';
import { getMyTransactions } from '../../services/transactionService';
import { Transaction } from '../../types/transactionTypes';
import TransactionRow from './TransactionRow';
import { Button } from '@/components/ui/button';
import { FaSpinner, FaExclamationTriangle, FaHistory, FaFilter, FaChartLine, FaCoins, FaCheckCircle, FaClock, FaTimesCircle, FaGem, FaArrowUp, FaArrowDown, FaGift } from 'react-icons/fa';

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const loadTransactions = async (page: number) => {
      setIsLoading(true);
      setError(null);
      const response = await getMyTransactions({ page, limit: 15 });
      if (response.basarili && response.veri) {
        setTransactions(prev => page === 1 ? response.veri.islemler : [...prev, ...response.veri.islemler]);
        setHasMore(response.veri.meta.suankiSayfa < response.veri.meta.toplamSayfa);
      } else {
        setError(response.mesaj || "İşlemler yüklenemedi.");
      }
      setIsLoading(false);
    };

    loadTransactions(currentPage);
  }, [currentPage]);

  return (
    <div className="bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaHistory className="text-white text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                İşlem Geçmişi
              </h2>
              <p className="text-slate-400 text-sm">
                Tüm finansal işlemlerinizi görüntüleyin
              </p>
            </div>
          </div>
          
          {/* Quick Stats */}
          {transactions.length > 0 && (
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-green-400 text-sm" />
                  <span className="text-white font-semibold">{transactions.length}</span>
                  <span className="text-slate-400 text-sm">İşlem</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Future Filter Buttons */}
        <div className="mt-4 flex gap-2 opacity-50">
          <Button variant="outline" size="sm" disabled className="bg-slate-800/30 border-slate-600/30">
            <FaFilter className="mr-2" />
            Filtrele
          </Button>
          <span className="text-xs text-slate-500 self-center">Yakında...</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Transactions List */}
        <div className="space-y-3">
          {transactions.map((tx, index) => (
            <div
              key={tx.id}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <TransactionRow transaction={tx} />
            </div>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-blue-200/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-gradient-to-r from-blue-500 to-purple-600 border-t-transparent rounded-full animate-spin"></div>
              <FaSpinner className="absolute inset-0 m-auto text-blue-400 animate-pulse" />
            </div>
            <p className="mt-4 text-slate-400 font-medium">İşlemler yükleniyor...</p>
            <div className="flex justify-center gap-1 mt-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="text-red-400 text-2xl" />
            </div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Bir Hata Oluştu</h3>
            <p className="text-slate-400 mb-4">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Tekrar Dene
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && transactions.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-700/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHistory className="text-slate-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">Henüz İşlem Yok</h3>
            <p className="text-slate-400 max-w-md mx-auto">
              İlk işleminizi yaptığınızda burada görünecek. Jeton satın alarak başlayabilirsiniz!
            </p>
          </div>
        )}

        {/* Load More Button */}
        {hasMore && !isLoading && transactions.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-slate-300 hover:text-white px-8 py-3 rounded-xl font-medium transition-all duration-200"
            >
              <FaSpinner className="mr-2" />
              Daha Fazla Yükle
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;