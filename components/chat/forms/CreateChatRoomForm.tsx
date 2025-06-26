// components/chat/CreateChatRoomForm.tsx

import React, { useState } from 'react';
import { CreateChatRoomRequest } from '../../../types/chatroomTypes';
import { X, Plus, Users, Mic, Lock, Globe } from 'lucide-react';

interface CreateChatRoomFormProps {
  onSubmit: (data: CreateChatRoomRequest) => Promise<void>;
  isLoading?: boolean;
}

const CreateChatRoomForm: React.FC<CreateChatRoomFormProps> = ({ onSubmit, isLoading = false }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [roomType, setRoomType] = useState<'PUBLIC' | 'PRIVATE'>('PUBLIC');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    password: '',
    maxParticipants: 50,
    speakerSeatCount: 8
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 5) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) newErrors.title = 'Oda başlığı gereklidir';
    else if (formData.title.length < 3) newErrors.title = 'En az 3 karakter olmalıdır';
    else if (formData.title.length > 100) newErrors.title = 'En fazla 100 karakter olabilir';
    
    if (!formData.description.trim()) newErrors.description = 'Açıklama gereklidir';
    else if (formData.description.length < 10) newErrors.description = 'En az 10 karakter olmalıdır';
    else if (formData.description.length > 500) newErrors.description = 'En fazla 500 karakter olabilir';
    
    if (roomType === 'PRIVATE' && !formData.password.trim()) {
      newErrors.password = 'Özel odalar için şifre gereklidir';
    } else if (formData.password && formData.password.length < 4) {
      newErrors.password = 'En az 4 karakter olmalıdır';
    }
    
    if (formData.maxParticipants < 2) newErrors.maxParticipants = 'En az 2 olmalıdır';
    if (formData.maxParticipants > 1000) newErrors.maxParticipants = 'En fazla 1000 olabilir';
    
    if (formData.speakerSeatCount < 1) newErrors.speakerSeatCount = 'En az 1 olmalıdır';
    if (formData.speakerSeatCount > 20) newErrors.speakerSeatCount = 'En fazla 20 olabilir';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const submitData: CreateChatRoomRequest = {
      title: formData.title,
      description: formData.description,
      type: roomType,
      password: roomType === 'PRIVATE' ? formData.password : undefined,
      maxParticipants: formData.maxParticipants,
      speakerSeatCount: formData.speakerSeatCount,
      tags
    };
    
    await onSubmit(submitData);
  };

  return (
    <div className="w-full">
      <p className="text-slate-600 mb-6">
        Arkadaşlarınızla sohbet etmek için yeni bir oda oluşturun
      </p>

      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Oda Başlığı */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Oda Başlığı
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Oda başlığını girin..."
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all duration-300 placeholder-slate-400 text-slate-800"
          />
          {errors.title && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              <span>{errors.title}</span>
            </p>
          )}
        </div>

        {/* Açıklama */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">
            Açıklama
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Odanızı tanımlayın..."
            rows={3}
            className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all duration-300 resize-none placeholder-slate-400 text-slate-800"
          />
          {errors.description && (
            <p className="text-sm text-red-500 flex items-center space-x-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              <span>{errors.description}</span>
            </p>
          )}
        </div>

        {/* Oda Tipi */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            Oda Tipi
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRoomType('PUBLIC')}
              className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                roomType === 'PUBLIC'
                  ? 'border-violet-400 bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 shadow-lg shadow-violet-500/10'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:shadow-md'
              }`}
            >
              <Globe className={`h-4 w-4 ${roomType === 'PUBLIC' ? 'text-violet-600' : 'text-slate-500'}`} />
              <span className="font-semibold text-sm">Herkese Açık</span>
            </button>
            
            <button
              type="button"
              onClick={() => setRoomType('PRIVATE')}
              className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center space-x-2 ${
                roomType === 'PRIVATE'
                  ? 'border-violet-400 bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 shadow-lg shadow-violet-500/10'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:shadow-md'
              }`}
            >
              <Lock className={`h-4 w-4 ${roomType === 'PRIVATE' ? 'text-violet-600' : 'text-slate-500'}`} />
              <span className="font-semibold text-sm">Özel</span>
            </button>
          </div>
        </div>

        {/* Şifre (Özel odalar için) */}
        {roomType === 'PRIVATE' && (
          <div className="space-y-2 animate-fadeIn">
            <label className="block text-sm font-semibold text-slate-700">
              Oda Şifresi
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              placeholder="Güvenli bir şifre girin..."
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all duration-300 placeholder-slate-400 text-slate-800"
            />
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                <span>{errors.password}</span>
              </p>
            )}
          </div>
        )}

        {/* Katılımcı Sayısı ve Konuşmacı Koltuğu */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Maksimum Katılımcı
            </label>
            <input
              type="number"
              min="2"
              max="1000"
              value={formData.maxParticipants}
              onChange={(e) => handleInputChange('maxParticipants', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all duration-300 text-slate-800"
            />
            {errors.maxParticipants && (
              <p className="text-xs text-red-500">{errors.maxParticipants}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">
              Konuşmacı Koltuğu
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={formData.speakerSeatCount}
              onChange={(e) => handleInputChange('speakerSeatCount', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all duration-300 text-slate-800"
            />
            {errors.speakerSeatCount && (
              <p className="text-xs text-red-500">{errors.speakerSeatCount}</p>
            )}
          </div>
        </div>

        {/* Etiketler */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700">
            Etiketler <span className="text-slate-400 font-normal">(İsteğe bağlı)</span>
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Etiket ekle..."
              maxLength={20}
              className="flex-1 px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 outline-none transition-all duration-300 placeholder-slate-400 text-slate-800"
            />
            <button
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim() || tags.length >= 5}
              className="px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl hover:from-violet-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-violet-500/25"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 rounded-full text-sm font-medium border border-slate-200 shadow-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-slate-500 hover:text-red-500 transition-colors duration-200"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          
          <p className="text-xs text-slate-500">
            En fazla 5 etiket ekleyebilirsiniz ({tags.length}/5)
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 shadow-xl shadow-violet-500/25 hover:shadow-2xl hover:shadow-violet-500/30 transform hover:-translate-y-0.5"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Oluşturuluyor...</span>
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              <span>Sohbet Odası Oluştur</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateChatRoomForm;