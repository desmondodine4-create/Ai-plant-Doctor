import React, { useState } from 'react';
import {
  Check,
  Download,
  FileText,
  HelpCircle,
  Info,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';
import type { UserProfile } from '../types';

interface ProfileViewProps {
  profile: UserProfile;
  onSaveProfile: (next: UserProfile) => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  onInstallPWA: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  isInstallable,
  isInstalled,
  isIOS,
  onInstallPWA,
}) => {
  const [name, setName] = useState(profile.name);
  const [location, setLocation] = useState(profile.location);
  const [role, setRole] = useState(profile.role);
  const [savedToast, setSavedToast] = useState(false);

  const handleSaveIdentity = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...profile,
      name: name.trim() || 'Grower',
      location: location.trim() || 'Smallholder Farm',
      role: role.trim() || 'Farmer & Gardener',
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F2417]">Profile & Settings</h1>
        <p className="mt-1 text-sm text-[#4B6353]">
          Manage your grower profile, notification preferences, and downloadable Android source
          files.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <form
          onSubmit={handleSaveIdentity}
          className="lg:col-span-6 rounded-2xl border border-[#DCE8DE] bg-white p-6 space-y-4"
        >
          <h2 className="text-base font-bold text-[#0F2417]">Grower Profile</h2>

          <div>
            <label htmlFor="prof-name" className="block text-xs font-semibold text-[#3E5646] mb-1.5">
              Display Name
            </label>
            <input
              id="prof-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-[#DCE8DE] bg-[#F6FAF6] px-3.5 text-sm text-[#0F2417] focus:border-[#16A34A] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="prof-loc" className="block text-xs font-semibold text-[#3E5646] mb-1.5">
              Farm / Garden Location
            </label>
            <input
              id="prof-loc"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-[#DCE8DE] bg-[#F6FAF6] px-3.5 text-sm text-[#0F2417] focus:border-[#16A34A] focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="prof-role" className="block text-xs font-semibold text-[#3E5646] mb-1.5">
              Grower Role
            </label>
            <select
              id="prof-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="min-h-[44px] w-full rounded-xl border border-[#DCE8DE] bg-[#F6FAF6] px-3.5 text-sm text-[#0F2417] focus:border-[#16A34A] focus:outline-none"
            >
              <option value="Farmer & Gardener">Farmer & Gardener</option>
              <option value="Commercial Grower">Commercial Grower</option>
              <option value="Agricultural Student">Agricultural Student</option>
              <option value="Agronomy Extension Officer">Agronomy Extension Officer</option>
            </select>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#14532D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] transition-colors"
            >
              {savedToast && <Check className="h-4 w-4" />}
              {savedToast ? 'Profile Saved' : 'Save Profile'}
            </button>
          </div>
        </form>

        <div className="lg:col-span-6 rounded-2xl border border-[#DCE8DE] bg-white p-6 space-y-4">
          <h2 className="text-base font-bold text-[#0F2417]">App & Notification Preferences</h2>

          <div className="space-y-3 divide-y divide-[#F1F6F2]">
            <label className="flex min-h-[52px] items-center justify-between gap-4 pt-1 cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-[#0F2417]">Measurement Units</p>
                <p className="text-xs text-[#4B6353]">Displayed across plant care guides</p>
              </div>
              <select
                value={profile.units}
                onChange={(e) =>
                  onSaveProfile({
                    ...profile,
                    units: e.target.value as 'Metric' | 'Imperial',
                  })
                }
                className="min-h-[40px] rounded-xl border border-[#DCE8DE] bg-[#F6FAF6] px-3 text-xs font-semibold text-[#0F2417]"
              >
                <option value="Metric">Metric (°C, mm)</option>
                <option value="Imperial">Imperial (°F, in)</option>
              </select>
            </label>

            {(
              [
                [
                  'autoSaveHistory',
                  'Auto-Save Diagnosis Reports',
                  'Automatically keep completed scans in History',
                ],
                [
                  'wateringReminders',
                  'Watering Window Reminders',
                  'Morning irrigation checklist notifications',
                ],
                [
                  'diseaseAlerts',
                  'Seasonal Disease Alerts',
                  'High-humidity blight & pest scouting alerts',
                ],
                [
                  'followUpReminders',
                  'Treatment Follow-Up Reminders',
                  'Check foliage progress 5 days after treatment',
                ],
              ] as const
            ).map(([field, label, desc]) => (
              <label
                key={field}
                className="flex min-h-[52px] items-center justify-between gap-4 pt-3 cursor-pointer"
              >
                <div>
                  <p className="text-sm font-semibold text-[#0F2417]">{label}</p>
                  <p className="text-xs text-[#4B6353]">{desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={profile[field]}
                  onChange={(e) =>
                    onSaveProfile({
                      ...profile,
                      [field]: e.target.checked,
                    })
                  }
                  className="h-5 w-5 accent-[#14532D] rounded cursor-pointer"
                />
              </label>
            ))}
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-[#DCE8DE] bg-white p-6 space-y-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-base font-bold text-[#0F2417]">
              Android APK Build & Source Deliverables
            </h2>
            <p className="mt-1 text-xs leading-relaxed text-[#4B6353]">
              This cloud workspace runs Node.js without the Android SDK/Flutter compiler, so binary{' '}
              <span className="font-mono">AIPlantDoctor.apk</span> compilation happens in Android
              Studio or Flutter CLI using the complete source archive below.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5 shrink-0">
            <a
              href="/api/download/source-zip"
              download="AIPlantDoctor_Source.zip"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#14532D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap"
            >
              <Download className="h-4 w-4" />
              AIPlantDoctor_Source.zip
            </a>
            <a
              href="/api/download/readme"
              download="README.md"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#DCE8DE] bg-white px-4 py-2 text-xs font-semibold text-[#0F2417] hover:bg-[#F6FAF6] transition-colors whitespace-nowrap"
            >
              <FileText className="h-4 w-4" />
              README.md
            </a>
            {isInstallable && !isInstalled && (
              <button
                type="button"
                onClick={onInstallPWA}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#86EFAC] bg-[#ECFDF5] px-4 py-2 text-xs font-semibold text-[#14532D] hover:bg-[#DCFCE7] transition-colors whitespace-nowrap"
              >
                <Smartphone className="h-4 w-4" />
                Install Smartphone PWA
              </button>
            )}
          </div>
        </div>

        {isIOS && !isInstalled && (
          <p className="text-xs text-[#4B6353]">
            On iPhone or iPad Safari, tap <strong>Share</strong> then{' '}
            <strong>Add to Home Screen</strong> to install AI Plant Doctor.
          </p>
        )}
      </section>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#DCE8DE] bg-white p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#14532D]">
            <Info className="h-4 w-4" />
            <h3 className="text-sm font-bold">About AI Plant Doctor</h3>
          </div>
          <p className="text-xs leading-relaxed text-[#3E5646]">
            AI Plant Doctor helps farmers, gardeners, and agricultural students identify plant
            diseases and act on practical, science-grounded treatment steps powered by Gemini AI.
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE8DE] bg-white p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#14532D]">
            <ShieldCheck className="h-4 w-4" />
            <h3 className="text-sm font-bold">Privacy Policy</h3>
          </div>
          <p className="text-xs leading-relaxed text-[#3E5646]">
            Submitted photographs are sent over HTTPS solely for real-time Gemini plant health
            analysis. API keys stay strictly on the server; your history stays locally on your
            device.
          </p>
        </div>

        <div className="rounded-2xl border border-[#DCE8DE] bg-white p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#14532D]">
            <HelpCircle className="h-4 w-4" />
            <h3 className="text-sm font-bold">Help & Photo Support</h3>
          </div>
          <p className="text-xs leading-relaxed text-[#3E5646]">
            For highest accuracy, capture crisp close-up photos in morning daylight showing both
            diseased spots and surrounding healthy leaf tissue.
          </p>
        </div>
      </div>
    </div>
  );
};
