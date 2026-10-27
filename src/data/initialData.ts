import { Badge, DailyGoalConfig, StudyActivity, StudySession, Subject, UserProfile } from '../types';

// Helper to get formatted dates relative to today
const today = new Date();
export const formatDateKey = (d: Date): string => d.toISOString().split('T')[0];

const getPastDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(today.getDate() - daysAgo);
  return formatDateKey(d);
};

const getFutureDate = (daysAhead: number): string => {
  const d = new Date();
  d.setDate(today.getDate() + daysAhead);
  return formatDateKey(d);
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub_mat',
    name: 'Matemática & Lógica',
    color: '#6366F1', // Indigo
    bgPastel: 'bg-indigo-50/80',
    borderPastel: 'border-indigo-200/80',
    textPastel: 'text-indigo-900',
    topics: [
      {
        id: 'top_mat_1',
        title: 'Funções Quadráticas & Vértice da Parábola',
        completed: true,
        materials: [
          {
            id: 'mat_1',
            title: 'Fórmula de Bhaskara & Coordenadas do Vértice',
            type: 'note',
            content: 'Xv = -b/(2a), Yv = -Δ/(4a). Máximo ou mínimo dependendo do sinal de a.',
          },
          {
            id: 'mat_2',
            title: 'Resolução de 10 Questões do ENEM',
            type: 'link',
            content: 'Vídeo explicativo com gabarito comentado passo a passo.',
            url: 'https://youtube.com',
          },
        ],
      },
      {
        id: 'top_mat_2',
        title: 'Trigonometria no Triângulo Retângulo',
        completed: false,
        materials: [
          {
            id: 'mat_3',
            title: 'Tabela dos Ângulos Notáveis (30°, 45°, 60°)',
            type: 'flashcard',
            content: 'Seno: 1/2, √2/2, √3/2. Cosseno: √3/2, √2/2, 1/2. Tangente: √3/3, 1, √3.',
          },
        ],
      },
    ],
  },
  {
    id: 'sub_bio',
    name: 'Biologia & Fisiologia',
    color: '#10B981', // Emerald
    bgPastel: 'bg-emerald-50/80',
    borderPastel: 'border-emerald-200/80',
    textPastel: 'text-emerald-900',
    topics: [
      {
        id: 'top_bio_1',
        title: 'Genética Mendeliana & Cruzamentos',
        completed: true,
        materials: [
          {
            id: 'bio_1',
            title: 'Primeira Lei de Mendel (Segregação dos Fatores)',
            type: 'note',
            content: 'Cada caráter é determinado por um par de fatores que se separam na formação dos gametas.',
          },
        ],
      },
      {
        id: 'top_bio_2',
        title: 'Citologia & Respiração Celular',
        completed: false,
        materials: [
          {
            id: 'bio_2',
            title: 'Etapas: Glicólise, Ciclo de Krebs e Fosforilação Oxidativa',
            type: 'note',
            content: 'Glicólise ocorre no citoplasma; ciclo de Krebs e cadeia respiratória na mitocôndria.',
          },
        ],
      },
    ],
  },
  {
    id: 'sub_his',
    name: 'História & Sociedade',
    color: '#F59E0B', // Amber
    bgPastel: 'bg-amber-50/80',
    borderPastel: 'border-amber-200/80',
    textPastel: 'text-amber-900',
    topics: [
      {
        id: 'top_his_1',
        title: 'Revolução Francesa e Iluminismo',
        completed: false,
        materials: [
          {
            id: 'his_1',
            title: 'Linha do Tempo: 1789 a 1799',
            type: 'note',
            content: 'Queda da Bastilha, Declaração dos Direitos do Homem, Período do Terror e Golpe do 18 Brumário.',
          },
        ],
      },
    ],
  },
  {
    id: 'sub_fis',
    name: 'Física & Mecânica',
    color: '#0EA5E9', // Sky
    bgPastel: 'bg-sky-50/80',
    borderPastel: 'border-sky-200/80',
    textPastel: 'text-sky-900',
    topics: [
      {
        id: 'top_fis_1',
        title: 'Cinemática & Movimento Uniformemente Variado (MUV)',
        completed: false,
        materials: [
          {
            id: 'fis_1',
            title: 'Equação de Torricelli e Função Horária da Posição',
            type: 'flashcard',
            content: 'v² = v₀² + 2aΔs | s = s₀ + v₀t + (at²)/2',
          },
        ],
      },
    ],
  },
  {
    id: 'sub_red',
    name: 'Redação & Linguagens',
    color: '#EC4899', // Pink
    bgPastel: 'bg-pink-50/80',
    borderPastel: 'border-pink-200/80',
    textPastel: 'text-pink-900',
    topics: [
      {
        id: 'top_red_1',
        title: 'Estrutura Dissertativo-Argumentativa e Proposta de Intervenção',
        completed: true,
        materials: [
          {
            id: 'red_1',
            title: '5 Elementos da Conclusão: Agente, Ação, Meio/Modo, Efeito e Detalhamento',
            type: 'note',
            content: 'Quem faz? O que faz? Como faz? Para que faz? + 1 detalhamento específico.',
          },
        ],
      },
    ],
  },
];

export const INITIAL_ACTIVITIES: StudyActivity[] = [];

export const INITIAL_SESSIONS: StudySession[] = [];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Estudante',
  email: '',
  avatarUrl: '🌸',
  level: 1,
  currentXp: 0,
  nextLevelXp: 150,
  currentStreak: 0,
  bestStreak: 0,
  streakFreezes: 0,
  unlockedBadgeIds: [],
  totalMinutes: 0,
  syncId: 'LUMINA-SYNC-7742',
  isRegistered: false,
};

export const INITIAL_GOALS_CONFIG: DailyGoalConfig = {
  defaultMinutes: 120, // 2h diárias
  defaultPomodoros: 4,
  customDays: {
    0: 45,  // Domingo: revisão leve
    1: 120, // Segunda
    2: 120, // Terça
    3: 120, // Quarta
    4: 120, // Quinta
    5: 120, // Sexta
    6: 90,  // Sábado
  },
};

export const ALL_BADGES: Badge[] = [
  {
    id: 'b_first_step',
    title: 'Primeiro Passo',
    icon: '🌱',
    description: 'Concluiu a primeira sessão de estudos no Lumina Study.',
    rarity: 'common',
    xpReward: 50,
    category: 'focus',
  },
  {
    id: 'b_iron_focus',
    title: 'Foco de Aço',
    icon: '⚡',
    description: 'Completou 4 blocos de Pomodoro em um único dia.',
    rarity: 'common',
    xpReward: 100,
    category: 'focus',
  },
  {
    id: 'b_detail_master',
    title: 'Mestre dos Detalhes',
    icon: '📝',
    description: 'Concluiu todas as subtarefas da lista de 5 atividades.',
    rarity: 'common',
    xpReward: 120,
    category: 'checklist',
  },
  {
    id: 'b_dragon_slayer',
    title: 'Matador de Dragões',
    icon: '🎯',
    description: 'Concluiu 10 atividades marcadas como Alta Prioridade 🔴.',
    rarity: 'rare',
    xpReward: 300,
    category: 'priority',
  },
  {
    id: 'b_early_bird',
    title: 'Madrugador do Saber',
    icon: '🌅',
    description: 'Concluiu uma sessão de estudos focada antes das 07:30.',
    rarity: 'rare',
    xpReward: 150,
    category: 'focus',
  },
  {
    id: 'b_night_owl',
    title: 'Guardião Noturno',
    icon: '🦉',
    description: 'Finalizou uma sessão de estudos de qualidade após as 22:30.',
    rarity: 'rare',
    xpReward: 150,
    category: 'focus',
  },
  {
    id: 'b_streak_7',
    title: 'Chama Constante',
    icon: '🔥',
    description: 'Manteve uma sequência ininterrupta de 7 dias de estudos.',
    rarity: 'rare',
    xpReward: 250,
    category: 'streak',
  },
  {
    id: 'b_shield_used',
    title: 'Resiliência Estratégica',
    icon: '🛡️',
    description: 'Usou o Escudo de Descanso para folga planejada e manteve o foco.',
    rarity: 'rare',
    xpReward: 120,
    category: 'streak',
  },
  {
    id: 'b_subject_done',
    title: 'Módulo Conquistado',
    icon: '📚',
    description: 'Completou todos os tópicos de uma disciplina cadastrada.',
    rarity: 'rare',
    xpReward: 300,
    category: 'mastery',
  },
  {
    id: 'b_checklist_30',
    title: 'Checklist Impecável',
    icon: '📋',
    description: 'Marcou 30 itens de listas concluídos em suas atividades.',
    rarity: 'rare',
    xpReward: 250,
    category: 'checklist',
  },
  {
    id: 'b_polymath',
    title: 'Polímata Curioso',
    icon: '🌐',
    description: 'Estudou pelo menos 4 disciplinas distintas na mesma semana.',
    rarity: 'epic',
    xpReward: 400,
    category: 'mastery',
  },
  {
    id: 'b_deep_focus',
    title: 'Muralha de Concentração',
    icon: '🏰',
    description: 'Realizou uma sessão contínua de 90 minutos de foco puro.',
    rarity: 'epic',
    xpReward: 450,
    category: 'focus',
  },
  {
    id: 'b_perfect_week',
    title: 'Semana Perfeita',
    icon: '🎯',
    description: 'Bateu a meta diária estipulada em todos os 7 dias da semana.',
    rarity: 'epic',
    xpReward: 500,
    category: 'streak',
  },
  {
    id: 'b_prio_wall',
    title: 'Muralha de Prioridades',
    icon: '⚔️',
    description: 'Concluiu todas as atividades de Alta Prioridade de uma semana.',
    rarity: 'epic',
    xpReward: 600,
    category: 'priority',
  },
  {
    id: 'b_century_hours',
    title: 'Centurião do Saber',
    icon: '⏳',
    description: 'Acumulou mais de 100 horas líquidas registradas no aplicativo.',
    rarity: 'epic',
    xpReward: 800,
    category: 'mastery',
  },
  {
    id: 'b_marathon',
    title: 'Maratonista Lendário',
    icon: '🚀',
    description: 'Estudou mais de 6 horas líquidas produtivas em um único dia.',
    rarity: 'legendary',
    xpReward: 1000,
    category: 'focus',
  },
  {
    id: 'b_streak_30',
    title: 'Chama Imortal',
    icon: '👑',
    description: 'Alcançou a incrível marca de 30 dias consecutivos de ofensiva.',
    rarity: 'legendary',
    xpReward: 1500,
    category: 'streak',
  },
  {
    id: 'b_archmage',
    title: 'Arquimago Lumina',
    icon: '💎',
    description: 'Alcançou o Nível 30 de maestria acadêmica.',
    rarity: 'legendary',
    xpReward: 2000,
    category: 'mastery',
  },
];
