import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Utensils, 
  ClipboardList, 
  ChefHat, 
  Package, 
  LogOut,
  Bell,
  Users,
  FileBarChart
} from 'lucide-react';
import { View } from '../types';
import { cn } from './UI';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
}

export default function Layout({ children, currentView, setView }: LayoutProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Дашборд', icon: LayoutDashboard },
    { id: 'orders', label: 'Заказы', icon: Utensils },
    { id: 'kitchen', label: 'Кухня', icon: ChefHat },
    { id: 'menu', label: 'Меню', icon: ClipboardList },
    { id: 'inventory', label: 'Склад', icon: Package },
    { id: 'staff', label: 'Персонал', icon: Users },
    { id: 'reports', label: 'Отчёты', icon: FileBarChart },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Utensils size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">CafeMaster</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors font-medium",
                currentView === item.id 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 transition-colors font-medium">
            <LogOut size={20} />
            Выход
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8">
          <h1 className="text-lg font-semibold text-slate-800">
            {menuItems.find(i => i.id === currentView)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-medium text-slate-900">Администратор</p>
                <p className="text-xs text-slate-500">Управление</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
