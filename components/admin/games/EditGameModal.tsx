// components/admin/games/EditGameModal.tsx

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { updateGame } from '@/services/adminService';
import { Game } from '@/types/gameTypes';

interface EditGameModalProps {
  game: Game | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

const EditGameModal: React.FC<EditGameModalProps> = ({ game, isOpen, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', description: '', entryCost: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (game) {
      setFormData({
        name: game.title,
        description: game.description || '',
        entryCost: game.entryCost || 0,
      });
    }
  }, [game]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!game) return;
    setIsLoading(true);
    setError(null);
    const response = await updateGame(game.id, formData);
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
        <DialogHeader>
          <DialogTitle>Oyunu Düzenle: {game?.title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input name="name" placeholder="Oyun Adı" value={formData.name} onChange={handleChange} className="bg-slate-700 border-slate-600" />
          <Input name="description" placeholder="Açıklama" value={formData.description} onChange={handleChange} className="bg-slate-700 border-slate-600" />
          <Input name="entryCost" type="number" placeholder="Giriş Ücreti" value={formData.entryCost} onChange={(e) => setFormData({...formData, entryCost: parseInt(e.target.value) || 0})} className="bg-slate-700 border-slate-600" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditGameModal;