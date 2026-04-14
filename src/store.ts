import { useState, useEffect, useRef } from 'react';
import { Dish, Ingredient, Order, Staff, Expense } from './types';
import { db } from './firebase';
import { doc, setDoc, collection, getDocs, writeBatch, query, orderBy } from 'firebase/firestore';

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
  { id: 'i1', name: 'Свекла', unit: 'кг', quantity: 10, minStock: 2, costPrice: 45 },
  { id: 'i2', name: 'Куриное филе', unit: 'кг', quantity: 5, minStock: 1, costPrice: 380 },
  { id: 'i3', name: 'Говядина', unit: 'кг', quantity: 8, minStock: 2, costPrice: 650 },
  { id: 'i4', name: 'Картофель', unit: 'кг', quantity: 20, minStock: 5, costPrice: 35 },
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

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('cafe_expenses');
    return saved ? JSON.parse(saved) : [];
  });

  const lastSavedRef = useRef<number>(Date.now());

  // Функция для сохранения данных в Firebase
  const saveToFirebase = async () => {
    try {
      console.log('Начало автосохранения в Firebase...');
      const batch = writeBatch(db);

      // Сохранение блюд
      dishes.forEach(dish => {
        batch.set(doc(db, 'dishes', dish.id), dish);
      });

      // Сохранение ингредиентов
      ingredients.forEach(ing => {
        batch.set(doc(db, 'ingredients', ing.id), ing);
      });

      // Сохранение заказов
      orders.forEach(order => {
        batch.set(doc(db, 'orders', order.id), order);
      });

      // Сохранение персонала
      staff.forEach(member => {
        batch.set(doc(db, 'staff', member.id), member);
      });

      // Сохранение издержек
      expenses.forEach(expense => {
        batch.set(doc(db, 'expenses', expense.id), expense);
      });

      await batch.commit();
      lastSavedRef.current = Date.now();
      console.log('Автосохранение успешно завершено');
    } catch (error) {
      console.error('Ошибка при автосохранении в Firebase:', error);
    }
  };

  // Эффект для локального сохранения и запуска таймера автосохранения
  useEffect(() => {
    localStorage.setItem('cafe_dishes', JSON.stringify(dishes));
    localStorage.setItem('cafe_ingredients', JSON.stringify(ingredients));
    localStorage.setItem('cafe_orders', JSON.stringify(orders));
    localStorage.setItem('cafe_staff', JSON.stringify(staff));
    localStorage.setItem('cafe_expenses', JSON.stringify(expenses));

    // Настройка интервала автосохранения (5 минут)
    const interval = setInterval(() => {
      saveToFirebase();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [dishes, ingredients, orders, staff, expenses]);

  // Загрузка данных из Firebase при инициализации (опционально)
  useEffect(() => {
    const loadData = async () => {
      try {
        const dishesSnap = await getDocs(collection(db, 'dishes'));
        if (!dishesSnap.empty) {
          const loadedDishes = dishesSnap.docs.map(d => d.data() as Dish);
          setDishes(loadedDishes);
        }
        // Аналогично для остальных коллекций...
        const expensesSnap = await getDocs(query(collection(db, 'expenses'), orderBy('timestamp', 'desc')));
        if (!expensesSnap.empty) {
          const loadedExpenses = expensesSnap.docs.map(d => d.data() as Expense);
          setExpenses(loadedExpenses);
        }
      } catch (e) {
        console.warn('Не удалось загрузить данные из Firebase, используем локальные');
      }
    };
    loadData();
  }, []);

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
      return { ...ing, quantity: Number(Math.max(0, ing.quantity - usedAmount).toFixed(3)) };
    }));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const addExpense = (expense: Expense) => {
    setExpenses(prev => [expense, ...prev]);
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
    setStaff,
    expenses,
    addExpense
  };
}
