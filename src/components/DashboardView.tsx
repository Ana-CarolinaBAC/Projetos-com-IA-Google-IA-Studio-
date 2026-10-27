import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Flame,
  CheckSquare,
  BookOpen,
  Trash2,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { formatDateKey } from '../data/initialData';

export const DashboardView: React.FC = () => {
  const {
    activities,
    subjects,
    sessions,
    goalsConfig,
    userProfile,
    timer,
    startTimer,
    pauseTimer,
    resetTimer,
    finishTimerManually,
    setTimerMode,
    setActiveTab,
    openActivityModal,
    openGoalModal,
    toggleActivityComplete,
    requestDeleteActivity,
  } = useStudy();

  const todayStr = formatDateKey(new Date());
  const dayOfWeek = new Date().getDay(); // 0 is Sunday, 1 is Monday...

  // Today's target minutes from customDays or default
  const todayTargetMinutes =
    goalsConfig.customDays[dayOfWeek] !== undefined
      ? goalsConfig.customDays[dayOfWeek]
      : goalsConfig.defaultMinutes;

  // Calculate total minutes studied today
  const todaySessions = sessions.filter((s) => s.date === todayStr);
  const minutesStudiedToday = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const pomodorosDoneToday = todaySessions.filter((s) => s.isPomodoro).length;

  // Percentage of daily goal
  const goalPercent =
    todayTargetMinutes > 0
      ? Math.min(100, Math.round((minutesStudiedToday / todayTargetMinutes) * 100))
      : 100;

  // Today's activities
  const todayActivities = activities.filter((a) => a.scheduledDate === todayStr);
  const todayCompletedCount = todayActivities.filter((a) => a.completed).length;

  // Top pending priority activities for today
  const topPriorityActivities = [...todayActivities]
    .filter((a) => !a.completed)
    .sort((a, b) => {
      const pWeights = { high: 3, medium: 2, low: 1 };
      return pWeights[b.priority] - pWeights[a.priority];
    })
    .slice(0, 3);

  // Active activity in timer
  const activeTimerActivity = activities.find((a) => a.id === timer.activeActivityId);
  const activeSubject = activeTimerActivity
    ? subjects.find((s) => s.id === activeTimerActivity.subjectId)
    : subjects[0];

  // Format timer seconds into MM:SS
  const formatTimerDisplay = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedToday = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/80 to-sky-50/90 border border-emerald-100/80 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="capitalize">{formattedToday}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-800 tracking-tight">
              Olá, {userProfile.name}! ✨
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              Mantenha o ritmo leve e focado hoje. Cada pequeno passo e cada minuto registrado
              fortalecem sua consistência.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={openGoalModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/90 text-stone-700 hover:text-stone-900 border border-stone-200/80 text-xs font-semibold hover:bg-white transition-all shadow-2xs"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <span>Ajustar Metas</span>
            </button>
            <button
              onClick={() => openActivityModal()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
            >
              <span>+ Atividade</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Daily Goal Card & Focus Timer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Goal Card (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <Clock className="w-4 h-4 text-emerald-700" />
                </div>
                <h2 className="text-sm font-bold text-stone-800">Meta do Dia</h2>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                {goalPercent}% Concluída
              </span>
            </div>

            {/* Circular / Visual Ring Metric */}
            <div className="flex items-center gap-6 my-4">
              <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 36 36">
                  {/* Background Circle */}
                  <path
                    className="text-stone-100"
                    strokeWidth="3.2"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  {/* Progress Circle (Pastel Mint) */}
                  <path
                    className="text-emerald-500 transition-all duration-700 ease-out"
                    strokeDasharray={`${goalPercent}, 100`}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-stone-800 tabular-nums">
                    {minutesStudiedToday}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium">minutos</span>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-stone-500">Alvo de hoje:</span>
                  <p className="text-sm font-semibold text-stone-800 tabular-nums">
                    {todayTargetMinutes} minutos{' '}
                    <span className="text-stone-400 font-normal">
                      ({(todayTargetMinutes / 60).toFixed(1)}h)
                    </span>
                  </p>
                </div>
                <div>
                  <span className="text-stone-500">Faltam para a meta:</span>
                  <p className="text-sm font-semibold text-emerald-700 tabular-nums">
                    {Math.max(0, todayTargetMinutes - minutesStudiedToday)} min
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-stone-100">
              <div className="p-2.5 rounded-xl bg-stone-50/80 border border-stone-100">
                <span className="text-[11px] text-stone-500">Ciclos Pomodoro</span>
                <p className="text-base font-bold text-stone-800 tabular-nums mt-0.5">
                  🍅 {pomodorosDoneToday}{' '}
                  <span className="text-xs text-stone-400 font-normal">
                    / {goalsConfig.defaultPomodoros}
                  </span>
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50/80 border border-stone-100">
                <span className="text-[11px] text-stone-500">Atividades de Hoje</span>
                <p className="text-base font-bold text-stone-800 tabular-nums mt-0.5">
                  ✅ {todayCompletedCount}{' '}
                  <span className="text-xs text-stone-400 font-normal">
                    / {todayActivities.length}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-500">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Ofensiva ativa: <strong>{userProfile.currentStreak} dias</strong>
            </span>
            <button
              onClick={() => setActiveTab('progress')}
              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              Ver gráficos <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Focus Timer Card (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header with Mode Toggles */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center text-violet-800">
                  <Sparkles className="w-4 h-4 text-violet-700" />
                </div>
                <h2 className="text-sm font-bold text-stone-800">Timer de Foco</h2>
              </div>

              {/* Mode Selectors */}
              <div className="flex items-center p-0.5 rounded-lg bg-stone-100 border border-stone-200/60 text-xs font-medium">
                <button
                  onClick={() => setTimerMode('pomodoro')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timer.mode === 'pomodoro'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Pomodoro (25m)
                </button>
                <button
                  onClick={() => setTimerMode('free')}
                  className={`px-3 py-1 rounded-md transition-all ${
                    timer.mode === 'free'
                      ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                      : 'text-stone-500 hover:text-stone-800'
                  }`}
                >
                  Modo Livre
                </button>
              </div>
            </div>

            {/* Currently Focused Activity Info */}
            <div className="p-3 rounded-xl bg-violet-50/70 border border-violet-200/60 mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shrink-0" />
                <div className="truncate text-xs">
                  <span className="text-stone-500">Estudando agora:</span>
                  <p className="font-semibold text-stone-800 truncate">
                    {activeTimerActivity ? activeTimerActivity.title : 'Foco Geral nos Estudos'}
                  </p>
                </div>
              </div>
              {activeSubject && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-white/90 text-stone-700 border border-stone-200/70 shrink-0">
                  {activeSubject.name}
                </span>
              )}
            </div>

            {/* Digital Clock Display */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-5xl sm:text-6xl font-extrabold tracking-tight text-stone-800 font-mono tabular-nums">
                {formatTimerDisplay(timer.secondsRemaining)}
              </div>
              <p className="text-xs text-stone-500 mt-2 font-medium">
                {timer.isActive
                  ? 'Foco total ativado • Sem distrações'
                  : 'Pronto para iniciar uma sessão de foco'}
              </p>
            </div>
          </div>

          {/* Timer Controls Bar */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-stone-100">
            <button
              onClick={resetTimer}
              className="p-2.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              title="Reiniciar Timer"
              aria-label="Reiniciar Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {timer.isActive ? (
              <button
                onClick={pauseTimer}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 active:scale-95 transition-all shadow-xs"
              >
                <Pause className="w-4 h-4" />
                Pausar
              </button>
            ) : (
              <button
                onClick={() => startTimer()}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
              >
                <Play className="w-4 h-4 fill-white" />
                Iniciar Foco
              </button>
            )}

            <button
              onClick={finishTimerManually}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-100 text-stone-700 hover:text-stone-900 hover:bg-stone-200 font-medium text-xs transition-colors"
              title="Finalizar e Salvar Minutos de Estudo"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Concluir Sessão</span>
            </button>
          </div>
        </div>
      </div>

      {/* Today's Priority Activities Queue */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center text-rose-800">
              <CheckSquare className="w-4 h-4 text-rose-700" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-stone-800">Foco Prioritário de Hoje</h2>
              <p className="text-xs text-stone-500">
                Atividades críticas que requerem sua maior atenção hoje
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('schedule')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            Ver cronograma completo ({todayActivities.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {topPriorityActivities.length === 0 ? (
          <div className="text-center py-8 px-4 rounded-xl bg-stone-50/60 border border-dashed border-stone-200">
            <Sparkles className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <h3 className="text-sm font-semibold text-stone-800">
              Nenhuma atividade prioritária pendente hoje!
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Todas as tarefas programadas para hoje foram concluídas ou você pode criar novas
              atividades no cronograma.
            </p>
            <button
              onClick={() => openActivityModal()}
              className="mt-3 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-2xs"
            >
              + Adicionar Atividade
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topPriorityActivities.map((act) => {
              const sub = subjects.find((s) => s.id === act.subjectId);
              const checkedCount = act.checklist.filter((i) => i.completed).length;
              const totalItems = act.checklist.length;
              const progressPct =
                totalItems > 0 ? Math.round((checkedCount / totalItems) * 100) : 0;

              return (
                <div
                  key={act.id}
                  className="p-4 rounded-xl border border-stone-200/90 bg-[#FAF8F5]/60 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Priority & Subject Tag */}
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider ${
                          act.priority === 'high'
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : act.priority === 'medium'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-sky-50 text-sky-800 border border-sky-200'
                        }`}
                      >
                        {act.priority === 'high'
                          ? '🔴 Alta'
                          : act.priority === 'medium'
                          ? '🟡 Média'
                          : '🔵 Baixa'}
                      </span>
                      <span className="text-stone-500 text-[11px] font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {act.durationMinutes}m
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-800 line-clamp-2 mb-1">
                      {act.title}
                    </h4>
                    {sub && <p className="text-[11px] text-stone-500 mb-3">{sub.name}</p>}

                    {/* Checklist Mini Progress */}
                    {totalItems > 0 && (
                      <div className="mb-3 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-stone-500 font-medium">
                          <span>
                            Subtarefas: {checkedCount}/{totalItems}
                          </span>
                          <span className="font-mono tabular-nums">{progressPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => {
                        startTimer(act.id);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-emerald-800" />
                      Focar Agora
                    </button>
                    <button
                      onClick={() => toggleActivityComplete(act.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-600 hover:bg-stone-100 transition-colors"
                      title="Marcar como Concluída"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => requestDeleteActivity(act)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Excluir Atividade com confirmação"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
