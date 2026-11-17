import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Copy,
  MessageSquare,
  Printer,
  Share2,
  ShieldAlert,
  Sprout,
} from 'lucide-react';
import type { DiagnosisResult } from '../types';

interface DiagnosisReportViewProps {
  result: DiagnosisResult;
  isSaved: boolean;
  onSave: (result: DiagnosisResult) => void;
  onBack: () => void;
  onAskAssistant: (cropName: string) => void;
  onNewScan: () => void;
}

export const DiagnosisReportView: React.FC<DiagnosisReportViewProps> = ({
  result,
  isSaved,
  onSave,
  onBack,
  onAskAssistant,
  onNewScan,
}) => {
  const [copied, setCopied] = useState(false);

  const formattedDate = new Date(result.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const severityMeta = (() => {
    if (result.isHealthy) {
      return {
        label: 'Healthy Foliage',
        colorClass: 'text-[#15803D]',
        Icon: CheckCircle2,
      };
    }
    const sev = result.severity.toLowerCase();
    if (sev === 'severe' || sev === 'critical') {
      return {
        label: `${result.severity} Severity`,
        colorClass: 'text-[#B91C1C]',
        Icon: ShieldAlert,
      };
    }
    return {
      label: `${result.severity} Severity`,
      colorClass: 'text-[#B45309]',
      Icon: AlertTriangle,
    };
  })();

  const StatusIcon = severityMeta.Icon;

  const buildShareText = () => {
    const lines = [
      'AI Plant Doctor — Diagnosis Report',
      `Plant: ${result.plantName}${result.scientificName ? ` (${result.scientificName})` : ''}`,
      `Condition: ${result.isHealthy ? 'Healthy' : result.diseaseName}`,
      `Severity: ${result.severity} · Confidence: ${result.confidenceLevel} (${result.confidenceScore}%)`,
      `Date: ${formattedDate}`,
      '',
      result.diseaseDescription,
      '',
      'Step-by-Step Treatment:',
      ...result.stepByStepTreatment.map((step, i) => `${i + 1}. ${step}`),
      '',
      'Prevention Tips:',
      ...result.preventionTips.map((tip) => `- ${tip}`),
    ];
    return lines.join('\n');
  };

  const handleCopyOrShare = async () => {
    const text = buildShareText();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `AI Plant Doctor: ${result.plantName}`,
          text,
        });
        return;
      } catch {
        // Fall through to clipboard copy if user dismissed native sheet
      }
    }
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#DCE8DE] bg-white px-4 py-2 text-sm font-semibold text-[#0F2417] hover:bg-[#F1F7F2] transition-colors whitespace-nowrap shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSave(result)}
            disabled={isSaved}
            className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 ${
              isSaved
                ? 'border border-[#BBF7D0] bg-[#ECFDF5] text-[#15803D]'
                : 'bg-[#14532D] text-white hover:bg-[#166534]'
            }`}
          >
            {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            {isSaved ? 'Saved to History' : 'Save Report'}
          </button>

          <button
            type="button"
            onClick={handleCopyOrShare}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#DCE8DE] bg-white px-4 py-2 text-sm font-semibold text-[#0F2417] hover:bg-[#F1F7F2] transition-colors whitespace-nowrap shrink-0"
          >
            {copied ? <Copy className="h-4 w-4 text-[#16A34A]" /> : <Share2 className="h-4 w-4" />}
            {copied ? 'Copied Report' : 'Share'}
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="hidden sm:inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#DCE8DE] bg-white px-4 py-2 text-sm font-semibold text-[#0F2417] hover:bg-[#F1F7F2] transition-colors whitespace-nowrap shrink-0"
          >
            <Printer className="h-4 w-4" />
            Print
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-5">
          <div className="h-full overflow-hidden rounded-2xl border border-[#DCE8DE] bg-white">
            {result.imageDataUrl ? (
              <img
                src={result.imageDataUrl}
                alt={`Uploaded photograph of ${result.plantName}`}
                referrerPolicy="no-referrer"
                className="h-64 w-full object-cover lg:h-full lg:min-h-[320px]"
              />
            ) : (
              <div className="flex h-64 w-full flex-col items-center justify-center bg-[#ECFDF5] text-[#14532D] lg:h-full">
                <Sprout className="h-12 w-12 mb-2" />
                <span className="text-sm font-medium">{result.plantName}</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex h-full flex-col justify-between rounded-2xl border border-[#DCE8DE] bg-white p-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 text-sm text-[#4B6353]">
                <span className="font-semibold text-[#14532D]">{result.plantName}</span>
                {result.scientificName && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="font-serif italic">{result.scientificName}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-xs">{formattedDate}</span>
              </div>

              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F2417] sm:text-3xl">
                {result.isHealthy ? 'Healthy Plant Foliage' : result.diseaseName}
              </h2>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm font-semibold">
                <span className={`inline-flex items-center gap-1.5 ${severityMeta.colorClass}`}>
                  <StatusIcon className="h-4 w-4" />
                  {severityMeta.label}
                </span>
                <span className="text-[#94A89A]" aria-hidden="true">
                  /
                </span>
                <span className="font-mono tabular-nums text-[#0F2417]">
                  {result.confidenceLevel} Confidence ({result.confidenceScore}%)
                </span>
              </div>

              <p className="mt-4 text-[15px] leading-relaxed text-[#284132]">
                {result.diseaseDescription}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3 pt-5 border-t border-[#ECF3ED]">
              <button
                type="button"
                onClick={() => onAskAssistant(result.plantName)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#16A34A] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#15803D] transition-colors whitespace-nowrap shrink-0"
              >
                <MessageSquare className="h-4 w-4" />
                Ask Care Assistant
              </button>
              <button
                type="button"
                onClick={onNewScan}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#DCE8DE] bg-white px-5 py-2.5 text-sm font-semibold text-[#0F2417] hover:bg-[#F6FAF6] transition-colors whitespace-nowrap shrink-0"
              >
                Scan Another Plant
              </button>
            </div>
          </div>
        </div>
      </div>

      {result.recommendedTreatment && (
        <section className="rounded-2xl border border-[#BBF7D0] bg-[#ECFDF5] p-6">
          <h3 className="text-base font-bold text-[#14532D]">Recommended Treatment Overview</h3>
          <p className="mt-2 text-[15px] leading-relaxed text-[#14532D]">
            {result.recommendedTreatment}
          </p>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {result.symptomsDetected.length > 0 && (
          <section className="rounded-2xl border border-[#DCE8DE] bg-white p-6">
            <h3 className="text-base font-bold text-[#0F2417]">Symptoms Detected</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#284132]">
              {result.symptomsDetected.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" />
                  <span>{symptom}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {result.possibleCauses.length > 0 && (
          <section className="rounded-2xl border border-[#DCE8DE] bg-white p-6">
            <h3 className="text-base font-bold text-[#0F2417]">Possible Causes</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#284132]">
              {result.possibleCauses.map((cause, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#14532D]" />
                  <span>{cause}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {result.stepByStepTreatment.length > 0 && (
        <section className="rounded-2xl border border-[#DCE8DE] bg-white p-6">
          <h3 className="text-base font-bold text-[#0F2417]">Step-by-Step Treatment Instructions</h3>
          <ol className="mt-4 space-y-3">
            {result.stepByStepTreatment.map((step, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3.5 border-b border-[#F1F6F2] pb-3 last:border-b-0 last:pb-0"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#DCFCE7] font-mono text-xs font-bold tabular-nums text-[#14532D]">
                  {idx + 1}
                </span>
                <p className="pt-0.5 text-sm leading-relaxed text-[#284132]">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {result.preventionTips.length > 0 && (
          <section className="rounded-2xl border border-[#DCE8DE] bg-white p-6">
            <h3 className="text-base font-bold text-[#0F2417]">Prevention Tips</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#284132]">
              {result.preventionTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16A34A]" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {result.followUpCare.length > 0 && (
          <section className="rounded-2xl border border-[#DCE8DE] bg-white p-6">
            <h3 className="text-base font-bold text-[#0F2417]">Follow-Up Care Recommendations</h3>
            <ul className="mt-3 space-y-2.5 text-sm leading-relaxed text-[#284132]">
              {result.followUpCare.map((care, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#14532D]" />
                  <span>{care}</span>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
};
