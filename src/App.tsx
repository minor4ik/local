import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MenuManager from './components/MenuManager';
import OrderSystem from './components/OrderSystem';
import KitchenView from './components/KitchenView';
import Inventory from './components/Inventory';
import StaffManager from './components/StaffManager';
import Reports from './components/Reports';
import Changelog from './components/Changelog';
import Login from './components/Login';
import { useCafeStore } from './store';
import { View, Staff } from './types';
import { testFirebase } from './testFirebase';

export default function App() {
  const [currentView, setView] = useState<View>('dashboard');
  const [currentUser, setCurrentUser] = useState<Staff | null>(() => {
    const saved = localStorage.getItem('cafe_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    testFirebase();
  }, []);

  const { 
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
    addExpense,
    notifications,
    markNotificationRead,
    clearNotifications,
    clearOrders
  } = useCafeStore();

  const handleLogin = (user: Staff) => {
    setCurrentUser(user);
    localStorage.setItem('cafe_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('cafe_user');
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} staff={staff} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard orders={orders} onNavigate={setView} />;
      case 'menu':
        return <MenuManager dishes={dishes} setDishes={setDishes} />;
      case 'orders':
        return <OrderSystem dishes={dishes} addOrder={addOrder} ingredients={ingredients} />;
      case 'kitchen':
        return <KitchenView orders={orders} updateStatus={updateOrderStatus} dishes={dishes} />;
      case 'inventory':
        return <Inventory ingredients={ingredients} setIngredients={setIngredients} addExpense={addExpense} />;
      case 'staff':
        return <StaffManager staff={staff} setStaff={setStaff} />;
      case 'reports':
        return <Reports orders={orders} expenses={expenses} clearOrders={clearOrders} />;
      case 'changelog':
        return <Changelog />;
      default:
        return <Dashboard orders={orders} onNavigate={setView} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setView}
      notifications={notifications}
      markNotificationRead={markNotificationRead}
      clearNotifications={clearNotifications}
      onLogout={handleLogout}
    >
      {renderView()}
    </Layout>
  );
}
