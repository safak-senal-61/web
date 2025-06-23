// components/transactions/DiamondConversion.tsx
import React, { useState, FormEvent } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { convertDiamondsToCoins } from '../../services/transactionService';
import { Balance } from '../../types/transactionTypes';
import { FaSpinner, FaGem, FaCoins, FaExchangeAlt } from 'react-icons/fa';

interface DiamondConversionProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentBalance: Balance | null;
  onSuccess: (newBalance: Balance) => void;
}

const DiamondConversion: React.FC<DiamondConversionProps> = ({ 
  isOpen, 
  onOpenChange, 
  currentBalance, 
  onSuccess 
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const conversionRate = 10; // 1 diamond = 10 coins (örnek oran)
  const calculatedCoins = amount ? parseInt(amount, 10) * conversionRate : 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const diamondAmount = parseInt(amount, 10);
    
    if (isNaN(diamondAmount) || diamondAmount <= 0) {
      setError('Lütfen geçerli bir miktar girin.');
      return;
    }
    
    if (currentBalance && diamondAmount > parseInt(currentBalance.elmaslar, 10)) {
      setError('Yetersiz elmas bakiyesi.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await convertDiamondsToCoins(diamondAmount);
      
      if (response.basarili) {
        onSuccess(response.veri.yeniBakiye);
        onOpenChange(false);
        setAmount('');
      } else {
        setError(response.mesaj);
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (percentage: number) => {
    if (currentBalance) {
      const quickAmount = Math.floor((parseInt(currentBalance.elmaslar, 10) * percentage) / 100);
      setAmount(quickAmount.toString());
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700/50 text-white shadow-2xl backdrop-blur-sm max-w-md mx-auto">
        <DialogHeader className="space-y-4 pb-6">
          <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg">
            <FaExchangeAlt className="text-2xl text-white" />
          </div>
          
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Elmas Dönüştürme
          </DialogTitle>
          
          <DialogDescription className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-lg">
              <FaGem className="text-blue-400" />
              <span className="text-slate-300">Mevcut Elmas:</span>
              <span className="font-bold text-blue-400">{currentBalance?.elmaslar || 0}</span>
            </div>
            <p className="text-sm text-slate-400">Elmaslarınızı jetona çevirin</p>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Quick Select Buttons */}
          <div className="grid grid-cols-3 gap-2">
            {[25, 50, 100].map((percentage) => (
              <Button
                key={percentage}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleQuickSelect(percentage)}
                disabled={loading || !currentBalance}
                className="bg-slate-700/50 border-slate-600 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-200"
              >
                {percentage === 100 ? 'Tümü' : `%${percentage}`}
              </Button>
            ))}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-300">
              Dönüştürülecek Elmas Miktarı
            </label>
            <div className="relative">
              <FaGem className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <Input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
                className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* Conversion Preview */}
          {amount && !isNaN(parseInt(amount, 10)) && (
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FaGem className="text-blue-400" />
                  <span className="text-slate-300">{amount} Elmas</span>
                </div>
                <FaExchangeAlt className="text-slate-400" />
                <div className="flex items-center gap-2">
                  <FaCoins className="text-yellow-400" />
                  <span className="text-yellow-400 font-semibold">{calculatedCoins} Jeton</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <DialogFooter className="gap-3 pt-4">
            <DialogClose asChild>
              <Button 
                type="button" 
                variant="outline" 
                disabled={loading}
                className="flex-1 bg-slate-700/50 border-slate-600 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-all duration-200"
              >
                İptal
              </Button>
            </DialogClose>
            
            <Button 
              type="submit" 
              disabled={loading || !amount || isNaN(parseInt(amount, 10)) || parseInt(amount, 10) <= 0}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <FaSpinner className="animate-spin" />
                  <span>Dönüştürülüyor...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FaExchangeAlt />
                  <span>Dönüştür</span>
                </div>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DiamondConversion;