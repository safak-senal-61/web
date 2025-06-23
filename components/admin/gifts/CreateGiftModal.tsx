// components/admin/gifts/CreateGiftModal.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createGift } from '@/services/adminService';

interface CreateGiftModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

const CreateGiftModal: React.FC<CreateGiftModalProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState({ giftId: '', name: '', cost: 0, value: 0, imageUrl: '' });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'cost' || name === 'value' ? parseInt(value) || 0 : value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    const response = await createGift(formData);
    if (response.basarili) {
      onSuccess();
      onOpenChange(false);
    } else {
      setError(response.mesaj);
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-800 border-slate-700 text-white">
        <DialogHeader><DialogTitle>Yeni Hediye Ekle</DialogTitle></DialogHeader>
        <div className="grid gap-4 py-4">
          <Input name="giftId" placeholder="Hediye ID (örn: rose)" value={formData.giftId} onChange={handleChange} className="bg-slate-700 border-slate-600" />
          <Input name="name" placeholder="Hediye Adı (örn: Gül)" value={formData.name} onChange={handleChange} className="bg-slate-700 border-slate-600" />
          <Input name="cost" type="number" placeholder="Maliyet (Jeton)" value={formData.cost} onChange={handleChange} className="bg-slate-700 border-slate-600" />
          <Input name="value" type="number" placeholder="Değer (Elmas)" value={formData.value} onChange={handleChange} className="bg-slate-700 border-slate-600" />
          <Input name="imageUrl" placeholder="Görsel URL" value={formData.imageUrl} onChange={handleChange} className="bg-slate-700 border-slate-600" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Ekleniyor...' : 'Hediye Oluştur'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGiftModal;