// components/admin/games/CreateCategoryModal.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { createGameCategory } from '@/services/adminService';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void; // Kategori eklenince listeyi yenilemek için
}

const CreateCategoryModal: React.FC<CreateCategoryModalProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const [name, setName] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    const response = await createGameCategory({ name, iconUrl });
    if (response.basarili) {
      onSuccess();
      onOpenChange(false);
      setName('');
      setIconUrl('');
    } else {
      setError(response.mesaj);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle>Yeni Oyun Kategorisi Ekle</DialogTitle>
          <DialogDescription>Oyunları gruplamak için yeni bir kategori oluşturun.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Kategori Adı</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-700 border-slate-600" />
          </div>
          <div>
            <Label htmlFor="iconUrl">İkon URL'i (Opsiyonel)</Label>
            <Input id="iconUrl" value={iconUrl} onChange={(e) => setIconUrl(e.target.value)} className="bg-slate-700 border-slate-600" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Ekleniyor...' : 'Kategori Oluştur'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateCategoryModal;