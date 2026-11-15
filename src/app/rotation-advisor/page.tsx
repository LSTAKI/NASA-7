'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { RotationAdvisorView } from '@/components/rotation/RotationAdvisorView';
import { Badge } from '@/components/ui/Badge';
import { ShieldCheck } from 'lucide-react';

export default function RotationAdvisorPage() {
  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e8e2]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#191c1f]">Explainable AI Crop Rotation Advisor</h2>
            <Badge variant="forest" size="md">Ecological Rule Engine</Badge>
          </div>
          <p className="text-xs text-[#5a626a] mt-1">
            Dynamic suitability ranking balancing soil horizons, water balance, pest cycle interruption, and biological nitrogen fixation
          </p>
        </div>
      </div>

      {/* Main Advisor View */}
      <RotationAdvisorView />

      {/* Scientific Methodology Disclaimer */}
      <div className="p-4 rounded-xl bg-white border border-[#e6e8e2] shadow-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5" />
        <div className="text-xs text-[#5a626a] leading-relaxed">
          <strong className="text-[#191c1f] block mb-0.5">Explainability &amp; Agronomic Governance:</strong>
          ARACHNOVA avoids opaque black-box deep learning. Every recommendation is scored via transparent, rule-grounded agronomic criteria derived from FAO EcoCrop matrices, regional extension recommendations, and certified crop science principles. Hard biological barriers (e.g. soil pH extremes, monoculture repeat families) are explicitly surfaced to the grower.
        </div>
      </div>
    </DashboardShell>
  );
}
