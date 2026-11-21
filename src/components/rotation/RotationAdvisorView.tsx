'use client';

import React, { useState } from 'react';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { FarmerPriorities, CropRotationScore } from '@/types';
import { rankAllCropsForFarm } from '@/lib/calculations/rotation-engine';
import { CROP_DATABASE } from '@/data/crops/crop-database';
import { CropVisualIcon, getCropVisualMetadata } from '@/components/rotation/CropVisualIcon';
import { CropCard } from '@/components/rotation/CropCard';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Sprout, CheckCircle2, Info, ChevronDown, ChevronUp, Search, Layers, Droplets, SunMedium } from 'lucide-react';

const QUICK_PREVIOUS_CROPS = [
  { id: 'maize', label: 'Maize (Corn)' },
  { id: 'soybean', label: 'Soybean' },
  { id: 'wheat', label: 'Wheat' },
  { id: 'tomato', label: 'Tomato' },
  { id: 'potato', label: 'Potato' },
  { id: 'green_peas', label: 'Green Peas' },
  { id: 'carrot', label: 'Carrot' },
];

export function RotationAdvisorView() {
  const { activeFarm } = useActiveFarm();

  // State for farmer priorities
  const [priorities, setPriorities] = useState<FarmerPriorities>({
    soilHealth: 4,
    waterConservation: 3,
    economicYield: 4,
    pestDiseaseBreak: 4
  });

  // Previous crop sequence
  const [previousCropsInput, setPreviousCropsInput] = useState<string[]>(
    activeFarm?.currentCrops.length ? activeFarm.currentCrops : ['maize']
  );

  // Filters
  const [targetSeason, setTargetSeason] = useState<string>('all');
  const [waterFilter, setWaterFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Expanded crop details
  const [expandedCropId, setExpandedCropId] = useState<string | null>(null);

  // Check URL query parameters to optionally expand top fertilizer plan for presentation
  const [openTopPlan] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return new URLSearchParams(window.location.search).get('openTop') === 'true';
    } catch {
      return false;
    }
  });

  // Compute rotation rankings
  const rankedCrops: CropRotationScore[] = activeFarm
    ? rankAllCropsForFarm(activeFarm, previousCropsInput, priorities)
    : [];

  // Filter crops based on season, water, category, search
  const filteredCrops = rankedCrops.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.crop.name.toLowerCase().includes(q);
      const matchSci = item.crop.scientificName.toLowerCase().includes(q);
      const matchFam = item.crop.family.toLowerCase().includes(q);
      if (!matchName && !matchSci && !matchFam) return false;
    }

    if (categoryFilter !== 'all') {
      const meta = getCropVisualMetadata(item.crop.id);
      if (meta.category !== categoryFilter) return false;
    }

    if (waterFilter !== 'all' && item.crop.waterRequirement !== waterFilter) {
      return false;
    }

    if (targetSeason !== 'all') {
      const suitable = item.crop.seasonsSuitable.some(s => s.toLowerCase().includes(targetSeason.toLowerCase()));
      if (!suitable) return false;
    }

    return true;
  });

  const handlePriorityChange = (key: keyof FarmerPriorities, val: number) => {
    setPriorities(prev => ({ ...prev, [key]: val }));
  };

  const activePrecedingCropId = previousCropsInput[0] || 'maize';

  // Counts for categories
  const vegetableCount = rankedCrops.filter(c => getCropVisualMetadata(c.crop.id).category === 'vegetable').length;
  const legumeCount = rankedCrops.filter(c => getCropVisualMetadata(c.crop.id).category === 'legume').length;
  const cerealCount = rankedCrops.filter(c => getCropVisualMetadata(c.crop.id).category === 'cereal').length;
  const coverCropCount = rankedCrops.filter(c => getCropVisualMetadata(c.crop.id).category === 'cover_crop').length;

  return (
    <div className="space-y-6">
      {/* Configuration & Sliders Bar */}
      <div className="bg-white rounded-xl border border-[#e6e8e2] p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#f4f5f1]">
          <div>
            <h3 className="font-bold text-lg text-[#191c1f] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2d6a4f]" />
              Explainable AI Rotation Configuration
            </h3>
            <p className="text-xs text-[#5a626a] mt-0.5">
              Evaluating candidate vegetables, grains, legumes and cover crops against {activeFarm?.name}&apos;s soil and climatological profile
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Visual Preceding Crop Selector */}
            <div className="flex items-center gap-2 bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-2.5 py-1.5">
              <CropVisualIcon cropId={activePrecedingCropId} size="xs" />
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-semibold text-[#5a626a]">Preceding Crop:</span>
                <select
                  value={activePrecedingCropId}
                  onChange={e => setPreviousCropsInput([e.target.value])}
                  className="bg-transparent text-xs text-[#191c1f] font-semibold focus:outline-none cursor-pointer"
                >
                  {CROP_DATABASE.map(c => {
                    const meta = getCropVisualMetadata(c.id);
                    return (
                      <option key={c.id} value={c.id}>
                        {meta.emoji} {c.name}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-[#5a626a]">Target Season:</span>
              <select
                value={targetSeason}
                onChange={e => setTargetSeason(e.target.value)}
                className="bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-2.5 py-1.5 text-xs text-[#191c1f] font-medium focus:outline-none focus:border-[#2d6a4f]"
              >
                <option value="all">All Sowing Windows</option>
                <option value="kharif">Kharif / Summer (Monsoon)</option>
                <option value="rabi">Rabi / Winter (Post-rain)</option>
                <option value="spring">Spring / Zaid</option>
              </select>
            </div>
          </div>
        </div>

        {/* Quick Preceding Crop Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-3 pb-2 text-xs">
          <span className="text-[11px] font-semibold text-[#88929c] uppercase tracking-wider">Quick Switch Preceding:</span>
          {QUICK_PREVIOUS_CROPS.map(chip => {
            const isActive = activePrecedingCropId === chip.id;
            const meta = getCropVisualMetadata(chip.id);
            return (
              <button
                key={chip.id}
                type="button"
                onClick={() => setPreviousCropsInput([chip.id])}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#1b4332] text-white shadow-xs'
                    : 'bg-[#f4f5f1] text-[#333a42] hover:bg-[#e6e8e2]'
                }`}
              >
                <CropVisualIcon cropId={chip.id} size="xs" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>

        {/* Priority Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-3 border-t border-[#f4f5f1]">
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-[#2a2f35]">Soil Health &amp; Carbon</span>
              <span className="font-mono text-xs font-bold text-[#2d6a4f]">{priorities.soilHealth}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={priorities.soilHealth}
              onChange={e => handlePriorityChange('soilHealth', parseInt(e.target.value))}
              className="w-full accent-[#2d6a4f] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-[#2a2f35]">Water Conservation</span>
              <span className="font-mono text-xs font-bold text-[#2d6a4f]">{priorities.waterConservation}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={priorities.waterConservation}
              onChange={e => handlePriorityChange('waterConservation', parseInt(e.target.value))}
              className="w-full accent-[#2d6a4f] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-[#2a2f35]">Economic Cash Yield</span>
              <span className="font-mono text-xs font-bold text-[#2d6a4f]">{priorities.economicYield}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={priorities.economicYield}
              onChange={e => handlePriorityChange('economicYield', parseInt(e.target.value))}
              className="w-full accent-[#2d6a4f] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-[#2a2f35]">Pest &amp; Pathogen Break</span>
              <span className="font-mono text-xs font-bold text-[#2d6a4f]">{priorities.pestDiseaseBreak}/5</span>
            </div>
            <input
              type="range"
              min="1"
              max="5"
              value={priorities.pestDiseaseBreak}
              onChange={e => handlePriorityChange('pestDiseaseBreak', parseInt(e.target.value))}
              className="w-full accent-[#2d6a4f] cursor-pointer"
            />
          </div>
        </div>

        {/* Filter bar */}
        <div className="space-y-3 mt-4 pt-4 border-t border-[#f4f5f1] text-xs">
          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[#88929c] font-semibold text-[11px] uppercase tracking-wider mr-1">Crop Type:</span>
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                categoryFilter === 'all'
                  ? 'bg-[#1b4332] text-white shadow-xs'
                  : 'bg-[#f4f5f1] text-[#5a626a] hover:bg-[#e6e8e2]'
              }`}
            >
              All Crops ({rankedCrops.length})
            </button>
            <button
              onClick={() => setCategoryFilter('vegetable')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                categoryFilter === 'vegetable'
                  ? 'bg-[#ea580c] text-white shadow-xs'
                  : 'bg-[#fff7ed] text-[#c2410c] hover:bg-[#fed7aa]'
              }`}
            >
              <CropVisualIcon cropId="carrot" size="xs" />
              Vegetables &amp; Roots ({vegetableCount})
            </button>
            <button
              onClick={() => setCategoryFilter('legume')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                categoryFilter === 'legume'
                  ? 'bg-[#16a34a] text-white shadow-xs'
                  : 'bg-[#f0fdf4] text-[#15803d] hover:bg-[#bbf7d0]'
              }`}
            >
              <CropVisualIcon cropId="chickpea" size="xs" />
              Legumes &amp; Pulses ({legumeCount})
            </button>
            <button
              onClick={() => setCategoryFilter('cereal')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                categoryFilter === 'cereal'
                  ? 'bg-[#ca8a04] text-white shadow-xs'
                  : 'bg-[#fefce8] text-[#854d0e] hover:bg-[#fef08a]'
              }`}
            >
              <CropVisualIcon cropId="wheat" size="xs" />
              Cereals &amp; Grains ({cerealCount})
            </button>
            <button
              onClick={() => setCategoryFilter('cover_crop')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-semibold transition-all ${
                categoryFilter === 'cover_crop'
                  ? 'bg-[#15803d] text-white shadow-xs'
                  : 'bg-[#f0fdf4] text-[#166534] hover:bg-[#bbf7d0]'
              }`}
            >
              <CropVisualIcon cropId="cover_crop_mix" size="xs" />
              Cover Crops ({coverCropCount})
            </button>
          </div>

          {/* Search & Water Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-[#88929c]" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter by name, vegetable, family..."
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#88929c]">Water Need:</span>
              <div className="flex gap-1">
                {['all', 'low', 'moderate', 'high'].map(wf => (
                  <button
                    key={wf}
                    onClick={() => setWaterFilter(wf)}
                    className={`px-2 py-0.5 rounded capitalize font-medium ${
                      waterFilter === wf
                        ? 'bg-[#2d6a4f] text-white'
                        : 'bg-[#f4f5f1] text-[#5a626a] hover:bg-[#e6e8e2]'
                    }`}
                  >
                    {wf}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ranked Candidate List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-base text-[#191c1f]">
            Agronomically Ranked Rotation Candidates ({filteredCrops.length} of {rankedCrops.length})
          </h4>
          <span className="text-xs text-[#5a626a]">Ranked by 6-factor planetary suitability</span>
        </div>

        {filteredCrops.length === 0 ? (
          <div className="p-8 bg-white rounded-xl border border-[#e6e8e2] text-center text-xs text-[#5a626a]">
            No crops matched the active filter criteria. Try resetting season, category, or water requirement filters.
          </div>
        ) : (
          filteredCrops.map((item, idx) => (
            <CropCard
              key={item.crop.id}
              item={item}
              rank={idx + 1}
              isExpanded={expandedCropId === item.crop.id}
              onToggleExpand={() => setExpandedCropId(expandedCropId === item.crop.id ? null : item.crop.id)}
              farmAreaHectares={activeFarm?.areaHectares || 0}
              farmName={activeFarm?.name}
              precedingCropId={activePrecedingCropId}
              defaultOpenFertilizer={openTopPlan && idx === 0}
            />
          ))
        )}
      </div>
    </div>
  );
}
