import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { Order } from '../types';
import { Card, Button } from './UI';

interface ReportsProps {
  orders: Order[];
}

export default function Reports({ orders }: ReportsProps) {
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const completedCount = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Отчёты и аналитика</h2>
        <div className="flex gap-3">
          <Button variant="secondary">
            <Calendar size={18} />
            Период
          </Button>
          <Button>
            <Download size={18} />
            Экспорт PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-indigo-600 text-white">
          <h3 className="text-indigo-100 font-medium mb-2">Общая выручка</h3>
          <p className="text-4xl font-bold">{totalRevenue.toLocaleString()} ₽</p>
          <div className="mt-4 flex items-center gap-2 text-indigo-200 text-sm">
            <FileText size={16} />
            На основе {orders.length} заказов
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-slate-500 font-medium mb-2">Выполненные заказы</h3>
          <p className="text-4xl font-bold text-slate-900">{completedCount}</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-600 text-sm font-medium">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            {Math.round((completedCount / (orders.length || 1)) * 100)}% от общего числа
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-bold">История заказов</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">ID</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Время</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Стол</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Сумма</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Статус</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{order.id}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(order.timestamp).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900">№{order.tableNumber}</td>
                  <td className="px-6 py-4 font-semibold text-slate-900">{order.total} ₽</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      order.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                      order.status === 'cancelled' ? 'bg-red-50 text-red-700' :
                      'bg-amber-50 text-amber-700'
                    }`}>
                      {order.status === 'completed' ? 'Выполнен' :
                       order.status === 'cancelled' ? 'Отменен' : 'В работе'}
                    </span>
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
