// components/settings/DangerZone.tsx
import React from 'react';
import { FaShieldAlt, FaDownload, FaTrash } from 'react-icons/fa';

const DangerZone: React.FC = () => {
  // Add onClick handlers as needed
  const handleDownloadData = () => {
    console.log("Download Data Clicked");
    // Implement download logic
  };

  const handleDeleteAccount = () => {
    console.log("Delete Account Clicked");
    // Implement account deletion logic (with confirmation)
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 border border-red-500/30">
      <h3 className="text-lg font-semibold text-red-400 mb-4 flex items-center space-x-2">
        <FaShieldAlt className="w-5 h-5" />
        <span>Tehlikeli Alan</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={handleDownloadData}
          className="flex items-center justify-center space-x-2 p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 transition-all group"
        >
          <FaDownload className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Verileri İndir</span>
        </button>
        <button 
          onClick={handleDeleteAccount}
          className="flex items-center justify-center space-x-2 p-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-red-400 transition-all group"
        >
          <FaTrash className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>Hesabı Sil</span>
        </button>
      </div>
    </div>
  );
};

export default DangerZone;