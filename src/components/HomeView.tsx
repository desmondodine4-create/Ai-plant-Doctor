import React from 'react';
import {
  BookOpen,
  Camera,
  ChevronRight,
  Download,
  FileText,
  History,
  MessageSquare,
  Smartphone,
  Sprout,
  Upload,
} from 'lucide-react';
import type { DiagnosisResult, UserProfile } from '../types';

interface HomeViewProps {
  profile: UserProfile;
  history: DiagnosisResult[];
  onStartCameraScan: () => void;
  onStartGalleryUpload: () => void;
  onOpenAssistant: () => void;
  onOpenLibrary: () => void;
  onOpenHistory: () => void;
  onSelectDiagnosis: (item: DiagnosisResult) => void;
  isInstallable: boolean;
  isInstalled: boolean;
  onInstallPWA: () => void;
}

const PLANT_TIPS = [
  {
    title: 'Morning Watering Window',
    detail:
      'Irrigate root zones before 9:00 AM so leaf surfaces dry promptly in sunlight, preventing fungal spore germination.',
  },
  {
    title: 'Lower-Leaf Airflow Pruning',
    detail:
      'Trim yellowing lower leaves touching damp soil on tomatoes and peppers to stop rain-splash blight spores.',
  },
  {
    title: 'Tool Sanitation Between Plots',
    detail:
      'Wipe pruning knives or machetes with diluted alcohol or bleach solution after handling symptomatic crops.',
  },
];

export const HomeView: React.FC<HomeViewProps> = ({
  profile,
  history,
  onStartCameraScan,
  onStartGalleryUpload,
  onOpenAssistant,
  onOpenLibrary,
  onOpenHistory,
  onSelectDiagnosis,
  isInstallable,
  isInstalled,
  onInstallPWA,
}) => {
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-8 pb-8">
      <section className="overflow-hidden rounded-3xl border border-[#DCE8DE] bg-[#14532D] text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-stretch">
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7">
            <div>
              <p className="text-sm font-semibold text-[#BBF7D0]">
                {greeting}, {profile.name} · {profile.location}
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Diagnose Plant Health with Confidence
              </h1>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[#DCFCE7]">
                Capture or upload a photograph of any crop leaf, stem, or fruit for instant
                Gemini-powered disease identification, severity assessment, and practical
                treatment guidance.
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onStartCameraScan}
                className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl bg-[#22C55E] px-6 py-3 text-sm font-bold text-[#052E16] hover:bg-[#4ADE80] transition-colors whitespace-nowrap shrink-0"
              >
                <Camera className="h-5 w-5" />
                Scan a Plant
              </button>
              <button
                type="button"
                onClick={onStartGalleryUpload}
                className="inline-flex min-h-[48px] items-center gap-2.5 rounded-xl border border-[#86EFAC]/50 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors whitespace-nowrap shrink-0"
              >
                <Upload className="h-4 w-4" />
                Upload Plant Image
              </button>
            </div>
          </div>

          <div className="relative min-h-[220px] lg:col-span-5">
            <img
              src="/src/assets/images/hero_plant_doctor_1794854872001.jpg"
              alt="Healthy sunlit green tomato foliage inside a modern agricultural greenhouse"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#082414]/80 via-[#082414]/20 to-transparent lg:bg-gradient-to-r lg:from-[#14532D] lg:via-transparent lg:to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-xs font-medium text-[#ECFDF5]">
              AI Plant Doctor · Multimodal Crop Pathology & Care Guide
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Quick Access">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <button
            type="button"
            onClick={onOpenAssistant}
            className="flex min-h-[88px] items-center justify-between rounded-2xl border border-[#DCE8DE] bg-white p-5 text-left hover:border-[#86EFAC] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#14532D]">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0F2417]">Plant Care Assistant</h2>
                <p className="mt-0.5 text-xs text-[#4B6353]">
                  Ask watering, soil, or yellowing questions
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[#6B8574]" />
          </button>

          <button
            type="button"
            onClick={onOpenLibrary}
            className="flex min-h-[88px] items-center justify-between rounded-2xl border border-[#DCE8DE] bg-white p-5 text-left hover:border-[#86EFAC] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#14532D]">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0F2417]">Plant Library</h2>
                <p className="mt-0.5 text-xs text-[#4B6353]">
                  Tomato, Cassava, Maize, Cocoa & more
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[#6B8574]" />
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="flex min-h-[88px] items-center justify-between rounded-2xl border border-[#DCE8DE] bg-white p-5 text-left hover:border-[#86EFAC] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#DCFCE7] text-[#14532D]">
                <History className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#0F2417]">Saved History</h2>
                <p className="mt-0.5 font-mono tabular-nums text-xs text-[#4B6353]">
                  {history.length} saved {history.length === 1 ? 'report' : 'reports'}
                </p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-[#6B8574]" />
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F2417]">Recent Diagnosis History</h2>
            <button
              type="button"
              onClick={onOpenHistory}
              className="text-sm font-semibold text-[#14532D] hover:underline whitespace-nowrap shrink-0"
            >
              View All
            </button>
          </div>

          {history.length === 0 ? (
            <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-[#DCE8DE] bg-white p-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#16A34A]">
                  <Sprout className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F2417]">No plant scans saved yet</p>
                  <p className="mt-0.5 text-xs text-[#4B6353]">
                    Scan or upload a leaf photograph to create your first diagnosis report.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onStartCameraScan}
                className="min-h-[44px] rounded-xl bg-[#14532D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0"
              >
                Start First Scan
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {history.slice(0, 4).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onSelectDiagnosis(item)}
                  className="flex w-full items-center gap-4 rounded-2xl border border-[#DCE8DE] bg-white p-3.5 text-left hover:border-[#86EFAC] transition-colors"
                >
                  {item.imageDataUrl ? (
                    <img
                      src={item.imageDataUrl}
                      alt={item.plantName}
                      referrerPolicy="no-referrer"
                      className="h-14 w-14 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#14532D]">
                      <Sprout className="h-6 w-6" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#0F2417]">{item.plantName}</p>
                    <p className="mt-0.5 truncate text-xs text-[#4B6353]">
                      {item.isHealthy ? 'Healthy Foliage' : item.diseaseName} ·{' '}
                      <span className="font-mono tabular-nums">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#6B8574]" />
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-[#0F2417]">Daily Plant Health Tips</h2>
          <div className="space-y-3">
            {PLANT_TIPS.map((tip) => (
              <div
                key={tip.title}
                className="rounded-2xl border border-[#DCE8DE] bg-white p-4"
              >
                <h3 className="text-sm font-bold text-[#14532D]">{tip.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-[#3E5646]">{tip.detail}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-[#DCE8DE] bg-white p-6">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 className="text-base font-bold text-[#0F2417]">
              Android Flutter Project & Installable Smartphone App
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-[#3E5646]">
              Download the complete Android Studio Flutter source project and server-side Gemini
              backend (<span className="font-mono text-xs">AIPlantDoctor_Source.zip</span>) to build{' '}
              <span className="font-mono text-xs">app-release.apk</span> locally with Flutter SDK
              &amp; Android Studio, or install this web app directly to your Android home screen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="/api/download/source-zip"
              download="AIPlantDoctor_Source.zip"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#14532D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0"
            >
              <Download className="h-4 w-4" />
              Download Source ZIP
            </a>
            <a
              href="/api/download/readme"
              download="README.md"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#DCE8DE] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F2417] hover:bg-[#F6FAF6] transition-colors whitespace-nowrap shrink-0"
            >
              <FileText className="h-4 w-4" />
              README.md
            </a>
            {isInstallable && !isInstalled && (
              <button
                type="button"
                onClick={onInstallPWA}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#86EFAC] bg-[#ECFDF5] px-4 py-2.5 text-sm font-semibold text-[#14532D] hover:bg-[#DCFCE7] transition-colors whitespace-nowrap shrink-0"
              >
                <Smartphone className="h-4 w-4" />
                Install Android Web App
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
