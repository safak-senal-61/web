import React from 'react';

interface DateFormatterProps {
  date: string | Date;
  format?: 'relative' | 'absolute' | 'short';
  className?: string;
}

const DateFormatter: React.FC<DateFormatterProps> = ({ 
  date, 
  format = 'relative',
  className = ''
}) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const formatRelative = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) {
      return 'Şimdi';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} dakika önce`;
    } else if (diffInHours < 1) {
      return 'Az önce';
    } else if (diffInHours < 24) {
      return `${diffInHours} saat önce`;
    } else if (diffInDays < 7) {
      return `${diffInDays} gün önce`;
    } else {
      return date.toLocaleDateString('tr-TR');
    }
  };

  const formatAbsolute = (date: Date) => {
    return date.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShort = (date: Date) => {
    return date.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit'
    });
  };

  const getFormattedDate = () => {
    switch (format) {
      case 'absolute':
        return formatAbsolute(dateObj);
      case 'short':
        return formatShort(dateObj);
      case 'relative':
      default:
        return formatRelative(dateObj);
    }
  };

  return (
    <span className={className} title={formatAbsolute(dateObj)}>
      {getFormattedDate()}
    </span>
  );
};

export default DateFormatter;