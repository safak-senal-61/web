// components/admin/games/CategoryList.tsx

import React from 'react';
import { GameCategory } from '@/types/adminTypes';
import { Button } from '@/components/ui/button';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface CategoryListProps {
  categories: GameCategory[];
}

const CategoryList: React.FC<CategoryListProps> = ({ categories }) => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-4">Kategoriler</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center gap-2 bg-slate-700/50 p-2 rounded-lg">
            <span className="font-medium text-white">{category.name}</span>
            <Button size="icon" variant="ghost" className="h-6 w-6 text-slate-400 hover:text-white">
                <FaEdit className="w-3 h-3"/>
            </Button>
             <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500/70 hover:text-red-500">
                <FaTrash className="w-3 h-3"/>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;