import React, { useState } from 'react';
import {
  User,
  Mail,
  Smartphone,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Save,
  Image as ImageIcon,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';

const PRESET_AVATARS = [
  { icon: '🌸', name: 'Flor de Cerejeira' },
  { icon: '🦉', name: 'Coruja Sábia' },
  { icon: '🦊', name: 'Raposa Focada' },
  { icon: '☕', name: 'Café & Livros' },
  { icon: '🚀', name: 'Astronauta' },
  { icon: '🌿', name: 'Folha Menta' },
  { icon: '📚', name: 'Pilha de Livros' },
  { icon: '🐱', name: 'Gatinho Estudioso' },
];

export const ProfileView: React.FC = () => {
  const { userProfile, updateProfile, registerAccount, syncDeviceData, resetAllData } = useStudy();

  const [name, setName] = useState(userProfile.name || 'Estudante');
  const [email, setEmail] = useState(userProfile.email || '');
  const [selectedAvatar, setSelectedAvatar] = useState(userProfile.avatarUrl || '🌸');
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [inputSyncCode, setInputSyncCode] = useState('');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAvatar = customAvatarUrl.trim() ? customAvatarUrl.trim() : selectedAvatar;
    updateProfile(name, email, finalAvatar);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    registerAccount(email, name);
  };

  const handleSyncSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputSyncCode.trim()) return;
    const success = syncDeviceData(inputSyncCode);
    if (success) {
      setInputSyncCode('');
    }
  };

  const handleCopySyncCode = () => {
    if (userProfile.syncId) {
      navigator.clipboard.writeText(userProfile.syncId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Banner */}
      <div className="bg-white border border-stone-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-100 to-pink-100 border border-violet-200/80 flex items-center justify-center text-3xl shadow-xs shrink-0">
            {userProfile.avatarUrl?.startsWith('http') ? (
              <img
                src={userProfile.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover rounded-2xl"
              />
            ) : (
              userProfile.avatarUrl || '🌸'
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-stone-800 tracking-tight">
                {userProfile.name || 'Meu Perfil'}
              </h1>
              {userProfile.isRegistered && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Sincronizado
                </span>
              )}
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {userProfile.email || 'Nenhum e-mail cadastrado ainda'} · Nível {userProfile.level} (
              {userProfile.currentXp} XP)
            </p>
          </div>
        </div>

        {/* Sync Code Pill */}
        {userProfile.syncId && (
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-[10px] text-stone-400 block font-medium">
                Código de Acesso Multi-Dispositivo
              </span>
              <span className="font-mono font-bold text-stone-800 tracking-wider">
                {userProfile.syncId}
              </span>
            </div>
            <button
              onClick={handleCopySyncCode}
              className="p-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors shadow-2xs"
              title="Copiar código para usar em outro dispositivo"
            >
              {isCopied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Grid: Profile Details & Multi-Device Access */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Edit Profile Form (7 cols) */}
        <div className="md:col-span-7 bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
            <User className="w-5 h-5 text-emerald-600" />
            <h2 className="text-sm font-bold text-stone-800">Dados do Perfil</h2>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Nome de Exibição
              </label>
              <input
                type="text"
                placeholder="Ex: Ana Carolina, Lucas..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                E-mail para Acesso
              </label>
              <input
                type="email"
                placeholder="seu-email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-emerald-500 font-medium"
              />
              <span className="text-[10px] text-stone-400 mt-1 block">
                Usado para salvar seu progresso e sincronizar com seu smartphone ou computador.
              </span>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-2">
                Escolha seu Avatar
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_AVATARS.map((av) => (
                  <button
                    key={av.icon}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av.icon);
                      setCustomAvatarUrl('');
                    }}
                    className={`py-2 rounded-xl text-xl flex items-center justify-center transition-all border ${
                      selectedAvatar === av.icon && !customAvatarUrl
                        ? 'bg-violet-50 border-violet-400 scale-105 shadow-2xs'
                        : 'bg-stone-50 border-stone-200/80 hover:bg-stone-100'
                    }`}
                    title={av.name}
                  >
                    {av.icon}
                  </button>
                ))}
              </div>

              {/* Or custom URL */}
              <div className="mt-3">
                <label className="block text-[11px] text-stone-500 mb-1 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-stone-400" />
                  Ou informe o link de uma foto/imagem personalizada (URL):
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-200 focus:outline-hidden focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 active:scale-95 transition-all shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Multi-Device Sync & Account (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          {/* Cadastro & Multi-Device Sync Card */}
          <div className="bg-white border border-stone-200/80 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <Smartphone className="w-5 h-5 text-violet-600" />
              <h2 className="text-sm font-bold text-stone-800">Acesso em Outros Dispositivos</h2>
            </div>

            {!userProfile.isRegistered ? (
              <form onSubmit={handleRegister} className="space-y-3">
                <p className="text-xs text-stone-600 leading-relaxed">
                  Cadastre seu e-mail para habilitar a chave de sincronização e acessar seus
                  cronogramas, checklists e matérias de qualquer aparelho.
                </p>
                <div>
                  <input
                    type="email"
                    placeholder="Digite seu e-mail para cadastro..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-200 focus:outline-hidden focus:border-violet-500 font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-700 transition-colors shadow-xs"
                >
                  Cadastrar & Ativar Sincronização
                </button>
              </form>
            ) : (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>Conta Ativa & Pronta</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 leading-relaxed">
                    Seus dados estão vinculados ao e-mail <strong>{userProfile.email}</strong> com
                    a chave <strong>{userProfile.syncId}</strong>.
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <label className="block text-xs font-semibold text-stone-700">
                    Conectar com Outro Aparelho
                  </label>
                  <p className="text-[11px] text-stone-500 leading-relaxed">
                    Possui outro celular ou computador com uma chave Lumina? Digite abaixo para
                    parear:
                  </p>
                  <form onSubmit={handleSyncSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ex: LUMINA-SYNC-XXXX"
                      value={inputSyncCode}
                      onChange={(e) => setInputSyncCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-stone-200 uppercase font-mono font-semibold"
                    />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors shrink-0"
                    >
                      Parear
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* Reset All Data Card */}
          <div className="bg-[#FAF8F5] border border-stone-200/80 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-bold text-stone-800">Zerar Pontuações & Tarefas</h3>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Deseja zerar seu XP, ofensivas e tarefas para iniciar um novo ciclo de estudos 100% limpo?
            </p>

            {!isResetConfirmOpen ? (
              <button
                type="button"
                onClick={() => setIsResetConfirmOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold transition-colors"
              >
                Zerar XP, Ofensiva e Tarefas
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs space-y-2">
                <p className="text-rose-800 font-semibold text-[11px]">
                  Tem certeza? Todo o XP, ofensiva e atividades serão resetados para zero.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      resetAllData();
                      setIsResetConfirmOpen(false);
                    }}
                    className="px-3 py-1 rounded-md bg-rose-600 text-white text-[11px] font-bold hover:bg-rose-700"
                  >
                    Sim, Zerar Tudo
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsResetConfirmOpen(false)}
                    className="px-3 py-1 rounded-md bg-white border border-stone-200 text-stone-600 text-[11px] font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
