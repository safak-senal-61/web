// components/settings/forms/DeviceSettings.tsx
import React, { useState, useEffect } from 'react';
import { Device, getDevices, addDevice, deleteDevice, updateDevice, deleteAllDevices } from '../../../services/authService';
import { getCategoryDetails } from '../../../constants/settingsConfig';
import { Smartphone, Monitor, Tablet, HelpCircle, Plus, Trash2, Edit2, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DeviceSettingsProps {
  // Bu bileşen kendi state'ini yönetir
}

const DeviceSettings: React.FC<DeviceSettingsProps> = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [addingDevice, setAddingDevice] = useState(false);
  const [editingDevice, setEditingDevice] = useState<string | null>(null);
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceType, setNewDeviceType] = useState<'mobile' | 'desktop' | 'tablet' | 'other'>('desktop');
  const [editDeviceName, setEditDeviceName] = useState('');
  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);

  const categoryDetails = getCategoryDetails('security');
  const colorScheme = categoryDetails?.color || 'red';

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const response = await getDevices();
      if (response.basarili && response.veri) {
        setDevices(response.veri.devices || []);
      } else {
        setDevices([]);
        toast.error(response.mesaj || 'Cihazlar yüklenirken hata oluştu');
      }
    } catch (error) {
      setDevices([]);
      toast.error('Cihazlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async () => {
    if (!newDeviceName.trim()) {
      toast.error('Cihaz adı gereklidir');
      return;
    }

    setAddingDevice(true);
    try {
      const response = await addDevice({
        deviceName: newDeviceName.trim(),
        deviceType: newDeviceType
      });
      
      if (response.basarili) {
        toast.success('Cihaz başarıyla eklendi');
        setNewDeviceName('');
        setNewDeviceType('desktop');
        loadDevices();
      } else {
        toast.error(response.mesaj || 'Cihaz eklenirken hata oluştu');
      }
    } catch (error) {
      toast.error('Cihaz eklenirken hata oluştu');
    } finally {
      setAddingDevice(false);
    }
  };

  const handleDeleteDevice = async (deviceId: string) => {
    try {
      const response = await deleteDevice(deviceId);
      if (response.basarili) {
        toast.success('Cihaz başarıyla silindi');
        loadDevices();
      } else {
        toast.error(response.mesaj || 'Cihaz silinirken hata oluştu');
      }
    } catch (error) {
      toast.error('Cihaz silinirken hata oluştu');
    }
  };

  const handleUpdateDevice = async (deviceId: string) => {
    if (!editDeviceName.trim()) {
      toast.error('Cihaz adı gereklidir');
      return;
    }

    try {
      const response = await updateDevice(deviceId, {
        deviceName: editDeviceName.trim()
      });
      
      if (response.basarili) {
        toast.success('Cihaz adı başarıyla güncellendi');
        setEditingDevice(null);
        setEditDeviceName('');
        loadDevices();
      } else {
        toast.error(response.mesaj || 'Cihaz güncellenirken hata oluştu');
      }
    } catch (error) {
      toast.error('Cihaz güncellenirken hata oluştu');
    }
  };

  const handleDeleteAllDevices = async () => {
    try {
      console.log('Tüm cihazları silme işlemi başlatılıyor...');
      const response = await deleteAllDevices();
      console.log('deleteAllDevices response:', response);
      
      if (response.basarili) {
        toast.success('Diğer tüm cihazlar başarıyla silindi');
        loadDevices();
        setShowDeleteAllConfirm(false);
      } else {
        console.error('deleteAllDevices başarısız:', response);
        toast.error(response.mesaj || 'Cihazlar silinirken hata oluştu');
      }
    } catch (error) {
      console.error('deleteAllDevices catch error:', error);
      toast.error('Cihazlar silinirken hata oluştu');
    }
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      default:
        return <HelpCircle className="w-5 h-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Yeni Cihaz Ekleme */}
      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <h3 className="text-lg font-medium text-white mb-4">Yeni Cihaz Ekle</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cihaz Adı
            </label>
            <input
              type="text"
              value={newDeviceName}
              onChange={(e) => setNewDeviceName(e.target.value)}
              placeholder="Örn: iPhone 15, MacBook Pro"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Cihaz Tipi
            </label>
            <select
              value={newDeviceType}
              onChange={(e) => setNewDeviceType(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="desktop">Masaüstü</option>
              <option value="mobile">Mobil</option>
              <option value="tablet">Tablet</option>
              <option value="other">Diğer</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddDevice}
              disabled={addingDevice || !newDeviceName.trim()}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {addingDevice ? 'Ekleniyor...' : 'Ekle'}
            </button>
          </div>
        </div>
      </div>

      {/* Cihaz Listesi */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-white">Güvenilir Cihazlar</h3>
          {devices.length > 1 && (
            <button
              onClick={() => setShowDeleteAllConfirm(true)}
              className="px-3 py-1 text-sm bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-md transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Diğer Cihazları Sil
            </button>
          )}
        </div>

        {devices.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Monitor className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Henüz kayıtlı cihaz bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className={`bg-slate-800/50 rounded-lg p-4 border ${
                  device.isCurrentDevice ? 'border-green-500/50 bg-green-500/5' : 'border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-slate-400">
                      {getDeviceIcon(device.deviceType)}
                    </div>
                    <div>
                      {editingDevice === device.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editDeviceName}
                            onChange={(e) => setEditDeviceName(e.target.value)}
                            className="px-2 py-1 bg-slate-700 border border-slate-600 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
                            autoFocus
                          />
                          <button
                            onClick={() => handleUpdateDevice(device.id)}
                            className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                          >
                            Kaydet
                          </button>
                          <button
                            onClick={() => {
                              setEditingDevice(null);
                              setEditDeviceName('');
                            }}
                            className="px-2 py-1 bg-slate-600 hover:bg-slate-700 text-white rounded text-xs transition-colors"
                          >
                            İptal
                          </button>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-medium text-white flex items-center gap-2">
                            {device.deviceName}
                            {device.isCurrentDevice && (
                              <span className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs rounded-full">
                                Mevcut Cihaz
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-slate-400">
                            Son kullanım: {formatDate(device.lastUsedAt)}
                          </p>
                          {device.ipAddress && (
                            <p className="text-xs text-slate-500">
                              IP: {device.ipAddress}
                            </p>
                          )}
                          {device.location && (
                            <p className="text-xs text-slate-500">
                              Konum: {device.location}
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  {!device.isCurrentDevice && editingDevice !== device.id && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingDevice(device.id);
                          setEditDeviceName(device.deviceName);
                        }}
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                        title="Düzenle"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDevice(device.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tüm Cihazları Silme Onayı */}
      {showDeleteAllConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-400" />
              <h3 className="text-lg font-medium text-white">Cihazları Sil</h3>
            </div>
            <p className="text-slate-300 mb-6">
              Mevcut cihazınız hariç diğer tüm güvenilir cihazları silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteAllConfirm(false)}
                className="flex-1 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-md transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleDeleteAllDevices}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceSettings;