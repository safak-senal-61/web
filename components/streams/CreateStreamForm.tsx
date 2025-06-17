// components/streams/CreateStreamForm.tsx
import React, { useState, FormEvent } from 'react';
// ...diğer importlar...
import { createStream } from '../../services/streamService';
import { CreateStreamPayload, Stream, AgoraConfig } from '../../types/streamTypes'; // AgoraConfig eklendi
import { DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { FaSpinner } from 'react-icons/fa';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface CreateStreamFormProps {
  // onSuccess prop'unun tipini güncelliyoruz
  onSuccess: (data: { yayin: Stream; agora: AgoraConfig }) => void;
  onCancel: () => void;
}

const CreateStreamForm: React.FC<CreateStreamFormProps> = ({ onSuccess, onCancel }) => {
  // ... (formun state'leri ve diğer kısımları aynı kalacak) ...
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Yayın başlığı zorunludur.');
      return;
    }
    setLoading(true);
    setError(null);

    const payload: CreateStreamPayload = {
      title,
      status: 'LIVE',
      coverImage: coverImage || undefined,
    };

    try {
      const response = await createStream(payload);
      if (response.basarili && response.veri) {
        // Başarılı olduğunda API'den dönen tüm veriyi onSuccess ile gönder
        onSuccess(response.veri);
      } else {
        setError(response.mesaj || 'Yayın oluşturulamadı.');
      }
    } catch (err) {
      setError('Yayın oluşturulurken bir hata oluştu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
        {/* Formun içeriği (Inputlar, Butonlar) aynı kalabilir */}
        <div>
            <Label htmlFor="streamTitle" className="text-slate-700 dark:text-slate-300">Yayın Başlığı</Label>
            <Input
            id="streamTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Canlı yayınınız için bir başlık girin"
            className="mt-1 bg-white dark:bg-slate-700/50"
            disabled={loading}
            />
        </div>

        <div>
            <Label htmlFor="coverImage" className="text-slate-700 dark:text-slate-300">Kapak Fotoğrafı (İsteğe Bağlı)</Label>
            <Input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={(e) => setCoverImage(e.target.files ? e.target.files[0] : null)}
            className="mt-1 file:text-slate-600 dark:file:text-slate-300"
            disabled={loading}
            />
        </div>

        <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            İptal
            </Button>
            <Button type="submit" disabled={loading} className="w-28">
            {loading ? <FaSpinner className="animate-spin" /> : 'Yayını Başlat'}
            </Button>
        </DialogFooter>
        {error && <p className="text-xs text-red-500 dark:text-red-400 mt-2">{error}</p>}
    </form>
  );
};

export default CreateStreamForm;