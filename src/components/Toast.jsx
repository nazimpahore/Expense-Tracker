import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          icon: CheckCircle2,
          border: 'border-emerald-500/40',
          bg: 'bg-slate-900/95 text-emerald-400',
          iconColor: 'text-emerald-400'
        };
      case 'error':
        return {
          icon: AlertCircle,
          border: 'border-rose-500/40',
          bg: 'bg-slate-900/95 text-rose-400',
          iconColor: 'text-rose-400'
        };
      default:
        return {
          icon: Info,
          border: 'border-teal-500/40',
          bg: 'bg-slate-900/95 text-teal-300',
          iconColor: 'text-teal-400'
        };
    }
  };

  const style = getStyle();
  const Icon = style.icon;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50 animate-fade-in">
      <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-2xl border ${style.border} ${style.bg} backdrop-blur-md`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <Icon className={`w-4 h-4 ${style.iconColor} flex-shrink-0`} />
          <span className="text-xs font-semibold text-slate-100 truncate">{toast.message}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
