
export interface School {
  id: string;
  name: string;
  location?: string;
}

export interface Student {
  id: string;
  schoolId: string;
  name: string;
  parentName: string;
  phone: string;
  monthlyFee: number;
}

export interface PaymentRecord {
  studentId: string;
  month: string; // Format: "YYYY-MM"
  status: 'paid' | 'unpaid';
  paidAmount: number;
}

export interface Expense {
  id: string;
  category: 'Yakıt' | 'Bakım-Onarım' | 'Kasko' | 'Sigorta' | 'Motorlu Taşıt Vergisi' | 'Muayene' | 'Diğer';
  description: string;
  amount: number;
  date: string; // Format: "YYYY-MM-DD"
}

export type AppView = 'dashboard' | 'school-detail' | 'reports' | 'expenses';

export const MONTHS = [
  { id: '09', name: 'Eylül' },
  { id: '10', name: 'Ekim' },
  { id: '11', name: 'Kasım' },
  { id: '12', name: 'Aralık' },
  { id: '01', name: 'Ocak' },
  { id: '02', name: 'Şubat' },
  { id: '03', name: 'Mart' },
  { id: '04', name: 'Nisan' },
  { id: '05', name: 'Mayıs' },
  { id: '06', name: 'Haziran' },
];

export const CURRENT_YEAR = new Date().getFullYear().toString();
