import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useStudy } from '../context/StudyContext';

export const ConfirmDeleteModal: React.FC = () => {
  const {
    activityToDelete,
    confirmDeleteActivity,
    cancelDeleteActivity,
    isClearCompletedModalOpen,
    confirmClearCompleted,
    cancelClearCompleted,
    subjects,
  } = useStudy();

  if (!activityToDelete && !isClearCompletedModalOpen) return null;

  if (activityToDelete) {
    const sub = subjects.find((s) => s.id === activityToDelete.subjectId);
    const subtasksCount = activityToDelete.checklist.length;

    return (
      <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-800">Excluir Atividade?</h3>
                <p className="text-xs text-stone-500">Confirmação de exclusão</p>
              </div>
            </div>
            <button
              onClick={cancelDeleteActivity}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Activity Preview Card */}
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/70 mb-4 space-y-1.5">
            <div className="flex items-center gap-2 text-[10px] font-semibold">
              <span
                className={`px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  activityToDelete.priority === 'high'
                    ? 'bg-rose-100 text-rose-900'
                    : activityToDelete.priority === 'medium'
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-sky-100 text-sky-900'
                }`}
              >
                {activityToDelete.priority === 'high'
                  ? '🔴 Alta'
                  : activityToDelete.priority === 'medium'
                  ? '🟡 Média'
                  : '🔵 Baixa'}
              </span>
              {sub && (
                <span className="text-stone-600 font-medium">{sub.name}</span>
              )}
            </div>
            <h4 className="text-xs font-bold text-stone-800 line-clamp-2">
              {activityToDelete.title}
            </h4>
            <p className="text-[11px] text-stone-500">
              Duração: {activityToDelete.durationMinutes} min
              {subtasksCount > 0 && ` · ${subtasksCount} subtarefas vinculadas`}
            </p>
          </div>

          <p className="text-xs text-stone-600 mb-5 leading-relaxed">
            Tem certeza de que deseja remover esta tarefa? Todas as subtarefas e notas associadas
            serão apagadas.
          </p>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={cancelDeleteActivity}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDeleteActivity}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 active:scale-95 transition-all shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Sim, Excluir Atividade</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Clear completed modal
  if (isClearCompletedModalOpen) {
    return (
      <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-800">Limpar Concluídas?</h3>
                <p className="text-xs text-stone-500">Remover tarefas já finalizadas</p>
              </div>
            </div>
            <button
              onClick={cancelClearCompleted}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-stone-600 mb-5 leading-relaxed">
            Deseja remover do cronograma todas as atividades marcadas como concluídas? Isso deixará
            sua lista mais limpa e focada nas próximas metas.
          </p>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={cancelClearCompleted}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmClearCompleted}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-semibold hover:bg-amber-700 active:scale-95 transition-all shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Concluídas</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};
