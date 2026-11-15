'use client';

import React, { useState } from 'react';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { FarmerPriorities, CropRotationScore } from '@/types';
import { rankAllCropsForFarm } from '@/lib/calculations/rotation-engine';
import { CROP_DATABASE } from '@/data/crops/crop-database';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Sparkles, Sliders, Sprout, CheckCircle2, AlertTriangle, Info, ChevronDown, ChevronUp, Search, Calendar } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Expanded crop details
  const [expandedCropId, setExpandedCropId] = useState<string | null>(null);

  // Compute rotation rankings
  const rankedCrops: CropRotationScore[] = activeFarm
    ? rankAllCropsForFarm(activeFarm, previousCropsInput, priorities)
    : [];

  // Filter crops based on season, water, search
  const filteredCrops = rankedCrops.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = item.crop.name.toLowerCase().includes(q);
      const matchSci = item.crop.scientificName.toLowerCase().includes(q);
      const matchFam = item.crop.family.toLowerCase().includes(q);
      if (!matchName && !matchSci && !matchFam) return false;
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
              Evaluating candidate species against {activeFarm?.name}&apos;s soil and climatological profile
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="font-semibold text-[#5a626a]">Preceding Crop:</span>
              <select
                value={previousCropsInput[0] || 'maize'}
                onChange={e => setPreviousCropsInput([e.target.value])}
                className="bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-2.5 py-1.5 text-xs text-[#191c1f] font-medium focus:outline-none focus:border-[#2d6a4f]"
              >
                {CROP_DATABASE.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.family.split(' ')[0]})
                  </option>
                ))}
              </select>
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

        {/* Priority Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
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
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-[#f4f5f1] text-xs">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-[#88929c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter crops (e.g. Chickpea, Legume)..."
              className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-[#2d6a4f]"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[#88929c]">Water Footprint:</span>
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

      {/* Ranked Candidate List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-base text-[#191c1f]">
            Agronomically Ranked Rotation Candidates ({filteredCrops.length} of {rankedCrops.length})
          </h4>
          <span className="text-xs text-[#5a626a]">Ranked by multi-factor suitability</span>
        </div>

        {filteredCrops.length === 0 ? (
          <div className="p-8 bg-white rounded-xl border border-[#e6e8e2] text-center text-xs text-[#5a626a]">
            No crops matched the active filter criteria. Try resetting season or water requirement filters.
          </div>
        ) : (
          filteredCrops.map((item, idx) => {
            const isExpanded = expandedCropId === item.crop.id;
            const score = item.overallScore;

            return (
              <div
                key={item.crop.id}
                className={`rounded-xl border transition-all bg-white overflow-hidden ${
                  score >= 80
                    ? 'border-[#74c69d] shadow-sm'
                    : score >= 60
                    ? 'border-[#e6e8e2]'
                    : 'border-[#fecaca] bg-[#fffbfb]'
                }`}
              >
                {/* Card Banner */}
                <div
                  onClick={() => setExpandedCropId(isExpanded ? null : item.crop.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#fbfbf8] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#eaf7ee] text-[#1b4332] font-bold text-xs flex items-center justify-center shrink-0">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-base text-[#191c1f]">{item.crop.name}</h4>
                        <span className="text-xs italic text-[#88929c]">({item.crop.scientificName})</span>
                        {item.crop.nitrogenImpact === 'fixer' && (
                          <Badge variant="sage" size="sm">N₂ Fixer</Badge>
                        )}
                        {item.crop.coverCropCapable && (
                          <Badge variant="blue" size="sm">Cover Crop</Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[#5a626a] mt-1">
                        <span>Family: <strong className="text-[#2a2f35]">{item.crop.family}</strong></span>
                        <span>&bull;</span>
                        <span>Duration: {item.crop.durationDays.min}-{item.crop.durationDays.max} days</span>
                        <span>&bull;</span>
                        <span>Water Need: <strong className="capitalize text-[#2a2f35]">{item.crop.waterRequirement}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] text-[#88929c] uppercase font-semibold block">Suitability Score</span>
                      <span
                        className={`text-2xl font-black ${
                          score >= 80 ? 'text-[#2d6a4f]' : score >= 60 ? 'text-[#d97706]' : 'text-[#dc2626]'
                        }`}
                      >
                        {score} <span className="text-xs font-semibold text-[#88929c]">/ 100</span>
                      </span>
                    </div>

                    <button
                      className="p-1.5 rounded-lg text-[#5a626a] hover:bg-[#f4f5f1]"
                      aria-label="Toggle details"
                    >
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Explanations and Breakdown */}
                {isExpanded && (
                  <div className="p-5 border-t border-[#f4f5f1] bg-[#fbfbf8] space-y-4 text-xs">
                    {/* 6-Factor Radar/Bar Breakdown */}
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wider text-[#5a626a] mb-2.5">
                        Explainable Scoring Breakdown
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="p-3 rounded-lg bg-white border border-[#e6e8e2]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-[#2a2f35]">Soil Compatibility</span>
                            <span className="font-bold text-[#2d6a4f]">{item.breakdown.soilCompatibility.score}%</span>
                          </div>
                          <p className="text-[11px] text-[#5a626a]">{item.breakdown.soilCompatibility.rationale}</p>
                        </div>

                        <div className="p-3 rounded-lg bg-white border border-[#e6e8e2]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-[#2a2f35]">Climate Envelope</span>
                            <span className="font-bold text-[#2d6a4f]">{item.breakdown.climateCompatibility.score}%</span>
                          </div>
                          <p className="text-[11px] text-[#5a626a]">{item.breakdown.climateCompatibility.rationale}</p>
                        </div>

                        <div className="p-3 rounded-lg bg-white border border-[#e6e8e2]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-[#2a2f35]">Water Balance Footprint</span>
                            <span className="font-bold text-[#2d6a4f]">{item.breakdown.waterBalanceSuitability.score}%</span>
                          </div>
                          <p className="text-[11px] text-[#5a626a]">{item.breakdown.waterBalanceSuitability.rationale}</p>
                        </div>

                        <div className="p-3 rounded-lg bg-white border border-[#e6e8e2]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-[#2a2f35]">Nutrient Cycling &amp; N-Balance</span>
                            <span className="font-bold text-[#2d6a4f]">{item.breakdown.nutrientCyclingBenefit.score}%</span>
                          </div>
                          <p className="text-[11px] text-[#5a626a]">{item.breakdown.nutrientCyclingBenefit.rationale}</p>
                        </div>

                        <div className="p-3 rounded-lg bg-white border border-[#e6e8e2]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-[#2a2f35]">Crop Family Diversity</span>
                            <span className="font-bold text-[#2d6a4f]">{item.breakdown.familyDiversityScore.score}%</span>
                          </div>
                          <p className="text-[11px] text-[#5a626a]">{item.breakdown.familyDiversityScore.rationale}</p>
                        </div>

                        <div className="p-3 rounded-lg bg-white border border-[#e6e8e2]">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-[#2a2f35]">Farmer Priority Alignment</span>
                            <span className="font-bold text-[#2d6a4f]">{item.breakdown.farmerPriorityFit.score}%</span>
                          </div>
                          <p className="text-[11px] text-[#5a626a]">{item.breakdown.farmerPriorityFit.rationale}</p>
                        </div>
                      </div>
                    </div>

                    {/* Key Advantages & Practical Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      <div className="p-3.5 rounded-lg bg-[#eaf7ee] border border-[#c7e9d2]">
                        <h6 className="font-bold text-xs text-[#1b4332] mb-1.5 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" />
                          Key Agronomic Advantages
                        </h6>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-[#1b4332]/90">
                          {item.keyAdvantages.map((adv, i) => (
                            <li key={i}>{adv}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3.5 rounded-lg bg-white border border-[#e6e8e2]">
                        <h6 className="font-bold text-xs text-[#191c1f] mb-1.5 flex items-center gap-1.5">
                          <Info className="w-4 h-4 text-[#0284c7]" />
                          Field Management Advisory
                        </h6>
                        <ul className="list-disc list-inside space-y-1 text-[11px] text-[#5a626a]">
                          {item.managementTips.map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
