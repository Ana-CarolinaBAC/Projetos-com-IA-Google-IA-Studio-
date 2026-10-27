import React from 'react';
import { Sparkles, CheckCircle2, Info } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const Toast: React.FC = () => {
  const { toast } = useStudy();

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl shadow-lg border text-xs font-semibold backdrop-blur-md ${
          toast.type === 'xp'
            ? 'bg-violet-900/95 text-white border-violet-700/80 shadow-violet-900/20'
            : toast.type === 'success'
            ? 'bg-emerald-900/95 text-white border-emerald-700/80 shadow-emerald-900/20'
            : 'bg-stone-900/95 text-white border-stone-700/80'
        }`}
      >
        {toast.type === 'xp' && <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />}
        {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
        {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
};
