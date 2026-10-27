import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Clock, Calendar, CheckSquare, Sparkles } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { formatDateKey } from '../data/initialData';
import { ActivityChecklistItem, PriorityLevel, StudyActivity } from '../types';

export const ActivityModal: React.FC = () => {
  const {
    isActivityModalOpen,
    closeActivityModal,
    editingActivity,
    addActivity,
    updateActivity,
    subjects,
  } = useStudy();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('medium');
  const [scheduledDate, setScheduledDate] = useState(formatDateKey(new Date()));
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [notes, setNotes] = useState('');
  const [checklistItems, setChecklistItems] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newChecklistText, setNewChecklistText] = useState('');

  useEffect(() => {
    if (editingActivity) {
      setTitle(editingActivity.title || '');
      setSubjectId(editingActivity.subjectId || (subjects[0]?.id ?? ''));
      setPriority(editingActivity.priority || 'medium');
      setScheduledDate(editingActivity.scheduledDate || formatDateKey(new Date()));
      setDurationMinutes(editingActivity.durationMinutes || 45);
      setNotes(editingActivity.notes || '');
      setChecklistItems(editingActivity.checklist || []);
    } else {
      setTitle('');
      setSubjectId(subjects[0]?.id || '');
      setPriority('medium');
      setScheduledDate(formatDateKey(new Date()));
      setDurationMinutes(45);
      setNotes('');
      setChecklistItems([]);
    }
    setNewChecklistText('');
  }, [editingActivity, subjects, isActivityModalOpen]);

  if (!isActivityModalOpen) return null;

  const handleAddChecklist = () => {
    if (!newChecklistText.trim()) return;
    setChecklistItems((prev) => [
      ...prev,
      {
        id: `chk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        text: newChecklistText.trim(),
        completed: false,
      },
    ]);
    setNewChecklistText('');
  };

  const handleRemoveChecklist = (id: string) => {
    setChecklistItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    if (editingActivity && editingActivity.id) {
      updateActivity({
        ...editingActivity,
        title: title.trim(),
        subjectId,
        priority,
        scheduledDate,
        durationMinutes,
        notes: notes.trim() || undefined,
        checklist: checklistItems,
      });
    } else {
      addActivity({
        title: title.trim(),
        subjectId,
        priority,
        scheduledDate,
        durationMinutes,
        completed: false,
        notes: notes.trim() || undefined,
        checklist: checklistItems,
      });
    }

    closeActivityModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <h2 className="text-base font-bold text-stone-800">
              {editingActivity && editingActivity.id ? 'Editar Atividade' : 'Nova Atividade de Estudo'}
            </h2>
          </div>
          <button
            onClick={closeActivityModal}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Título da Atividade *
            </label>
            <input
              type="text"
              placeholder="Ex: Resolver 15 exercícios de Cinemática, Ler capítulo 4..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 font-medium"
              autoFocus
              required
            />
          </div>

          {/* Grid: Subject & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Disciplina *
              </label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 bg-white"
                required
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Prioridade *
              </label>
              <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200/60">
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  className={`py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    priority === 'high'
                      ? 'bg-rose-100 text-rose-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  🔴 Alta
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('medium')}
                  className={`py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    priority === 'medium'
                      ? 'bg-amber-100 text-amber-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  🟡 Média
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('low')}
                  className={`py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    priority === 'low'
                      ? 'bg-sky-100 text-sky-900 shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  🔵 Baixa
                </button>
              </div>
            </div>
          </div>

          {/* Grid: Date & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                Data de Estudo
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                Duração Estimada: <strong className="text-stone-800">{durationMinutes} min</strong>
              </label>
              <input
                type="range"
                min={15}
                max={180}
                step={15}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer mt-2"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>15m</span>
                <span>45m</span>
                <span>90m</span>
                <span>3h</span>
              </div>
            </div>
          </div>

          {/* Checklist / Subtasks Builder */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
              <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
              Lista de Subtarefas & Passos
            </label>

            {checklistItems.length > 0 && (
              <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto pr-1">
                {checklistItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#FAF8F5] border border-stone-200/60 text-xs"
                  >
                    <span className="text-stone-700 truncate">
                      {idx + 1}. {item.text}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveChecklist(item.id)}
                      className="text-stone-300 hover:text-rose-500 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ex: Ler págs 20 a 35, resolver 5 questões..."
                value={newChecklistText}
                onChange={(e) => setNewChecklistText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddChecklist();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddChecklist}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-emerald-50 hover:text-emerald-800 text-stone-700 text-xs font-semibold transition-colors shrink-0"
              >
                + Adicionar
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Observações (Opcional)
            </label>
            <textarea
              rows={2}
              placeholder="Anotações extras, link de apoio ou foco principal..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={closeActivityModal}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs"
            >
              {editingActivity && editingActivity.id ? 'Salvar Alterações' : 'Criar Atividade'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
