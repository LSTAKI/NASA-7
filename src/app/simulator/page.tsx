'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { StrategyComparator } from '@/components/rotation/StrategyComparator';
import { Badge } from '@/components/ui/Badge';
import { ShieldAlert } from 'lucide-react';

export default function SimulatorPage() {
  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e8e2]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#191c1f]">Cropping Strategy Simulator</h2>
            <Badge variant="forest" size="md">Multi-Year Scenario Modeling</Badge>
          </div>
          <p className="text-xs text-[#5a626a] mt-1">
            Compare 4 holistic multi-season regimes: Baseline vs Nutrient-Cycling, Water-Conscious, and Soil-Protection
          </p>
        </div>
      </div>

      {/* Main Strategy Comparator */}
      <StrategyComparator />

      {/* Scientific Governance Disclaimer */}
      <div className="p-4 rounded-xl bg-white border border-[#e6e8e2] shadow-xs flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#88929c] shrink-0 mt-0.5" />
        <div className="text-xs text-[#5a626a] leading-relaxed">
          <strong className="text-[#191c1f] block mb-0.5">Scientific Modeling Integrity:</strong>
          ARACHNOVA rejects arbitrary fabricated percentage increases (e.g. &ldquo;+37% yield guarantee&rdquo;). Agricultural outcomes depend on real-world stochastic rainfall events, soil micro-variation, and operational execution. Impacts are presented with categorical biological trajectories and substantiated with verifiable agronomic mechanics.
        </div>
      </div>
    </DashboardShell>
  );
}
