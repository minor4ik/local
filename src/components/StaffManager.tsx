import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, X } from 'lucide-react';
import { Staff } from '../types';
import { Card, Button } from './UI';

interface StaffManagerProps {
  staff: Staff[];
  setStaff: React.Dispatch<React.SetStateAction<Staff[]>>;
}

export default function StaffManager({ staff, setStaff }: StaffManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newMember, setNewMember] = useState<Partial<Staff>>({
    name: '',
    position: 'Официант',
    phone: '',
    login: ''
  });

  const handleAdd = () => {
    if (!newMember.name || !newMember.login) return;
    const member: Staff = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMember.name!,
      position: newMember.position!,
      phone: newMember.phone || '',
      login: newMember.login!
    };
    setStaff(prev => [...prev, member]);
    setIsAdding(false);
    setNewMember({ name: '', position: 'Официант', phone: '', login: '' });
  };

  const deleteMember = (id: string) => {
    setStaff(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Управление персоналом</h2>
        <Button onClick={() => setIsAdding(true)}>
          <Plus size={18} />
          Добавить сотрудника
        </Button>
      </div>

      {isAdding && (
        <Card className="p-6 border-2 border-indigo-100 bg-indigo-50/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Новый сотрудник</h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">ФИО</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                value={newMember.name}
                onChange={e => setNewMember({...newMember, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Должность</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                value={newMember.position}
                onChange={e => setNewMember({...newMember, position: e.target.value})}
              >
                <option>Администратор</option>
                <option>Официант</option>
                <option>Повар</option>
                <option>Бармен</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Телефон</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                value={newMember.phone}
                onChange={e => setNewMember({...newMember, phone: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Логин</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500/20"
                value={newMember.login}
                onChange={e => setNewMember({...newMember, login: e.target.value})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsAdding(false)}>Отмена</Button>
            <Button onClick={handleAdd}>Сохранить</Button>
          </div>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">ФИО</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Должность</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Телефон</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600">Логин</th>
                <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{member.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-medium">
                      {member.position}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{member.phone}</td>
                  <td className="px-6 py-4 text-slate-600">{member.login}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteMember(member.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
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
