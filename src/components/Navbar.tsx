import React from 'react';
import {
  BookOpen,
  Calendar,
  Flame,
  LayoutDashboard,
  Plus,
  Shield,
  Trophy,
  Volume2,
  VolumeX,
  BarChart3,
  Sparkles,
  User,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    isSoundMuted,
    toggleSoundMute,
    openActivityModal,
    useStreakFreeze,
  } = useStudy();

  const xpPercent = Math.min(
    100,
    Math.round(((userProfile.currentXp % 150) / 150) * 100)
  );

  return (
    <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-stone-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100/90 text-emerald-800 flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                <Sparkles className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-stone-800 flex items-center gap-1.5">
                  Lumina Study
                </span>
                <p className="text-[11px] text-stone-500 font-medium hidden sm:block">
                  Foco & Organização
                </p>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Single-line controls) */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/60">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-600" />
              Painel
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'schedule'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <Calendar className="w-4 h-4 text-violet-600" />
              Cronograma
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'materials'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <BookOpen className="w-4 h-4 text-sky-600" />
              Materiais
            </button>

            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'progress'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-600" />
              Progresso
            </button>

            <button
              onClick={() => setActiveTab('badges')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'badges'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <Trophy className="w-4 h-4 text-pink-600" />
              Emblemas
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <User className="w-4 h-4 text-violet-600" />
              Perfil
            </button>
          </nav>

          {/* Zone 3: Gamification Metrics & Primary Action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* User Avatar Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 p-1 rounded-xl border transition-all ${
                activeTab === 'profile'
                  ? 'bg-violet-100 border-violet-300 ring-2 ring-violet-400 shadow-2xs'
                  : 'bg-white hover:bg-stone-50 border-stone-200/80 shadow-2xs'
              }`}
              title={`Acessar Perfil (${userProfile.name})`}
            >
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center text-base">
                {userProfile.avatarUrl?.startsWith('http') ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt="Avatar"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  userProfile.avatarUrl || '🌸'
                )}
              </div>
              <span className="hidden xl:inline text-xs font-semibold text-stone-700 max-w-[85px] truncate pr-1">
                {userProfile.name || 'Perfil'}
              </span>
            </button>
            {/* Streak Counter */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50/90 border border-amber-200/80 text-amber-900 text-xs font-semibold cursor-pointer hover:bg-amber-100 transition-colors"
              title={`${userProfile.currentStreak} dias seguidos de estudo!`}
            >
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="tabular-nums font-bold">{userProfile.currentStreak}</span>
              <span className="hidden sm:inline text-amber-700/80 text-[11px]">dias</span>
            </div>

            {/* Streak Freeze Shield (if available) */}
            {userProfile.streakFreezes > 0 && (
              <button
                onClick={useStreakFreeze}
                className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-lg bg-sky-50 border border-sky-200 text-sky-800 text-xs font-medium hover:bg-sky-100 transition-colors"
                title={`${userProfile.streakFreezes} Escudos de Descanso disponíveis. Clique para proteger o dia.`}
              >
                <Shield className="w-3.5 h-3.5 text-sky-600" />
                <span className="tabular-nums">{userProfile.streakFreezes}</span>
              </button>
            )}

            {/* Level & XP Mini-Bar */}
            <div
              onClick={() => setActiveTab('badges')}
              className="hidden sm:flex flex-col justify-center px-2.5 py-1 rounded-lg bg-violet-50/90 border border-violet-200/70 text-violet-900 cursor-pointer hover:bg-violet-100 transition-colors"
              title={`Nível ${userProfile.level} (${userProfile.currentXp} XP)`}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold gap-3">
                <span>Nível {userProfile.level}</span>
                <span className="text-[10px] text-violet-600 font-mono tabular-nums">
                  {userProfile.currentXp} XP
                </span>
              </div>
              <div className="w-20 h-1.5 bg-violet-200 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-violet-600 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Sound Mute Toggle */}
            <button
              onClick={toggleSoundMute}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              title={isSoundMuted ? 'Ativar sons relaxantes' : 'Mutar sons'}
              aria-label="Toggle som"
            >
              {isSoundMuted ? (
                <VolumeX className="w-4 h-4 text-stone-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-emerald-600" />
              )}
            </button>

            {/* Primary Action Button: Nova Atividade */}
            <button
              onClick={() => openActivityModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Nova Atividade</span>
              <span className="sm:hidden">Criar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-200/60 bg-white/95 px-2 py-1.5">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
            activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-stone-500'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Painel</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
            activeTab === 'schedule' ? 'text-violet-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Cronograma</span>
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
            activeTab === 'materials' ? 'text-sky-700 font-bold' : 'text-stone-500'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Materiais</span>
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
            activeTab === 'progress' ? 'text-amber-700 font-bold' : 'text-stone-500'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Progresso</span>
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
            activeTab === 'badges' ? 'text-pink-700 font-bold' : 'text-stone-500'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Emblemas</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center py-1 px-2 text-[10px] font-medium ${
            activeTab === 'profile' ? 'text-violet-700 font-bold' : 'text-stone-500'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Perfil</span>
        </button>
      </div>
    </header>
  );
};
