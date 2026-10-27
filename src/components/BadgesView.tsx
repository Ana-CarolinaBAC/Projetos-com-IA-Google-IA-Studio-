import React, { useState } from 'react';
import { Trophy, Lock, CheckCircle2, Sparkles, Award } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { BadgeRarity } from '../types';

export const BadgesView: React.FC = () => {
  const { badges, userProfile } = useStudy();

  const [rarityFilter, setRarityFilter] = useState<string>('all');

  const unlockedCount = userProfile.unlockedBadgeIds.length;
  const totalBadges = badges.length;
  const progressPercent = Math.round((unlockedCount / totalBadges) * 100);

  const filteredBadges = badges.filter((b) => {
    if (rarityFilter === 'all') return true;
    return b.rarity === rarityFilter;
  });

  const getRarityBadge = (rarity: BadgeRarity) => {
    switch (rarity) {
      case 'common':
        return { label: 'Comum', style: 'bg-stone-100 text-stone-700 border-stone-200' };
      case 'rare':
        return { label: 'Raro', style: 'bg-sky-50 text-sky-800 border-sky-200' };
      case 'epic':
        return { label: 'Épico', style: 'bg-violet-50 text-violet-800 border-violet-200' };
      case 'legendary':
        return { label: 'Lendário', style: 'bg-amber-50 text-amber-900 border-amber-200' };
    }
  };

  const getLevelTitle = (lvl: number) => {
    if (lvl <= 3) return 'Iniciado nos Livros';
    if (lvl <= 7) return 'Aprendiz Focado';
    if (lvl <= 12) return 'Estrategista de Estudos';
    if (lvl <= 20) return 'Erudito Dedicado';
    if (lvl <= 35) return 'Filósofo do Conhecimento';
    return 'Grão-Mestre Lumina';
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Level Summary Card */}
      <div className="bg-gradient-to-r from-violet-50/90 via-pink-50/80 to-amber-50/90 border border-violet-100/90 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              <span className="text-xs font-semibold text-violet-800 uppercase tracking-wider">
                Sistema de Gamificação & Recompensas
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-800 tracking-tight">
              Galeria de Emblemas Virtuais 🏆
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-xl">
              Celebre sua evolução nos estudos. Conquiste novos emblemas ao cumprir metas, manter a
              ofensiva diária e superar matérias prioritárias.
            </p>
          </div>

          {/* Level & Trophy Badge Status */}
          <div className="p-4 rounded-xl bg-white/90 border border-stone-200/70 shadow-xs flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center text-2xl">
              🎖️
            </div>
            <div>
              <span className="text-[11px] text-stone-500 font-medium">Nível de Maestria</span>
              <h3 className="text-sm font-bold text-stone-800">
                Nível {userProfile.level} · {getLevelTitle(userProfile.level)}
              </h3>
              <p className="text-[11px] text-violet-700 font-mono font-medium">
                {userProfile.currentXp} XP acumulados
              </p>
            </div>
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="mt-5 pt-4 border-t border-violet-100/80">
          <div className="flex items-center justify-between text-xs text-stone-600 mb-1.5 font-medium">
            <span>
              Progresso da Coleção: <strong>{unlockedCount} de {totalBadges} Emblemas</strong>
            </span>
            <span className="font-mono tabular-nums text-violet-700 font-bold">
              {progressPercent}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-violet-200/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-violet-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Rarity Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-[#FAF8F5] p-2 rounded-xl border border-stone-200/60">
        <button
          onClick={() => setRarityFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            rarityFilter === 'all'
              ? 'bg-white text-stone-900 shadow-2xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Todos os Emblemas ({totalBadges})
        </button>

        <button
          onClick={() => setRarityFilter('common')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            rarityFilter === 'common'
              ? 'bg-white text-stone-900 shadow-2xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Bronze (Comum)
        </button>

        <button
          onClick={() => setRarityFilter('rare')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            rarityFilter === 'rare'
              ? 'bg-sky-100 text-sky-900 font-semibold shadow-2xs'
              : 'text-sky-700 hover:bg-sky-50'
          }`}
        >
          Prata (Raro)
        </button>

        <button
          onClick={() => setRarityFilter('epic')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            rarityFilter === 'epic'
              ? 'bg-violet-100 text-violet-900 font-semibold shadow-2xs'
              : 'text-violet-700 hover:bg-violet-50'
          }`}
        >
          Ouro (Épico)
        </button>

        <button
          onClick={() => setRarityFilter('legendary')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
            rarityFilter === 'legendary'
              ? 'bg-amber-100 text-amber-900 font-semibold shadow-2xs'
              : 'text-amber-700 hover:bg-amber-50'
          }`}
        >
          Diamante (Lendário)
        </button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = userProfile.unlockedBadgeIds.includes(badge.id);
          const rarity = getRarityBadge(badge.rarity);

          return (
            <div
              key={badge.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isUnlocked
                  ? 'bg-white border-stone-200/90 shadow-xs hover:shadow-md hover:border-violet-300'
                  : 'bg-stone-50/70 border-stone-200/50 opacity-75'
              }`}
            >
              <div>
                {/* Header: Icon & Rarity Tag */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-xs transition-transform ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-200'
                        : 'bg-stone-200/80 grayscale border border-stone-300/60'
                    }`}
                  >
                    {badge.icon}
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md border ${rarity.style}`}
                    >
                      {rarity.label}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 font-bold">
                      +{badge.xpReward} XP
                    </span>
                  </div>
                </div>

                {/* Badge Title & Description */}
                <h3
                  className={`text-sm font-bold flex items-center gap-1.5 ${
                    isUnlocked ? 'text-stone-800' : 'text-stone-500'
                  }`}
                >
                  {badge.title}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">{badge.description}</p>
              </div>

              {/* Status Footer */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {isUnlocked ? (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Conquistado
                  </span>
                ) : (
                  <span className="text-stone-400 font-medium flex items-center gap-1 text-[11px]">
                    <Lock className="w-3.5 h-3.5" />
                    Bloqueado
                  </span>
                )}
                <span className="text-[10px] text-stone-400 capitalize">
                  {badge.category === 'priority'
                    ? 'Prioridade'
                    : badge.category === 'checklist'
                    ? 'Checklist'
                    : badge.category === 'streak'
                    ? 'Ofensiva'
                    : badge.category === 'focus'
                    ? 'Foco'
                    : 'Maestria'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
