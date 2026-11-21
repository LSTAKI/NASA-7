'use client';

import React from 'react';
import { CROP_DATABASE } from '@/data/crops/crop-database';
import { getFertilizerRequirementByCropId } from '@/data/fertilizer/fertilizer-database';
import { CropVisualIcon, getCropVisualMetadata } from '@/components/rotation/CropVisualIcon';
import { FlaskConical, CheckCircle2, RefreshCw, Layers } from 'lucide-react';

export interface RotationTimelineProps {
  precedingCropId: string;
  isPrecedingCropConfirmed?: boolean;
  currentCropId: string;
  followingCropId?: string;
  activeCropId: string;
  onSelectCrop: (cropId: string) => void;
  farmAreaHectares: number;
}

/**
 * Returns an indicative complementary subsequent sequence crop based on simplified crop-family
 * and nitrogen dynamics heuristics.
 *
 * NOTE: This is a provisional heuristic guideline and NOT an independently validated agronomic recommendation.
 */
export function getComplementarySequenceCropId(currentCropId: string): string {
  const current = CROP_DATABASE.find(c => c.id === currentCropId);
  if (!current) return 'green_peas';

  // If current is a cereal / heavy feeder, follow with a nitrogen-fixing legume or cover crop
  if (current.category === 'cereal' || current.nitrogenImpact === 'heavy_feeder') {
    if (current.id === 'maize') return 'soybean';
    if (current.id === 'wheat') return 'chickpea';
    if (current.id === 'sorghum') return 'chickpea';
    if (current.id === 'pearl_millet') return 'groundnut';
    return 'green_peas';
  }

  // If current is a legume / fixer, follow with a high-demand cereal
  if (current.category === 'legume' || current.nitrogenImpact === 'fixer') {
    if (current.id === 'soybean') return 'wheat';
    if (current.id === 'chickpea') return 'maize';
    if (current.id === 'groundnut') return 'pearl_millet';
    return 'wheat';
  }

  // If current is a root / tuber or solanaceous crop, follow with a cereal or legume to break disease cycle
  if (current.id === 'potato' || current.id === 'tomato') {
    return 'maize';
  }
  if (current.id === 'carrot') {
    return 'green_peas';
  }
  if (current.id === 'cabbage') {
    return 'tomato';
  }
  if (current.id === 'onion') {
    return 'wheat';
  }
  if (current.id === 'cotton') {
    return 'wheat';
  }

  return 'cover_crop_mix';
}

export const RotationTimeline: React.FC<RotationTimelineProps> = ({
  precedingCropId,
  isPrecedingCropConfirmed = false,
  currentCropId,
  followingCropId,
  activeCropId,
  onSelectCrop,
  farmAreaHectares,
}) => {
  const effectiveFollowingId = followingCropId || getComplementarySequenceCropId(currentCropId);

  const sequence = [
    {
      id: precedingCropId,
      stepLabel: isPrecedingCropConfirmed ? 'Previous Harvest' : 'Preceding Crop (Selected)',
      phaseBadge: isPrecedingCropConfirmed ? 'Confirmed Farm Harvest' : 'Default Selection (Unconfirmed)',
      isRecommended: false,
      ecologicalRole: isPrecedingCropConfirmed
        ? 'Confirmed previous field harvest baseline'
        : 'Baseline reference crop. Select your actual previous crop in the configuration panel above.',
    },
    {
      id: currentCropId,
      stepLabel: 'Current Season',
      phaseBadge: 'Recommended Candidate',
      isRecommended: true,
      ecologicalRole: 'Primary target crop for current sowing',
    },
    {
      id: effectiveFollowingId,
      stepLabel: 'Following Rotation',
      phaseBadge: 'Suggested Next Crop (Provisional)',
      isRecommended: false,
      ecologicalRole: 'Indicative heuristic suggestion based on simplified crop-family alternation and nitrogen dynamics. Not independently validated.',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E0DCD3] p-4 md:p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#EAE6DF]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2E7D32]" />
          <h4 className="text-sm font-bold text-[#1E2420]">
            Crop Rotation Sequence &amp; Multi-Season Planning
          </h4>
        </div>
        <div className="text-[11px] text-[#5C645E]">
          Click any crop below to view its specific fertilizer dosage
        </div>
      </div>

      {/* Accessible Interactive Sequence Flow with Button Semantics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative" role="region" aria-label="Crop Rotation Sequence">
        {sequence.map((step, idx) => {
          const cropObj = CROP_DATABASE.find(c => c.id === step.id);
          const fertReq = getFertilizerRequirementByCropId(step.id);
          const meta = getCropVisualMetadata(step.id);
          const isActive = activeCropId === step.id;

          return (
            <button
              type="button"
              key={`${step.id}-${idx}`}
              onClick={() => onSelectCrop(step.id)}
              aria-pressed={isActive}
              aria-label={`View fertilizer plan for ${cropObj?.name || step.id} (${step.stepLabel} - ${step.phaseBadge})`}
              className={`w-full text-left relative rounded-xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2 ${
                isActive
                  ? 'bg-[#EAF3EE] border-[#2E7D32] ring-2 ring-[#2E7D32]/20 shadow-xs'
                  : 'bg-[#F9F8F5] border-[#E0DCD3] hover:border-[#528C70] hover:bg-white'
              }`}
            >
              <div>
                {/* Step Tag & Status */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-bold text-[#5C645E] uppercase tracking-wider">
                    {step.stepLabel}
                  </span>
                  {step.isRecommended ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2E7D32] text-white">
                      Recommended
                    </span>
                  ) : step.phaseBadge.includes('Provisional') ? (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FFFDF5] text-[#854D0E] border border-[#FDE68A]">
                      {step.phaseBadge}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAE6DF] text-[#404642]">
                      {step.phaseBadge}
                    </span>
                  )}
                </div>

                {/* Crop Identity */}
                <div className="flex items-center gap-2.5 my-1.5">
                  <CropVisualIcon cropId={step.id} size="sm" />
                  <div>
                    <h5 className="text-sm font-bold text-[#1E2420] leading-tight">
                      {cropObj?.name || step.id}
                    </h5>
                    <span className="text-[11px] text-[#5C645E] italic">
                      {cropObj?.family || 'Poaceae'}
                    </span>
                  </div>
                </div>

                {/* Ecological Trait & Advisory */}
                <p className="text-[11px] text-[#5C645E] mt-1 leading-snug">
                  {step.ecologicalRole}
                </p>
              </div>

              {/* Action / Active State Indicator */}
              <div className="mt-3 pt-2.5 border-t border-[#EAE6DF] flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  {isActive ? (
                    <span className="text-[#2E7D32] flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active Fertilizer Plan
                    </span>
                  ) : (
                    <span className="text-[#528C70] flex items-center gap-1">
                      <FlaskConical className="w-3.5 h-3.5" />
                      View Fertilizer Plan
                    </span>
                  )}
                </div>

                {fertReq?.recommendationStatus === 'verified' ? (
                  <span className="text-[9px] font-medium text-[#2E7D32] bg-white px-1.5 py-0.5 rounded border border-[#C7E9D2]">
                    Verified RDF
                  </span>
                ) : (
                  <span className="text-[9px] font-medium text-[#D4973B] bg-white px-1.5 py-0.5 rounded border border-[#FDE68A]">
                    Provisional
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Advisory footnote & provisional disclosure */}
      <div className="text-[11px] text-[#5C645E] space-y-1.5 pt-1">
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5 text-[#528C70] shrink-0" />
          <span>
            Each crop in this multi-season rotation maintains its own distinct nutrient demand, fertilizer formulation, and phenological schedule scaled to {farmAreaHectares > 0 ? `${farmAreaHectares} ha` : 'your field area'}.
          </span>
        </div>
        <p className="text-[10.5px] text-[#8A928C] leading-relaxed">
          * <strong className="text-[#5C645E]">Agronomic Notice:</strong> &ldquo;Suggested Next Crop (Provisional)&rdquo; is an indicative sequence suggestion derived from simplified botanical family alternation and biological nitrogen-balance heuristics. It is provisional and has not been independently validated as a certified field-specific rotation plan.
        </p>
      </div>
    </div>
  );
};
