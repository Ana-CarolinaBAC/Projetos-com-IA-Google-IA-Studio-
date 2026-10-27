/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { ScheduleView } from './components/ScheduleView';
import { MaterialsView } from './components/MaterialsView';
import { ProgressView } from './components/ProgressView';
import { BadgesView } from './components/BadgesView';
import { ProfileView } from './components/ProfileView';
import { ActivityModal } from './components/ActivityModal';
import { GoalModal } from './components/GoalModal';
import { BadgeUnlockedModal } from './components/BadgeUnlockedModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { Toast } from './components/Toast';

const MainAppContent: React.FC = () => {
  const { activeTab, setActiveTab, openActivityModal, openGoalModal } = useStudy();

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-800 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'schedule' && <ScheduleView />}
        {activeTab === 'materials' && <MaterialsView />}
        {activeTab === 'progress' && <ProgressView />}
        {activeTab === 'badges' && <BadgesView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Modals & Overlays */}
      <ActivityModal />
      <GoalModal />
      <ConfirmDeleteModal />
      <BadgeUnlockedModal />
      <Toast />

      {/* Subtle, Clean Footer */}
      <footer className="border-t border-stone-200/70 bg-white/60 py-6 mt-12 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            Lumina Study · Organização de estudos com gamificação, foco e bem-estar mental.
          </p>
          <div className="flex items-center gap-4 text-stone-600">
            <button
              onClick={() => setActiveTab('schedule')}
              className="hover:text-stone-900 transition-colors"
            >
              Cronograma
            </button>
            <span>·</span>
            <button
              onClick={openGoalModal}
              className="hover:text-stone-900 transition-colors"
            >
              Metas Diárias
            </button>
            <span>·</span>
            <button
              onClick={() => setActiveTab('badges')}
              className="hover:text-stone-900 transition-colors"
            >
              Emblemas
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <StudyProvider>
      <MainAppContent />
    </StudyProvider>
  );
}
