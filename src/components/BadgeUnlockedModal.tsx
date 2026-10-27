import React from 'react';
import { Sparkles, Trophy, X, ArrowRight } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const BadgeUnlockedModal: React.FC = () => {
  const { newlyUnlockedBadge, clearNewlyUnlockedBadge } = useStudy();

  if (!newlyUnlockedBadge) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-300 relative">
        <button
          onClick={clearNewlyUnlockedBadge}
          className="absolute right-4 top-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Glowing Badge Avatar */}
        <div className="relative w-20 h-20 mx-auto my-3 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-amber-200/50 blur-lg animate-pulse" />
          <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-100 to-violet-100 border-2 border-amber-300/80 flex items-center justify-center text-4xl shadow-md">
            {newlyUnlockedBadge.icon}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Novo Emblema Desbloqueado!</span>
        </div>

        <h3 className="text-lg font-extrabold text-stone-800">{newlyUnlockedBadge.title}</h3>
        <p className="text-xs text-stone-600 mt-1.5 leading-relaxed px-2">
          {newlyUnlockedBadge.description}
        </p>

        <div className="mt-4 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2">
          <span>Recompensa:</span>
          <span className="font-mono text-sm font-bold text-emerald-700">
            +{newlyUnlockedBadge.xpReward} XP
          </span>
        </div>

        <button
          onClick={clearNewlyUnlockedBadge}
          className="mt-5 w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all shadow-xs flex items-center justify-center gap-2 active:scale-98"
        >
          <span>Continuar Estudando</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
