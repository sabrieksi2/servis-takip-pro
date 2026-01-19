
import React, { useState } from 'react';
import { Expense } from '../types';
import { Plus, Trash2, Fuel, Wrench, Shield, FileText, MoreHorizontal, Calendar, DollarSign } from 'lucide-react';

interface ExpensesViewProps {
  expenses: Expense[];
  onAdd: (data: Omit<Expense, 'id'>) => void;
  onDelete: (id: string) => void;
}

const CATEGORIES = [
  { name: 'Yakıt', icon: <Fuel size={18} /> },
  { name: 'Bakım-Onarım', icon: <Wrench size={18} /> },
  { name: 'Kasko', icon: <Shield size={18} /> },
  { name: 'Sigorta', icon: <Shield size={18} /> },
  { name: 'Motorlu Taşıt Vergisi', icon: <FileText size={18} /> },
  { name: 'Muayene', icon: <FileText size={18} /> },
  { name: 'Diğer', icon: <MoreHorizontal size={18} /> },
] as const;

const ExpensesView: React.FC<ExpensesViewProps> = ({ expenses, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<Expense, 'id'>>({
    category: 'Yakıt',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount > 0) {
      onAdd(formData);
      setIsAdding(false);
      setFormData({
        category: 'Yakıt',
        description: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500 p-3 rounded-2xl text-white shadow-lg shadow-amber-100">
            <DollarSign size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Gider Kayıtları</h2>
            <p className="text-sm text-slate-500">Servis masraflarını buradan takip et.</p>
          </div>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all shadow-xl"
          >
            <Plus size={20} />
            <span>Gider Ekle</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-2xl animate-in zoom-in-95 duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Kategori</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none"
              >
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Açıklama</label>
              <input 
                type="text" 
                placeholder="Örn: Shell mazot alımı"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase">Tutar (₺)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={formData.amount || ''}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 outline-none"
              />
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className="flex-1 bg-slate-900 text-white p-3 rounded-xl font-bold hover:bg-black transition-all">Kaydet</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-3 bg-slate-100 text-slate-500 rounded-xl font-bold hover:bg-slate-200 transition-all">İptal</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Tarih</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Kategori</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase">Açıklama</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase text-right">Tutar</th>
              <th className="p-4 text-xs font-bold text-slate-400 uppercase text-center">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-400 italic">Kayıtlı gider bulunmuyor.</td>
              </tr>
            ) : (
              expenses.map(expense => (
                <tr key={expense.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-400" />
                      {new Date(expense.date).toLocaleDateString('tr-TR')}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-bold">
                      {CATEGORIES.find(c => c.name === expense.category)?.icon}
                      {expense.category}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">{expense.description || '-'}</td>
                  <td className="p-4 text-right font-black text-red-600 text-sm">{expense.amount.toLocaleString()} ₺</td>
                  <td className="p-4 text-center">
                    <button onClick={() => onDelete(expense.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesView;
