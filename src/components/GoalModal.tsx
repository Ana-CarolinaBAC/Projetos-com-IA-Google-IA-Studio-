import React, { useState } from 'react';
import { X, SlidersHorizontal, Clock, Flame, Shield, Check } from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { DailyGoalConfig } from '../types';

export const GoalModal: React.FC = () => {
  const { isGoalModalOpen, closeGoalModal, goalsConfig, updateGoalsConfig } = useStudy();

  const [defaultMinutes, setDefaultMinutes] = useState(goalsConfig.defaultMinutes || 120);
  const [defaultPomodoros, setDefaultPomodoros] = useState(goalsConfig.defaultPomodoros || 4);
  const [customDays, setCustomDays] = useState<Record<number, number>>({
    ...goalsConfig.customDays,
  });

  if (!isGoalModalOpen) return null;

  const daysLabels = [
    { index: 1, name: 'Segunda-feira', short: 'Seg' },
    { index: 2, name: 'Terça-feira', short: 'Ter' },
    { index: 3, name: 'Quarta-feira', short: 'Qua' },
    { index: 4, name: 'Quinta-feira', short: 'Qui' },
    { index: 5, name: 'Sexta-feira', short: 'Sex' },
    { index: 6, name: 'Sábado', short: 'Sáb' },
    { index: 0, name: 'Domingo (Descanso ou Leve)', short: 'Dom' },
  ];

  const handleDayChange = (dayIndex: number, minutes: number) => {
    setCustomDays((prev) => ({
      ...prev,
      [dayIndex]: minutes,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newConfig: DailyGoalConfig = {
      defaultMinutes,
      defaultPomodoros,
      customDays,
    };
    updateGoalsConfig(newConfig);
    closeGoalModal();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200 my-8">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-stone-800">Personalizar Metas Diárias</h2>
          </div>
          <button
            onClick={closeGoalModal}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Default Minutes & Pomodoros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/60">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                Meta Diária Padrão (Minutos)
              </label>
              <input
                type="number"
                min={15}
                max={480}
                step={15}
                value={defaultMinutes}
                onChange={(e) => setDefaultMinutes(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                Equivale a {(defaultMinutes / 60).toFixed(1)} horas/dia
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                🍅 Ciclos Pomodoro Alvo
              </label>
              <input
                type="number"
                min={1}
                max={16}
                value={defaultPomodoros}
                onChange={(e) => setDefaultPomodoros(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 bg-white font-mono"
              />
              <span className="text-[10px] text-stone-400 mt-0.5 block">
                {defaultPomodoros * 25} min de foco planejado
              </span>
            </div>
          </div>

          {/* Custom Targets per Day of Week */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-stone-700">
                Ajuste por Dia da Semana (Anti-Burnout)
              </label>
              <span className="text-[11px] text-stone-400">0 min = dia livre de folga</span>
            </div>

            <div className="space-y-2">
              {daysLabels.map((day) => {
                const currentVal =
                  customDays[day.index] !== undefined ? customDays[day.index] : defaultMinutes;

                return (
                  <div
                    key={day.index}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-stone-200/70 text-xs"
                  >
                    <span className="font-medium text-stone-800 w-44">{day.name}</span>

                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min={0}
                        max={300}
                        step={15}
                        value={currentVal}
                        onChange={(e) => handleDayChange(day.index, Number(e.target.value))}
                        className="w-24 sm:w-32 accent-emerald-600 cursor-pointer"
                      />
                      <span className="w-14 text-right font-mono font-bold text-stone-800 tabular-nums">
                        {currentVal}m
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={closeGoalModal}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Metas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
