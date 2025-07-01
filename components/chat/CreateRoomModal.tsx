// components/chat/CreateRoomModal.tsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createChatRoom } from '@/services/chatroomService';
import { CreateChatRoomRequest } from '@/types/chatroomTypes';

interface CreateRoomModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSuccess: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onOpenChange, onSuccess }) => {
  const [formData, setFormData] = useState<CreateChatRoomRequest>({
    title: '',
    description: '',
    type: 'PUBLIC',
    maxParticipants: 50,
    speakerSeatCount: 8,
    tags: [],
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);
    const response = await createChatRoom(formData);
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
          <DialogTitle>Yeni Sohbet Odası Oluştur</DialogTitle>
          <DialogDescription>Odanızın ayarlarını yapılandırın.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
            <Input placeholder="Oda Başlığı" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="bg-slate-700 border-slate-600"/>
            <Input placeholder="Açıklama" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="bg-slate-700 border-slate-600"/>
            <Select onValueChange={(value: 'PUBLIC' | 'PRIVATE') => setFormData({...formData, type: value})} defaultValue={formData.type}>
                <SelectTrigger className="bg-slate-700 border-slate-600"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-slate-800 text-white border-slate-700">
                    <SelectItem value="PUBLIC">Herkese Açık</SelectItem>
                    <SelectItem value="PRIVATE">Özel (Şifreli)</SelectItem>
                </SelectContent>
            </Select>
            {formData.type === 'PRIVATE' && (
                <Input type="password" placeholder="Oda Şifresi" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="bg-slate-700 border-slate-600"/>
            )}
             {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>İptal</Button>
          <Button onClick={handleSubmit} disabled={isLoading}>{isLoading ? 'Oluşturuluyor...' : 'Oda Oluştur'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRoomModal;