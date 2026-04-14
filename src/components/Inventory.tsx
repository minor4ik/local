import React, { useState } from 'react';
import { AlertTriangle, Plus, ArrowDown, ArrowUp, X } from 'lucide-react';
import { Ingredient } from '../types';
import { Card, Button, cn } from './UI';

interface InventoryProps {
  ingredients: Ingredient[];
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
}

export default function Inventory({ ingredients, setIngredients }: InventoryProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [supply, setSupply] = useState({ ingredientId: '', amount: 0 });

  const handleSupply = () => {
    if (!supply.ingredientId || supply.amount <= 0) return;
    setIngredients(prev => prev.map(ing => 
      ing.id === supply.ingredientId 
        ? { ...ing, quantity: ing.quantity + supply.amount } 
        : ing
    ));
    setIsAdding(false);
    setSupply({ ingredientId: '', amount: 0 });
  };

  const adjustStock = (id: string, delta: number) => {
    setIngredients(prev => prev.map(ing => 
      ing.id === id ? { ...ing, quantity: Math.max(0, ing.quantity + delta) } : ing
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Учёт продуктов</h2>
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={18} />
          Новая поставка
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 border-2 border-indigo-100 bg-indigo-50/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Оформление поставки</h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Ингредиент</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                value={supply.ingredientId}
                onChange={e => setSupply({...supply, ingredientId: e.target.value})}
              >
                <option value="">Выберите продукт...</option>
                {ingredients.map(ing => (
                  <option key={ing.id} value={ing.id}>{ing.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Количество</label>
              <input 
                type="number" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                value={supply.amount}
                onChange={e => setSupply({...supply, amount: Number(e.target.value)})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsAdding(false)}>Отмена</Button>
            <Button onClick={handleSupply}>Принять</Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ingredients.map(ing => {
          const isLow = ing.quantity <= ing.minStock;
          return (
            <Card key={ing.id} className={cn(
              "p-6 border-l-4",
              isLow ? "border-l-red-500" : "border-l-emerald-500"
            )}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-900">{ing.name}</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Ед. изм: {ing.unit}</p>
                </div>
                {isLow && (
                  <div className="text-red-500 animate-pulse">
                    <AlertTriangle size={20} />
                  </div>
                )}
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">{ing.quantity}</p>
                  <p className="text-xs text-slate-500">Мин. остаток: {ing.minStock}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => adjustStock(ing.id, -1)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <ArrowDown size={16} />
                  </button>
                  <button 
                    onClick={() => adjustStock(ing.id, 1)}
                    className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    <ArrowUp size={16} />
                  </button>
                </div>
              </div>

              {isLow && (
                <div className="mt-4 p-2 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold uppercase text-center">
                  Требуется закупка
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

