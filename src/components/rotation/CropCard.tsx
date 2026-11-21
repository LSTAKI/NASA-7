'use client';

import React, { useState, useEffect } from 'react';
import { CropRotationScore } from '@/types';
import { CropVisualIcon, getCropVisualMetadata } from '@/components/rotation/CropVisualIcon';
import { Badge } from '@/components/ui/Badge';
import { RotationTimeline } from '@/components/rotation/RotationTimeline';
import { FertilizerPlanner } from '@/components/rotation/fertilizer/FertilizerPlanner';
import {
  CheckCircle2,
  Info,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  Sparkles,
  Layers,
} from 'lucide-react';

export interface CropCardProps {
  item: CropRotationScore;
  rank: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  farmAreaHectares: number;
  farmName?: string;
  precedingCropId: string;
  isPrecedingCropConfirmed?: boolean;
  defaultOpenFertilizer?: boolean;
}

export const CropCard: React.FC<CropCardProps> = ({
  item,
  rank,
  isExpanded,
  onToggleExpand,
  farmAreaHectares,
  farmName,
  precedingCropId,
  isPrecedingCropConfirmed = false,
  defaultOpenFertilizer = false,
}) => {
  const [isFertilizerOpen, setIsFertilizerOpen] = useState<boolean>(defaultOpenFertilizer);
  const [activeFertilizerCropId, setActiveFertilizerCropId] = useState<string>(item.crop.id);

  // Synchronize active fertilizer crop when item crop changes
  useEffect(() => {
    setActiveFertilizerCropId(item.crop.id);
  }, [item.crop.id]);

  const score = item.overallScore;
  const meta = getCropVisualMetadata(item.crop.id);

  const handleTimelineCropSelect = (cropId: string) => {
    setActiveFertilizerCropId(cropId);
    if (!isFertilizerOpen) {
      setIsFertilizerOpen(true);
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all bg-white overflow-hidden shadow-xs ${
        score >= 80
          ? 'border-[#74c69d]'
          : score >= 60
          ? 'border-[#e6e8e2]'
          : 'border-[#fecaca] bg-[#fffbfb]'
      }`}
    >
      {/* 1. MAIN CARD BANNER */}
      <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Side: Identity & Attributes with Keyboard Accessibility */}
        <div
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
          aria-label={`${item.crop.name} details, rank ${rank}, suitability score ${score} out of 100`}
          onClick={onToggleExpand}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onToggleExpand();
            }
          }}
          className="flex items-start gap-4 cursor-pointer flex-1 focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2 rounded-xl p-1"
        >
          {/* Visual Crop Icon with Rank Badge */}
          <div className="relative shrink-0">
            <CropVisualIcon cropId={item.crop.id} size="lg" />
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#1b4332] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              #{rank}
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="font-bold text-base text-[#191c1f] flex items-center gap-1.5">
                {item.crop.name}
              </h4>
              <span className="text-xs italic text-[#88929c]">({item.crop.scientificName})</span>

              {/* Category Tag */}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${meta.pillBg} ${meta.pillText}`}
              >
                {meta.categoryLabel}
              </span>

              {item.crop.nitrogenImpact === 'fixer' && (
                <Badge variant="sage" size="sm">
                  N₂ Fixer
                </Badge>
              )}
              {item.crop.coverCropCapable && (
                <Badge variant="blue" size="sm">
                  Cover Crop
                </Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5a626a] mt-1.5">
              <span>
                Family: <strong className="text-[#2a2f35]">{item.crop.family}</strong>
              </span>
              <span>&bull;</span>
              <span>
                Duration: {item.crop.durationDays.min}-{item.crop.durationDays.max} days
              </span>
              <span>&bull;</span>
              <span>
                Water Need: <strong className="capitalize text-[#2a2f35]">{item.crop.waterRequirement}</strong>
              </span>
              <span>&bull;</span>
              <span>
                Root: <strong className="capitalize text-[#2a2f35]">{item.crop.rootDepth}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Score, Smart Fertilizer Action, and Details Toggle */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {/* Suitability Score */}
          <div className="text-right mr-1">
            <span className="text-[10px] text-[#88929c] uppercase font-semibold block">Suitability Score</span>
            <span
              className={`text-2xl font-black ${
                score >= 80 ? 'text-[#2d6a4f]' : score >= 60 ? 'text-[#d97706]' : 'text-[#dc2626]'
              }`}
            >
              {score} <span className="text-xs font-semibold text-[#88929c]">/ 100</span>
            </span>
          </div>

          {/* Integrated Action Button: Smart Fertilizer Plan */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsFertilizerOpen(prev => !prev);
            }}
            aria-expanded={isFertilizerOpen}
            aria-label={`${isFertilizerOpen ? 'Hide' : 'Open'} Smart Fertilizer Plan for ${item.crop.name}`}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2 ${
              isFertilizerOpen
                ? 'bg-[#2E7D32] text-white shadow-xs ring-2 ring-[#2E7D32]/20'
                : 'bg-[#EAF3EE] text-[#2E7D32] hover:bg-[#d8ebd2] border border-[#2E7D32]/30'
            }`}
            title="Open crop-specific scientific fertilizer dosage, bag counts, and split schedule"
          >
            <FlaskConical className="w-4 h-4" />
            <span>Smart Fertilizer Plan</span>
            {isFertilizerOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {/* Chevron for Agronomic Profile */}
          <button
            type="button"
            onClick={onToggleExpand}
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Hide agronomic profile for ${item.crop.name}` : `Show agronomic profile for ${item.crop.name}`}
            className="p-2 rounded-xl text-[#5a626a] hover:bg-[#f4f5f1] transition-colors focus:outline-none focus:ring-2 focus:ring-[#2E7D32]"
            title={isExpanded ? 'Hide agronomic profile' : 'Show agronomic profile'}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. EXPANDED AGRONOMIC PROFILE & EXPLAINABLE SCORING */}
      {isExpanded && (
        <div className="p-5 border-t border-[#f4f5f1] bg-[#fbfbf8] space-y-5 text-xs">
          {/* Visual Agronomic Hero Banner */}
          <div className="p-4 rounded-xl bg-white border border-[#e6e8e2] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <CropVisualIcon cropId={item.crop.id} size="xl" showBadge />
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-sm text-[#191c1f]">{item.crop.name} Agronomic Profile</h5>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${meta.pillBg} ${meta.pillText}`}>
                    {meta.categoryLabel}
                  </span>
                </div>
                <p className="text-[11px] text-[#5a626a] mt-0.5 max-w-xl leading-relaxed">
                  {item.crop.rootDescription}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 shrink-0 text-center border-t md:border-t-0 md:border-l border-[#f4f5f1] pt-3 md:pt-0 md:pl-4">
              <div>
                <span className="text-[10px] text-[#88929c] block font-semibold">Optimal Temp</span>
                <span className="font-bold text-[#191c1f] text-xs">
                  {item.crop.optimalTemperatureC.min}-{item.crop.optimalTemperatureC.max}°C
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#88929c] block font-semibold">Soil pH Range</span>
                <span className="font-bold text-[#191c1f] text-xs">
                  {item.crop.soilPhPreference.min}-{item.crop.soilPhPreference.max}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#88929c] block font-semibold">Water Need</span>
                <span className="font-bold text-[#2d6a4f] text-xs capitalize">
                  {item.crop.waterRequirement}
                </span>
              </div>
            </div>
          </div>

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

          {/* Key Advantages & Field Management */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
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

      {/* 3. INTEGRATED EXPANDABLE SMART FERTILIZER PLAN SECTION */}
      {isFertilizerOpen && (
        <div className="p-4 md:p-6 border-t-2 border-[#2E7D32]/30 bg-[#FBFBF8] space-y-6">
          {/* Multi-Season Rotation Sequence Flow with Accessibility */}
          <RotationTimeline
            precedingCropId={precedingCropId}
            isPrecedingCropConfirmed={isPrecedingCropConfirmed}
            currentCropId={item.crop.id}
            activeCropId={activeFertilizerCropId}
            onSelectCrop={handleTimelineCropSelect}
            farmAreaHectares={farmAreaHectares}
          />

          {/* Embedded Smart Fertilizer Planner for Active Crop */}
          <FertilizerPlanner
            initialCropId={activeFertilizerCropId}
            initialAreaHectares={farmAreaHectares}
            farmName={farmName}
            embedded={true}
            onCropChange={(cropId) => setActiveFertilizerCropId(cropId)}
          />
        </div>
      )}
    </div>
  );
};
