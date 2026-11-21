'use client';

import React from 'react';
import { OrganicAlternativesResult } from '@/types/fertilizer';
import { Leaf, Info, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';

interface OrganicAlternativesProps {
  organicData: OrganicAlternativesResult;
}

export const OrganicAlternatives: React.FC<OrganicAlternativesProps> = ({ organicData }) => {
  const { alternatives, areaHectares, areaAcres, generalOrganicAdvisory, cropName } = organicData;

  return (
    <div className="bg-white rounded-2xl border border-[#E0DCD3] p-5 md:p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE6DF] gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EAF3EE] flex items-center justify-center text-[#2E7D32]">
            <Leaf className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1E2420]">
              Organic Alternatives & Biofertilizer Practices
            </h3>
            <p className="text-xs text-[#5C645E]">
              Biological soil conditioners, manures and inoculants for {cropName || 'selected crop'} ({areaHectares.toFixed(1)} ha / {areaAcres.toFixed(1)} acres)
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#EAF3EE] text-[#2E7D32] border border-[#2E7D32]/20 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5" />
          Integrated Nutrient Management (INM)
        </span>
      </div>

      {/* Critical Scientific Disclaimer Notice */}
      <div className="my-4 p-4 rounded-xl bg-[#FFFDF5] border border-[#D4973B]/40 text-xs text-[#1E2420] flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-[#D4973B] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="font-semibold text-[#D4973B] block">
            Agronomic Notice: Organic Manures are Biological Conditioners, NOT 1:1 Chemical Substitutes
          </strong>
          <p className="text-[#5C645E] leading-relaxed">
            Organic manures (FYM, compost) release their nutrient content gradually through biological decomposition over 2 to 3 successive seasons. In the first year, approximately 25-30% of their Nitrogen, 60-70% of Phosphorus, and 70-80% of Potassium become plant-available (ICAR-IISS LTFE research). They build essential soil organic carbon and soil water retention, but cannot guarantee identical peak yields if directly substituted kilogram-for-kilogram against synthetic fertilizers in intensive high-yielding cropping.
          </p>
        </div>
      </div>

      {/* Alternatives Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {alternatives.map((alt, idx) => {
          const isBiofertilizer = alt.category === 'biofertilizer';
          const isGreenManure = alt.category === 'green_manure';

          let categoryBadge = 'Bulky Organic Manure';
          let badgeStyle = 'bg-[#EAF3EE] text-[#2E7D32] border-[#2E7D32]/20';

          if (isBiofertilizer) {
            categoryBadge = 'Bacterial Inoculant';
            badgeStyle = 'bg-[#F4F8F5] text-[#528C70] border-[#528C70]/30';
          } else if (isGreenManure) {
            categoryBadge = 'Green Manuring';
            badgeStyle = 'bg-[#FDF6E9] text-[#D4973B] border-[#D4973B]/30';
          }

          return (
            <div
              key={idx}
              className="rounded-2xl p-4 md:p-5 bg-[#F9F8F5] border border-[#E8E4DB] hover:border-[#528C70]/40 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                    {categoryBadge}
                  </span>
                  {alt.isProvisional && (
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#FFFDF5] text-[#D4973B] border border-[#D4973B]/30">
                      Provisional
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold text-[#1E2420]">{alt.productName}</h4>

                {alt.biofertilizerStrain && (
                  <p className="text-[11px] font-mono text-[#528C70] italic mt-0.5">
                    Strain: {alt.biofertilizerStrain}
                  </p>
                )}

                {/* Quantities */}
                <div className="mt-3 p-3 rounded-xl bg-white border border-[#EAE6DF] space-y-1.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-[#5C645E]">Field Dose ({areaHectares.toFixed(1)} ha):</span>
                    <strong className="text-sm font-bold text-[#1E2420]">
                      {alt.totalFarmDoseEstimated}
                    </strong>
                  </div>
                  <div className="flex justify-between items-baseline text-[11px] text-[#5C645E] pt-1 border-t border-[#EAE6DF]">
                    <span>Standard Rate:</span>
                    <span className="font-mono">{alt.recommendedDosePerHectare}</span>
                  </div>
                </div>

                {/* Nutrient Contribution Explanation */}
                <div className="mt-3 text-xs text-[#5C645E] space-y-2">
                  <div>
                    <strong className="text-[#1E2420] font-medium block mb-0.5">Biological Function:</strong>
                    <p className="leading-relaxed">{alt.nutrientSupplyExplanation}</p>
                  </div>
                  <div>
                    <strong className="text-[#1E2420] font-medium block mb-0.5">Method & Timing:</strong>
                    <p className="leading-relaxed">{alt.timingAndMethod}</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-white/80 border border-black/5 text-[11px]">
                    <strong className="text-[#528C70] font-medium block mb-0.5">Release Kinetics:</strong>
                    <p className="leading-relaxed text-[#5C645E]">{alt.releaseAssumptions}</p>
                  </div>
                </div>
              </div>

              {/* Reference Citation */}
              {alt.scientificReference && (
                <div className="mt-4 pt-3 border-t border-[#EAE6DF] text-[10px] text-[#5C645E] flex items-start gap-1.5">
                  <BookOpen className="w-3 h-3 text-[#528C70] shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{alt.scientificReference}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* General INM Guidance Notes */}
      {generalOrganicAdvisory.length > 0 && (
        <div className="mt-6 pt-4 border-t border-[#EAE6DF]">
          <h5 className="text-xs font-semibold text-[#1E2420] uppercase tracking-wider mb-2">
            Integrated Nutrient Management (INM) Principles
          </h5>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[#5C645E]">
            {generalOrganicAdvisory.map((adv, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#528C70] mt-1.5 shrink-0" />
                <span>{adv}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
