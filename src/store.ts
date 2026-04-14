import { useState, useEffect } from 'react';
import { Dish, Ingredient, Order, Staff } from './types';

// Initial Mock Data
const initialStaff: Staff[] = [
  { id: '1', name: 'Иванов Иван', position: 'Администратор', phone: '+7 (999) 123-45-67', login: 'admin' },
  { id: '2', name: 'Петров Петр', position: 'Официант', phone: '+7 (999) 765-43-21', login: 'waiter1' },
  { id: '3', name: 'Сидоров Сидор', position: 'Повар', phone: '+7 (999) 000-00-00', login: 'chef1' },
];

const initialDishes: Dish[] = [
  { id: '1', name: 'Борщ', category: 'Супы', price: 350, description: 'Классический борщ со сметаной', available: true, ingredients: [{ ingredientId: 'i1', amount: 0.2 }] },
  { id: '2', name: 'Цезарь', category: 'Салаты', price: 450, description: 'Салат с курицей и соусом цезарь', available: true, ingredients: [{ ingredientId: 'i2', amount: 0.15 }] },
  { id: '3', name: 'Стейк', category: 'Горячее', price: 1200, description: 'Говяжий стейк прожарки медиум', available: true, ingredients: [{ ingredientId: 'i3', amount: 0.3 }] },
];

const initialIngredients: Ingredient[] = [
  { id: 'i1', name: 'Свекла', unit: 'кг', quantity: 10, minStock: 2 },
  { id: 'i2', name: 'Куриное филе', unit: 'кг', quantity: 5, minStock: 1 },
  { id: 'i3', name: 'Говядина', unit: 'кг', quantity: 8, minStock: 2 },
  { id: 'i4', name: 'Картофель', unit: 'кг', quantity: 20, minStock: 5 },
];

export function useCafeStore() {
  const [dishes, setDishes] = useState<Dish[]>(() => {
    const saved = localStorage.getItem('cafe_dishes');
    return saved ? JSON.parse(saved) : initialDishes;
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem('cafe_ingredients');
    return saved ? JSON.parse(saved) : initialIngredients;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('cafe_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [staff, setStaff] = useState<Staff[]>(() => {
    const saved = localStorage.getItem('cafe_staff');
    return saved ? JSON.parse(saved) : initialStaff;
  });

  useEffect(() => {
    localStorage.setItem('cafe_dishes', JSON.stringify(dishes));
  }, [dishes]);

  useEffect(() => {
    localStorage.setItem('cafe_ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('cafe_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('cafe_staff', JSON.stringify(staff));
  }, [staff]);

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
    // Deduct ingredients
    setIngredients(prev => prev.map(ing => {
      let usedAmount = 0;
      order.items.forEach(item => {
        const dish = dishes.find(d => d.id === item.dishId);
        const recipeItem = dish?.ingredients.find(ri => ri.ingredientId === ing.id);
        if (recipeItem) {
          usedAmount += recipeItem.amount * item.quantity;
        }
      });
      return { ...ing, quantity: Math.max(0, ing.quantity - usedAmount) };
    }));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return {
    dishes,
    setDishes,
    ingredients,
    setIngredients,
    orders,
    addOrder,
    updateOrderStatus,
    staff,
    setStaff
  };
}
