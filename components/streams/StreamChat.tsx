// components/streams/StreamChat.tsx
import React from 'react';
import { Stream } from '../../types/streamTypes';
import { FaPaperPlane } from 'react-icons/fa';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface StreamChatProps {
    stream: Stream;
}

const StreamChat: React.FC<StreamChatProps> = ({ stream }) => {
    // TODO: WebSocket or another real-time connection logic for chat will be implemented here.

    return (
        <div className="bg-white dark:bg-slate-800/50 rounded-xl flex flex-col h-full shadow-lg border border-slate-200 dark:border-slate-700/50">
            <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                <h2 className="font-bold text-slate-800 dark:text-white">Yayın Sohbeti</h2>
            </div>
            
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Chat messages will be rendered here */}
                <div className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-purple-500">Ahmet:</span> Selam herkese!
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-green-500">Zeynep:</span> Hoş geldin!
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-blue-500">{stream.broadcaster.nickname}:</span> Hoş buldum arkadaşlar, yayın başlıyor!
                </div>
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                <form className="flex items-center gap-2">
                    <Input
                        placeholder="Bir mesaj yaz..."
                        className="bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-600"
                    />
                    <Button type="submit" size="icon" className="flex-shrink-0 bg-blue-600 hover:bg-blue-700">
                        <FaPaperPlane />
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default StreamChat;