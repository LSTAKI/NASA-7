'use client';

import React from 'react';
import { CROP_DATABASE } from '@/data/crops/crop-database';
import { getFertilizerRequirementByCropId } from '@/data/fertilizer/fertilizer-database';
import { CropVisualIcon, getCropVisualMetadata } from '@/components/rotation/CropVisualIcon';
import { FlaskConical, ArrowRight, ArrowDown, CheckCircle2, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export interface RotationTimelineProps {
  precedingCropId: string;
  currentCropId: string;
  followingCropId?: string;
  activeCropId: string;
  onSelectCrop: (cropId: string) => void;
  farmAreaHectares: number;
}

/**
 * Returns a complementary subsequent sequence crop based on crop family and nitrogen dynamics
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
      stepLabel: 'Previous Harvest',
      phaseBadge: 'Preceding Crop',
      isRecommended: false,
      ecologicalRole: 'Residual soil horizon baseline',
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
      phaseBadge: 'Ecological Break Partner',
      isRecommended: false,
      ecologicalRole: 'Restorative sequence partner',
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

      {/* Responsive Sequence Flow */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
        {sequence.map((step, idx) => {
          const cropObj = CROP_DATABASE.find(c => c.id === step.id);
          const fertReq = getFertilizerRequirementByCropId(step.id);
          const meta = getCropVisualMetadata(step.id);
          const isActive = activeCropId === step.id;

          return (
            <div
              key={`${step.id}-${idx}`}
              onClick={() => onSelectCrop(step.id)}
              className={`relative rounded-xl p-3.5 border transition-all cursor-pointer flex flex-col justify-between ${
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

                {/* Ecological Trait */}
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
                    <span className="text-[#528C70] flex items-center gap-1 group-hover:text-[#2E7D32]">
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
            </div>
          );
        })}
      </div>

      {/* Advisory footnote */}
      <div className="text-[11px] text-[#5C645E] flex items-center gap-1.5 pt-1">
        <RefreshCw className="w-3.5 h-3.5 text-[#528C70] shrink-0" />
        <span>
          Each crop in this multi-season rotation maintains its own distinct nutrient demand, fertilizer formulation, and phenological schedule scaled to {farmAreaHectares > 0 ? `${farmAreaHectares} ha` : 'your registered area'}.
        </span>
      </div>
    </div>
  );
};
