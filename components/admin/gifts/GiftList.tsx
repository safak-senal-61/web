// components/admin/gifts/GiftList.tsx

import React from 'react';
import Image from 'next/image';
import { Gift } from '@/types/adminTypes';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface GiftListProps {
  gifts: Gift[];
  onEdit: (gift: Gift) => void;
  onDelete: (gift: Gift) => void;
}

const GiftList: React.FC<GiftListProps> = ({ gifts, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-700/50 text-xs uppercase">
                    <tr>
                        <th className="p-3">Görsel</th>
                        <th className="p-3">Hediye Adı</th>
                        <th className="p-3">Maliyet (Jeton)</th>
                        <th className="p-3">Değer (Elmas)</th>
                        <th className="p-3">Durum</th>
                        <th className="p-3">İşlemler</th>
                    </tr>
                </thead>
                <tbody>
                    {gifts.map((gift) => (
                        <tr key={gift.id} className="border-b border-slate-700 hover:bg-slate-700/30">
                            <td className="p-3">
                                <Image src={gift.imageUrl} alt={gift.name} width={40} height={40} className="rounded-md bg-slate-700"/>
                            </td>
                            <td className="p-3 font-medium text-white">{gift.name}</td>
                            <td className="p-3">{gift.cost}</td>
                            <td className="p-3">{gift.value}</td>
                            <td className="p-3">
                                <span className={`px-2 py-1 text-xs rounded-full ${gift.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {gift.isActive ? 'Aktif' : 'Pasif'}
                                </span>
                            </td>
                            <td className="p-3 flex gap-2">
                                <Button size="sm" variant="outline" onClick={() => onEdit(gift)}><FaEdit /></Button>
                                <Button size="sm" variant="destructive" onClick={() => onDelete(gift)}><FaTrash /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default GiftList;