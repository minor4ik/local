export interface Dish {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  available: boolean;
  ingredients: { ingredientId: string; amount: number }[];
  prepTime: number; // Время приготовления в минутах
  weight: number; // Вес блюда в граммах
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  minStock: number;
  costPrice: number; // Себестоимость за единицу (кг, л, шт)
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'inventory' | 'staff' | 'utility' | 'other';
  timestamp: number;
}

export interface OrderItem {
  dishId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string; // Номер чека
  tableNumber: number;
  items: OrderItem[];
  status: 'pending' | 'cooking' | 'ready' | 'completed' | 'cancelled';
  timestamp: number;
  total: number;
}

export interface Staff {
  id: string;
  name: string;
  position: string;
  phone: string;
  login: string;
  password?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'status' | 'info';
  timestamp: number;
  read: boolean;
}

export type View = 'dashboard' | 'menu' | 'orders' | 'kitchen' | 'inventory' | 'staff' | 'reports' | 'changelog';
