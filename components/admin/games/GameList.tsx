// components/admin/games/GameList.tsx

import React from 'react';
import { Game } from '@/types/gameTypes';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface GameListProps {
  games: Game[];
  onEdit: (game: Game) => void;
  onDelete: (game: Game) => void;
}

const GameList: React.FC<GameListProps> = ({ games, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Oyunlar</h2>
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-700/50 text-xs uppercase">
                    <tr>
                        <th className="p-3">Oyun Adı</th>
                        <th className="p-3">Kategori</th>
                        <th className="p-3">Giriş Ücreti</th>
                        <th className="p-3">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                            <td className="p-3 font-medium text-white">{game.title}</td>
                            <td className="p-3">{game.genres?.[0]?.name || 'N/A'}</td>
                            <td className="p-3">{game.entryCost || 0} Jeton</td>
                            <td className="p-3 flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => onEdit(game)}>
                                    <FaEdit />
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => onDelete(game)}>
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default GameList;