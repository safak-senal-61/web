import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../ui/card';
import { Button } from '../../ui/button';
import { X, MessageCircle, Loader2 } from 'lucide-react';
import { ChatMessage } from '../../../types/chatroomTypes';
import chatroomService from '../../../services/chatroomService';
import { MessageItem } from './components/MessageItem';
import MessagePagination from './components/MessagePagination';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';

interface MessageListProps {
  roomId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const MessageList: React.FC<MessageListProps> = ({ roomId, isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);
  const messagesPerPage = 20;

  const fetchMessages = async (page: number = 1) => {
    if (!roomId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await chatroomService.getChatMessages(roomId, page, messagesPerPage);
      
      if (response.basarili && response.veri) {
        setMessages(response.veri.mesajlar || []);
        setTotalPages(response.veri.meta?.toplamSayfa || 1);
        setTotalMessages(response.veri.meta?.toplamMesaj || 0);
        setCurrentPage(page);
      } else {
        setError(response.mesaj || 'Mesajlar yüklenirken bir hata oluştu.');
      }
    } catch (err) {
      console.error('Mesajlar yüklenirken hata:', err);
      setError('Mesajlar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && roomId) {
      fetchMessages(1);
    }
  }, [isOpen, roomId]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      fetchMessages(page);
    }
  };

  const handleRetry = () => {
    fetchMessages(currentPage);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mesajlar</h2>
              <p className="text-sm text-gray-600">
                Toplam {totalMessages} mesaj
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner size="lg" text="Mesajlar yükleniyor..." />
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center">
              <ErrorMessage 
                message={error}
                type="error"
                variant="card"
                onRetry={handleRetry}
              />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-medium mb-2">Henüz mesaj yok</p>
                <p className="text-gray-500 text-sm">Bu odada henüz hiç mesaj gönderilmemiş.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <MessageItem 
                    key={message.id} 
                    message={message} 
                    variant="card"
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="border-t border-gray-200 p-4 bg-gray-50">
                  <MessagePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalMessages={totalMessages}
                    onPageChange={handlePageChange}
                    variant="detailed"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageList;