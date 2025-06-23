// components/transactions/TransactionRow.tsx
import React from 'react';
import { Transaction } from '../../types/transactionTypes';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FaArrowDown, FaArrowUp, FaCoins, FaShoppingBag, FaGift, FaGem, FaCheckCircle, FaClock, FaTimesCircle, FaBan } from 'react-icons/fa';

// İşlem tipi ve ikon eşleştirmesi
const transactionDetails = {
  COIN_PURCHASE: { 
    icon: FaShoppingBag, 
    text: 'Jeton Alımı', 
    color: 'text-green-400', 
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
    sign: '+' 
  },
  GIFT_SEND: { 
    icon: FaGift, 
    text: 'Hediye Gönderimi', 
    color: 'text-red-400', 
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    sign: '-' 
  },
  DIAMOND_CONVERSION: { 
    icon: FaCoins, 
    text: 'Elmas → Jeton', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
    sign: '+' 
  },
  STREAM_REWARD: { 
    icon: FaGem, 
    text: 'Yayın Geliri', 
    color: 'text-yellow-400', 
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
    sign: '+' 
  },
};

const statusDetails = {
  COMPLETED: { icon: FaCheckCircle, text: 'Tamamlandı', color: 'text-green-400' },
  PENDING: { icon: FaClock, text: 'Beklemede', color: 'text-yellow-400' },
  FAILED: { icon: FaTimesCircle, text: 'Başarısız', color: 'text-red-400' },
  CANCELLED: { icon: FaBan, text: 'İptal Edildi', color: 'text-gray-400' },
};

interface TransactionRowProps {
  transaction: Transaction;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ transaction }) => {
  const details = transactionDetails[transaction.transactionType] || { 
    icon: FaCoins, 
    text: 'Diğer İşlem', 
    color: 'text-gray-400', 
    bgColor: 'bg-gray-500/10',
    borderColor: 'border-gray-500/20',
    sign: '' 
  };
  
  const status = statusDetails[transaction.status] || statusDetails.PENDING;
  const Icon = details.icon;
  const StatusIcon = status.icon;
  const isPositive = details.sign === '+';

  return (
    <div className={`group relative flex items-center justify-between p-5 bg-gradient-to-r from-slate-800/40 via-slate-800/30 to-slate-800/40 hover:from-slate-700/50 hover:via-slate-700/40 hover:to-slate-700/50 rounded-2xl border ${details.borderColor} hover:border-slate-600/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/20`}>
      
      {/* Left Side - Icon & Details */}
      <div className="flex items-center gap-5">
        {/* Transaction Icon */}
        <div className={`relative w-14 h-14 ${details.bgColor} rounded-2xl flex items-center justify-center border ${details.borderColor} group-hover:scale-110 transition-transform duration-200`}>
          <Icon className={`w-6 h-6 ${details.color}`} />
          
          {/* Direction Indicator */}
          {isPositive ? (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <FaArrowDown className="w-3 h-3 text-white rotate-180" />
            </div>
          ) : (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
              <FaArrowUp className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        
        {/* Transaction Details */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <p className="font-bold text-white text-lg">{details.text}</p>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.color === 'text-green-400' ? 'bg-green-500/10' : status.color === 'text-yellow-400' ? 'bg-yellow-500/10' : status.color === 'text-gray-400' ? 'bg-gray-500/10' : 'bg-red-500/10'}`}>
              <StatusIcon className={`w-3 h-3 ${status.color}`} />
              <span className={`text-xs font-semibold ${status.color}`}>
                {status.text}
              </span>
            </div>
          </div>
          
          <p className="text-sm text-slate-400 font-medium">
            {format(new Date(transaction.createdAt), 'dd MMMM yyyy, HH:mm', { locale: tr })}
          </p>
        </div>
      </div>

      {/* Right Side - Amount */}
      <div className="text-right space-y-1">
        <div className="flex items-center justify-end gap-2">
          <p className={`font-bold text-2xl ${details.color} tracking-tight`}>
            {details.sign}{transaction.amount}
          </p>
          <span className="text-slate-400 text-sm font-medium uppercase tracking-wide">
            {transaction.currency}
          </span>
        </div>
        
        {/* Amount in TL if different currency */}
        {transaction.currency !== 'TRY' && (
          <p className="text-xs text-slate-500">
            ≈ {(parseInt(transaction.amount) * 0.30).toFixed(2)} TL
          </p>
        )}
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};

export default TransactionRow;