
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
  isOpen, title, message, onConfirm, onCancel, confirmText = "Onayla", type = 'info' 
}) => {
  if (!isOpen) return null;

  const colors = {
    danger: 'bg-red-600 hover:bg-red-700 shadow-red-100',
    warning: 'bg-amber-500 hover:bg-amber-600 shadow-amber-100',
    info: 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
  };

  const iconColors = {
    danger: 'text-red-600 bg-red-50',
    warning: 'text-amber-600 bg-amber-50',
    info: 'text-blue-600 bg-blue-50'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        <div className="p-6 text-center">
          <div className={`w-16 h-16 ${iconColors[type]} rounded-3xl flex items-center justify-center mx-auto mb-4`}>
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">{message}</p>
          
          <div className="flex flex-col gap-3">
            <button
              onClick={onConfirm}
              className={`w-full py-3.5 rounded-2xl text-white font-bold transition-all shadow-lg ${colors[type]}`}
            >
              {confirmText}
            </button>
            <button
              onClick={onCancel}
              className="w-full py-3.5 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 transition-colors"
            >
              Vazgeç
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
