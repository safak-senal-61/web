// components/settings/LoadingState.tsx
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-10rem)]">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-slate-300 text-lg">Ayarlar yükleniyor...</p>
      </div>
    </div>
  );
};

export default LoadingState;