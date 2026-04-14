import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, Users, DollarSign, ShoppingBag } from 'lucide-react';
import { Order } from '../types';
import { Card } from './UI';

interface DashboardProps {
  orders: Order[];
}

export default function Dashboard({ orders }: DashboardProps) {
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const completedOrders = orders.filter(o => o.status === 'completed').length;
    const avgOrder = orders.length > 0 ? totalRevenue / orders.length : 0;
    
    return [
      { label: 'Выручка', value: `${totalRevenue.toLocaleString()} ₽`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Заказы', value: orders.length, icon: ShoppingBag, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Ср. чек', value: `${Math.round(avgOrder).toLocaleString()} ₽`, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50' },
      { label: 'Посетители', value: orders.length * 2, icon: Users, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];
  }, [orders]);

  const chartData = useMemo(() => {
    // Group by hour for mock trend
    return [
      { time: '09:00', sales: 4000 },
      { time: '12:00', sales: 12000 },
      { time: '15:00', sales: 8000 },
      { time: '18:00', sales: 18000 },
      { time: '21:00', sales: 15000 },
    ];
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center gap-4">
              <div className={stat.bg + " p-3 rounded-xl " + stat.color}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">Динамика продаж</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4, fill: '#4f46e5' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-bold mb-6">Популярные категории</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Супы', value: 400 },
                { name: 'Салаты', value: 300 },
                { name: 'Горячее', value: 600 },
                { name: 'Напитки', value: 800 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
}
