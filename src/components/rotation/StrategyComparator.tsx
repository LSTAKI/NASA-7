'use client';

import React, { useState } from 'react';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { generateStrategiesForFarm } from '@/lib/calculations/simulator-engine';
import { FarmerPriorities, RotationStrategy } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { TrendingUp, Layers, Droplets, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export function StrategyComparator() {
  const { activeFarm } = useActiveFarm();

  const [priorities, setPriorities] = useState<FarmerPriorities>({
    soilHealth: 4,
    waterConservation: 4,
    economicYield: 3,
    pestDiseaseBreak: 4
  });

  const [selectedStrategyId, setSelectedStrategyId] = useState<string>('strat-nutrient');

  if (!activeFarm) return null;

  const strategies: RotationStrategy[] = generateStrategiesForFarm(activeFarm, priorities);
  const activeStrategy = strategies.find(s => s.id === selectedStrategyId) || strategies[0];

  return (
    <div className="space-y-6">
      {/* Strategy Selector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {strategies.map(strat => {
          const isSelected = strat.id === selectedStrategyId;
          return (
            <div
              key={strat.id}
              onClick={() => setSelectedStrategyId(strat.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer bg-white flex flex-col justify-between ${
                isSelected
                  ? 'border-[#2d6a4f] shadow-md ring-2 ring-[#2d6a4f]/20'
                  : 'border-[#e6e8e2] hover:border-[#b7e4c7] shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant={strat.id === 'strat-baseline' ? 'charcoal' : 'sage'} size="sm">
                    {strat.dataConfidence} Confidence
                  </Badge>
                  {isSelected && <span className="w-2.5 h-2.5 rounded-full bg-[#2d6a4f]"></span>}
                </div>
                <h4 className="font-bold text-sm text-[#191c1f] leading-snug">{strat.title}</h4>
                <p className="text-xs text-[#5a626a] mt-1 line-clamp-2">{strat.subtitle}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#f4f5f1]">
                <span className="text-[10px] text-[#88929c] uppercase font-semibold block mb-1.5">
                  Rotation Sequence
                </span>
                <div className="flex flex-wrap gap-1">
                  {strat.cropSequence.map((c, i) => (
                    <span
                      key={i}
                      className="text-[11px] font-medium bg-[#f4f5f1] text-[#2a2f35] px-1.5 py-0.5 rounded"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* In-depth Detailed Strategy Dossier */}
      <div className="bg-white rounded-xl border border-[#e6e8e2] p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f4f5f1]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-[#191c1f]">{activeStrategy.title}</h3>
              <Badge variant="forest" size="md">Scenario Simulation</Badge>
            </div>
            <p className="text-xs text-[#5a626a] mt-0.5">{activeStrategy.subtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#5a626a]">Data Reliability:</span>
            <Badge variant="sage" size="sm">{activeStrategy.dataConfidence}</Badge>
          </div>
        </div>

        {/* 4 Core Quantitative/Qualitative Impact Indicators */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
            <span className="text-[10px] font-semibold text-[#88929c] uppercase block">Soil Organic Matter</span>
            <span className="text-sm font-bold text-[#1b4332] mt-1 block">
              {activeStrategy.metrics.organicMatterImpact}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
            <span className="text-[10px] font-semibold text-[#88929c] uppercase block">Water Consumption</span>
            <span className="text-sm font-bold text-[#0284c7] mt-1 block">
              {activeStrategy.metrics.waterUsageIndex}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
            <span className="text-[10px] font-semibold text-[#88929c] uppercase block">Biological N₂ Balance</span>
            <span className="text-sm font-bold text-[#2d6a4f] mt-1 block">
              {activeStrategy.metrics.nitrogenBalance}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
            <span className="text-[10px] font-semibold text-[#88929c] uppercase block">Living Root Cover</span>
            <span className="text-sm font-bold text-[#d97706] mt-1 block">
              {activeStrategy.metrics.soilCoverDuration}
            </span>
          </div>
        </div>

        {/* Narrative Agronomic Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
            <h5 className="font-bold text-xs text-[#191c1f] flex items-center gap-1.5 mb-1.5">
              <Layers className="w-4 h-4 text-[#2d6a4f]" />
              Soil Dynamics &amp; Soil Structure
            </h5>
            <p className="text-xs text-[#5a626a] leading-relaxed">
              {activeStrategy.soilConsiderations}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
            <h5 className="font-bold text-xs text-[#191c1f] flex items-center gap-1.5 mb-1.5">
              <Droplets className="w-4 h-4 text-[#0284c7]" />
              Hydrological Water Footprint
            </h5>
            <p className="text-xs text-[#5a626a] leading-relaxed">
              {activeStrategy.waterRequirements}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
            <h5 className="font-bold text-xs text-[#191c1f] flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-4 h-4 text-[#d97706]" />
              Climate Stress Resilience
            </h5>
            <p className="text-xs text-[#5a626a] leading-relaxed">
              {activeStrategy.climateCompatibility}
            </p>
          </div>
        </div>

        {/* Advantages vs Potential Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-[#eaf7ee] border border-[#c7e9d2]">
            <h5 className="font-bold text-xs text-[#1b4332] flex items-center gap-1.5 mb-2">
              <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" />
              Expected Agronomic Advantages
            </h5>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#1b4332]/90">
              {activeStrategy.potentialAdvantages.map((adv, i) => (
                <li key={i}>{adv}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-[#fffbeb] border border-[#fde68a]">
            <h5 className="font-bold text-xs text-[#92400e] flex items-center gap-1.5 mb-2">
              <AlertTriangle className="w-4 h-4 text-[#d97706]" />
              Management Risks &amp; Trade-offs
            </h5>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-[#92400e]/90">
              {activeStrategy.potentialRisks.map((risk, i) => (
                <li key={i}>{risk}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
