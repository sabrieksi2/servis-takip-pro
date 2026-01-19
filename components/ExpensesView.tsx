
import React, { useState } from 'react';
import { Expense } from '../types';
import { Plus, Trash2, Fuel, Wrench, Shield, FileText, MoreHorizontal, Calendar, DollarSign, X } from 'lucide-react';

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
    <div className="space-y-4 lg:space-y-6 animate-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center bg-white p-4 lg:p-6 rounded-[24px] lg:rounded-[32px] border border-slate-100 shadow-sm gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-amber-500 p-2.5 lg:p-3 rounded-xl lg:rounded-2xl text-white shadow-lg shadow-amber-100 shrink-0">
            <DollarSign size={22} />
          </div>
          <div>
            <h2 className="text-base lg:text-xl font-black text-slate-800 uppercase tracking-tight">Gider Yönetimi</h2>
            <p className="text-[10px] lg:text-xs text-slate-400 font-bold uppercase tracking-widest">Harcama Takibi</p>
          </div>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black uppercase text-sm hover:bg-black transition-all shadow-xl"
          >
            <Plus size={20} />
            <span>Gider Ekle</span>
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white p-5 lg:p-8 rounded-[28px] lg:rounded-[36px] border-2 border-slate-900 shadow-2xl animate-in zoom-in-95 duration-300 relative">
          <button onClick={() => setIsAdding(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-2"><X size={20}/></button>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value as any})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none font-bold text-sm lg:text-base"
                >
                  {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Açıklama</label>
                <input 
                  type="text" 
                  placeholder="Shell yakıt alımı vb."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none font-bold text-sm lg:text-base"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tutar (₺)</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={formData.amount || ''}
                  onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value) || 0})}
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 outline-none font-black text-sm lg:text-base"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" className="flex-1 bg-slate-900 text-white p-4 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-black transition-all">Kaydet</button>
              <button type="button" onClick={() => setIsAdding(false)} className="px-8 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-sm hover:bg-slate-200 transition-all">İptal</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-[24px] lg:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px] lg:min-w-0">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 lg:p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tarih</th>
                <th className="p-4 lg:p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Kategori</th>
                <th className="p-4 lg:p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Açıklama</th>
                <th className="p-4 lg:p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Tutar</th>
                <th className="p-4 lg:p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-medium italic text-sm">Gider kaydı bulunmuyor.</td>
                </tr>
              ) : (
                expenses.map(expense => (
                  <tr key={expense.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 lg:p-5 text-xs lg:text-sm font-bold text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-300" />
                        {new Date(expense.date).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="p-4 lg:p-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-[10px] font-black uppercase">
                        {CATEGORIES.find(c => c.name === expense.category)?.icon}
                        {expense.category}
                      </span>
                    </td>
                    <td className="p-4 lg:p-5 text-xs lg:text-sm text-slate-600 font-medium truncate max-w-[150px]">{expense.description || '-'}</td>
                    <td className="p-4 lg:p-5 text-right font-black text-red-600 text-sm lg:text-base">{expense.amount.toLocaleString()} ₺</td>
                    <td className="p-4 lg:p-5 text-center">
                      <button onClick={() => onDelete(expense.id)} className="p-2 text-slate-200 hover:text-red-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpensesView;
