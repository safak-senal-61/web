// components/chat/MessageInput.tsx
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FaPaperPlane } from 'react-icons/fa';
import { sendMessage } from '@/services/chatroomService';
import { ChatMessage } from '@/types/chatroomTypes';

interface MessageInputProps {
  roomId: string;
  onMessageSent: (message: ChatMessage) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ roomId, onMessageSent }) => {
    const [content, setContent] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async () => {
        if (!content.trim() || isSending) return;
        setIsSending(true);
        const response = await sendMessage(roomId, content.trim());
        if (response.basarili && response.veri) {
            onMessageSent(response.veri.mesaj);
            setContent('');
        }
        setIsSending(false);
    };

    return (
        <div className="p-4 bg-slate-900 border-t border-slate-700 flex items-center gap-4">
            <Input 
                placeholder="Bir mesaj yaz..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                className="bg-slate-800 border-slate-600 text-white"
            />
            <Button onClick={handleSend} disabled={isSending}>
                <FaPaperPlane />
            </Button>
        </div>
    );
};

export default MessageInput;