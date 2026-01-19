
import React, { useState, useEffect } from 'react';
import { Student } from '../types';
import { X, User, Phone, Wallet, Users as ParentIcon } from 'lucide-react';

interface StudentModalProps {
  schoolId: string;
  student?: Student | null;
  onClose: () => void;
  onSave: (data: Omit<Student, 'id' | 'schoolId'>) => void;
}

const StudentModal: React.FC<StudentModalProps> = ({ student, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    parentName: '',
    phone: '',
    monthlyFee: 0
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name,
        parentName: student.parentName,
        phone: student.phone,
        monthlyFee: student.monthlyFee
      });
    }
  }, [student]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-blue-600 text-white">
          <h2 className="text-xl font-bold">{student ? 'Öğrenciyi Düzenle' : 'Yeni Öğrenci Kaydı'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-xl transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <User size={14} className="text-blue-500" /> Öğrenci Adı Soyadı
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Örn: Ali Yılmaz"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <ParentIcon size={14} className="text-blue-500" /> Veli Adı Soyadı
            </label>
            <input
              required
              type="text"
              value={formData.parentName}
              onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Örn: Mehmet Yılmaz"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Phone size={14} className="text-blue-500" /> İletişim Numarası
            </label>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Örn: 05xx xxx xx xx"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Wallet size={14} className="text-blue-500" /> Aylık Servis Ücreti (₺)
            </label>
            <input
              required
              type="number"
              value={formData.monthlyFee || ''}
              onChange={(e) => setFormData({ ...formData, monthlyFee: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
              placeholder="Örn: 1500"
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
            >
              {student ? 'Güncelle' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentModal;
