
import React, { useState } from 'react';
import { School, Student, PaymentRecord, Expense, MONTHS, CURRENT_YEAR } from '../types';
import { TrendingUp, AlertTriangle, Building2, UserX, Wallet, CheckCircle2, Info, X, Users, Wrench } from 'lucide-react';

interface ReportsViewProps {
  schools: School[];
  students: Student[];
  payments: PaymentRecord[];
  expenses: Expense[];
}

const ReportsView: React.FC<ReportsViewProps> = ({ schools, students, payments, expenses }) => {
  const [detailMonth, setDetailMonth] = useState<{key: string, name: string} | null>(null);

  const getOverdueMonths = (studentId: string) => {
    const overdue: string[] = [];
    const now = new Date();
    const currentYearNum = now.getFullYear();
    const currentMonthNum = now.getMonth() + 1;

    MONTHS.forEach(m => {
      const monthIdNum = parseInt(m.id);
      let year = currentYearNum;
      if (currentMonthNum < 7 && monthIdNum >= 9) year = currentYearNum - 1;
      else if (currentMonthNum >= 9 && monthIdNum < 7) year = currentYearNum + 1;

      const checkDate = new Date(year, monthIdNum - 1, 1);
      const todayDate = new Date(currentYearNum, currentMonthNum - 1, 1);

      if (checkDate <= todayDate) {
        const monthKey = `${year}-${m.id}`;
        if (!payments.some(p => p.studentId === studentId && p.month === monthKey)) {
          overdue.push(m.name);
        }
      }
    });
    return overdue;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* Finansal Özet - Excel Tarzı */}
      <section className="bg-white rounded-[32px] border border-slate-100 shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-4">
            <div className="bg-amber-500 p-3 rounded-2xl shadow-lg shadow-amber-900/20">
              <TrendingUp size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">Mali Durum Özeti (Ciro & Kar)</h2>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.2em]">Finansal Excel Tablosu</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Toplam Ciro</p>
              <p className="text-xl font-black text-green-400">{payments.reduce((sum, p) => sum + p.paidAmount, 0).toLocaleString()} ₺</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-slate-400 uppercase font-bold">Net Kâr</p>
              <p className="text-xl font-black text-amber-400">
                {(payments.reduce((sum, p) => sum + p.paidAmount, 0) - expenses.reduce((sum, e) => sum + e.amount, 0)).toLocaleString()} ₺
              </p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/50">
                <th className="p-5 text-xs font-black text-slate-500 uppercase border-r border-slate-200 w-32">Dönem / Ay</th>
                <th className="p-5 text-xs font-black text-slate-700 uppercase bg-green-50/50 text-center">Toplam Ciro</th>
                <th className="p-5 text-xs font-black text-slate-700 uppercase bg-red-50/50 text-center">Toplam Gider</th>
                <th className="p-5 text-xs font-black text-slate-900 uppercase bg-amber-50/50 text-center">Net Kar</th>
                <th className="p-5 text-xs font-black text-slate-500 uppercase text-center">Detay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MONTHS.map(m => {
                const monthIdNum = parseInt(m.id);
                let year = parseInt(CURRENT_YEAR);
                const nowMonth = new Date().getMonth() + 1;
                if (nowMonth < 7 && monthIdNum >= 9) year -= 1;
                const monthKey = `${year}-${m.id}`;

                const monthlyIncome = payments.filter(p => p.month === monthKey).reduce((sum, p) => sum + p.paidAmount, 0);
                const monthlyExpense = expenses.filter(e => e.date.startsWith(monthKey)).reduce((sum, e) => sum + e.amount, 0);
                const netProfit = monthlyIncome - monthlyExpense;

                return (
                  <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-5 font-bold text-slate-700 text-sm border-r border-slate-100">{m.name} {year}</td>
                    <td className="p-5 text-center text-sm font-black text-green-600 bg-green-50/20">{monthlyIncome.toLocaleString()} ₺</td>
                    <td className="p-5 text-center text-sm font-black text-red-600 bg-red-50/20">{monthlyExpense.toLocaleString()} ₺</td>
                    <td className={`p-5 text-center text-lg font-black bg-amber-50/20 ${netProfit >= 0 ? 'text-slate-900' : 'text-red-600'}`}>
                      {netProfit.toLocaleString()} ₺
                    </td>
                    <td className="p-5 text-center">
                      <button 
                        onClick={() => setDetailMonth({key: monthKey, name: `${m.name} ${year}`})}
                        className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all mx-auto flex items-center gap-1 text-[10px] font-black uppercase"
                      >
                        <Info size={14} />
                        Detay
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Okul Bazlı Detay */}
      <section className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center gap-3">
          <Building2 className="text-blue-600" size={24} />
          <h2 className="text-lg font-bold text-slate-800 uppercase">Okul Bazlı Aylık Gelirler</h2>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Okul Adı</th>
                {MONTHS.map(m => <th key={m.id} className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">{m.name}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {schools.map(school => (
                <tr key={school.id} className="hover:bg-slate-50/30">
                  <td className="p-4 font-bold text-slate-700 text-sm">{school.name}</td>
                  {MONTHS.map(m => {
                    const monthIdNum = parseInt(m.id);
                    let year = parseInt(CURRENT_YEAR);
                    const nowMonth = new Date().getMonth() + 1;
                    if (nowMonth < 7 && monthIdNum >= 9) year -= 1;
                    const monthKey = `${year}-${m.id}`;
                    
                    const total = payments
                      .filter(p => p.month === monthKey && students.find(s => s.id === p.studentId)?.schoolId === school.id)
                      .reduce((sum, p) => sum + p.paidAmount, 0);
                    
                    return (
                      <td key={m.id} className={`p-4 text-center text-sm font-bold ${total > 0 ? 'text-slate-800' : 'text-slate-200 font-normal'}`}>
                        {total > 0 ? `${total.toLocaleString()} ₺` : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Geciken Ödemeler Tablosu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden border-t-8 border-t-red-600">
          <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserX className="text-red-600" size={24} />
              <h2 className="text-xl font-black text-slate-800 uppercase">Geciken Tahsilatlar</h2>
            </div>
            <span className="px-4 py-1 bg-red-600 text-white text-[10px] font-black rounded-full uppercase tracking-widest animate-pulse">
              Takip Gerekli
            </span>
          </div>
          <div className="overflow-y-auto max-h-[500px] custom-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Öğrenci</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-center">Süre</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase">Aylar</th>
                  <th className="p-4 text-[10px] font-black text-slate-400 uppercase text-right">Borç</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {students.map(student => {
                  const overdue = getOverdueMonths(student.id);
                  if (overdue.length === 0) return null;
                  return (
                    <tr key={student.id} className="hover:bg-red-50/30 transition-colors">
                      <td className="p-4">
                        <div className="text-sm font-bold text-slate-800">{student.name}</div>
                        <div className="text-[10px] text-slate-500 uppercase">{student.parentName}</div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-[11px] font-black">
                          {overdue.length} Ay
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {overdue.map(m => (
                            <span key={m} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] rounded font-bold">{m}</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-right text-sm font-black text-red-600">
                        {(overdue.length * student.monthlyFee).toLocaleString()} ₺
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Özet Kartları */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-3xl -mr-16 -mt-16"></div>
            <Wallet className="text-amber-500 mb-6" size={32} />
            <h3 className="text-xl font-black mb-6 uppercase tracking-tight">Kasa Durumu</h3>
            <div className="space-y-5 relative z-10">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Kayıtlı Öğrenci:</span>
                <span className="font-black text-white">{students.length}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Ödeme Bekleyen:</span>
                <span className="font-black text-red-400">{students.filter(s => getOverdueMonths(s.id).length > 0).length}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Kalan Alacak:</span>
                <span className="font-black text-amber-500 text-2xl tracking-tighter">
                  {students.reduce((sum, s) => sum + (getOverdueMonths(s.id).length * s.monthlyFee), 0).toLocaleString()} ₺
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aylık Detay Modalı */}
      {detailMonth && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
            <div className="p-8 bg-blue-600 text-white flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black uppercase tracking-tight">{detailMonth.name} Raporu</h3>
                <p className="text-blue-100 text-xs font-bold uppercase tracking-widest">Gelir ve Gider Kalemleri</p>
              </div>
              <button onClick={() => setDetailMonth(null)} className="p-3 bg-white/20 rounded-2xl hover:bg-white/40 transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* Gelir Detayları */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-green-600">
                  <Users size={20} />
                  <h4 className="font-black uppercase text-sm tracking-widest">Gelen Tahsilatlar</h4>
                </div>
                <div className="space-y-2">
                  {payments.filter(p => p.month === detailMonth.key).length === 0 ? (
                    <p className="text-slate-400 italic text-sm">Bu ay henüz ödeme kaydı yok.</p>
                  ) : (
                    payments.filter(p => p.month === detailMonth.key).map((p, idx) => {
                      const student = students.find(s => s.id === p.studentId);
                      return (
                        <div key={idx} className="flex justify-between items-center p-4 bg-green-50 rounded-2xl border border-green-100">
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{student?.name || 'Bilinmeyen Öğrenci'}</p>
                            <p className="text-[10px] text-green-700 font-black uppercase tracking-widest">Ödeme Alındı</p>
                          </div>
                          <span className="font-black text-green-600">{p.paidAmount.toLocaleString()} ₺</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Gider Detayları */}
              <div>
                <div className="flex items-center gap-2 mb-4 text-red-600">
                  <Wrench size={20} />
                  <h4 className="font-black uppercase text-sm tracking-widest">Yapılan Harcamalar</h4>
                </div>
                <div className="space-y-2">
                  {expenses.filter(e => e.date.startsWith(detailMonth.key)).length === 0 ? (
                    <p className="text-slate-400 italic text-sm">Bu ay herhangi bir gider girilmemiş.</p>
                  ) : (
                    expenses.filter(e => e.date.startsWith(detailMonth.key)).map((e, idx) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-100">
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{e.category}</p>
                          <p className="text-[10px] text-red-400 font-bold">{e.description || 'Açıklama yok'}</p>
                        </div>
                        <span className="font-black text-red-600">-{e.amount.toLocaleString()} ₺</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Aylık Net Durum</p>
                <p className={`text-2xl font-black ${
                  (payments.filter(p => p.month === detailMonth.key).reduce((sum, p) => sum + p.paidAmount, 0) - 
                   expenses.filter(e => e.date.startsWith(detailMonth.key)).reduce((sum, e) => sum + e.amount, 0)) >= 0 
                  ? 'text-slate-900' : 'text-red-600'
                }`}>
                  {(payments.filter(p => p.month === detailMonth.key).reduce((sum, p) => sum + p.paidAmount, 0) - 
                    expenses.filter(e => e.date.startsWith(detailMonth.key)).reduce((sum, e) => sum + e.amount, 0)).toLocaleString()} ₺
                </p>
              </div>
              <button 
                onClick={() => setDetailMonth(null)}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase text-sm hover:bg-black transition-all"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsView;
