// components/chat/JoinPrivateRoomModal.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { joinChatRoom } from '@/services/chatroomService';
import { FaLock } from 'react-icons/fa';

interface JoinPrivateRoomModalProps {
  roomId: string;
  onJoinSuccess: () => void;
}

const JoinPrivateRoomModal: React.FC<JoinPrivateRoomModalProps> = ({ roomId, onJoinSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleJoin = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await joinChatRoom(roomId, password);
            if (response.basarili) {
                onJoinSuccess();
            } else {
                setError(response.mesaj || 'Odaya katılım başarısız.');
            }
        } catch (e: any) {
             setError(e.response?.data?.mesaj || 'Bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen bg-slate-900">
            <div className="w-full max-w-sm p-8 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl">
                <FaLock className="mx-auto text-3xl text-blue-400 mb-4"/>
                <h2 className="text-xl font-bold text-white text-center mb-2">Özel Oda</h2>
                <p className="text-slate-400 text-center mb-6">Bu odaya girmek için şifreyi girmeniz gerekmektedir.</p>
                <Input 
                    type="password" 
                    placeholder="Oda Şifresi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-slate-700 border-slate-600 text-white"
                />
                {error && <p className="text-red-400 text-xs mt-2 text-center">{error}</p>}
                <Button onClick={handleJoin} disabled={isLoading || !password} className="w-full mt-4">
                    {isLoading ? 'Katılıyor...' : 'Odaya Katıl'}
                </Button>
            </div>
        </div>
    );
};

export default JoinPrivateRoomModal;