import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { UserPlus, Loader2 } from 'lucide-react';
import { chatroomService } from '../../../services/chatroomService';

interface AddModeratorProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  onSuccess?: () => void;
}

const AddModerator: React.FC<AddModeratorProps> = ({
  isOpen,
  onClose,
  roomId,
  onSuccess
}) => {
  const [targetUserId, setTargetUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!targetUserId.trim()) {
      setError('Kullanıcı ID gereklidir.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await chatroomService.addModerator(roomId, targetUserId.trim());
      
      if (response.basarili) {
        setSuccess(response.mesaj || 'Moderatör başarıyla eklendi.');
        setTargetUserId('');
        
        // 2 saniye sonra modal'ı kapat ve success callback'i çağır
        setTimeout(() => {
          onClose();
          onSuccess?.();
          setSuccess('');
        }, 2000);
      } else {
        setError(response.mesaj || 'Moderatör eklenirken bir hata oluştu.');
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
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Moderatör Ekle
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetUserId">Kullanıcı ID</Label>
            <Input
              id="targetUserId"
              type="text"
              placeholder="Moderatör yapılacak kullanıcının ID'sini girin"
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
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ekleniyor...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Moderatör Ekle
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddModerator;