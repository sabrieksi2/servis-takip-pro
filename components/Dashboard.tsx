
import React, { useState } from 'react';
import { School, Student, PaymentRecord, Expense } from '../types';
import { Users, CreditCard, TrendingUp, AlertCircle, School as SchoolIcon, Eye, EyeOff, Trash2, ArrowRight } from 'lucide-react';

interface DashboardProps {
  schools: School[];
  students: Student[];
  payments: PaymentRecord[];
  expenses: Expense[];
  onSchoolClick: (id: string) => void;
  onDeleteSchool: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ schools, students, payments, expenses, onSchoolClick, onDeleteSchool }) => {
  const [showRevenue, setShowRevenue] = useState(false);
  
  const totalRevenue = payments.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netBalance = totalRevenue - totalExpenses;

  const currentMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
  const pendingPaymentsCount = students.length - payments.filter(p => p.month === currentMonth).length;

  return (
    <div className="space-y-6 lg:space-y-10 animate-in fade-in duration-500 pb-10">
      {/* Stats Grid - Mobile: 1 col, Tablet: 2 col, Desktop: 4 col */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard 
          icon={<Users className="text-blue-600" size={22} />} 
          label="Toplam Öğrenci" 
          value={students.length.toString()} 
          color="blue"
        />
        <div className="relative group">
          <StatCard 
            icon={<CreditCard className="text-green-600" size={22} />} 
            label="Yıllık Net Durum" 
            value={showRevenue ? `${netBalance.toLocaleString()} ₺` : "•••••• ₺"} 
            color="green"
            subLabel={showRevenue ? "Ciro - Gider" : "Görmek için tıklayın"}
          />
          <button 
            onClick={() => setShowRevenue(!showRevenue)}
            className="absolute top-4 right-4 p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            {showRevenue ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <StatCard 
          icon={<TrendingUp className="text-purple-600" size={22} />} 
          label="Aktif Okul" 
          value={schools.length.toString()} 
          color="purple"
        />
        <StatCard 
          icon={<AlertCircle className="text-orange-600" size={22} />} 
          label="Bekleyen Ödemeler" 
          value={pendingPaymentsCount.toString()} 
          color="orange"
          subLabel="Bu ay için"
        />
      </div>

      {/* Schools List */}
      <section>
        <div className="flex items-center justify-between mb-4 lg:mb-6">
          <h2 className="text-lg lg:text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
            <SchoolIcon size={20} className="text-blue-600" />
            Okul Listesi
          </h2>
        </div>
        
        {schools.length === 0 ? (
          <div className="p-12 border-2 border-dashed border-slate-200 rounded-[32px] text-center">
            <SchoolIcon size={40} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Henüz okul eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {schools.map(school => {
              const schoolStudents = students.filter(s => s.schoolId === school.id);
              return (
                <div 
                  key={school.id}
                  className="group relative bg-white p-5 lg:p-7 rounded-[28px] lg:rounded-[36px] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
                  onClick={() => onSchoolClick(school.id)}
                >
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSchool(school.id);
                    }}
                    className="absolute top-4 right-4 p-2.5 text-slate-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="w-10 h-10 lg:w-14 lg:h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 lg:mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <SchoolIcon size={24} />
                  </div>
                  <h3 className="font-black text-base lg:text-xl mb-1 group-hover:text-blue-600 transition-colors uppercase truncate pr-8">{school.name}</h3>
                  <p className="text-slate-400 text-[10px] lg:text-xs font-bold uppercase tracking-widest mb-4 lg:mb-6">{school.location || 'Konum Bilgisi Yok'}</p>
                  
                  <div className="flex items-center justify-between pt-4 lg:pt-6 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[9px] lg:text-[10px] font-black text-slate-400 uppercase tracking-widest">Öğrenci Sayısı</span>
                      <span className="text-sm lg:text-lg font-black text-slate-800">{schoolStudents.length} Kayıt</span>
                    </div>
                    <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string, subLabel?: string }> = ({ icon, label, value, color, subLabel }) => (
  <div className="bg-white p-5 lg:p-7 rounded-[28px] lg:rounded-[36px] border border-slate-100 shadow-sm h-full flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2.5 lg:p-3 bg-white border border-slate-100 rounded-xl lg:rounded-2xl shadow-sm`}>
        {icon}
      </div>
    </div>
    <div>
      <p className="text-slate-500 text-[10px] lg:text-xs font-black uppercase tracking-widest mb-1">{label}</p>
      <div className="flex flex-col">
        <h4 className="text-xl lg:text-2xl font-black text-slate-800 tracking-tight">{value}</h4>
        {subLabel && <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">{subLabel}</span>}
      </div>
    </div>
  </div>
);

export default Dashboard;
