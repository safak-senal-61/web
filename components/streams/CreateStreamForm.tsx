import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { FaSpinner, FaImage, FaVideo, FaUpload } from 'react-icons/fa';

// Mock interface for demonstration
interface CreateStreamFormProps {
  onSuccess: (newStream: any) => void;
  onCancel: () => void;
}

const CreateStreamForm: React.FC<CreateStreamFormProps> = ({ onSuccess, onCancel }) => {
  const [title, setTitle] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
      setCoverImage(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Yayın başlığı zorunludur.');
      return;
    }
    setLoading(true);
    setError(null);

    // Simulate API call
    setTimeout(() => {
      onSuccess({ id: 1, title, coverImage });
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-blue-500/5 to-indigo-500/5 rounded-xl blur-3xl"></div>
      
      <form onSubmit={handleSubmit} className="relative space-y-6 py-6 px-1">
        {/* Header with icon */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg">
            <FaVideo className="text-white text-sm" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Yeni Yayın Başlat</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Yayın bilgilerini girerek hemen canlı yayına geç</p>
          </div>
        </div>

        {/* Error message with modern styling */}
        {error && (
          <div className="relative p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          </div>
        )}
        
        {/* Stream title input */}
        <div className="space-y-2">
          <Label htmlFor="streamTitle" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <span>Yayın Başlığı</span>
            <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Input
              id="streamTitle"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Canlı yayınınız için çekici bir başlık girin"
              className="pl-4 pr-4 py-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
              disabled={loading}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-xl pointer-events-none"></div>
          </div>
        </div>

        {/* Cover image upload with drag & drop */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <FaImage className="text-slate-400" />
            <span>Kapak Fotoğrafı</span>
            <span className="text-xs text-slate-400 font-normal">(İsteğe bağlı)</span>
          </Label>
          
          <div
            className={`relative group transition-all duration-300 ${
              dragOver 
                ? 'border-blue-400 dark:border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-[1.02]' 
                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="relative p-6 border-2 border-dashed rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
              {coverImage ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <FaImage className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{coverImage.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {(coverImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCoverImage(null)}
                    className="text-xs"
                  >
                    Kaldır
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-full mb-3 mx-auto group-hover:scale-110 transition-transform duration-200">
                    <FaUpload className="text-slate-400 dark:text-slate-500" />
                  </div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Fotoğraf yükle veya sürükle bırak
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    PNG, JPG, GIF formatları desteklenir (Maks. 10MB)
                  </p>
                </div>
              )}
              
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <DialogFooter className="pt-6 gap-3">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel} 
            disabled={loading}
            className="px-6 py-2.5 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
          >
            İptal
          </Button>
          
          <Button 
            type="submit" 
            disabled={loading || !title.trim()} 
            className="px-8 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] font-medium"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <FaSpinner className="animate-spin" />
                <span>Başlatılıyor...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FaVideo />
                <span>Yayını Başlat</span>
              </div>
            )}
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};

export default CreateStreamForm;