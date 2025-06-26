import React, { useState } from 'react';
import { joinChatRoom } from '../../../services/chatroomService';
import { ChatRoom } from '../../../types/chatroomTypes';

interface JoinChatRoomProps {
  room: ChatRoom;
  onJoinSuccess: () => void;
  onCancel: () => void;
}

const JoinChatRoom: React.FC<JoinChatRoomProps> = ({ room, onJoinSuccess, onCancel }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await joinChatRoom(room.id, room.type === 'PRIVATE' ? password : undefined);
      
      if (response.basarili) {
        onJoinSuccess();
      } else {
        setError(response.mesaj);
      }
    } catch (error) {
      setError('Odaya katılırken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {room.title} Odasına Katıl
        </h2>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-2">{room.description}</p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
              {room.type === 'PUBLIC' ? 'Herkese Açık' : 'Özel'}
            </span>
            <span>
              {room.activeParticipants.length}/{room.maxParticipants} kişi
            </span>
          </div>
        </div>

        {room.type === 'PRIVATE' && (
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Oda Şifresi
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Oda şifresini girin"
              disabled={isLoading}
            />
          </div>
        )}

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
            onClick={handleJoin}
            disabled={isLoading || (room.type === 'PRIVATE' && !password.trim())}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Katılıyor...' : 'Katıl'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinChatRoom;