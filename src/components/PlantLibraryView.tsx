import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ChevronRight,
  Droplets,
  MessageSquare,
  Search,
  Sprout,
  Sun,
  Thermometer,
} from 'lucide-react';
import { PLANT_LIBRARY } from '../data/plants';
import type { PlantGuide } from '../types';

interface PlantLibraryViewProps {
  onAskAssistantAboutPlant: (plantName: string) => void;
}

export const PlantLibraryView: React.FC<PlantLibraryViewProps> = ({
  onAskAssistantAboutPlant,
}) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedPlant, setSelectedPlant] = useState<PlantGuide | null>(null);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(PLANT_LIBRARY.map((p) => p.category)))],
    [],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PLANT_LIBRARY.filter((plant) => {
      const catOk = category === 'All' || plant.category === category;
      const queryOk =
        !q ||
        plant.name.toLowerCase().includes(q) ||
        plant.scientificName.toLowerCase().includes(q) ||
        plant.category.toLowerCase().includes(q) ||
        plant.commonDiseases.some(
          (d) =>
            d.name.toLowerCase().includes(q) || d.symptoms.toLowerCase().includes(q),
        );
      return catOk && queryOk;
    });
  }, [query, category]);

  if (selectedPlant) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setSelectedPlant(null)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-[#DCE8DE] bg-white px-4 py-2 text-sm font-semibold text-[#0F2417] hover:bg-[#F1F7F2] transition-colors whitespace-nowrap shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            All Crops
          </button>

          <button
            type="button"
            onClick={() => onAskAssistantAboutPlant(selectedPlant.name)}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#14532D] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#166534] transition-colors whitespace-nowrap shrink-0"
          >
            <MessageSquare className="h-4 w-4" />
            Ask Assistant About {selectedPlant.name}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
          <div className="lg:col-span-5">
            <div className="h-full overflow-hidden rounded-2xl border border-[#DCE8DE] bg-white">
              {selectedPlant.imageUrl ? (
                <img
                  src={selectedPlant.imageUrl}
                  alt={selectedPlant.name}
                  referrerPolicy="no-referrer"
                  className="h-64 w-full object-cover lg:h-full lg:min-h-[280px]"
                />
              ) : (
                <div className="flex h-64 w-full flex-col items-center justify-center bg-[#ECFDF5] text-[#14532D] lg:h-full">
                  <Sprout className="h-12 w-12 mb-2" />
                  <span className="text-sm font-semibold">{selectedPlant.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="h-full rounded-2xl border border-[#DCE8DE] bg-white p-6">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#4B6353]">
                <span className="font-semibold text-[#16A34A]">{selectedPlant.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-serif italic">{selectedPlant.scientificName}</span>
              </div>
              <h1 className="mt-2 text-2xl font-bold text-[#0F2417] sm:text-3xl">
                {selectedPlant.name}
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-[#284132]">
                {selectedPlant.overview}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 border-t border-[#ECF3ED] pt-5 sm:grid-cols-2">
                <div className="flex items-start gap-2.5">
                  <Sun className="h-4 w-4 shrink-0 text-[#16A34A] mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#4B6353]">Sunlight</p>
                    <p className="text-sm font-medium text-[#0F2417]">{selectedPlant.sunlight}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Droplets className="h-4 w-4 shrink-0 text-[#16A34A] mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#4B6353]">Watering</p>
                    <p className="text-sm font-medium text-[#0F2417]">{selectedPlant.water}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Thermometer className="h-4 w-4 shrink-0 text-[#16A34A] mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#4B6353]">Temperature & Soil pH</p>
                    <p className="text-sm font-medium text-[#0F2417] tabular-nums">
                      {selectedPlant.temperature} · pH {selectedPlant.soilPh}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <Sprout className="h-4 w-4 shrink-0 text-[#16A34A] mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-[#4B6353]">Spacing & Harvest</p>
                    <p className="text-sm font-medium text-[#0F2417]">
                      {selectedPlant.spacing} · {selectedPlant.harvestWindow}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#0F2417]">Common Diseases & Symptoms</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {selectedPlant.commonDiseases.map((disease) => (
              <div
                key={disease.name}
                className="rounded-2xl border border-[#DCE8DE] bg-white p-5 space-y-2.5"
              >
                <div>
                  <h3 className="text-base font-bold text-[#14532D]">{disease.name}</h3>
                  <p className="text-xs font-medium text-[#4B6353]">{disease.pathogenType}</p>
                </div>
                <p className="text-sm leading-relaxed text-[#284132]">
                  <span className="font-semibold text-[#0F2417]">Symptoms: </span>
                  {disease.symptoms}
                </p>
                <p className="text-sm leading-relaxed text-[#284132]">
                  <span className="font-semibold text-[#0F2417]">Prevention: </span>
                  {disease.prevention}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-[#BBF7D0] bg-[#ECFDF5] p-6">
          <h2 className="text-base font-bold text-[#14532D]">Field Prevention Checklist</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-[#14532D]">
            {selectedPlant.preventionAdvice.map((tip, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#15803D]" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F2417]">Plant Library</h1>
        <p className="mt-1 text-sm text-[#4B6353]">
          Search growing requirements, common diseases, symptoms, and prevention guides across key
          food and cash crops.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B8574]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Tomato, Cassava, Maize, Blight..."
            className="min-h-[44px] w-full rounded-xl border border-[#DCE8DE] bg-white pl-10 pr-4 text-sm text-[#0F2417] placeholder:text-[#6B8574] focus:border-[#16A34A] focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => {
            const active = cat === category;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`min-h-[38px] rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#14532D] text-white'
                    : 'border border-[#DCE8DE] bg-white text-[#3E5646] hover:bg-[#F1F7F2]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[#DCE8DE] bg-white p-10 text-center">
          <p className="text-sm font-semibold text-[#0F2417]">No matching crops found</p>
          <p className="mt-1 text-xs text-[#4B6353]">
            Try searching another crop name or clearing your category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((plant) => (
            <button
              key={plant.id}
              type="button"
              onClick={() => setSelectedPlant(plant)}
              className="group flex flex-col overflow-hidden rounded-2xl border border-[#DCE8DE] bg-white text-left hover:border-[#86EFAC] transition-colors"
            >
              <div className="h-40 w-full overflow-hidden bg-[#ECFDF5]">
                {plant.imageUrl ? (
                  <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-[#14532D]">
                    <Sprout className="h-10 w-10 mb-1.5" />
                    <span className="text-xs font-medium text-[#3E5646]">{plant.category}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <p className="text-xs text-[#4B6353]">
                    {plant.category} · <span className="font-serif italic">{plant.scientificName}</span>
                  </p>
                  <h2 className="mt-1 text-lg font-bold text-[#0F2417]">{plant.name}</h2>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#3E5646]">
                    {plant.overview}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#F1F6F2] pt-3 text-xs font-semibold text-[#14532D]">
                  <span className="tabular-nums">
                    {plant.commonDiseases.length} common{' '}
                    {plant.commonDiseases.length === 1 ? 'disease' : 'diseases'}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
