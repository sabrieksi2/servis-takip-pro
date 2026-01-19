
import React, { useState, useEffect, useMemo } from 'react';
import { School, Student, PaymentRecord, Expense, AppView, MONTHS, CURRENT_YEAR } from './types';
import { supabase, isSupabaseConfigured } from './supabase';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SchoolView from './components/SchoolView';
import ReportsView from './components/ReportsView';
import ExpensesView from './components/ExpensesView';
import ConfirmationModal from './components/ConfirmationModal';

const App: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string | null>(null);

  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    type: 'danger' | 'warning' | 'info';
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: () => {}
  });

  // Verileri Yükleme (Supabase varsa oradan, yoksa LocalStorage'dan)
  useEffect(() => {
    const fetchData = async () => {
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: sSchools } = await supabase.from('schools').select('*');
          const { data: sStudents } = await supabase.from('students').select('*');
          const { data: sPayments } = await supabase.from('payments').select('*');
          const { data: sExpenses } = await supabase.from('expenses').select('*');

          if (sSchools) setSchools(sSchools);
          if (sStudents) setStudents(sStudents);
          if (sPayments) setPayments(sPayments);
          if (sExpenses) setExpenses(sExpenses);
        } catch (error) {
          console.error("Supabase veri çekme hatası:", error);
        }
      } else {
        // Fallback: LocalStorage
        const savedSchools = localStorage.getItem('schools');
        const savedStudents = localStorage.getItem('students');
        const savedPayments = localStorage.getItem('payments');
        const savedExpenses = localStorage.getItem('expenses');

        if (savedSchools) setSchools(JSON.parse(savedSchools));
        if (savedStudents) setStudents(JSON.parse(savedStudents));
        if (savedPayments) setPayments(JSON.parse(savedPayments));
        if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  // LocalStorage senkronizasyonu (Supabase yoksa yedekleme için)
  useEffect(() => {
    if (!isSupabaseConfigured) {
      localStorage.setItem('schools', JSON.stringify(schools));
      localStorage.setItem('students', JSON.stringify(students));
      localStorage.setItem('payments', JSON.stringify(payments));
      localStorage.setItem('expenses', JSON.stringify(expenses));
    }
  }, [schools, students, payments, expenses]);

  const addSchool = async (name: string) => {
    const newSchoolObj = { id: Date.now().toString(), name, location: '' };
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('schools').insert([{ name, location: '' }]).select();
      if (data) setSchools(prev => [...prev, data[0]]);
    } else {
      setSchools(prev => [...prev, newSchoolObj]);
    }
  };

  const deleteSchool = (id: string) => {
    const school = schools.find(s => s.id === id);
    if (!school) return;

    setConfirmState({
      isOpen: true,
      title: 'Okulu Sil',
      message: `"${school.name}" isimli okulu silmek üzeresiniz. Bu işlem geri alınamaz!`,
      confirmText: 'Evet, Sil',
      type: 'danger',
      onConfirm: async () => {
        if (isSupabaseConfigured && supabase) {
          await supabase.from('schools').delete().eq('id', id);
        }
        setSchools(prev => prev.filter(s => s.id !== id));
        if (selectedSchoolId === id) setActiveView('dashboard');
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    if (isSupabaseConfigured && supabase) {
      const { data } = await supabase.from('students').insert([studentData]).select();
      if (data) setStudents(prev => [...prev, data[0]]);
    } else {
      setStudents(prev => [...prev, { ...studentData, id: Date.now().toString() }]);
    }
  };

  const updateStudent = async (updated: Student) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('students').update(updated).eq('id', updated.id);
    }
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const deleteStudent = (id: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Öğrenciyi Sil',
      confirmText: 'Sil',
      type: 'danger',
      message: `Öğrenci silinecek. Emin misiniz?`,
      onConfirm: async () => {
        if (isSupabaseConfigured && supabase) {
          await supabase.from('students').delete().eq('id', id);
        }
        setStudents(prev => prev.filter(s => s.id !== id));
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const addExpense = async (data: Omit<Expense, 'id'>) => {
    if (isSupabaseConfigured && supabase) {
      const { data: sData } = await supabase.from('expenses').insert([data]).select();
      if (sData) setExpenses(prev => [sData[0], ...prev]);
    } else {
      setExpenses(prev => [{ ...data, id: Date.now().toString() }, ...prev]);
    }
  };

  const deleteExpense = (id: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Gideri Sil',
      confirmText: 'Sil',
      type: 'danger',
      message: 'Bu harcama kaydını silmek istediğinize emin misiniz?',
      onConfirm: async () => {
        if (isSupabaseConfigured && supabase) {
          await supabase.from('expenses').delete().eq('id', id);
        }
        setExpenses(prev => prev.filter(e => e.id !== id));
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const togglePayment = async (studentId: string, monthKey: string) => {
    const existing = payments.find(p => p.studentId === studentId && p.month === monthKey);
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (existing) {
      if (isSupabaseConfigured && supabase) {
        await supabase.from('payments').delete().eq('studentId', studentId).eq('month', monthKey);
      }
      setPayments(prev => prev.filter(p => !(p.studentId === studentId && p.month === monthKey)));
    } else {
      const newPayment = { studentId, month: monthKey, status: 'paid', paidAmount: student.monthlyFee };
      if (isSupabaseConfigured && supabase) {
        await supabase.from('payments').insert([newPayment]);
      }
      setPayments(prev => [...prev, newPayment as PaymentRecord]);
    }
  };

  const selectedSchool = useMemo(() => schools.find(s => s.id === selectedSchoolId), [schools, selectedSchoolId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold text-slate-600">Veriler Hazırlanıyor...</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <Sidebar 
        schools={schools} 
        activeView={activeView} 
        selectedSchoolId={selectedSchoolId}
        onNavigate={(view, id) => { setActiveView(view); if (id) setSelectedSchoolId(id); }}
        onAddSchool={addSchool}
      />

      <main className="flex-1 p-4 lg:p-8 overflow-y-auto relative">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
               <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">
                {activeView === 'dashboard' ? 'Genel Bakış' : activeView === 'reports' ? 'Finansal Raporlar' : activeView === 'expenses' ? 'Gider Yönetimi' : selectedSchool?.name}
              </h1>
              {isSupabaseConfigured && (
                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded uppercase">Bulut Aktif</span>
              )}
            </div>
            <p className="text-slate-500 text-sm">Anka Turizm Profesyonel Servis Takip Sistemi</p>
          </div>
        </header>

        {activeView === 'dashboard' && (
          <Dashboard 
            schools={schools} 
            students={students} 
            payments={payments} 
            expenses={expenses}
            onSchoolClick={(id) => { setSelectedSchoolId(id); setActiveView('school-detail'); }} 
            onDeleteSchool={deleteSchool}
          />
        )}
        {activeView === 'reports' && <ReportsView schools={schools} students={students} payments={payments} expenses={expenses} />}
        {activeView === 'expenses' && <ExpensesView expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} />}
        {activeView === 'school-detail' && selectedSchool && (
          <SchoolView school={selectedSchool} students={students.filter(s => s.schoolId === selectedSchoolId)} payments={payments} onAddStudent={addStudent} onUpdateStudent={updateStudent} onDeleteStudent={deleteStudent} onTogglePayment={togglePayment} />
        )}
      </main>

      <ConfirmationModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} confirmText={confirmState.confirmText} type={confirmState.type} onConfirm={confirmState.onConfirm} onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
};

export default App;
