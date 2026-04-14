import React, { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MenuManager from './components/MenuManager';
import OrderSystem from './components/OrderSystem';
import KitchenView from './components/KitchenView';
import Inventory from './components/Inventory';
import StaffManager from './components/StaffManager';
import Reports from './components/Reports';
import { useCafeStore } from './store';
import { View } from './types';

export default function App() {
  const [currentView, setView] = useState<View>('dashboard');
  const { 
    dishes, 
    setDishes, 
    ingredients, 
    setIngredients, 
    orders, 
    addOrder, 
    updateOrderStatus,
    staff,
    setStaff
  } = useCafeStore();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard orders={orders} />;
      case 'menu':
        return <MenuManager dishes={dishes} setDishes={setDishes} />;
      case 'orders':
        return <OrderSystem dishes={dishes} addOrder={addOrder} />;
      case 'kitchen':
        return <KitchenView orders={orders} updateStatus={updateOrderStatus} />;
      case 'inventory':
        return <Inventory ingredients={ingredients} setIngredients={setIngredients} />;
      case 'staff':
        return <StaffManager staff={staff} setStaff={setStaff} />;
      case 'reports':
        return <Reports orders={orders} />;
      default:
        return <Dashboard orders={orders} />;
    }
  };

  return (
    <Layout currentView={currentView} setView={setView}>
      {renderView()}
    </Layout>
  );
}
