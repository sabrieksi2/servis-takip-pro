
import React, { useState } from 'react';
import { School, AppView } from '../types';
import { LayoutGrid, School as SchoolIcon, Plus, ChevronRight, Bird, BarChart3, Wallet } from 'lucide-react';

interface SidebarProps {
  schools: School[];
  activeView: AppView;
  selectedSchoolId: string | null;
  onNavigate: (view: AppView, id?: string) => void;
  onAddSchool: (name: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ schools, activeView, selectedSchoolId, onNavigate, onAddSchool }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState('');

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSchoolName.trim()) {
      onAddSchool(newSchoolName.trim());
      setNewSchoolName('');
      setIsAdding(false);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex shadow-xl shadow-slate-100/50">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <SchoolIcon size={22} />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">ServisTakip</span>
        </div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Yönetim Paneli</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeView === 'dashboard' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <LayoutGrid size={20} />
          <span>Genel Bakış</span>
        </button>

        <button
          onClick={() => onNavigate('reports')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeView === 'reports' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BarChart3 size={20} />
          <span>Raporlar</span>
        </button>

        <button
          onClick={() => onNavigate('expenses')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
            activeView === 'expenses' ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Wallet size={20} />
          <span>Giderler</span>
        </button>

        <div className="pt-4 pb-2">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Okullarım</p>
          <div className="space-y-1">
            {schools.map((school) => (
              <button
                key={school.id}
                onClick={() => onNavigate('school-detail', school.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                  activeView === 'school-detail' && selectedSchoolId === school.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <SchoolIcon size={18} className={activeView === 'school-detail' && selectedSchoolId === school.id ? 'text-blue-100' : 'text-slate-400'} />
                  <span className="truncate text-sm">{school.name}</span>
                </div>
                <ChevronRight size={14} className="opacity-50" />
              </button>
            ))}
          </div>
        </div>

        {isAdding ? (
          <form onSubmit={handleAddSubmit} className="mt-2 px-2">
            <input
              autoFocus
              type="text"
              value={newSchoolName}
              onChange={(e) => setNewSchoolName(e.target.value)}
              placeholder="Okul adı..."
              className="w-full px-3 py-2 text-sm border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-blue-600 text-white text-xs py-2 rounded-lg font-medium">Ekle</button>
              <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-100 text-slate-600 text-xs py-2 rounded-lg">İptal</button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all border border-dashed border-slate-200 mt-4"
          >
            <Plus size={20} />
            <span className="text-sm">Okul Ekle</span>
          </button>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="p-4 bg-gradient-to-br from-slate-900 to-black rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none group-hover:translate-x-full transition-transform duration-1000"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-amber-900/20">
              <Bird size={24} strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">ANKA TURİZM</span>
              <span className="text-[10px] text-amber-100/60 font-medium uppercase tracking-[0.2em]">VIP Service</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
