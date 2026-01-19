
import React, { useState } from 'react';
import { School, Student, PaymentRecord, Expense } from '../types';
import { Users, CreditCard, TrendingUp, AlertCircle, School as SchoolIcon, Eye, EyeOff, Trash2 } from 'lucide-react';

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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Users className="text-blue-600" size={24} />} 
          label="Toplam Öğrenci" 
          value={students.length.toString()} 
          color="blue"
        />
        <div className="relative group">
          <StatCard 
            icon={<CreditCard className="text-green-600" size={24} />} 
            label="Yıllık Net Durum" 
            value={showRevenue ? `${netBalance.toLocaleString()} ₺` : "•••••• ₺"} 
            color="green"
            subLabel={showRevenue ? "Ciro - Gider" : "Görmek için tıklayın"}
          />
          <button 
            onClick={() => setShowRevenue(!showRevenue)}
            className="absolute top-6 right-6 p-2 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            {showRevenue ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <StatCard 
          icon={<TrendingUp className="text-purple-600" size={24} />} 
          label="Aktif Okul" 
          value={schools.length.toString()} 
          color="purple"
        />
        <StatCard 
          icon={<AlertCircle className="text-orange-600" size={24} />} 
          label="Bekleyen Ödemeler" 
          value={pendingPaymentsCount.toString()} 
          color="orange"
          subLabel="Bu ay için"
        />
      </div>

      {/* Schools List */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800">Okul Listesi</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {schools.map(school => {
            const schoolStudents = students.filter(s => s.schoolId === school.id);
            return (
              <div 
                key={school.id}
                className="group relative bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                onClick={() => onSchoolClick(school.id)}
              >
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSchool(school.id);
                  }}
                  className="absolute top-4 right-4 p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>

                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <SchoolIcon size={24} />
                </div>
                <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">{school.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{school.location || 'Konum belirtilmedi'}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Öğrenci Sayısı</span>
                  <span className="px-3 py-1 bg-slate-100 rounded-full text-sm font-bold text-slate-700">{schoolStudents.length}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string, subLabel?: string }> = ({ icon, label, value, color, subLabel }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-full">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 bg-white border border-slate-100 rounded-2xl shadow-sm`}>
        {icon}
      </div>
    </div>
    <p className="text-slate-500 text-sm font-medium">{label}</p>
    <div className="flex flex-col">
      <h4 className="text-2xl font-bold text-slate-800 tracking-tight">{value}</h4>
      {subLabel && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">{subLabel}</span>}
    </div>
  </div>
);

export default Dashboard;
