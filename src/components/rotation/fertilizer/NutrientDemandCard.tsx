'use client';

import React from 'react';
import { NutrientDemandResult } from '@/types/fertilizer';
import { FlaskConical, Scale, Info, Sparkles } from 'lucide-react';

interface NutrientDemandCardProps {
  nutrientDemand: NutrientDemandResult;
  areaUnit?: 'ha' | 'acres';
}

export const NutrientDemandCard: React.FC<NutrientDemandCardProps> = ({
  nutrientDemand,
  areaUnit = 'ha',
}) => {
  const { totalDemandKg, baselineRdfKgHa, areaHectares, areaAcres } = nutrientDemand;

  const displayAreaText =
    areaUnit === 'acres'
      ? `${areaAcres.toFixed(1)} acres (${areaHectares.toFixed(1)} ha)`
      : `${areaHectares.toFixed(1)} ha (${areaAcres.toFixed(1)} acres)`;

  return (
    <div className="bg-white rounded-2xl border border-[#E0DCD3] p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE6DF] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EAF3EE] flex items-center justify-center text-[#2E7D32]">
            <FlaskConical className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1E2420]">
              Crop Nutrient Requirements
            </h3>
            <p className="text-xs text-[#5C645E]">
              Total pure nutrients required for your field area ({displayAreaText})
            </p>
          </div>
        </div>

        {nutrientDemand.soilTestAdjustmentApplied && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-[#EAF3EE] text-[#2E7D32] border border-[#2E7D32]/20 self-start sm:self-auto">
            <Sparkles className="w-3.5 h-3.5" />
            Soil Test Adjusted
          </span>
        )}
      </div>

      {/* Explanatory Educational Note */}
      <div className="my-4 p-3 rounded-xl bg-[#F9F8F5] border border-[#EAE6DF] flex items-start gap-2.5 text-xs text-[#5C645E]">
        <Info className="w-4 h-4 text-[#528C70] shrink-0 mt-0.5" />
        <p>
          <strong className="text-[#1E2420] font-medium">Important distinction:</strong> These figures represent pure chemical nutrients (N, P₂O₅, K₂O) absorbed by crops. Commercial fertilizers supply these in specific percentages (e.g., Urea delivers 46% Nitrogen, DAP delivers 18% N and 46% P₂O₅).
        </p>
      </div>

      {/* Nutrient Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Nitrogen */}
        <div className="rounded-xl p-4 bg-[#F9F8F5] border border-[#E8E4DB] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#5C645E] mb-1">
              <span className="font-semibold text-[#1E2420] uppercase tracking-wider">Nitrogen (N)</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-[#E0DCD3] font-mono">
                {baselineRdfKgHa.nitrogen} kg/ha
              </span>
            </div>
            <div className="text-2xl font-bold text-[#1E2420] mt-1">
              {totalDemandKg.nitrogen.toFixed(1)}{' '}
              <span className="text-sm font-normal text-[#5C645E]">kg</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#5C645E] pt-2 border-t border-[#EAE6DF]">
            Drives vegetative foliage, green leaves & protein building.
          </div>
        </div>

        {/* Phosphorus */}
        <div className="rounded-xl p-4 bg-[#F9F8F5] border border-[#E8E4DB] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#5C645E] mb-1">
              <span className="font-semibold text-[#1E2420] uppercase tracking-wider">Phosphorus (P₂O₅)</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-[#E0DCD3] font-mono">
                {baselineRdfKgHa.phosphorus} kg/ha
              </span>
            </div>
            <div className="text-2xl font-bold text-[#1E2420] mt-1">
              {totalDemandKg.phosphorus.toFixed(1)}{' '}
              <span className="text-sm font-normal text-[#5C645E]">kg</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#5C645E] pt-2 border-t border-[#EAE6DF]">
            Stimulates root establishment, nodulation & early vigor.
          </div>
        </div>

        {/* Potassium */}
        <div className="rounded-xl p-4 bg-[#F9F8F5] border border-[#E8E4DB] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-[#5C645E] mb-1">
              <span className="font-semibold text-[#1E2420] uppercase tracking-wider">Potassium (K₂O)</span>
              <span className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-[#E0DCD3] font-mono">
                {baselineRdfKgHa.potassium} kg/ha
              </span>
            </div>
            <div className="text-2xl font-bold text-[#1E2420] mt-1">
              {totalDemandKg.potassium.toFixed(1)}{' '}
              <span className="text-sm font-normal text-[#5C645E]">kg</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-[#5C645E] pt-2 border-t border-[#EAE6DF]">
            Regulates stomata, drought tolerance, fruit firmness & test weight.
          </div>
        </div>

        {/* Secondary: Sulphur (if demanded) */}
        {totalDemandKg.sulfur !== undefined && totalDemandKg.sulfur > 0 && (
          <div className="rounded-xl p-4 bg-[#F9F8F5] border border-[#D4973B]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#5C645E] mb-1">
                <span className="font-semibold text-[#D4973B] uppercase tracking-wider">Sulphur (S)</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-[#E0DCD3] font-mono">
                  {baselineRdfKgHa.sulfur} kg/ha
                </span>
              </div>
              <div className="text-2xl font-bold text-[#1E2420] mt-1">
                {totalDemandKg.sulfur.toFixed(1)}{' '}
                <span className="text-sm font-normal text-[#5C645E]">kg</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-[#5C645E] pt-2 border-t border-[#EAE6DF]">
              Essential for oil synthesis in oilseeds and pungency in alliums.
            </div>
          </div>
        )}

        {/* Micronutrient: Zinc (if demanded) */}
        {totalDemandKg.zinc !== undefined && totalDemandKg.zinc > 0 && (
          <div className="rounded-xl p-4 bg-[#F9F8F5] border border-[#528C70]/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs text-[#5C645E] mb-1">
                <span className="font-semibold text-[#528C70] uppercase tracking-wider">Zinc (ZnSO₄ eq.)</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-white border border-[#E0DCD3] font-mono">
                  {baselineRdfKgHa.zinc} kg/ha
                </span>
              </div>
              <div className="text-2xl font-bold text-[#1E2420] mt-1">
                {totalDemandKg.zinc.toFixed(1)}{' '}
                <span className="text-sm font-normal text-[#5C645E]">kg</span>
              </div>
            </div>
            <div className="mt-3 text-[11px] text-[#5C645E] pt-2 border-t border-[#EAE6DF]">
              Chlorophyll production and internode elongation in cereals.
            </div>
          </div>
        )}
      </div>

      {/* Baseline Rationale details */}
      {nutrientDemand.soilTestAdjustmentDetails && (
        <div className="mt-4 pt-3 border-t border-[#EAE6DF] text-xs text-[#5C645E] flex items-start gap-2">
          <Scale className="w-3.5 h-3.5 text-[#528C70] shrink-0 mt-0.5" />
          <span>{nutrientDemand.soilTestAdjustmentDetails}</span>
        </div>
      )}
    </div>
  );
};
