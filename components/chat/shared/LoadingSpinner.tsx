import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'dots' | 'pulse' | 'bounce';
  text?: string;
  className?: string;
  color?: 'blue' | 'green' | 'red' | 'gray' | 'purple';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md',
  variant = 'default',
  text,
  className = '',
  color = 'blue'
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  };

  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    red: 'text-red-500',
    gray: 'text-gray-500',
    purple: 'text-purple-500'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  if (variant === 'dots') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${sizeClasses[size]} bg-current rounded-full animate-pulse ${colorClasses[color]}`}
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
        {text && (
          <span className={`ml-2 ${textSizeClasses[size]} ${colorClasses[color]}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className={`${sizeClasses[size]} bg-current rounded-full animate-pulse ${colorClasses[color]}`} />
        {text && (
          <span className={`${textSizeClasses[size]} ${colorClasses[color]} animate-pulse`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'bounce') {
    return (
      <div className={`flex items-center space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`${sizeClasses[size]} bg-current rounded-full animate-bounce ${colorClasses[color]}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
        {text && (
          <span className={`ml-2 ${textSizeClasses[size]} ${colorClasses[color]}`}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Loader2 className={`${sizeClasses[size]} animate-spin ${colorClasses[color]}`} />
      {text && (
        <span className={`${textSizeClasses[size]} ${colorClasses[color]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;