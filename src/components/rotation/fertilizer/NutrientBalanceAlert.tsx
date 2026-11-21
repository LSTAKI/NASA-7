'use client';

import React from 'react';
import { FertilizerPlanResult } from '@/types/fertilizer';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  ShieldAlert,
  HelpCircle,
} from 'lucide-react';

interface NutrientBalanceAlertProps {
  plan: FertilizerPlanResult;
}

export const NutrientBalanceAlert: React.FC<NutrientBalanceAlertProps> = ({ plan }) => {
  const {
    nutrientBalance,
    secondaryNutrientAccounting,
    isRecommendationComplete,
    recommendationStatus,
    warnings,
  } = plan;

  const alerts: {
    id: string;
    type: 'critical' | 'incomplete' | 'warning' | 'info';
    title: string;
    message: string;
    actionNote?: string;
  }[] = [];

  // 1. Critical: DAP Nitrogen Oversupply Imbalance
  if (nutrientBalance.isNutrientImbalanced && nutrientBalance.imbalanceWarnings.length > 0) {
    alerts.push({
      id: 'dap-imbalance',
      type: 'critical',
      title: 'Critical Nutrient Imbalance: Nitrogen Oversupply',
      message: nutrientBalance.imbalanceWarnings[0],
      actionNote: 'Recommended Action: Switch to the SSP + Urea + MOP combination to supply Phosphorus without exceeding your crop\'s Nitrogen limit.',
    });
  }

  // 2. Incomplete Formulation: Unmet Secondary / Micronutrients
  if (!isRecommendationComplete && secondaryNutrientAccounting.hasUnmetRequirements) {
    const unmet = secondaryNutrientAccounting.unmetNutrients.join(' and ');
    const sulfurDeficit = secondaryNutrientAccounting.sulfur?.status === 'deficit';
    const zincDeficit = secondaryNutrientAccounting.zinc?.status === 'deficit';

    let specificMessage = `The current fertilizer formulation does not satisfy the crop's demand for ${unmet}.`;
    if (sulfurDeficit && zincDeficit) {
      specificMessage += ` Deficit: ${Math.abs(secondaryNutrientAccounting.sulfur?.balanceKg || 0)} kg Sulphur and ${Math.abs(secondaryNutrientAccounting.zinc?.balanceKg || 0)} kg Zinc.`;
    } else if (sulfurDeficit) {
      specificMessage += ` Deficit: ${Math.abs(secondaryNutrientAccounting.sulfur?.balanceKg || 0)} kg Sulphur.`;
    } else if (zincDeficit) {
      specificMessage += ` Deficit: ${Math.abs(secondaryNutrientAccounting.zinc?.balanceKg || 0)} kg Zinc.`;
    }

    alerts.push({
      id: 'unmet-nutrients',
      type: 'incomplete',
      title: 'Incomplete Formulation: Supplemental Nutrients Required',
      message: specificMessage,
      actionNote: sulfurDeficit
        ? 'Action: Consider switching to SSP (which supplies 11% S naturally) or plan a supplemental application of Agricultural Gypsum (400 kg/ha at pegging for groundnut).'
        : 'Action: Apply Zinc Sulfate separately based on soil test diagnosis. Do not mix Zinc Sulfate with DAP/SSP.',
    });
  }

  // 3. Secondary Nutrient Oversupply (e.g. incidental sulfur from SSP)
  if (
    secondaryNutrientAccounting.sulfur?.status === 'surplus' &&
    secondaryNutrientAccounting.sulfur.balanceKg > 10 &&
    !alerts.some(a => a.id === 'unmet-nutrients')
  ) {
    alerts.push({
      id: 'sulfur-surplus',
      type: 'info',
      title: 'Incidental Nutrient Supply: Sulphur & Calcium',
      message: secondaryNutrientAccounting.sulfur.advisory || `SSP delivers a surplus of ${secondaryNutrientAccounting.sulfur.balanceKg} kg Sulphur and incidental Calcium.`,
      actionNote: 'Beneficial in neutral to alkaline soils. In acidic soils, monitor soil pH over multiple seasons.',
    });
  }

  // 4. Provisional Crop Status
  if (recommendationStatus === 'provisional') {
    alerts.push({
      id: 'provisional-crop',
      type: 'warning',
      title: 'Provisional Ecological Recommendation',
      message: 'This crop (Multi-Species Cover Crop) is managed for soil biological regeneration and green manuring rather than cash harvest. Synthetic nitrogen is deliberately set to 0 kg/ha to protect biological N₂ fixation.',
      actionNote: 'Apply minimal starter P & K only if laboratory soil testing shows extreme subsoil depletion.',
    });
  }

  // 5. General warnings (e.g. SoilGrids total nitrogen non-available alert)
  for (let i = 0; i < warnings.length; i++) {
    const w = warnings[i];
    if (w.includes('SoilGrids estimated Total Nitrogen')) {
      alerts.push({
        id: `soilgrids-n-warning-${i}`,
        type: 'info',
        title: 'Soil Science Notice: Total vs. Available Nitrogen',
        message: w,
        actionNote: 'To adjust nitrogen rates, provide a laboratory Soil Health Card measurement tested via Alkaline Permanganate (Subbiah & Asija 1956).',
      });
    }
  }

  // If completely balanced with zero alerts, show reassuring status pill
  if (alerts.length === 0) {
    return (
      <div className="rounded-xl p-4 bg-[#EAF3EE] border border-[#2E7D32]/20 flex items-start gap-3 text-xs text-[#1E2420]">
        <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-[#2E7D32] text-sm block">
            Fully Balanced Macronutrient Formulation
          </span>
          <p className="text-[#5C645E] mt-0.5">
            This fertilizer combination satisfies 100% of the target Nitrogen, Phosphorus, and Potassium requirements for your field area without excess nitrogen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {alerts.map(alert => {
        let containerStyle = 'bg-[#F9F8F5] border-[#E0DCD3] text-[#1E2420]';
        let icon = <Info className="w-5 h-5 text-[#528C70] shrink-0 mt-0.5" />;
        let badgeColor = 'bg-[#EAE6DF] text-[#1E2420]';

        if (alert.type === 'critical') {
          containerStyle = 'bg-[#FFF5F2] border-[#D96B27]/40 text-[#1E2420]';
          icon = <AlertCircle className="w-5 h-5 text-[#D96B27] shrink-0 mt-0.5" />;
          badgeColor = 'bg-[#D96B27]/10 text-[#D96B27] border border-[#D96B27]/30';
        } else if (alert.type === 'incomplete') {
          containerStyle = 'bg-[#FFFDF5] border-[#D4973B]/50 text-[#1E2420]';
          icon = <AlertTriangle className="w-5 h-5 text-[#D4973B] shrink-0 mt-0.5" />;
          badgeColor = 'bg-[#D4973B]/10 text-[#D4973B] border border-[#D4973B]/30';
        } else if (alert.type === 'warning') {
          containerStyle = 'bg-[#FFFDF5] border-[#D4973B]/40 text-[#1E2420]';
          icon = <ShieldAlert className="w-5 h-5 text-[#D4973B] shrink-0 mt-0.5" />;
          badgeColor = 'bg-[#D4973B]/10 text-[#D4973B] border border-[#D4973B]/30';
        } else if (alert.type === 'info') {
          containerStyle = 'bg-[#F4F8F5] border-[#528C70]/30 text-[#1E2420]';
          icon = <Info className="w-5 h-5 text-[#528C70] shrink-0 mt-0.5" />;
          badgeColor = 'bg-[#528C70]/10 text-[#528C70] border border-[#528C70]/20';
        }

        return (
          <div
            key={alert.id}
            className={`rounded-2xl p-4 md:p-5 border shadow-sm ${containerStyle}`}
          >
            <div className="flex items-start gap-3">
              {icon}
              <div className="flex-1 space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="text-sm font-semibold">{alert.title}</h4>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${badgeColor}`}>
                    {alert.type}
                  </span>
                </div>
                <p className="text-xs text-[#404642] leading-relaxed">{alert.message}</p>
                {alert.actionNote && (
                  <div className="mt-2 text-xs font-medium text-[#1E2420] p-2.5 rounded-lg bg-white/80 border border-black/5">
                    💡 {alert.actionNote}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
