import React, { useMemo, useState } from 'react';
import { ChevronRight, Search, Sprout, Trash2 } from 'lucide-react';
import type { DiagnosisResult } from '../types';

interface HistoryViewProps {
  history: DiagnosisResult[];
  onSelect: (item: DiagnosisResult) => void;
  onDelete: (id: string) => void;
  onStartScan: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onSelect,
  onDelete,
  onStartScan,
}) => {
  const [filter, setFilter] = useState<'all' | 'healthy' | 'diseased'>('all');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return history.filter((item) => {
      const statusOk =
        filter === 'all' ||
        (filter === 'healthy' && item.isHealthy) ||
        (filter === 'diseased' && !item.isHealthy);
      const queryOk =
        !q ||
        item.plantName.toLowerCase().includes(q) ||
        item.diseaseName.toLowerCase().includes(q);
      return statusOk && queryOk;
    });
  }, [history, filter, query]);

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0F2417]">Diagnosis History</h1>
          <p className="mt-1 text-sm text-[#4B6353]">
            Review saved plant scans, dates, and treatment reports stored locally on your device.
          </p>
        </div>
        <button
          type="button"
          onClick={onStartScan}
          className="min-h-[44px] rounded-xl bg-[#14532D] px-4 py-2 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0"
        >
          New Plant Scan
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B8574]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by plant or disease name..."
            className="min-h-[44px] w-full rounded-xl border border-[#DCE8DE] bg-white pl-10 pr-4 text-sm text-[#0F2417] placeholder:text-[#6B8574] focus:border-[#16A34A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-[#DCE8DE] bg-white p-1">
          {(
            [
              ['all', 'All'],
              ['diseased', 'Attention Needed'],
              ['healthy', 'Healthy'],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`min-h-[36px] rounded-lg px-3 py-1 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                filter === key
                  ? 'bg-[#14532D] text-white'
                  : 'text-[#3E5646] hover:bg-[#F6FAF6]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#DCE8DE] bg-white p-10 text-center">
          <Sprout className="mx-auto h-10 w-10 text-[#16A34A]" />
          <h2 className="mt-3 text-base font-bold text-[#0F2417]">
            {history.length === 0 ? 'No saved diagnoses yet' : 'No matching reports'}
          </h2>
          <p className="mt-1 text-xs text-[#4B6353]">
            {history.length === 0
              ? 'Scanned plants and saved diagnosis reports will appear here for offline review.'
              : 'Try adjusting your search or status filter.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const dateLabel = new Date(item.createdAt).toLocaleString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl border border-[#DCE8DE] bg-white p-3.5"
              >
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  className="flex min-w-0 flex-1 items-center gap-4 text-left"
                >
                  {item.imageDataUrl ? (
                    <img
                      src={item.imageDataUrl}
                      alt={item.plantName}
                      referrerPolicy="no-referrer"
                      className="h-16 w-16 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#ECFDF5] text-[#14532D]">
                      <Sprout className="h-6 w-6" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B6353]">
                      <span className="font-mono tabular-nums">{dateLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        {item.confidenceScore}% confidence
                      </span>
                    </div>
                    <h2 className="mt-0.5 truncate text-base font-bold text-[#0F2417]">
                      {item.plantName}
                    </h2>
                    <p
                      className={`truncate text-xs font-semibold ${
                        item.isHealthy ? 'text-[#15803D]' : 'text-[#B45309]'
                      }`}
                    >
                      {item.isHealthy ? 'Healthy Foliage' : `${item.diseaseName} (${item.severity})`}
                    </p>
                  </div>

                  <ChevronRight className="h-5 w-5 shrink-0 text-[#6B8574]" />
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(item.id)}
                  aria-label={`Delete diagnosis for ${item.plantName}`}
                  className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
