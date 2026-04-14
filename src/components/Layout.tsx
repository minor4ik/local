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
  FileBarChart,
  History,
  Menu as MenuIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Trash2,
  Clock
} from 'lucide-react';
import { View, Notification } from '../types';
import { cn } from './UI';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  notifications: Notification[];
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
}

export default function Layout({ 
  children, 
  currentView, 
  setView, 
  notifications, 
  markNotificationRead, 
  clearNotifications 
}: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'dashboard', label: 'Статистика', icon: LayoutDashboard },
    { id: 'orders', label: 'Заказы', icon: Utensils },
    { id: 'kitchen', label: 'Кухня', icon: ChefHat },
    { id: 'menu', label: 'Меню', icon: ClipboardList },
    { id: 'inventory', label: 'Склад', icon: Package },
    { id: 'staff', label: 'Персонал', icon: Users },
    { id: 'reports', label: 'Отчёты', icon: FileBarChart },
    // Добавлен пункт меню для перехода в раздел истории обновлений
    { id: 'changelog', label: 'Журнал', icon: History },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-indigo-600">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Utensils size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900">Кафе Мастер</span>
          </div>
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id as View);
                setIsSidebarOpen(false);
              }}
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
          {/* Отображение текущей версии системы в футере боковой панели */}
          <div className="px-4 py-2 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Версия v 1.2
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 transition-colors font-medium">
            <LogOut size={20} />
            Выход
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden w-full">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-50 rounded-lg"
              onClick={() => setIsSidebarOpen(true)}
            >
              <MenuIcon size={24} />
            </button>
            <h1 className="text-lg font-semibold text-slate-800 truncate max-w-[150px] sm:max-w-none">
              {menuItems.find(i => i.id === currentView)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 relative">
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 text-slate-400 hover:text-indigo-600 transition-colors relative"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-[10px] text-white flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900">Уведомления</h3>
                  <button 
                    onClick={clearNotifications}
                    className="text-xs text-slate-400 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    Очистить
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <Bell size={32} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm">Нет новых уведомлений</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => markNotificationRead(notif.id)}
                          className={cn(
                            "p-4 hover:bg-slate-50 transition-colors cursor-pointer relative",
                            !notif.read && "bg-indigo-50/30"
                          )}
                        >
                          {!notif.read && (
                            <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-500 rounded-full"></div>
                          )}
                          <div className="flex gap-3">
                            <div className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                              notif.type === 'order' ? "bg-emerald-100 text-emerald-600" :
                              notif.type === 'status' ? "bg-indigo-100 text-indigo-600" :
                              notif.type === 'inventory' ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-600"
                            )}>
                              {notif.type === 'order' && <Utensils size={16} />}
                              {notif.type === 'status' && <CheckCircle2 size={16} />}
                              {notif.type === 'inventory' && <AlertCircle size={16} />}
                              {notif.type === 'info' && <Info size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-900 truncate">{notif.title}</p>
                              <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notif.message}</p>
                              <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                                <Clock size={10} />
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">Администратор</p>
                <p className="text-xs text-slate-500">Управление</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs shrink-0">
                AD
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
