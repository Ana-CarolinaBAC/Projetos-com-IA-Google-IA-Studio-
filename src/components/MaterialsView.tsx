import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  ExternalLink,
  FileText,
  HelpCircle,
  CheckCircle2,
  Circle,
  FolderPlus,
  Sparkles,
  Search,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { StudyMaterial } from '../types';

export const MaterialsView: React.FC = () => {
  const { subjects, addSubject, addTopic, toggleTopicComplete, addMaterial } = useStudy();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | 'all'>('all');

  // Modal states for adding Subject, Topic, and Material
  const [isAddSubjectOpen, setIsAddSubjectOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectColor, setNewSubjectColor] = useState('#10B981');

  const [activeTopicModalSubId, setActiveTopicModalSubId] = useState<string | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState('');

  const [activeMaterialModal, setActiveMaterialModal] = useState<{
    subjectId: string;
    topicId: string;
  } | null>(null);
  const [newMaterialTitle, setNewMaterialTitle] = useState('');
  const [newMaterialType, setNewMaterialType] = useState<'link' | 'note' | 'flashcard'>('note');
  const [newMaterialContent, setNewMaterialContent] = useState('');
  const [newMaterialUrl, setNewMaterialUrl] = useState('');

  const handleCreateSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    addSubject(newSubjectName.trim(), newSubjectColor);
    setNewSubjectName('');
    setIsAddSubjectOpen(false);
  };

  const handleCreateTopic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTopicModalSubId || !newTopicTitle.trim()) return;
    addTopic(activeTopicModalSubId, newTopicTitle.trim());
    setNewTopicTitle('');
    setActiveTopicModalSubId(null);
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMaterialModal || !newMaterialTitle.trim()) return;
    addMaterial(activeMaterialModal.subjectId, activeMaterialModal.topicId, {
      title: newMaterialTitle.trim(),
      type: newMaterialType,
      content: newMaterialContent.trim(),
      url: newMaterialUrl.trim() || undefined,
    });
    setNewMaterialTitle('');
    setNewMaterialContent('');
    setNewMaterialUrl('');
    setActiveMaterialModal(null);
  };

  const filteredSubjects = subjects
    .filter((s) => (selectedSubjectId === 'all' ? true : s.id === selectedSubjectId))
    .filter((s) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inSubName = s.name.toLowerCase().includes(q);
      const inTopics = s.topics.some(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          t.materials.some((m) => m.title.toLowerCase().includes(q) || m.content.toLowerCase().includes(q))
      );
      return inSubName || inTopics;
    });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
            <h1 className="text-xl font-bold text-stone-800 tracking-tight">
              Repositório de Materiais & Disciplinas
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Centralize resumos, links de videoaulas e tópicos organizados por matéria
          </p>
        </div>

        <button
          onClick={() => setIsAddSubjectOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition-all shadow-xs self-start md:self-auto"
        >
          <FolderPlus className="w-4 h-4" />
          <span>Nova Disciplina</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-[#FAF8F5] p-2 rounded-xl border border-stone-200/60">
        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedSubjectId('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              selectedSubjectId === 'all'
                ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Todas as Disciplinas ({subjects.length})
          </button>
          {subjects.map((sub) => (
            <button
              key={sub.id}
              onClick={() => setSelectedSubjectId(sub.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedSubjectId === sub.id
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {sub.name}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por tópico ou anotação..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-white rounded-lg border border-stone-200 focus:outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="space-y-6">
        {filteredSubjects.map((sub) => {
          const totalTopics = sub.topics.length;
          const completedTopics = sub.topics.filter((t) => t.completed).length;
          const masteryPct =
            totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

          return (
            <div
              key={sub.id}
              className="bg-white border border-stone-200/80 rounded-2xl p-5 shadow-xs transition-all"
            >
              {/* Subject Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-8 rounded-full shrink-0"
                    style={{ backgroundColor: sub.color }}
                  />
                  <div>
                    <h2 className="text-base font-bold text-stone-800">{sub.name}</h2>
                    <p className="text-xs text-stone-500">
                      {totalTopics} {totalTopics === 1 ? 'tópico' : 'tópicos'} cadastrados ·{' '}
                      {completedTopics} dominados ({masteryPct}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTopicModalSubId(sub.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar Tópico</span>
                  </button>
                </div>
              </div>

              {/* Topics and Materials */}
              {sub.topics.length === 0 ? (
                <div className="py-6 text-center text-xs text-stone-500">
                  Nenhum tópico adicionado a esta disciplina ainda. Clique em "Adicionar Tópico".
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {sub.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className={`p-4 rounded-xl border transition-all ${
                        topic.completed
                          ? 'bg-emerald-50/20 border-emerald-200/80'
                          : 'bg-[#FAF8F5]/60 border-stone-200/70 hover:border-stone-300'
                      }`}
                    >
                      {/* Topic Title with Complete Toggle */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <label className="flex items-start gap-2.5 cursor-pointer flex-1 min-w-0">
                          <button
                            onClick={() => toggleTopicComplete(sub.id, topic.id)}
                            className="mt-0.5 text-stone-400 hover:text-emerald-600 transition-colors shrink-0"
                            title="Marcar tópico como dominado (+15 XP)"
                          >
                            {topic.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                          <span
                            className={`text-xs font-bold leading-snug ${
                              topic.completed ? 'line-through text-stone-400' : 'text-stone-800'
                            }`}
                          >
                            {topic.title}
                          </span>
                        </label>

                        <button
                          onClick={() =>
                            setActiveMaterialModal({ subjectId: sub.id, topicId: topic.id })
                          }
                          className="p-1 rounded-md text-stone-400 hover:text-emerald-700 hover:bg-emerald-50 transition-colors shrink-0"
                          title="Adicionar recurso/anotação a este tópico"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Materials List */}
                      {topic.materials.length > 0 && (
                        <div className="space-y-1.5 mt-3 pt-2 border-t border-stone-100">
                          {topic.materials.map((mat) => (
                            <div
                              key={mat.id}
                              className="p-2 rounded-lg bg-white border border-stone-200/60 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-semibold text-stone-800 flex items-center gap-1.5">
                                  {mat.type === 'link' && (
                                    <ExternalLink className="w-3 h-3 text-sky-500" />
                                  )}
                                  {mat.type === 'note' && (
                                    <FileText className="w-3 h-3 text-violet-500" />
                                  )}
                                  {mat.type === 'flashcard' && (
                                    <HelpCircle className="w-3 h-3 text-amber-500" />
                                  )}
                                  {mat.title}
                                </span>
                                {mat.url && (
                                  <a
                                    href={mat.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-[10px] text-sky-600 hover:underline flex items-center gap-0.5"
                                  >
                                    Abrir link
                                  </a>
                                )}
                              </div>
                              <p className="text-[11px] text-stone-600 font-normal leading-relaxed">
                                {mat.content}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal: Add Subject */}
      {isAddSubjectOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-stone-800 mb-3">Nova Disciplina</h3>
            <form onSubmit={handleCreateSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Nome da Disciplina
                </label>
                <input
                  type="text"
                  placeholder="Ex: Química Orgânica, Direito Constitucional..."
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Cor Tema</label>
                <div className="flex items-center gap-2">
                  {['#10B981', '#6366F1', '#F59E0B', '#0EA5E9', '#EC4899', '#8B5CF6'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewSubjectColor(c)}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        newSubjectColor === c ? 'scale-110 border-stone-800' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddSubjectOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                >
                  Criar Disciplina
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Topic */}
      {activeTopicModalSubId && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-stone-800 mb-3">Adicionar Tópico</h3>
            <form onSubmit={handleCreateTopic} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Título do Tópico / Assunto
                </label>
                <input
                  type="text"
                  placeholder="Ex: Leis de Newton, Funções Orgânicas..."
                  value={newTopicTitle}
                  onChange={(e) => setNewTopicTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500"
                  autoFocus
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTopicModalSubId(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                >
                  Salvar Tópico
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Material */}
      {activeMaterialModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-base font-bold text-stone-800 mb-3">Novo Recurso de Estudo</h3>
            <form onSubmit={handleCreateMaterial} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Título do Material
                </label>
                <input
                  type="text"
                  placeholder="Ex: Resumo de Fórmulas, Link da Videoaula..."
                  value={newMaterialTitle}
                  onChange={(e) => setNewMaterialTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Tipo</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setNewMaterialType('note')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                      newMaterialType === 'note'
                        ? 'bg-violet-50 text-violet-900 border-violet-300 font-semibold'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    📝 Resumo/Nota
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMaterialType('link')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                      newMaterialType === 'link'
                        ? 'bg-sky-50 text-sky-900 border-sky-300 font-semibold'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    🔗 Link Web
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewMaterialType('flashcard')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border ${
                      newMaterialType === 'flashcard'
                        ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                        : 'bg-stone-50 text-stone-600 border-stone-200'
                    }`}
                  >
                    💡 Flashcard
                  </button>
                </div>
              </div>

              {newMaterialType === 'link' && (
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    URL / Link da Aula
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newMaterialUrl}
                    onChange={(e) => setNewMaterialUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Conteúdo / Anotações
                </label>
                <textarea
                  rows={3}
                  placeholder="Escreva pontos principais, fórmulas ou detalhes do material..."
                  value={newMaterialContent}
                  onChange={(e) => setNewMaterialContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveMaterialModal(null)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-stone-600 hover:bg-stone-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                >
                  Salvar Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
