import React, { useState } from 'react';
import { leaveChatRoom } from '../../../services/chatroomService';
import { ChatRoom } from '../../../types/chatroomTypes';

interface LeaveChatRoomProps {
  room: ChatRoom;
  onLeaveSuccess: () => void;
  onCancel: () => void;
}

const LeaveChatRoom: React.FC<LeaveChatRoomProps> = ({ room, onLeaveSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLeave = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await leaveChatRoom(room.id);
      
      if (response.basarili) {
        onLeaveSuccess();
      } else {
        setError(response.mesaj);
      }
    } catch (error) {
      setError('Odadan ayrılırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Odadan Ayrıl
        </h2>
        
        <div className="mb-6">
          <p className="text-gray-600 mb-2">
            <strong>{room.title}</strong> odasından ayrılmak istediğinizden emin misiniz?
          </p>
          <p className="text-sm text-gray-500">
            Odadan ayrıldıktan sonra tekrar katılmak için odayı bulmanız gerekecek.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            İptal
          </button>
          <button
            onClick={handleLeave}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Ayrılıyor...' : 'Ayrıl'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveChatRoom;