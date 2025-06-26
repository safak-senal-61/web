import React from 'react';
import { AlertTriangle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  variant?: 'banner' | 'card' | 'inline';
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
  showIcon?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message,
  type = 'error',
  variant = 'card',
  onRetry,
  onDismiss,
  className = '',
  showIcon = true
}) => {
  const getIcon = () => {
    switch (type) {
      case 'warning':
        return AlertTriangle;
      case 'info':
        return AlertCircle;
      case 'error':
      default:
        return XCircle;
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          icon: 'text-amber-500'
        };
      case 'info':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200', 
          text: 'text-blue-800',
          icon: 'text-blue-500'
        };
      case 'error':
      default:
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          icon: 'text-red-500'
        };
    }
  };

  const Icon = getIcon();
  const colors = getColorClasses();

  if (variant === 'inline') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        {showIcon && <Icon className={`h-4 w-4 ${colors.icon}`} />}
        <span className={`text-sm ${colors.text}`}>{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className={`text-xs underline ${colors.text} hover:opacity-75`}
          >
            Tekrar Dene
          </button>
        )}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`${colors.bg} ${colors.border} border-l-4 p-4 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {showIcon && <Icon className={`h-5 w-5 ${colors.icon}`} />}
            <span className={`${colors.text} font-medium`}>{message}</span>
          </div>
          <div className="flex items-center space-x-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium ${colors.text} hover:opacity-75 transition-opacity`}
              >
                <RefreshCw className="h-3 w-3" />
                <span>Tekrar Dene</span>
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className={`${colors.text} hover:opacity-75 transition-opacity`}
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Card variant (default)
  return (
    <div className={`${colors.bg} ${colors.border} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        {showIcon && <Icon className={`h-5 w-5 ${colors.icon} mt-0.5`} />}
        <div className="flex-1">
          <p className={`${colors.text} text-sm`}>{message}</p>
          {(onRetry || onDismiss) && (
            <div className="flex items-center space-x-3 mt-3">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className={`flex items-center space-x-1 px-3 py-1 text-xs font-medium ${colors.text} hover:opacity-75 transition-opacity border ${colors.border} rounded`}
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Tekrar Dene</span>
                </button>
              )}
              {onDismiss && (
                <button
                  onClick={onDismiss}
                  className={`text-xs ${colors.text} hover:opacity-75 transition-opacity`}
                >
                  Kapat
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;