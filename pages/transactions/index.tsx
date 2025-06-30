// pages/transactions/index.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';
import { Header } from '@/components/layout/Header';
import Drawer from '@/components/common/Drawer';
import TransactionHistory from '@/components/transactions/TransactionHistory';
import BalanceDisplay from '@/components/transactions/BalanceDisplay';
import DiamondConversion from '@/components/transactions/DiamondConversion';
import CoinPackages from '@/components/transactions/CoinPackages';
import PaymentModal from '@/components/transactions/PaymentModal';
import { Balance } from '@/types/transactionTypes';
import { getMyBalance, purchaseCoinPackage } from '@/services/transactionService';

const TransactionsPage = () => {
  const { user, isLoading: authIsLoading } = useAuth();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  const [balance, setBalance] = useState<Balance | null>(null);
  const [isBalanceLoading, setIsBalanceLoading] = useState(true);
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);

  // Yeni state'ler
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentHtml, setPaymentHtml] = useState<string | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    setIsBalanceLoading(true);
    const response = await getMyBalance();
    if (response.basarili) {
      setBalance(response.veri.bakiye);
    }
    setIsBalanceLoading(false);
  }, []);

  useEffect(() => {
    if (!authIsLoading && !user) {
      router.push('/login?redirect=/transactions');
    } else if (user) {
      fetchBalance();
    }
  }, [user, authIsLoading, router, fetchBalance]);

  const handlePackageSelect = async (packageId: string) => {
    setIsPaymentLoading(true);
    setPaymentError(null);
    setPaymentHtml(null);
    setIsPaymentModalOpen(true);

    const response = await purchaseCoinPackage(packageId);
    if (response.basarili) {
        setPaymentHtml(response.veri.paymentPageContent);
    } else {
        setPaymentError(response.mesaj);
    }
    setIsPaymentLoading(false);
  };
  
  const handleConversionSuccess = (newBalance: Balance) => {
    setBalance(newBalance);
  };

  if (authIsLoading || !user) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/90 to-slate-900">
      <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsDrawerOpen(!isDrawerOpen)} />

        <main className="flex-1 overflow-y-auto p-3 sm:p-6 lg:p-8 animate-fade-in">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <div className="px-1 sm:px-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">Finansal İşlemler</h1>
              <p className="mt-2 text-sm sm:text-md text-slate-300">
                Jeton alımlarınızı, hediye gönderimlerinizi ve tüm bakiye hareketlerinizi buradan takip edebilirsiniz.
              </p>
            </div>
            
            <BalanceDisplay balance={balance} isLoading={isBalanceLoading} onConvertClick={() => setIsConversionModalOpen(true)} />
            <CoinPackages onPackageSelect={handlePackageSelect} isLoading={isPaymentLoading} />
            <TransactionHistory />

          </div>
        </main>
      </div>
      
      <DiamondConversion isOpen={isConversionModalOpen} onOpenChange={setIsConversionModalOpen} currentBalance={balance} onSuccess={handleConversionSuccess} />
      <PaymentModal isOpen={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen} paymentHtml={paymentHtml} isLoading={isPaymentLoading} error={paymentError} />
    </div>
  );
};

export default TransactionsPage;