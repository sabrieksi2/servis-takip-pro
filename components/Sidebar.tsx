
import React, { useState } from 'react';
import { School, AppView } from '../types';
import { LayoutGrid, School as SchoolIcon, Plus, ChevronRight, Bird, BarChart3, Wallet, X } from 'lucide-react';

interface SidebarProps {
  schools: School[];
  activeView: AppView;
  selectedSchoolId: string | null;
  isSidebarOpen: boolean;
  onNavigate: (view: AppView, id?: string) => void;
  onAddSchool: (name: string) => void;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ schools, activeView, selectedSchoolId, isSidebarOpen, onNavigate, onAddSchool, onClose }) => {
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
    <>
      {/* Mobile Overlay Background */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] lg:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col shadow-2xl lg:shadow-xl lg:shadow-slate-100/50 z-[110] transition-transform duration-300
        lg:translate-x-0 lg:static lg:z-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <SchoolIcon size={18} />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-800">ServisTakip</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Profesyonel Panel</p>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-slate-400 hover:bg-slate-100 rounded-xl"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'dashboard' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <LayoutGrid size={20} />
            <span className="text-sm">Genel Bakış</span>
          </button>

          <button
            onClick={() => onNavigate('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'reports' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BarChart3 size={20} />
            <span className="text-sm">Raporlar</span>
          </button>

          <button
            onClick={() => onNavigate('expenses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeView === 'expenses' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Wallet size={20} />
            <span className="text-sm">Gider Yönetimi</span>
          </button>

          <div className="pt-4 pb-2">
            <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Okullar</p>
            <div className="space-y-1">
              {schools.map((school) => (
                <button
                  key={school.id}
                  onClick={() => onNavigate('school-detail', school.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${
                    activeView === 'school-detail' && selectedSchoolId === school.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                      : 'text-slate-600 hover:bg-slate-50 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <SchoolIcon size={16} className={activeView === 'school-detail' && selectedSchoolId === school.id ? 'text-blue-100' : 'text-slate-400'} />
                    <span className="truncate text-xs">{school.name}</span>
                  </div>
                  <ChevronRight size={12} className="opacity-50 shrink-0" />
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
                className="w-full px-3 py-2.5 text-xs border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
              />
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white text-[10px] py-2 rounded-lg font-black uppercase">Ekle</button>
                <button type="button" onClick={() => setIsAdding(false)} className="flex-1 bg-slate-100 text-slate-600 text-[10px] py-2 rounded-lg font-black uppercase">İptal</button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:bg-slate-50 transition-all border border-dashed border-slate-200 mt-4"
            >
              <Plus size={18} />
              <span className="text-xs font-bold">Okul Ekle</span>
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="p-4 bg-gradient-to-br from-slate-900 to-black rounded-[20px] border border-amber-500/30 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none group-hover:translate-x-full transition-transform duration-1000"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-9 h-9 bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 rounded-xl flex items-center justify-center text-slate-900 shadow-lg shadow-amber-900/20">
                <Bird size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200">ANKA TURİZM</span>
                <span className="text-[8px] text-amber-100/60 font-medium uppercase tracking-[0.2em]">VIP Servis</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
