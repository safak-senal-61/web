// components/rooms/CreateRoomForm.tsx
import React, { useState } from 'react';
import { Room } from '../../types/roomTypes'; // RoomCard.tsx veya types/roomTypes.ts'den doğru import edildiğinden emin olun
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogFooter } from "@/components/ui/dialog";
// Bu tip, Room'dan formda olmayan alanları çıkarır.
// category ve language, Room tipinde varsa burada da olacaktır.
type CreateRoomFormData = Omit<Room, 'id' | 'createdBy' | 'memberCount' | 'lastActivity' | 'isPopular' | 'isNew'>;

interface CreateRoomFormProps {
  onSubmit: (data: CreateRoomFormData) => void;
  onCancel: () => void;
  initialData?: Partial<CreateRoomFormData>;
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({ onSubmit, onCancel, initialData = {} }) => {
  // initialData'dan değerleri alırken, bu alanların CreateRoomFormData'da (ve dolayısıyla Room'da)
  // tanımlı olduğundan emin olun.
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [maxMembers, setMaxMembers] = useState(initialData.maxMembers || 50);
  const [isPrivate, setIsPrivate] = useState(initialData.isPrivate || false);
  // Room tipinde tags: string[] ise, initialData.tags de string[] olmalı
  const [tags, setTags] = useState((initialData.tags || []).join(', '));
  const [category, setCategory] = useState(initialData.category || ''); // Hata buradaysa, Room tipinde category eksik olabilir
  const [language, setLanguage] = useState(initialData.language || 'tr'); // Hata buradaysa, Room tipinde language eksik olabilir
  const [imageUrl, setImageUrl] = useState(initialData.imageUrl || '');

  const [errors, setErrors] = useState<Partial<Record<keyof CreateRoomFormData, string>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CreateRoomFormData, string>> = {};
    if (!name.trim()) newErrors.name = "Oda adı gerekli.";
    else if (name.trim().length < 3) newErrors.name = "Oda adı en az 3 karakter olmalı.";
    if (!description.trim()) newErrors.description = "Açıklama gerekli.";
    if (maxMembers < 2 || maxMembers > 500) newErrors.maxMembers = "Üye sayısı 2 ile 500 arasında olmalı.";
    if (!category) newErrors.category = "Kategori seçimi gerekli."; // category state'i kullanılıyor

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const submitData: CreateRoomFormData = {
      name: name.trim(),
      description: description.trim(),
      maxMembers: Number(maxMembers),
      isPrivate,
      tags: tags.split(',').map(tag => tag.trim()).filter(Boolean), // Bu doğru
      category, // category state'inden
      language, // language state'inden
      imageUrl: imageUrl.trim() || undefined,
    };
    onSubmit(submitData);
  };

  const availableCategories = ["Sohbet", "Oyun", "Müzik", "Teknoloji", "Dil Öğrenimi", "Sanat", "Diğer"];
  const availableLanguages = [{value: "tr", label: "Türkçe"}, {value: "en", label: "English"}];


  return (
    <form onSubmit={handleSubmit} className="space-y-6 py-4 pr-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
      <div>
        <Label htmlFor="roomName" className="text-slate-700 dark:text-slate-300">Oda Adı</Label>
        <Input
          id="roomName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Eğlenceli bir oda adı girin"
          className="mt-1 bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
        />
        {errors.name && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="roomDescription" className="text-slate-700 dark:text-slate-300">Açıklama</Label>
        <Textarea
          id="roomDescription"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Odanız ne hakkında?"
          rows={3}
          className="mt-1 bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
        />
        {errors.description && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
            <Label htmlFor="roomCategory" className="text-slate-700 dark:text-slate-300">Kategori</Label>
            <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="roomCategory" className="w-full mt-1 bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                    <SelectValue placeholder="Kategori Seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    {availableCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                </SelectContent>
            </Select>
            {errors.category && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.category}</p>}
        </div>
        <div>
            <Label htmlFor="roomLanguage" className="text-slate-700 dark:text-slate-300">Oda Dili</Label>
             <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="roomLanguage" className="w-full mt-1 bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white">
                    <SelectValue placeholder="Dil Seçin" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white">
                    {availableLanguages.map(lang => <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>)}
                </SelectContent>
            </Select>
            {/* errors.language eklenebilir */}
        </div>
      </div>
      
      <div>
        <Label htmlFor="roomTags" className="text-slate-700 dark:text-slate-300">Etiketler (Virgülle ayırın)</Label>
        <Input
          id="roomTags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="örn: oyun, sohbet, müzik"
          className="mt-1 bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
        />
      </div>
      
      <div>
        <Label htmlFor="roomImageUrl" className="text-slate-700 dark:text-slate-300">Oda Görsel URL (Opsiyonel)</Label>
        <Input
          id="roomImageUrl"
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://ornek.com/gorsel.jpg"
          className="mt-1 bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <div>
            <Label htmlFor="roomMaxMembers" className="text-slate-700 dark:text-slate-300">Maksimum Üye</Label>
            <Input
            id="roomMaxMembers"
            type="number"
            min="2"
            max="500"
            value={maxMembers}
            onChange={(e) => setMaxMembers(Number(e.target.value))}
            className="mt-1 bg-white dark:bg-slate-700/50 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white"
            />
            {errors.maxMembers && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{errors.maxMembers}</p>}
        </div>
        <div className="flex items-center space-x-2 pt-5">
            <Switch
                id="roomIsPrivate"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
            />
            <Label htmlFor="roomIsPrivate" className="text-slate-700 dark:text-slate-300 cursor-pointer">
                Özel Oda
            </Label>
        </div>
      </div>

      <DialogFooter className="pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700">
          İptal
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white">
          Odayı Oluştur
        </Button>
      </DialogFooter>
    </form>
  );
};

export default CreateRoomForm;