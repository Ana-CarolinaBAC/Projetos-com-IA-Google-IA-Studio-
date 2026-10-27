import React, { useRef } from 'react';
import {
  BarChart3,
  Calendar,
  Flame,
  Clock,
  Download,
  Upload,
  PieChart,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { formatDateKey } from '../data/initialData';

export const ProgressView: React.FC = () => {
  const { sessions, subjects, activities, goalsConfig, userProfile, exportData, importData } =
    useStudy();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Calculate current week (Monday to Sunday)
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;

  const mondayDate = new Date(now);
  mondayDate.setDate(now.getDate() + distanceToMonday);

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(mondayDate);
    d.setDate(mondayDate.getDate() + i);
    return {
      dateStr: formatDateKey(d),
      dayName: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i],
      fullDayName: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'][i],
      dayOfWeekIndex: (i + 1) % 7,
    };
  });

  // Minutes per day of current week
  const weekData = weekDays.map((w) => {
    const daySessions = sessions.filter((s) => s.date === w.dateStr);
    const totalMinutes = daySessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const target =
      goalsConfig.customDays[w.dayOfWeekIndex] !== undefined
        ? goalsConfig.customDays[w.dayOfWeekIndex]
        : goalsConfig.defaultMinutes;

    return {
      ...w,
      minutes: totalMinutes,
      hours: Number((totalMinutes / 60).toFixed(1)),
      targetMinutes: target,
      targetHours: Number((target / 60).toFixed(1)),
      metGoal: totalMinutes >= target && target > 0,
    };
  });

  const totalWeekMinutes = weekData.reduce((acc, d) => acc + d.minutes, 0);
  const totalWeekHours = (totalWeekMinutes / 60).toFixed(1);
  const avgDailyHours = (totalWeekMinutes / 7 / 60).toFixed(1);

  // Subject distribution
  const subjectTimeMap: Record<string, number> = {};
  sessions.forEach((s) => {
    subjectTimeMap[s.subjectId] = (subjectTimeMap[s.subjectId] || 0) + s.durationMinutes;
  });

  const totalAllMinutes = Object.values(subjectTimeMap).reduce((acc, m) => acc + m, 0) || 1;

  const subjectDistribution = subjects
    .map((sub) => {
      const mins = subjectTimeMap[sub.id] || 0;
      const pct = Math.round((mins / totalAllMinutes) * 100);
      return {
        ...sub,
        minutes: mins,
        hours: (mins / 60).toFixed(1),
        percentage: pct,
      };
    })
    .sort((a, b) => b.minutes - a.minutes);

  // High priority completion rate
  const highPriorityActivities = activities.filter((a) => a.priority === 'high');
  const highPriorityDone = highPriorityActivities.filter((a) => a.completed).length;
  const highPriorityRate =
    highPriorityActivities.length > 0
      ? Math.round((highPriorityDone / highPriorityActivities.length) * 100)
      : 100;

  // Chart scaling math
  const maxHours = Math.max(...weekData.map((d) => Math.max(d.hours, d.targetHours)), 4);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) importData(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <h1 className="text-xl font-bold text-stone-800 tracking-tight">
              Progresso & Métricas Semanais
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Acompanhe suas horas líquidas de estudo, consistência da ofensiva e distribuição por matéria
          </p>
        </div>

        {/* Backup / Export Buttons */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
            title="Importar backup em JSON"
          >
            <Upload className="w-3.5 h-3.5 text-stone-500" />
            <span>Restaurar</span>
          </button>
          <button
            onClick={exportData}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-semibold transition-colors shadow-2xs"
            title="Exportar dados do app para JSON"
          >
            <Download className="w-3.5 h-3.5 text-emerald-700" />
            <span>Exportar Backup</span>
          </button>
        </div>
      </div>

      {/* KPI Summary Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Horas na Semana</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-stone-800 tabular-nums font-mono">
            {totalWeekHours}h
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">Segunda a Domingo</p>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Média Diária</span>
            <BarChart3 className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-stone-800 tabular-nums font-mono">
            {avgDailyHours}h
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">Ritmo médio por dia</p>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Alta Prioridade 🔴</span>
            <CheckCircle2 className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-700 tabular-nums font-mono">
            {highPriorityRate}%
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">
            {highPriorityDone} de {highPriorityActivities.length} concluídas
          </p>
        </div>

        <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span>Ofensiva Atual</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-700 tabular-nums font-mono">
            {userProfile.currentStreak} dias
          </div>
          <p className="text-[11px] text-stone-400 mt-0.5">Recorde: {userProfile.bestStreak} dias</p>
        </div>
      </div>

      {/* Grid: Weekly Bar Chart & Subject Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Bar Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                </div>
                <h2 className="text-sm font-bold text-stone-800">Horas Líquidas por Dia</h2>
              </div>
              <span className="text-xs text-stone-500 font-medium">Esta Semana</span>
            </div>
            <p className="text-xs text-stone-500 mb-6">
              As barras representam o tempo líquido estudado; a linha pontilhada indica sua meta diária.
            </p>

            {/* Pure Responsive SVG Bar Chart */}
            <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pt-4 pb-2 border-b border-stone-200">
              {weekData.map((d) => {
                const heightPercent = Math.min(100, Math.round((d.hours / maxHours) * 100));
                const targetPercent = Math.min(100, Math.round((d.targetHours / maxHours) * 100));
                const isSelectedToday = d.dateStr === formatDateKey(new Date());

                return (
                  <div key={d.dateStr} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-800 text-white text-[10px] py-1 px-2 rounded-md pointer-events-none whitespace-nowrap shadow-md z-10 font-mono">
                      {d.fullDayName}: {d.hours}h / meta: {d.targetHours}h
                    </div>

                    {/* Bar Container */}
                    <div className="w-full max-w-[36px] h-full flex items-end justify-center relative">
                      {/* Target Line Indicator */}
                      {d.targetHours > 0 && (
                        <div
                          className="absolute w-full border-b-2 border-dashed border-stone-300 z-10"
                          style={{ bottom: `${targetPercent}%` }}
                          title={`Meta: ${d.targetHours}h`}
                        />
                      )}

                      {/* Actual Hours Bar (Pastel Mint / Green) */}
                      <div
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          d.metGoal
                            ? 'bg-emerald-400 group-hover:bg-emerald-500'
                            : d.hours > 0
                            ? 'bg-emerald-200 group-hover:bg-emerald-300'
                            : 'bg-stone-100 h-1'
                        } ${isSelectedToday ? 'ring-2 ring-emerald-500 ring-offset-1' : ''}`}
                        style={{ height: d.hours > 0 ? `${heightPercent}%` : '4px' }}
                      />
                    </div>

                    {/* Day Name */}
                    <span
                      className={`text-[11px] font-semibold mt-2 ${
                        isSelectedToday ? 'text-emerald-700 font-bold' : 'text-stone-500'
                      }`}
                    >
                      {d.dayName}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono tabular-nums">
                      {d.hours}h
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 7-Day Consistency Streak Indicator */}
          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-stone-600">
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Consistência Semanal:
            </span>
            <div className="flex items-center gap-1.5">
              {weekData.map((d) => (
                <div
                  key={d.dateStr}
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    d.metGoal
                      ? 'bg-emerald-500 text-white shadow-2xs'
                      : d.hours > 0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-stone-100 text-stone-400'
                  }`}
                  title={`${d.fullDayName}: ${d.hours}h estudadas`}
                >
                  {d.metGoal ? '✓' : d.dayName[0]}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Time Distribution (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center text-sky-800">
                  <PieChart className="w-4 h-4 text-sky-700" />
                </div>
                <h2 className="text-sm font-bold text-stone-800">Distribuição por Disciplina</h2>
              </div>
            </div>
            <p className="text-xs text-stone-500 mb-4">
              Porcentagem de tempo dedicada a cada matéria no acumulado
            </p>

            {/* Segmented Progress Stack Bar */}
            <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-100 mb-5">
              {subjectDistribution.map((sub) => {
                if (sub.percentage <= 0) return null;
                return (
                  <div
                    key={sub.id}
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${sub.percentage}%`,
                      backgroundColor: sub.color,
                    }}
                    title={`${sub.name}: ${sub.percentage}% (${sub.hours}h)`}
                  />
                );
              })}
            </div>

            {/* Subject List with Percentages */}
            <div className="space-y-2.5">
              {subjectDistribution.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: sub.color }}
                    />
                    <span className="font-semibold text-stone-800 truncate">{sub.name}</span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-mono">
                    <span className="text-stone-500 tabular-nums">{sub.hours}h</span>
                    <span className="font-bold text-stone-800 w-10 text-right tabular-nums">
                      {sub.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-400 text-center">
            Mantenha suas matérias equilibradas para cobrir todo o conteúdo com segurança.
          </div>
        </div>
      </div>
    </div>
  );
};
