/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import {
  BookOpen,
  History,
  Home,
  ScanLine,
  User,
  WifiOff,
} from 'lucide-react';
import { CareAssistantPanel } from './components/CareAssistantPanel';
import { DiagnoseView } from './components/DiagnoseView';
import { DiagnosisReportView } from './components/DiagnosisReportView';
import { HistoryView } from './components/HistoryView';
import { HomeView } from './components/HomeView';
import { PlantLibraryView } from './components/PlantLibraryView';
import { ProfileView } from './components/ProfileView';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { usePWAInstall } from './hooks/usePWAInstall';
import type { DiagnosisResult, NavTab, UserProfile } from './types';

const HISTORY_STORAGE_KEY = 'ai_plant_doctor_web_history_v1';
const PROFILE_STORAGE_KEY = 'ai_plant_doctor_web_profile_v1';

const DEFAULT_PROFILE: UserProfile = {
  name: 'Grower',
  location: 'Smallholder Farm',
  role: 'Farmer & Gardener',
  units: 'Metric',
  autoSaveHistory: true,
  wateringReminders: true,
  diseaseAlerts: true,
  followUpReminders: true,
};

function loadInitialHistory(): DiagnosisResult[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function loadInitialProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (!raw) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PROFILE;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [history, setHistory] = useState<DiagnosisResult[]>(loadInitialHistory);
  const [profile, setProfile] = useState<UserProfile>(loadInitialProfile);
  const [activeReport, setActiveReport] = useState<DiagnosisResult | null>(null);
  const [autoTrigger, setAutoTrigger] = useState<'camera' | 'gallery' | null>(null);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [assistantCrop, setAssistantCrop] = useState<string | undefined>(undefined);

  const isOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
      // If storage quota is tight, trim oldest thumbnail-heavy entries
      if (history.length > 1) {
        try {
          localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 12)));
        } catch {
          // Ignore storage quota failure gracefully
        }
      }
    }
  }, [history]);

  useEffect(() => {
    try {
      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // Ignore storage error
    }
  }, [profile]);

  const handleSaveDiagnosis = (result: DiagnosisResult) => {
    setHistory((prev) => [result, ...prev.filter((item) => item.id !== result.id)]);
  };

  const handleDeleteDiagnosis = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
    if (activeReport?.id === id) {
      setActiveReport(null);
    }
  };

  const openDiagnoseFlow = (trigger?: 'camera' | 'gallery') => {
    setActiveReport(null);
    setAutoTrigger(trigger ?? null);
    setActiveTab('diagnose');
  };

  const openAssistant = (cropName?: string) => {
    setAssistantCrop(cropName);
    setAssistantOpen(true);
  };

  const switchTab = (tab: NavTab) => {
    setActiveReport(null);
    setActiveTab(tab);
  };

  const navItems: Array<{ id: NavTab; label: string; Icon: typeof Home }> = [
    { id: 'home', label: 'Home', Icon: Home },
    { id: 'diagnose', label: 'Diagnose', Icon: ScanLine },
    { id: 'library', label: 'Plant Library', Icon: BookOpen },
    { id: 'history', label: 'History', Icon: History },
    { id: 'profile', label: 'Profile', Icon: User },
  ];

  const isSavedReport = activeReport
    ? history.some((item) => item.id === activeReport.id)
    : false;

  return (
    <div className="min-h-screen bg-[#F6FAF6] text-[#0F2417] pb-20 md:pb-8">
      <header className="sticky top-0 z-30 border-b border-[#DCE8DE] bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:h-16 lg:px-8">
          <button
            type="button"
            onClick={() => switchTab('home')}
            className="text-lg font-bold tracking-tight text-[#14532D] whitespace-nowrap shrink-0"
          >
            AI Plant Doctor
          </button>

          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium"
          >
            {navItems.map(({ id, label }) => {
              const active = activeTab === id && !activeReport;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => switchTab(id)}
                  className={`py-1 transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'font-bold text-[#14532D] underline decoration-2 underline-offset-8'
                      : 'text-[#4B6353] hover:text-[#0F2417]'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => openDiagnoseFlow('camera')}
              className="min-h-[40px] rounded-xl bg-[#14532D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0"
            >
              Scan a Plant
            </button>
          </div>
        </div>
      </header>

      {!isOnline && (
        <div className="border-b border-[#FDE68A] bg-[#FFFBEB] px-4 py-2 text-center text-xs font-medium text-[#92400E]">
          <span className="inline-flex items-center gap-1.5">
            <WifiOff className="h-3.5 w-3.5" />
            Offline Mode — Plant Library and saved History remain available. Reconnect for Gemini
            diagnosis.
          </span>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {activeReport ? (
          <DiagnosisReportView
            result={activeReport}
            isSaved={isSavedReport}
            onSave={handleSaveDiagnosis}
            onBack={() => setActiveReport(null)}
            onAskAssistant={(crop) => openAssistant(crop)}
            onNewScan={() => openDiagnoseFlow()}
          />
        ) : activeTab === 'home' ? (
          <HomeView
            profile={profile}
            history={history}
            onStartCameraScan={() => openDiagnoseFlow('camera')}
            onStartGalleryUpload={() => openDiagnoseFlow('gallery')}
            onOpenAssistant={() => openAssistant()}
            onOpenLibrary={() => switchTab('library')}
            onOpenHistory={() => switchTab('history')}
            onSelectDiagnosis={(item) => setActiveReport(item)}
            isInstallable={isInstallable}
            isInstalled={isInstalled}
            onInstallPWA={() => {
              void install();
            }}
          />
        ) : activeTab === 'diagnose' ? (
          <DiagnoseView
            autoTrigger={autoTrigger}
            onConsumedTrigger={() => setAutoTrigger(null)}
            autoSaveHistory={profile.autoSaveHistory}
            onSaveDiagnosis={handleSaveDiagnosis}
            onDiagnosisReady={(result) => setActiveReport(result)}
          />
        ) : activeTab === 'library' ? (
          <PlantLibraryView
            onAskAssistantAboutPlant={(plantName) => openAssistant(plantName)}
          />
        ) : activeTab === 'history' ? (
          <HistoryView
            history={history}
            onSelect={(item) => setActiveReport(item)}
            onDelete={handleDeleteDiagnosis}
            onStartScan={() => openDiagnoseFlow()}
          />
        ) : (
          <ProfileView
            profile={profile}
            onSaveProfile={setProfile}
            isInstallable={isInstallable}
            isInstalled={isInstalled}
            isIOS={isIOS}
            onInstallPWA={() => {
              void install();
            }}
          />
        )}
      </main>

      <nav
        aria-label="Mobile Bottom Navigation"
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#DCE8DE] bg-white/95 backdrop-blur-md md:hidden"
      >
        <div className="grid h-16 grid-cols-5 items-center">
          {navItems.map(({ id, label, Icon }) => {
            const active = activeTab === id;
            const shortLabel = id === 'library' ? 'Library' : label;
            return (
              <button
                key={id}
                type="button"
                onClick={() => switchTab(id)}
                className={`flex min-h-[44px] flex-col items-center justify-center gap-1 transition-colors ${
                  active ? 'text-[#14532D]' : 'text-[#5A7263]'
                }`}
              >
                <Icon className={`h-5 w-5 ${active ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
                <span className={`text-[10px] tracking-tight ${active ? 'font-bold' : 'font-medium'}`}>
                  {shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <CareAssistantPanel
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        cropContext={assistantCrop}
        growerName={profile.name}
      />
    </div>
  );
}
