
import React, { useState, useEffect, useMemo } from 'react';
import { School, Student, PaymentRecord, Expense, AppView, MONTHS, CURRENT_YEAR } from './types';
import { supabase, isSupabaseConfigured } from './supabase';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import SchoolView from './components/SchoolView';
import ReportsView from './components/ReportsView';
import ExpensesView from './components/ExpensesView';
import ConfirmationModal from './components/ConfirmationModal';
import { AlertCircle, CloudOff, CloudCheck, RefreshCw, UploadCloud, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const fetchData = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setDbError(null);
    
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: sSchools, error: e1 } = await supabase.from('schools').select('*').order('name');
        const { data: sStudents, error: e2 } = await supabase.from('students').select('*');
        const { data: sPayments, error: e3 } = await supabase.from('payments').select('*');
        const { data: sExpenses, error: e4 } = await supabase.from('expenses').select('*').order('date', { ascending: false });

        if (e1 || e2 || e3 || e4) {
          const msg = e1?.message || e2?.message || e3?.message || e4?.message;
          setDbError(`Veritabanı Hatası: ${msg}`);
          throw new Error(msg);
        }

        setSchools(sSchools || []);
        setStudents(sStudents || []);
        setPayments(sPayments || []);
        setExpenses(sExpenses || []);
      } catch (error) {
        console.error("Fetch Error:", error);
      }
    } else {
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
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const migrateToCloud = async () => {
    if (!supabase) return;
    setRefreshing(true);
    try {
      if (schools.length > 0) await supabase.from('schools').upsert(schools);
      if (students.length > 0) await supabase.from('students').upsert(students);
      if (payments.length > 0) await supabase.from('payments').upsert(payments);
      if (expenses.length > 0) await supabase.from('expenses').upsert(expenses);
      alert("Tebrikler! Yerel verileriniz başarıyla buluta taşındı.");
      localStorage.removeItem('schools'); // Taşındıktan sonra temizle
      fetchData();
    } catch (err: any) {
      alert("Taşıma hatası: " + err.message);
    }
    setRefreshing(false);
  };

  const addSchool = async (name: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('schools').insert([{ name, location: '' }]).select();
      if (error) { alert("Hata: " + error.message); return; }
      if (data) setSchools(prev => [...prev, data[0]]);
    } else {
      setSchools(prev => [...prev, { id: Date.now().toString(), name, location: '' }]);
    }
  };

  const deleteSchool = (id: string) => {
    setConfirmState({
      isOpen: true,
      title: 'Okulu Sil',
      message: `Bu okulu silmek istediğinize emin misiniz?`,
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
      const { data, error } = await supabase.from('students').insert([studentData]).select();
      if (error) { alert("Hata: " + error.message); return; }
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
      message: 'Bu kaydı silmek istediğinize emin misiniz?',
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
      <div className="text-center p-6">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="font-bold text-slate-600">ANKA TURİZM Yükleniyor...</p>
      </div>
    </div>
  );

  const handleNavigate = (view: AppView, id?: string) => {
    setActiveView(view);
    if (id) setSelectedSchoolId(id);
    setIsSidebarOpen(false); // Mobil menüyü kapat
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Sidebar - Desktop'ta sabit, Mobilde overlay */}
      <Sidebar 
        schools={schools} 
        activeView={activeView} 
        selectedSchoolId={selectedSchoolId}
        isSidebarOpen={isSidebarOpen}
        onNavigate={handleNavigate}
        onAddSchool={addSchool}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header - Mobil Uyumlu */}
        <header className="bg-white border-b border-slate-200 px-4 py-3 lg:px-8 lg:py-6 flex flex-col gap-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Mobil Menü Butonu */}
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                <Menu size={24} />
              </button>

              <div>
                <div className="flex items-center gap-2">
                   <h1 className="text-lg lg:text-2xl font-bold text-slate-800 uppercase tracking-tight truncate max-w-[150px] lg:max-w-none">
                    {activeView === 'dashboard' ? 'Genel Bakış' : activeView === 'reports' ? 'Raporlar' : activeView === 'expenses' ? 'Giderler' : selectedSchool?.name}
                  </h1>
                  {isSupabaseConfigured && !dbError ? (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 text-[9px] lg:text-[10px] font-black rounded-full uppercase border border-green-200 whitespace-nowrap">
                       <CloudCheck size={10} className="hidden sm:block" /> Bulut
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] lg:text-[10px] font-black rounded-full uppercase border border-amber-200 whitespace-nowrap">
                       <CloudOff size={10} className="hidden sm:block" /> Yerel
                    </div>
                  )}
                </div>
                <p className="hidden lg:block text-slate-500 text-sm">Anka Turizm Servis Takip Sistemi</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isSupabaseConfigured && !dbError && localStorage.getItem('schools') && (
                <button 
                  onClick={migrateToCloud}
                  className="p-2 lg:p-3 bg-blue-50 text-blue-600 border border-blue-200 rounded-xl lg:rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                >
                  <UploadCloud size={18} />
                </button>
              )}
              {isSupabaseConfigured && (
                <button 
                  onClick={() => fetchData(true)} 
                  disabled={refreshing}
                  className="p-2 lg:p-3 bg-white border border-slate-200 rounded-xl lg:rounded-2xl text-slate-600 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center gap-2 text-sm font-bold shadow-sm"
                >
                  <RefreshCw size={18} className={refreshing ? 'animate-spin' : ''} />
                  <span className="hidden lg:inline">{refreshing ? 'Güncelleniyor...' : 'Senkronize Et'}</span>
                </button>
              )}
            </div>
          </div>
          
          {dbError && (
            <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-xl flex items-center gap-2 text-xs lg:text-sm font-bold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{dbError}</span>
            </div>
          )}
        </header>

        {/* View İçeriği - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
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
        </div>
      </main>

      <ConfirmationModal isOpen={confirmState.isOpen} title={confirmState.title} message={confirmState.message} confirmText={confirmState.confirmText} type={confirmState.type} onConfirm={confirmState.onConfirm} onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))} />
    </div>
  );
};

export default App;
