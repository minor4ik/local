import React from 'react';
import { FileText, Download, Calendar } from 'lucide-react';
import { Order, Expense } from '../types';
import { Card, Button, cn } from './UI';
import { TrendingDown, TrendingUp, PieChart as PieIcon } from 'lucide-react';

interface ReportsProps {
  orders: Order[];
  expenses: Expense[];
}

export default function Reports({ orders, expenses }: ReportsProps) {
  const totalRevenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const completedCount = orders.filter(o => o.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold">Отчёты</h2>
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <Button variant="secondary" className="flex-1 sm:flex-none">
            <Calendar size={18} />
            Период
          </Button>
          <Button className="flex-1 sm:flex-none">
            <Download size={18} />
            Экспорт
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-emerald-600 text-white">
          <h3 className="text-emerald-100 font-medium mb-2">Общая выручка</h3>
          <p className="text-4xl font-bold">{totalRevenue.toLocaleString()} ₽</p>
          <div className="mt-4 flex items-center gap-2 text-emerald-200 text-sm">
            <TrendingUp size={16} />
            На основе {completedCount} заказов
          </div>
        </Card>

        <Card className="p-6 bg-rose-600 text-white">
          <h3 className="text-rose-100 font-medium mb-2">Общие расходы</h3>
          <p className="text-4xl font-bold">{totalExpenses.toLocaleString()} ₽</p>
          <div className="mt-4 flex items-center gap-2 text-rose-200 text-sm">
            <TrendingDown size={16} />
            {expenses.length} записей об издержках
          </div>
        </Card>

        <Card className={cn("p-6 text-white", netProfit >= 0 ? "bg-indigo-600" : "bg-slate-800")}>
          <h3 className="text-indigo-100 font-medium mb-2">Чистая прибыль</h3>
          <p className="text-4xl font-bold">{netProfit.toLocaleString()} ₽</p>
          <div className="mt-4 flex items-center gap-2 text-indigo-200 text-sm">
            <PieIcon size={16} />
            Рентабельность: {totalRevenue > 0 ? Math.round((netProfit / totalRevenue) * 100) : 0}%
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold">История заказов</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 sm:px-6 py-4 text-sm font-semibold text-slate-600">Время</th>
                  <th className="px-4 sm:px-6 py-4 text-sm font-semibold text-slate-600">Стол</th>
                  <th className="px-4 sm:px-6 py-4 text-sm font-semibold text-slate-600">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.slice(0, 10).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="px-4 sm:px-6 py-4 text-slate-600">
                      {new Date(order.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-bold text-slate-900">№{order.tableNumber}</td>
                    <td className="px-4 sm:px-6 py-4 font-semibold text-slate-900">{order.total} ₽</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-bold">Последние расходы</h3>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-4 sm:px-6 py-4 text-sm font-semibold text-slate-600">Описание</th>
                  <th className="px-4 sm:px-6 py-4 text-sm font-semibold text-slate-600">Сумма</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.slice(0, 10).map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="px-4 sm:px-6 py-4">
                      <p className="font-medium text-slate-900">{expense.description}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{
                        expense.category === 'inventory' ? 'Склад' : 
                        expense.category === 'staff' ? 'Персонал' : 'Прочее'
                      }</p>
                    </td>
                    <td className="px-4 sm:px-6 py-4 font-semibold text-rose-600">-{expense.amount} ₽</td>
                  </tr>
                ))}
                {expenses.length === 0 && (
                  <tr>
                    <td colSpan={2} className="px-6 py-10 text-center text-slate-400 italic">Нет записей о расходах</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
