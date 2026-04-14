import React, { useState } from 'react';
import { Plus, Search, Trash2, Edit2, X } from 'lucide-react';
import { Dish } from '../types';
import { Card, Button } from './UI';

interface MenuManagerProps {
  dishes: Dish[];
  setDishes: React.Dispatch<React.SetStateAction<Dish[]>>;
}

export default function MenuManager({ dishes, setDishes }: MenuManagerProps) {
  const [search, setSearch] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [newDish, setNewDish] = useState<Partial<Dish>>({
    name: '',
    category: 'Горячее',
    price: 0,
    description: '',
    available: true,
    ingredients: []
  });

  const filteredDishes = dishes.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddDish = () => {
    if (!newDish.name || !newDish.price) return;
    const dish: Dish = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDish.name!,
      category: newDish.category!,
      price: Number(newDish.price),
      description: newDish.description || '',
      available: true,
      ingredients: []
    };
    setDishes(prev => [...prev, dish]);
    setIsAdding(false);
    setNewDish({ name: '', category: 'Горячее', price: 0, description: '', available: true, ingredients: [] });
  };

  const deleteDish = (id: string) => {
    setDishes(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Поиск блюда или категории..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={18} />
          Добавить блюдо
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 border-2 border-indigo-100 bg-indigo-50/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Новое блюдо</h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Название</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                value={newDish.name}
                onChange={e => setNewDish({...newDish, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Категория</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                value={newDish.category}
                onChange={e => setNewDish({...newDish, category: e.target.value})}
              >
                <option>Супы</option>
                <option>Салаты</option>
                <option>Горячее</option>
                <option>Напитки</option>
                <option>Десерты</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Цена (₽)</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                value={newDish.price}
                onChange={e => setNewDish({...newDish, price: Number(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Описание</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                value={newDish.description}
                onChange={e => setNewDish({...newDish, description: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsAdding(false)}>Отмена</Button>
            <Button onClick={handleAddDish}>Сохранить</Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Название</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Категория</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Цена</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Статус</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDishes.map((dish) => (
                <tr key={dish.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{dish.name}</p>
                    <p className="text-xs text-slate-500">{dish.description}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                      {dish.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-900">
                    {dish.price} ₽
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                      dish.available ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                    )}>
                      <span className={cn("w-1.5 h-1.5 rounded-full", dish.available ? "bg-emerald-500" : "bg-red-500")}></span>
                      {dish.available ? 'В наличии' : 'Нет'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteDish(dish.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

