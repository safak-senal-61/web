// components/rooms/CreateRoomButton.tsx
import React from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { useRouter } from 'next/router'; // Veya bir modal state'i yönetmek için context/useState

interface CreateRoomButtonProps {
  className?: string; // Ekstra class'lar için
  onClick?: () => void; // Modal açmak için
}

const CreateRoomButton: React.FC<CreateRoomButtonProps> = ({ className, onClick }) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Eğer bir onClick prop'u varsa onu çağır (modal için)
    } else {
      router.push('/rooms/create'); // Yoksa sayfaya yönlendir
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 
                 bg-gradient-to-r from-blue-500 to-purple-600 
                 hover:from-blue-600 hover:to-purple-700 
                 text-white font-semibold rounded-lg shadow-md hover:shadow-lg 
                 transition-all duration-300 transform hover:scale-105 
                 ${className || ''}`}
    >
      <FaPlusCircle className="w-5 h-5" />
      Yeni Oda Oluştur
    </button>
  );
};

export default CreateRoomButton;