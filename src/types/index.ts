export type PriorityLevel = 'high' | 'medium' | 'low';

export interface ActivityChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: string;
}

export interface StudyActivity {
  id: string;
  title: string;
  subjectId: string;
  priority: PriorityLevel;
  scheduledDate: string; // YYYY-MM-DD
  durationMinutes: number;
  completed: boolean;
  completedAt?: string;
  checklist: ActivityChecklistItem[];
  notes?: string;
  orderIndex: number;
}

export interface StudyMaterial {
  id: string;
  title: string;
  type: 'link' | 'note' | 'flashcard';
  content: string;
  url?: string;
}

export interface SubjectTopic {
  id: string;
  title: string;
  completed: boolean;
  materials: StudyMaterial[];
}

export interface Subject {
  id: string;
  name: string;
  color: string;
  bgPastel: string;
  borderPastel: string;
  textPastel: string;
  topics: SubjectTopic[];
}

export interface StudySession {
  id: string;
  activityId?: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  xpEarned: number;
  isPomodoro: boolean;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  currentStreak: number;
  bestStreak: number;
  streakFreezes: number;
  unlockedBadgeIds: string[];
  totalMinutes: number;
  syncId?: string;
  isRegistered?: boolean;
}

export interface DailyGoalConfig {
  defaultMinutes: number;
  defaultPomodoros: number;
  customDays: {
    [dayOfWeek: number]: number; // 0 = Sunday, 1 = Monday, etc.
  };
}

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  rarity: BadgeRarity;
  xpReward: number;
  category: 'focus' | 'streak' | 'priority' | 'checklist' | 'mastery';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'xp' | 'success' | 'info';
  points?: number;
}
