import React, { useState } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  ArrowUpDown,
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Trash2,
  Edit2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ListTodo,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { formatDateKey } from '../data/initialData';
import { PriorityLevel, StudyActivity } from '../types';

export const ScheduleView: React.FC = () => {
  const {
    activities,
    subjects,
    toggleActivityComplete,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
    requestDeleteActivity,
    requestClearCompleted,
    sortActivitiesByPriority,
    openActivityModal,
    startTimer,
    setActiveTab,
  } = useStudy();

  const todayStr = formatDateKey(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [expandedChecklists, setExpandedChecklists] = useState<Record<string, boolean>>({
    // Keep first few open by default
  });
  const [newChecklistText, setNewChecklistText] = useState<Record<string, string>>({});

  // Date Navigation Helpers
  const shiftDate = (days: number) => {
    const current = new Date(`${selectedDate}T12:00:00`);
    current.setDate(current.getDate() + days);
    setSelectedDate(formatDateKey(current));
  };

  const isToday = selectedDate === todayStr;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = selectedDate === formatDateKey(tomorrow);

  // Filter activities for selected date and priority
  const dateActivities = activities.filter((a) => a.scheduledDate === selectedDate);

  const filteredActivities = dateActivities.filter((act) => {
    if (filterPriority === 'all') return true;
    if (filterPriority === 'pending') return !act.completed;
    return act.priority === filterPriority;
  });

  const toggleChecklistExpand = (actId: string) => {
    setExpandedChecklists((prev) => ({
      ...prev,
      [actId]: prev[actId] === undefined ? false : !prev[actId],
    }));
  };

  const handleAddChecklistItem = (actId: string) => {
    const text = newChecklistText[actId];
    if (text && text.trim()) {
      addChecklistItem(actId, text.trim());
      setNewChecklistText((prev) => ({ ...prev, [actId]: '' }));
    }
  };

  const formattedSelectedDate = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(`${selectedDate}T12:00:00`));

  return (
    <div className="space-y-6">
      {/* Top Header & Date Navigation Bar */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              <h1 className="text-xl font-bold text-stone-800 tracking-tight">
                Cronograma de Estudos
              </h1>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Organize suas atividades diárias com prioridade e checklists passo a passo
            </p>
          </div>

          {/* Date Picker Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedDate(todayStr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isToday
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Hoje
            </button>

            <button
              onClick={() => setSelectedDate(formatDateKey(tomorrow))}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                isTomorrow
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Amanhã
            </button>

            <div className="flex items-center bg-stone-100/90 rounded-xl p-1 border border-stone-200/60">
              <button
                onClick={() => shiftDate(-1)}
                className="p-1 rounded-lg hover:bg-white text-stone-600 transition-colors"
                title="Dia anterior"
                aria-label="Dia anterior"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs font-medium text-stone-800 px-2 py-0.5 focus:outline-hidden cursor-pointer"
              />

              <button
                onClick={() => shiftDate(1)}
                className="p-1 rounded-lg hover:bg-white text-stone-600 transition-colors"
                title="Próximo dia"
                aria-label="Próximo dia"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={() => openActivityModal({ scheduledDate: selectedDate } as StudyActivity)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Nova Atividade</span>
            </button>
          </div>
        </div>

        {/* Selected Date Summary Banner */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-stone-600 gap-2">
          <span className="font-medium capitalize flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            {formattedSelectedDate}
          </span>
          <span className="text-stone-500">
            {dateActivities.length} {dateActivities.length === 1 ? 'atividade' : 'atividades'}{' '}
            programadas ·{' '}
            <strong className="text-stone-700">
              {dateActivities.filter((a) => a.completed).length} concluídas
            </strong>
          </span>
        </div>
      </div>

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#FAF8F5] p-2 rounded-xl border border-stone-200/60">
        {/* Priority Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterPriority('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterPriority === 'all'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Todas ({dateActivities.length})
          </button>

          <button
            onClick={() => setFilterPriority('high')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterPriority === 'high'
                ? 'bg-rose-100 text-rose-900 font-semibold shadow-2xs'
                : 'text-rose-700 hover:bg-rose-50'
            }`}
          >
            🔴 Alta Prioridade
          </button>

          <button
            onClick={() => setFilterPriority('medium')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterPriority === 'medium'
                ? 'bg-amber-100 text-amber-900 font-semibold shadow-2xs'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            🟡 Média
          </button>

          <button
            onClick={() => setFilterPriority('low')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterPriority === 'low'
                ? 'bg-sky-100 text-sky-900 font-semibold shadow-2xs'
                : 'text-sky-700 hover:bg-sky-50'
            }`}
          >
            🔵 Baixa
          </button>

          <button
            onClick={() => setFilterPriority('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterPriority === 'pending'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Apenas Pendentes
          </button>
        </div>

        {/* Priority Sorter Action & Clear Completed */}
        <div className="flex items-center gap-2 shrink-0">
          {dateActivities.some((a) => a.completed) && (
            <button
              onClick={() => requestClearCompleted(selectedDate)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 text-stone-600 hover:text-rose-700 text-xs font-semibold transition-all shrink-0"
              title="Remover atividades concluídas deste dia com confirmação"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Concluídas</span>
            </button>
          )}

          <button
            onClick={() => sortActivitiesByPriority(selectedDate)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200/80 text-stone-700 hover:text-stone-900 hover:bg-stone-50 text-xs font-semibold transition-all shrink-0 shadow-2xs"
            title="Organiza as atividades colocando Alta Prioridade no topo"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-violet-600" />
            <span>Organizar por Prioridade</span>
          </button>
        </div>
      </div>

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <div className="bg-white border border-dashed border-stone-200 rounded-2xl p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-stone-800">
            Nenhuma atividade encontrada neste dia
          </h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Aproveite para planejar seus blocos de foco, adicionar listas de tarefas e priorizar as
            matérias mais importantes.
          </p>
          <button
            onClick={() => openActivityModal({ scheduledDate: selectedDate } as StudyActivity)}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-colors shadow-xs"
          >
            + Adicionar Atividade em {selectedDate}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredActivities.map((act) => {
            const sub = subjects.find((s) => s.id === act.subjectId);
            const isExpanded = expandedChecklists[act.id] !== false; // default open
            const totalItems = act.checklist.length;
            const completedItems = act.checklist.filter((i) => i.completed).length;
            const progressPct =
              totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

            const priorityBadge = {
              high: {
                label: 'Alta Prioridade',
                badge: 'bg-rose-50 text-rose-800 border-rose-200/80',
                dot: 'bg-rose-500',
              },
              medium: {
                label: 'Média Prioridade',
                badge: 'bg-amber-50 text-amber-800 border-amber-200/80',
                dot: 'bg-amber-500',
              },
              low: {
                label: 'Baixa Prioridade',
                badge: 'bg-sky-50 text-sky-800 border-sky-200/80',
                dot: 'bg-sky-500',
              },
            }[act.priority];

            return (
              <div
                key={act.id}
                className={`bg-white border rounded-2xl p-4 sm:p-5 transition-all shadow-xs ${
                  act.completed
                    ? 'border-emerald-200/80 bg-emerald-50/20'
                    : act.priority === 'high'
                    ? 'border-rose-200/80 hover:border-rose-300'
                    : 'border-stone-200/80 hover:border-stone-300'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => toggleActivityComplete(act.id)}
                      className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors shrink-0"
                      title={act.completed ? 'Marcar como pendente' : 'Marcar como concluída'}
                      aria-label="Toggle conclusão"
                    >
                      {act.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      {/* Tags Bar */}
                      <div className="flex items-center gap-2 flex-wrap text-xs mb-1.5">
                        {/* Priority Badge */}
                        <span
                          className={`px-2 py-0.5 rounded-md font-semibold text-[10px] uppercase tracking-wider border flex items-center gap-1.5 ${priorityBadge.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${priorityBadge.dot}`} />
                          {priorityBadge.label}
                        </span>

                        {/* Subject Tag */}
                        {sub && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${sub.bgPastel} ${sub.textPastel} ${sub.borderPastel}`}
                          >
                            {sub.name}
                          </span>
                        )}

                        {/* Duration */}
                        <span className="text-stone-500 text-[11px] flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {act.durationMinutes} min
                        </span>
                      </div>

                      <h3
                        className={`text-sm sm:text-base font-bold text-stone-800 ${
                          act.completed ? 'line-through text-stone-400' : ''
                        }`}
                      >
                        {act.title}
                      </h3>

                      {act.notes && (
                        <p className="text-xs text-stone-500 mt-1 line-clamp-2">{act.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Top Right Action Menu */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => {
                        startTimer(act.id);
                        setActiveTab('dashboard');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                      title="Iniciar sessão de foco para esta atividade"
                    >
                      <Play className="w-3.5 h-3.5 fill-emerald-800" />
                      <span className="hidden sm:inline">Focar</span>
                    </button>

                    <button
                      onClick={() => openActivityModal(act)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      title="Editar Atividade"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => requestDeleteActivity(act)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Excluir Atividade com confirmação"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subtasks / Checklist Section */}
                <div className="mt-4 pt-3 border-t border-stone-100">
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => toggleChecklistExpand(act.id)}
                      className="flex items-center gap-2 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors"
                    >
                      <ListTodo className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Lista de Subtarefas ({completedItems}/{totalItems})</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                      )}
                    </button>

                    {totalItems > 0 && (
                      <span className="text-[11px] font-mono text-stone-500 tabular-nums">
                        {progressPct}% concluído
                      </span>
                    )}
                  </div>

                  {/* Mini Progress Bar */}
                  {totalItems > 0 && (
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  )}

                  {/* Expandable Content */}
                  {isExpanded && (
                    <div className="space-y-2 mt-2">
                      {act.checklist.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#FAF8F5]/80 hover:bg-[#FAF8F5] border border-stone-200/50 text-xs transition-colors"
                        >
                          <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleChecklistItem(act.id, item.id)}
                              className="w-4 h-4 rounded-sm text-emerald-600 focus:ring-emerald-500 border-stone-300 cursor-pointer"
                            />
                            <span
                              className={`truncate select-none ${
                                item.completed ? 'line-through text-stone-400' : 'text-stone-700'
                              }`}
                            >
                              {item.text}
                            </span>
                          </label>

                          <button
                            onClick={() => removeChecklistItem(act.id, item.id)}
                            className="text-stone-300 hover:text-rose-500 transition-colors p-1"
                            title="Remover item da lista"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Add new checklist item input */}
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="text"
                          placeholder="Adicionar passo ou subtarefa... (pressione Enter)"
                          value={newChecklistText[act.id] || ''}
                          onChange={(e) =>
                            setNewChecklistText((prev) => ({ ...prev, [act.id]: e.target.value }))
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAddChecklistItem(act.id);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200 focus:outline-hidden focus:border-emerald-500 transition-colors"
                        />
                        <button
                          onClick={() => handleAddChecklistItem(act.id)}
                          className="px-3 py-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-emerald-50 hover:text-emerald-800 text-xs font-semibold transition-colors shrink-0"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
