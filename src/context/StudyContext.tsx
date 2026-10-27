import React, { createContext, useContext, useEffect, useState, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  ActivityChecklistItem,
  Badge,
  DailyGoalConfig,
  PriorityLevel,
  StudyActivity,
  StudyMaterial,
  StudySession,
  Subject,
  ToastMessage,
  UserProfile,
} from '../types';
import {
  ALL_BADGES,
  formatDateKey,
  INITIAL_ACTIVITIES,
  INITIAL_GOALS_CONFIG,
  INITIAL_SESSIONS,
  INITIAL_SUBJECTS,
  INITIAL_USER_PROFILE,
} from '../data/initialData';
import {
  isSoundEnabled,
  playCheckmarkSound,
  playSuccessChime,
  playTimerBell,
  setSoundEnabled,
} from '../utils/audio';

// Bumped storage key so the user starts with clean 0 XP, 0 streak, and empty task list
const STORAGE_KEY = 'lumina_study_v2';

export const calculateLevel = (totalXp: number): { level: number; nextLevelXp: number } => {
  const XP_PER_LEVEL = 150;
  const level = Math.max(1, Math.floor(totalXp / XP_PER_LEVEL) + 1);
  const nextLevelXp = level * XP_PER_LEVEL;
  return { level, nextLevelXp };
};

interface StudyContextType {
  // Navigation
  activeTab: 'dashboard' | 'schedule' | 'materials' | 'progress' | 'badges' | 'profile';
  setActiveTab: (tab: 'dashboard' | 'schedule' | 'materials' | 'progress' | 'badges' | 'profile') => void;

  // Activities & Schedule
  activities: StudyActivity[];
  addActivity: (activity: Omit<StudyActivity, 'id' | 'orderIndex'>) => void;
  updateActivity: (activity: StudyActivity) => void;
  deleteActivity: (id: string) => void;
  toggleActivityComplete: (id: string) => void;
  toggleChecklistItem: (activityId: string, itemId: string) => void;
  addChecklistItem: (activityId: string, text: string) => void;
  removeChecklistItem: (activityId: string, itemId: string) => void;
  sortActivitiesByPriority: (date: string) => void;

  // Deletion with Confirmation Modals
  activityToDelete: StudyActivity | null;
  requestDeleteActivity: (activity: StudyActivity) => void;
  confirmDeleteActivity: () => void;
  cancelDeleteActivity: () => void;
  isClearCompletedModalOpen: boolean;
  requestClearCompleted: (date?: string) => void;
  confirmClearCompleted: () => void;
  cancelClearCompleted: () => void;

  // Subjects & Materials
  subjects: Subject[];
  addSubject: (name: string, color: string) => void;
  addTopic: (subjectId: string, title: string) => void;
  toggleTopicComplete: (subjectId: string, topicId: string) => void;
  addMaterial: (subjectId: string, topicId: string, material: Omit<StudyMaterial, 'id'>) => void;

  // Sessions & Metrics
  sessions: StudySession[];
  recordSession: (subjectId: string, durationMinutes: number, isPomodoro: boolean, activityId?: string) => void;

  // Gamification & Profile
  userProfile: UserProfile;
  updateProfile: (name: string, email: string, avatarUrl?: string) => void;
  registerAccount: (email: string, name?: string) => void;
  syncDeviceData: (syncCode: string) => boolean;
  resetAllData: () => void;
  badges: Badge[];
  newlyUnlockedBadge: Badge | null;
  clearNewlyUnlockedBadge: () => void;
  useStreakFreeze: () => void;
  goalsConfig: DailyGoalConfig;
  updateGoalsConfig: (config: DailyGoalConfig) => void;

  // Timer
  timer: {
    isActive: boolean;
    mode: 'pomodoro' | 'free';
    secondsRemaining: number;
    totalSecondsInCycle: number;
    activeActivityId: string | null;
    pomodoroCycleCount: number;
  };
  startTimer: (activityId?: string) => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  finishTimerManually: () => void;
  setTimerMode: (mode: 'pomodoro' | 'free') => void;

  // Modals & Feedback
  isActivityModalOpen: boolean;
  openActivityModal: (activityToEdit?: StudyActivity) => void;
  closeActivityModal: () => void;
  editingActivity: StudyActivity | null;
  isGoalModalOpen: boolean;
  openGoalModal: () => void;
  closeGoalModal: () => void;

  // Sound & Toast
  isSoundMuted: boolean;
  toggleSoundMute: () => void;
  toast: ToastMessage | null;
  showToast: (message: string, type?: 'xp' | 'success' | 'info', points?: number) => void;
  triggerConfetti: () => void;

  // Backup
  exportData: () => void;
  importData: (jsonStr: string) => boolean;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'materials' | 'progress' | 'badges' | 'profile'>('dashboard');

  // Core Data States
  const [activities, setActivities] = useState<StudyActivity[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_subjects`);
      return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
    } catch {
      return INITIAL_SUBJECTS;
    }
  });

  const [sessions, setSessions] = useState<StudySession[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_sessions`);
      return saved ? JSON.parse(saved) : INITIAL_SESSIONS;
    } catch {
      return INITIAL_SESSIONS;
    }
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_profile`);
      if (saved) {
        const parsed = JSON.parse(saved);
        const { level, nextLevelXp } = calculateLevel(parsed.currentXp || 0);
        return {
          ...parsed,
          level,
          nextLevelXp,
        };
      }
      return INITIAL_USER_PROFILE;
    } catch {
      return INITIAL_USER_PROFILE;
    }
  });

  const [goalsConfig, setGoalsConfig] = useState<DailyGoalConfig>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_goals`);
      return saved ? JSON.parse(saved) : INITIAL_GOALS_CONFIG;
    } catch {
      return INITIAL_GOALS_CONFIG;
    }
  });

  // Sound, Modals & Deletion States
  const [isSoundMuted, setIsSoundMuted] = useState<boolean>(!isSoundEnabled());
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<StudyActivity | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Deletion confirmation states
  const [activityToDelete, setActivityToDelete] = useState<StudyActivity | null>(null);
  const [isClearCompletedModalOpen, setIsClearCompletedModalOpen] = useState(false);
  const [targetClearDate, setTargetClearDate] = useState<string | undefined>(undefined);

  // Live Refs to prevent stale closures and infinite re-evaluations
  const userProfileRef = useRef(userProfile);
  userProfileRef.current = userProfile;

  const sessionsRef = useRef(sessions);
  sessionsRef.current = sessions;

  const activitiesRef = useRef(activities);
  activitiesRef.current = activities;

  // Timer State
  const POMODORO_DEFAULT_SECONDS = 25 * 60;
  const [timer, setTimer] = useState({
    isActive: false,
    mode: 'pomodoro' as 'pomodoro' | 'free',
    secondsRemaining: POMODORO_DEFAULT_SECONDS,
    totalSecondsInCycle: POMODORO_DEFAULT_SECONDS,
    activeActivityId: null as string | null,
    pomodoroCycleCount: 0,
  });

  // Save to LocalStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
      localStorage.setItem(`${STORAGE_KEY}_subjects`, JSON.stringify(subjects));
      localStorage.setItem(`${STORAGE_KEY}_sessions`, JSON.stringify(sessions));
      localStorage.setItem(`${STORAGE_KEY}_profile`, JSON.stringify(userProfile));
      localStorage.setItem(`${STORAGE_KEY}_goals`, JSON.stringify(goalsConfig));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }, [activities, subjects, sessions, userProfile, goalsConfig]);

  // Confetti helper
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#A7F3D0', '#DDD6FE', '#FECDD3', '#BAE6FD', '#FDE68A'],
      });
    } catch {
      // safe fallback
    }
  };

  // Toast helper
  const showToast = (message: string, type: 'xp' | 'success' | 'info' = 'xp', points?: number) => {
    setToast({
      id: Math.random().toString(),
      message,
      type,
      points,
    });
    setTimeout(() => {
      setToast(null);
    }, 2800);
  };

  // Sound mute toggle
  const toggleSoundMute = () => {
    const nextState = !isSoundMuted;
    setIsSoundMuted(nextState);
    setSoundEnabled(!nextState);
  };

  // Deterministic, Safe XP Engine (NO recursive loops!)
  const addXp = (amount: number, reason: string) => {
    if (amount <= 0) return;

    setUserProfile((prev) => {
      const newXp = prev.currentXp + amount;
      const { level: newLevel, nextLevelXp } = calculateLevel(newXp);
      const leveledUp = newLevel > prev.level;

      if (leveledUp) {
        playSuccessChime();
        triggerConfetti();
        showToast(`🎉 Parabéns! Você subiu para o Nível ${newLevel}!`, 'success');
      } else if (reason) {
        showToast(`+${amount} XP ${reason}`, 'xp', amount);
      }

      return {
        ...prev,
        level: newLevel,
        currentXp: newXp,
        nextLevelXp,
      };
    });
  };

  // Safe Badge Checker - runs only when triggered, NEVER calls addXp recursively
  const checkAndAwardBadges = () => {
    const currentProfile = userProfileRef.current;
    const currentSessions = sessionsRef.current;
    const currentActivities = activitiesRef.current;
    const unlocked = new Set(currentProfile.unlockedBadgeIds);
    const newlyUnlocked: Badge[] = [];

    for (const badge of ALL_BADGES) {
      if (unlocked.has(badge.id)) continue;

      let eligible = false;
      if (badge.id === 'b_first_step' && currentSessions.length >= 1) eligible = true;
      else if (badge.id === 'b_iron_focus') {
        const todayStr = formatDateKey(new Date());
        const pomos = currentSessions.filter((s) => s.date === todayStr && s.isPomodoro).length;
        if (pomos >= 4) eligible = true;
      } else if (badge.id === 'b_dragon_slayer') {
        const highDone = currentActivities.filter((a) => a.priority === 'high' && a.completed).length;
        if (highDone >= 10) eligible = true;
      } else if (badge.id === 'b_detail_master') {
        const actsWithAllChecklistDone = currentActivities.filter(
          (a) => a.checklist.length > 0 && a.checklist.every((c) => c.completed)
        ).length;
        if (actsWithAllChecklistDone >= 5) eligible = true;
      } else if (badge.id === 'b_checklist_30') {
        let totalChecked = 0;
        currentActivities.forEach((a) => {
          totalChecked += a.checklist.filter((c) => c.completed).length;
        });
        if (totalChecked >= 30) eligible = true;
      } else if (badge.id === 'b_streak_7' && currentProfile.currentStreak >= 7) {
        eligible = true;
      } else if (badge.id === 'b_streak_30' && currentProfile.currentStreak >= 30) {
        eligible = true;
      } else if (badge.id === 'b_polymath') {
        const uniqueSubjects = new Set(currentSessions.map((s) => s.subjectId));
        if (uniqueSubjects.size >= 4) eligible = true;
      } else if (badge.id === 'b_century_hours') {
        const totalMinutes = currentSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
        if (totalMinutes >= 6000) eligible = true;
      }

      if (eligible) {
        newlyUnlocked.push(badge);
        unlocked.add(badge.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      const totalBonusXp = newlyUnlocked.reduce((acc, b) => acc + b.xpReward, 0);
      const newBadgeIds = newlyUnlocked.map((b) => b.id);

      setUserProfile((prev) => {
        const newXp = prev.currentXp + totalBonusXp;
        const { level: newLevel, nextLevelXp } = calculateLevel(newXp);
        return {
          ...prev,
          level: newLevel,
          currentXp: newXp,
          nextLevelXp,
          unlockedBadgeIds: [...prev.unlockedBadgeIds, ...newBadgeIds],
        };
      });

      setNewlyUnlockedBadge(newlyUnlocked[0]);
      playSuccessChime();
      triggerConfetti();
      showToast(
        `🏆 Emblema conquistado: ${newlyUnlocked[0].title}! (+${newlyUnlocked[0].xpReward} XP)`,
        'success'
      );
    }
  };

  const clearNewlyUnlockedBadge = () => setNewlyUnlockedBadge(null);

  // Timer Tick Interval
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (timer.isActive) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev.mode === 'pomodoro') {
            if (prev.secondsRemaining <= 1) {
              playTimerBell();
              triggerConfetti();
              const activeAct = activities.find((a) => a.id === prev.activeActivityId);
              const subjectId = activeAct ? activeAct.subjectId : subjects[0]?.id || 'sub_mat';
              recordSession(subjectId, 25, true, prev.activeActivityId || undefined);

              return {
                ...prev,
                isActive: false,
                secondsRemaining: POMODORO_DEFAULT_SECONDS,
                pomodoroCycleCount: prev.pomodoroCycleCount + 1,
              };
            }
            return { ...prev, secondsRemaining: prev.secondsRemaining - 1 };
          } else {
            return {
              ...prev,
              secondsRemaining: prev.secondsRemaining + 1,
            };
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer.isActive, timer.mode, timer.activeActivityId, activities, subjects]);

  const startTimer = (activityId?: string) => {
    setTimer((prev) => ({
      ...prev,
      isActive: true,
      activeActivityId: activityId !== undefined ? activityId : prev.activeActivityId,
    }));
  };

  const pauseTimer = () => {
    setTimer((prev) => ({ ...prev, isActive: false }));
  };

  const resetTimer = () => {
    setTimer((prev) => ({
      ...prev,
      isActive: false,
      secondsRemaining: prev.mode === 'pomodoro' ? POMODORO_DEFAULT_SECONDS : 0,
    }));
  };

  const setTimerMode = (mode: 'pomodoro' | 'free') => {
    setTimer((prev) => ({
      ...prev,
      isActive: false,
      mode,
      secondsRemaining: mode === 'pomodoro' ? POMODORO_DEFAULT_SECONDS : 0,
      totalSecondsInCycle: mode === 'pomodoro' ? POMODORO_DEFAULT_SECONDS : 0,
    }));
  };

  const finishTimerManually = () => {
    if (timer.mode === 'free' && timer.secondsRemaining >= 60) {
      const minutes = Math.floor(timer.secondsRemaining / 60);
      const activeAct = activities.find((a) => a.id === timer.activeActivityId);
      const subjectId = activeAct ? activeAct.subjectId : subjects[0]?.id || 'sub_mat';
      recordSession(subjectId, minutes, false, timer.activeActivityId || undefined);
    } else if (timer.mode === 'pomodoro') {
      const elapsed = timer.totalSecondsInCycle - timer.secondsRemaining;
      if (elapsed >= 60) {
        const minutes = Math.floor(elapsed / 60);
        const activeAct = activities.find((a) => a.id === timer.activeActivityId);
        const subjectId = activeAct ? activeAct.subjectId : subjects[0]?.id || 'sub_mat';
        recordSession(subjectId, minutes, false, timer.activeActivityId || undefined);
      }
    }
    resetTimer();
  };

  // Record a completed study session
  const recordSession = (subjectId: string, durationMinutes: number, isPomodoro: boolean, activityId?: string) => {
    const todayStr = formatDateKey(new Date());
    const activity = activities.find((a) => a.id === activityId);

    let xp = durationMinutes;
    if (activity?.priority === 'high') {
      xp = Math.round(xp * 1.5);
    }
    if (isPomodoro) {
      xp += 25;
    }

    const newSession: StudySession = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      activityId,
      subjectId,
      date: todayStr,
      durationMinutes,
      xpEarned: xp,
      isPomodoro,
      createdAt: new Date().toISOString(),
    };

    setSessions((prev) => [newSession, ...prev]);
    setUserProfile((prev) => {
      // Advance streak if daily goal is achieved
      const newTotal = prev.totalMinutes + durationMinutes;
      const todayTotal = sessions
        .filter((s) => s.date === todayStr)
        .reduce((acc, s) => acc + s.durationMinutes, 0) + durationMinutes;
      const todayTarget = goalsConfig.defaultMinutes || 120;
      const newStreak = todayTotal >= todayTarget && prev.currentStreak === 0 ? 1 : prev.currentStreak;

      return {
        ...prev,
        totalMinutes: newTotal,
        currentStreak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      };
    });

    addXp(xp, `por ${durationMinutes} min de foco!`);
    playCheckmarkSound();
    setTimeout(checkAndAwardBadges, 100);
  };

  // Activity CRUD
  const addActivity = (actData: Omit<StudyActivity, 'id' | 'orderIndex'>) => {
    const newAct: StudyActivity = {
      ...actData,
      id: `act_${Date.now()}`,
      orderIndex: activities.length,
    };
    setActivities((prev) => [newAct, ...prev]);
    showToast('Atividade adicionada ao cronograma!', 'info');
  };

  const updateActivity = (act: StudyActivity) => {
    setActivities((prev) => prev.map((a) => (a.id === act.id ? act : a)));
    showToast('Atividade atualizada!', 'info');
  };

  // Direct delete
  const deleteActivity = (id: string) => {
    setActivities((prev) => prev.filter((a) => a.id !== id));
    showToast('Atividade removida com sucesso.', 'info');
  };

  // Safe Removal with Confirmation Modal
  const requestDeleteActivity = (activity: StudyActivity) => {
    setActivityToDelete(activity);
  };

  const confirmDeleteActivity = () => {
    if (activityToDelete) {
      deleteActivity(activityToDelete.id);
      setActivityToDelete(null);
    }
  };

  const cancelDeleteActivity = () => {
    setActivityToDelete(null);
  };

  // Clear completed activities
  const requestClearCompleted = (date?: string) => {
    setTargetClearDate(date);
    setIsClearCompletedModalOpen(true);
  };

  const confirmClearCompleted = () => {
    setActivities((prev) => {
      if (targetClearDate) {
        return prev.filter((a) => !(a.completed && a.scheduledDate === targetClearDate));
      }
      return prev.filter((a) => !a.completed);
    });
    setIsClearCompletedModalOpen(false);
    setTargetClearDate(undefined);
    showToast('Atividades concluídas foram removidas.', 'info');
  };

  const cancelClearCompleted = () => {
    setIsClearCompletedModalOpen(false);
    setTargetClearDate(undefined);
  };

  const toggleActivityComplete = (id: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === id) {
          const nextCompleted = !act.completed;
          if (nextCompleted) {
            playSuccessChime();
            triggerConfetti();
            let bonusXp = 15;
            if (act.priority === 'high') bonusXp = 45;
            if (act.priority === 'medium') bonusXp = 25;
            addXp(bonusXp, `por concluir atividade (${act.priority.toUpperCase()})!`);
            setTimeout(checkAndAwardBadges, 100);
          }
          return {
            ...act,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
        }
        return act;
      })
    );
  };

  // Nested Checklist Actions
  const toggleChecklistItem = (activityId: string, itemId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          let wasUncheckedNowChecked = false;
          const updatedChecklist = act.checklist.map((item) => {
            if (item.id === itemId) {
              const nextVal = !item.completed;
              if (nextVal) wasUncheckedNowChecked = true;
              return {
                ...item,
                completed: nextVal,
                completedAt: nextVal ? new Date().toISOString() : undefined,
              };
            }
            return item;
          });

          if (wasUncheckedNowChecked) {
            playCheckmarkSound();
            addXp(5, 'pelo item de checklist marcado!');
          }

          const allCompleted = updatedChecklist.length > 0 && updatedChecklist.every((i) => i.completed);
          if (allCompleted && !act.completed) {
            addXp(20, 'por finalizar toda a lista da atividade!');
            setTimeout(checkAndAwardBadges, 100);
          }

          return {
            ...act,
            checklist: updatedChecklist,
          };
        }
        return act;
      })
    );
  };

  const addChecklistItem = (activityId: string, text: string) => {
    if (!text.trim()) return;
    const newItem: ActivityChecklistItem = {
      id: `chk_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      text: text.trim(),
      completed: false,
    };
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          return {
            ...act,
            checklist: [...act.checklist, newItem],
          };
        }
        return act;
      })
    );
  };

  const removeChecklistItem = (activityId: string, itemId: string) => {
    setActivities((prev) =>
      prev.map((act) => {
        if (act.id === activityId) {
          return {
            ...act,
            checklist: act.checklist.filter((i) => i.id !== itemId),
          };
        }
        return act;
      })
    );
  };

  // Sort activities by priority: High -> Medium -> Low
  const sortActivitiesByPriority = (date: string) => {
    const priorityWeight: Record<PriorityLevel, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };

    setActivities((prev) => {
      const otherDates = prev.filter((a) => a.scheduledDate !== date);
      const targetDateActivities = prev.filter((a) => a.scheduledDate === date);

      targetDateActivities.sort((a, b) => {
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      });

      return [...targetDateActivities, ...otherDates];
    });
    showToast('Atividades organizadas por prioridade máxima!', 'info');
  };

  // Subject Actions
  const addSubject = (name: string, color: string) => {
    const newSubject: Subject = {
      id: `sub_${Date.now()}`,
      name,
      color,
      bgPastel: 'bg-emerald-50/80',
      borderPastel: 'border-emerald-200/80',
      textPastel: 'text-emerald-900',
      topics: [],
    };
    setSubjects((prev) => [...prev, newSubject]);
    showToast(`Disciplina "${name}" criada!`, 'success');
  };

  const addTopic = (subjectId: string, title: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: [
              ...sub.topics,
              {
                id: `top_${Date.now()}`,
                title,
                completed: false,
                materials: [],
              },
            ],
          };
        }
        return sub;
      })
    );
  };

  const toggleTopicComplete = (subjectId: string, topicId: string) => {
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.map((t) => {
              if (t.id === topicId) {
                const nextState = !t.completed;
                if (nextState) {
                  playCheckmarkSound();
                  addXp(15, 'pelo tópico dominado!');
                  setTimeout(checkAndAwardBadges, 100);
                }
                return { ...t, completed: nextState };
              }
              return t;
            }),
          };
        }
        return sub;
      })
    );
  };

  const addMaterial = (subjectId: string, topicId: string, material: Omit<StudyMaterial, 'id'>) => {
    const newMat: StudyMaterial = {
      ...material,
      id: `mat_${Date.now()}`,
    };
    setSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id === subjectId) {
          return {
            ...sub,
            topics: sub.topics.map((top) => {
              if (top.id === topicId) {
                return {
                  ...top,
                  materials: [...top.materials, newMat],
                };
              }
              return top;
            }),
          };
        }
        return sub;
      })
    );
    showToast('Material cadastrado!', 'success');
  };

  // Profile Management Actions
  const updateProfile = (name: string, email: string, avatarUrl?: string) => {
    setUserProfile((prev) => ({
      ...prev,
      name: name.trim() || prev.name,
      email: email.trim(),
      avatarUrl: avatarUrl !== undefined ? avatarUrl : prev.avatarUrl,
    }));
    showToast('Perfil atualizado com sucesso!', 'success');
  };

  const registerAccount = (email: string, name?: string) => {
    const syncCode = `LUMINA-SYNC-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setUserProfile((prev) => ({
      ...prev,
      email: email.trim(),
      name: name?.trim() || prev.name,
      syncId: syncCode,
      isRegistered: true,
    }));
    playSuccessChime();
    triggerConfetti();
    showToast('Conta cadastrada com sucesso! Sincronização ativada.', 'success');
  };

  const syncDeviceData = (syncCode: string): boolean => {
    if (!syncCode.trim()) {
      showToast('Por favor, informe o código de sincronização.', 'info');
      return false;
    }
    // Update local profile with the sync code
    setUserProfile((prev) => ({
      ...prev,
      syncId: syncCode.trim().toUpperCase(),
      isRegistered: true,
    }));
    playSuccessChime();
    showToast(`Dispositivo conectado ao código ${syncCode.trim().toUpperCase()}!`, 'success');
    return true;
  };

  // Reset all user data, XP, streak, activities and sessions to zero
  const resetAllData = () => {
    setActivities([]);
    setSessions([]);
    setUserProfile({
      ...INITIAL_USER_PROFILE,
      name: userProfile.name || 'Estudante',
      email: userProfile.email || '',
      avatarUrl: userProfile.avatarUrl || '🌸',
    });
    setGoalsConfig(INITIAL_GOALS_CONFIG);
    try {
      localStorage.removeItem(`${STORAGE_KEY}_activities`);
      localStorage.removeItem(`${STORAGE_KEY}_sessions`);
      localStorage.removeItem(`${STORAGE_KEY}_profile`);
    } catch {
      // safe
    }
    showToast('Pontuações, ofensivas e tarefas foram zeradas com sucesso!', 'info');
  };

  // Streak Freeze Use
  const useStreakFreeze = () => {
    if (userProfile.streakFreezes <= 0) {
      showToast('Você não possui escudos de descanso disponíveis.', 'info');
      return;
    }
    setUserProfile((prev) => ({
      ...prev,
      streakFreezes: prev.streakFreezes - 1,
    }));
    playSuccessChime();
    showToast('🛡️ Escudo de descanso ativado! Sua ofensiva está protegida hoje.', 'success');
  };

  // Modals
  const openActivityModal = (actToEdit?: StudyActivity) => {
    setEditingActivity(actToEdit || null);
    setIsActivityModalOpen(true);
  };

  const closeActivityModal = () => {
    setIsActivityModalOpen(false);
    setEditingActivity(null);
  };

  const openGoalModal = () => setIsGoalModalOpen(true);
  const closeGoalModal = () => setIsGoalModalOpen(false);

  const updateGoalsConfig = (newConfig: DailyGoalConfig) => {
    setGoalsConfig(newConfig);
    showToast('Metas diárias atualizadas com sucesso!', 'success');
  };

  // Backup data
  const exportData = () => {
    const data = {
      activities,
      subjects,
      sessions,
      userProfile,
      goalsConfig,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumina_study_backup_${formatDateKey(new Date())}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Dados exportados com sucesso!', 'success');
  };

  const importData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.userProfile) {
        setActivities(parsed.activities || []);
        setSubjects(parsed.subjects || INITIAL_SUBJECTS);
        setSessions(parsed.sessions || []);
        const { level, nextLevelXp } = calculateLevel(parsed.userProfile.currentXp || 0);
        setUserProfile({
          ...parsed.userProfile,
          level,
          nextLevelXp,
        });
        if (parsed.goalsConfig) setGoalsConfig(parsed.goalsConfig);
        showToast('Dados restaurados com sucesso!', 'success');
        return true;
      }
      return false;
    } catch {
      showToast('Arquivo JSON inválido.', 'info');
      return false;
    }
  };

  const value = useMemo(
    () => ({
      activeTab,
      setActiveTab,
      activities,
      addActivity,
      updateActivity,
      deleteActivity,
      activityToDelete,
      requestDeleteActivity,
      confirmDeleteActivity,
      cancelDeleteActivity,
      isClearCompletedModalOpen,
      requestClearCompleted,
      confirmClearCompleted,
      cancelClearCompleted,
      toggleActivityComplete,
      toggleChecklistItem,
      addChecklistItem,
      removeChecklistItem,
      sortActivitiesByPriority,
      subjects,
      addSubject,
      addTopic,
      toggleTopicComplete,
      addMaterial,
      sessions,
      recordSession,
      userProfile,
      updateProfile,
      registerAccount,
      syncDeviceData,
      resetAllData,
      badges: ALL_BADGES,
      newlyUnlockedBadge,
      clearNewlyUnlockedBadge,
      useStreakFreeze,
      goalsConfig,
      updateGoalsConfig,
      timer,
      startTimer,
      pauseTimer,
      resetTimer,
      finishTimerManually,
      setTimerMode,
      isActivityModalOpen,
      openActivityModal,
      closeActivityModal,
      editingActivity,
      isGoalModalOpen,
      openGoalModal,
      closeGoalModal,
      isSoundMuted,
      toggleSoundMute,
      toast,
      showToast,
      triggerConfetti,
      exportData,
      importData,
    }),
    [
      activeTab,
      activities,
      activityToDelete,
      isClearCompletedModalOpen,
      subjects,
      sessions,
      userProfile,
      goalsConfig,
      timer,
      isActivityModalOpen,
      editingActivity,
      isGoalModalOpen,
      newlyUnlockedBadge,
      toast,
      isSoundMuted,
    ]
  );

  return <StudyContext.Provider value={value}>{children}</StudyContext.Provider>;
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
