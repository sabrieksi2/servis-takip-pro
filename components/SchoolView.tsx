
import React, { useState } from 'react';
import { School, Student, PaymentRecord, MONTHS, CURRENT_YEAR } from '../types';
import { Plus, UserPlus, Check, X, Edit2, Trash2, Calendar, Phone, DollarSign, Users } from 'lucide-react';
import StudentModal from './StudentModal';

interface SchoolViewProps {
  school: School;
  students: Student[];
  payments: PaymentRecord[];
  onAddStudent: (data: Omit<Student, 'id'>) => void;
  onUpdateStudent: (data: Student) => void;
  onDeleteStudent: (id: string) => void;
  onTogglePayment: (studentId: string, month: string) => void;
}

const SchoolView: React.FC<SchoolViewProps> = ({ 
  school, students, payments, onAddStudent, onUpdateStudent, onDeleteStudent, onTogglePayment 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const getMonthKey = (monthId: string) => {
    const currentYearNum = parseInt(CURRENT_YEAR);
    const currentMonth = new Date().getMonth() + 1;
    const mId = parseInt(monthId);
    
    // Okul yılı mantığı: Eylül(09)-Aralık(12) arası eğer şu an Ocak-Haziran arasındaysak geçen seneye aittir.
    let year = currentYearNum;
    if (currentMonth < 7 && mId >= 9) {
      year = currentYearNum - 1;
    } else if (currentMonth >= 9 && mId < 7) {
      year = currentYearNum + 1;
    }
    
    return `${year}-${monthId}`;
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100">
            <UserPlus size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800">Öğrenci Yönetimi</h3>
            <p className="text-xs text-slate-500">{students.length} Kayıtlı Öğrenci</p>
          </div>
        </div>
        <button 
          onClick={() => { setEditingStudent(null); setIsModalOpen(true); }}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
        >
          <Plus size={20} />
          <span>Yeni Öğrenci</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="sticky left-0 z-10 bg-slate-50 p-4 text-xs font-bold text-slate-500 uppercase min-w-[200px]">Öğrenci</th>
                <th className="p-4 text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Ücret</th>
                {MONTHS.map(m => (
                  <th key={m.id} className="p-4 text-xs font-bold text-slate-500 uppercase text-center min-w-[80px]">{m.name}</th>
                ))}
                <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={MONTHS.length + 3} className="p-12 text-center opacity-40 italic">Henüz öğrenci eklenmemiş.</td>
                </tr>
              ) : (
                students.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="sticky left-0 z-10 bg-white/95 p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-sm">{student.name}</span>
                        <span className="text-[10px] text-slate-400">{student.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-blue-700 text-sm">{student.monthlyFee} ₺</td>
                    {MONTHS.map(m => {
                      const mKey = getMonthKey(m.id);
                      const isPaid = payments.some(p => p.studentId === student.id && p.month === mKey);
                      return (
                        <td key={m.id} className="p-4 text-center">
                          <button 
                            type="button"
                            onClick={(e) => { e.stopPropagation(); onTogglePayment(student.id, mKey); }}
                            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all shadow-sm mx-auto ${
                              isPaid ? 'bg-green-500 text-white hover:scale-110' : 'bg-slate-100 text-slate-300 hover:bg-slate-200'
                            }`}
                          >
                            {isPaid ? <Check size={16} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-current"></div>}
                          </button>
                        </td>
                      );
                    })}
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setEditingStudent(student); setIsModalOpen(true); }} className="p-2 text-slate-400 hover:text-blue-600 rounded-lg transition-colors"><Edit2 size={16} /></button>
                        <button onClick={() => onDeleteStudent(student.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <StudentModal 
          schoolId={school.id}
          student={editingStudent}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            if (editingStudent) onUpdateStudent({ ...editingStudent, ...data });
            else onAddStudent({ ...data, schoolId: school.id });
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default SchoolView;
