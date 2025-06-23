// components/admin/games/CreateGameModal.tsx

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createGame } from '@/services/adminService';
import { GameCategory } from '@/types/adminTypes';

interface CreateGameModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
  categories: GameCategory[];
}

const CreateGameModal: React.FC<CreateGameModalProps> = ({ isOpen, onOpenChange, onSuccess, categories }) => {
  const [formData, setFormData] = useState({
    gameId: '',
    name: '',
    description: '',
    iconUrl: '',
    entryCost: 0,
    categoryId: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSelectChange = (value: string) => {
    setFormData({ ...formData, categoryId: value });
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    const response = await createGame(formData);
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
          <DialogTitle>Yeni Oyun Ekle</DialogTitle>
          <DialogDescription>Sisteme yeni bir oyun ekleyin.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input name="gameId" placeholder="Oyun ID (örn: tic-tac-toe)" value={formData.gameId} onChange={handleChange} className="bg-slate-700 border-slate-600" />
          <Input name="name" placeholder="Oyun Adı" value={formData.name} onChange={handleChange} className="bg-slate-700 border-slate-600" />
          <Input name="description" placeholder="Açıklama" value={formData.description} onChange={handleChange} className="bg-slate-700 border-slate-600" />
          <Input name="entryCost" type="number" placeholder="Giriş Ücreti (Jeton)" onChange={(e) => setFormData({...formData, entryCost: parseInt(e.target.value) || 0})} className="bg-slate-700 border-slate-600" />
          <Select onValueChange={handleSelectChange}>
            <SelectTrigger className="bg-slate-700 border-slate-600">
                <SelectValue placeholder="Kategori Seçin" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
            </SelectContent>
          </Select>
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Ekleniyor...' : 'Oyun Oluştur'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGameModal;