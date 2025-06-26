import React, { useState, useRef } from 'react';
import { updateChatRoomCoverImage } from '../../../services/chatroomService';
import { ChatRoom } from '../../../types/chatroomTypes';

interface UpdateCoverImageProps {
  room: ChatRoom;
  onUpdateSuccess: (updatedRoom: ChatRoom) => void;
  onCancel: () => void;
}

const UpdateCoverImage: React.FC<UpdateCoverImageProps> = ({ room, onUpdateSuccess, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }

      // Dosya tipi kontrolü
      if (!file.type.startsWith('image/')) {
        setError('Lütfen geçerli bir resim dosyası seçin.');
        return;
      }

      setSelectedFile(file);
      setError('');

      // Preview oluştur
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Lütfen bir dosya seçin.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await updateChatRoomCoverImage(room.id, selectedFile);
      
      if (response.basarili && response.veri?.oda) {
        const updatedRoom = { ...room, coverImageUrl: response.veri.oda.coverImageUrl };
        onUpdateSuccess(updatedRoom);
      } else {
        setError(response.mesaj);
      }
    } catch (error) {
      setError('Kapak fotoğrafı güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (fileInputRef.current) {
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInputRef.current.files = dt.files;
        handleFileSelect({ target: { files: dt.files } } as any);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Kapak Fotoğrafını Güncelle
        </h2>
        
        <div className="mb-4">
          <p className="text-gray-600 mb-2">
            <strong>{room.title}</strong> odası için yeni kapak fotoğrafı seçin
          </p>
        </div>

        {/* Mevcut kapak fotoğrafı */}
        {room.coverImageUrl && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Mevcut kapak fotoğrafı:</p>
            <img 
              src={room.coverImageUrl} 
              alt="Mevcut kapak" 
              className="w-full h-32 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Dosya seçme alanı */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 hover:border-blue-400 transition-colors"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div>
              <img 
                src={previewUrl} 
                alt="Önizleme" 
                className="w-full h-32 object-cover rounded-lg mb-2"
              />
              <p className="text-sm text-gray-600">{selectedFile?.name}</p>
            </div>
          ) : (
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-gray-600 mb-1">Dosyayı buraya sürükleyin veya</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                dosya seçin
              </button>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (max. 5MB)</p>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {selectedFile && (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full mb-4 px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
          >
            Farklı dosya seç
          </button>
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
            onClick={handleUpload}
            disabled={isLoading || !selectedFile}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCoverImage;