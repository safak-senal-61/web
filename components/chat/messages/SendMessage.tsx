import React, { useState } from 'react';
import { chatroomService } from '../../../services/chatroomService';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Loader2, Send, AlertCircle, CheckCircle } from 'lucide-react';

interface SendMessageProps {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const SendMessage: React.FC<SendMessageProps> = ({ roomId, isOpen, onClose, onSuccess }) => {
  const [content, setContent] = useState('');
  const [messageType, setMessageType] = useState<'TEXT' | 'IMAGE' | 'VOICE'>('TEXT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      setError('Mesaj içeriği boş olamaz.');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await chatroomService.sendMessage(roomId, content.trim(), messageType);
      
      if (response.basarili) {
        setSuccess('Mesaj başarıyla gönderildi!');
        setContent('');
        setMessageType('TEXT');
        
        // Success callback'i çağır
        if (onSuccess) {
          onSuccess();
        }
        
        // 2 saniye sonra modalı kapat
        setTimeout(() => {
          onClose();
          setSuccess(null);
        }, 2000);
      } else {
        setError(response.mesaj || 'Mesaj gönderilirken bir hata oluştu.');
      }
    } catch (err) {
      setError('Mesaj gönderilirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setContent('');
    setMessageType('TEXT');
    setError(null);
    setSuccess(null);
    onClose();
  };

  const getMessageTypeLabel = (type: string) => {
    switch (type) {
      case 'TEXT': return 'Metin';
      case 'IMAGE': return 'Resim';
      case 'VOICE': return 'Ses';
      default: return 'Metin';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2">
              <Send className="h-5 w-5 text-blue-600" />
              <span>Mesaj Gönder</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Mesaj Tipi Seçimi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj Tipi
                </label>
                <Select value={messageType} onValueChange={(value: 'TEXT' | 'IMAGE' | 'VOICE') => setMessageType(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mesaj tipini seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">Metin</SelectItem>
                    <SelectItem value="IMAGE">Resim</SelectItem>
                    <SelectItem value="VOICE">Ses</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mesaj İçeriği */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mesaj İçeriği
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`${getMessageTypeLabel(messageType)} mesajınızı buraya yazın...`}
                  rows={4}
                  className="resize-none"
                  disabled={loading}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {content.length}/1000 karakter
                </div>
              </div>

              {/* Hata Mesajı */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Başarı Mesajı */}
              {success && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-md">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              {/* Butonlar */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !content.trim()}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Gönder
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SendMessage;