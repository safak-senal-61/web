import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { UserMinus, Loader2, AlertTriangle } from 'lucide-react';
import { chatroomService } from '../../../services/chatroomService';

interface RemoveModeratorProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  onSuccess?: () => void;
}

const RemoveModerator: React.FC<RemoveModeratorProps> = ({
  isOpen,
  onClose,
  roomId,
  onSuccess
}) => {
  const [targetUserId, setTargetUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetUserId.trim()) {
      setError('Kullanıcı ID gereklidir.');
      return;
    }

    setShowConfirmation(true);
  };

  const handleConfirmRemove = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    setShowConfirmation(false);

    try {
      const response = await chatroomService.removeModerator(roomId, targetUserId.trim());
      
      if (response.basarili) {
        setSuccess(response.mesaj || 'Moderatör başarıyla çıkarıldı.');
        setTargetUserId('');
        
        // 2 saniye sonra modal'ı kapat ve success callback'i çağır
        setTimeout(() => {
          onClose();
          onSuccess?.();
          setSuccess('');
        }, 2000);
      } else {
        setError(response.mesaj || 'Moderatör çıkarılırken bir hata oluştu.');
      }
    } catch (error) {
      setError('Beklenmeyen bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setTargetUserId('');
      setError('');
      setSuccess('');
      setShowConfirmation(false);
      onClose();
    }
  };

  const handleCancelConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserMinus className="h-5 w-5" />
            Moderatör Çıkar
          </DialogTitle>
        </DialogHeader>
        
        {!showConfirmation ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="targetUserId">Kullanıcı ID</Label>
              <Input
                id="targetUserId"
                type="text"
                placeholder="Moderatörlükten çıkarılacak kullanıcının ID'sini girin"
                value={targetUserId}
                onChange={(e) => setTargetUserId(e.target.value)}
                disabled={isLoading}
                className="w-full"
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                {error}
              </div>
            )}

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md border border-green-200">
                {success}
              </div>
            )}

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !targetUserId.trim()}
                variant="destructive"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    İşleniyor...
                  </>
                ) : (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" />
                    Devam Et
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">Moderatör çıkarma işlemini onaylayın</p>
                <p className="mt-1">
                  <span className="font-medium">{targetUserId}</span> kullanıcısını moderatörlükten çıkarmak istediğinizden emin misiniz?
                </p>
              </div>
            </div>

            <DialogFooter className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelConfirmation}
                disabled={isLoading}
              >
                İptal
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmRemove}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Çıkarılıyor...
                  </>
                ) : (
                  <>
                    <UserMinus className="mr-2 h-4 w-4" />
                    Evet, Çıkar
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RemoveModerator;