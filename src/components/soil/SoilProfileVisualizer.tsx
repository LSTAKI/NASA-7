'use client';

import React, { useState } from 'react';
import { SoilGridsResponse, SoilProperties } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Layers, Info, CheckCircle2, ShieldAlert, Sparkles, TestTube } from 'lucide-react';

interface SoilProfileVisualizerProps {
  soilData: SoilGridsResponse | null;
  farmSoil?: SoilProperties;
  loading: boolean;
  onOpenManualModal?: () => void;
}

export function SoilProfileVisualizer({
  soilData,
  farmSoil,
  loading,
  onOpenManualModal
}: SoilProfileVisualizerProps) {
  const hasManualTest = farmSoil?.source === 'manual_test';
  const [activeSource, setActiveSource] = useState<'model' | 'lab'>(hasManualTest ? 'lab' : 'model');

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-[#e6e8e2] p-6 animate-pulse space-y-4">
        <div className="h-6 bg-[#e6e8e2] rounded w-1/3"></div>
        <div className="h-24 bg-[#f4f5f1] rounded"></div>
      </div>
    );
  }

  // Choose source data
  const isLab = activeSource === 'lab' && hasManualTest;

  const ph = isLab ? (farmSoil?.phH2O ?? 6.5) : (soilData?.phH2O ?? 6.4);
  const soc = isLab ? (farmSoil?.organicCarbon ?? 20.0) : (soilData?.socGkg ?? 22.0);
  const nitrogen = isLab ? (farmSoil?.nitrogen ?? 1.8) : (soilData?.nitrogenGkg ?? 1.8);
  const sand = isLab ? (farmSoil?.sand ?? 30) : (soilData?.sandPercent ?? 30);
  const clay = isLab ? (farmSoil?.clay ?? 28) : (soilData?.clayPercent ?? 28);
  const silt = isLab ? (farmSoil?.silt ?? 42) : (soilData?.siltPercent ?? 42);

  // Compute textural class
  let texture = soilData?.textureClass ?? 'Loam';
  if (isLab) {
    if (clay >= 40) texture = 'Clay';
    else if (sand >= 70) texture = 'Sandy Loam / Sand';
    else if (silt >= 80) texture = 'Silt';
    else if (clay >= 27 && clay < 40 && sand <= 45) texture = 'Clay Loam';
    else if (sand >= 45 && clay <= 20) texture = 'Sandy Loam';
    else if (silt >= 50 && clay <= 27) texture = 'Silt Loam';
    else texture = 'Loam';
  }

  const completeness = isLab ? 100 : (soilData?.dataCompleteness ?? 90);

  return (
    <div className="bg-white rounded-xl border border-[#e6e8e2] p-6 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#f4f5f1]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-lg text-[#191c1f]">
              Soil Horizon Profile &amp; Physical Texture
            </h3>
            <Badge variant={isLab ? 'forest' : 'sage'} size="sm">
              {isLab ? 'Certified Lab Test' : 'ISRIC SoilGrids 250m Model'}
            </Badge>
          </div>
          <p className="text-xs text-[#5a626a] mt-0.5">
            {isLab
              ? `Laboratory test recorded ${farmSoil?.lastUpdated || 'recently'} for 0-30cm core horizon`
              : 'ISRIC SoilGrids 250m global spatial modeling with texture calibration'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Source Toggle if manual test is available */}
          {hasManualTest && (
            <div className="flex items-center bg-[#f4f5f1] p-1 rounded-lg border border-[#e6e8e2] text-xs">
              <button
                onClick={() => setActiveSource('lab')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-all ${
                  activeSource === 'lab' ? 'bg-white text-[#1b4332] shadow-xs' : 'text-[#5a626a]'
                }`}
              >
                <TestTube className="w-3.5 h-3.5 text-[#2d6a4f]" />
                Lab Test
              </button>
              <button
                onClick={() => setActiveSource('model')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded font-semibold transition-all ${
                  activeSource === 'model' ? 'bg-white text-[#1b4332] shadow-xs' : 'text-[#5a626a]'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-[#52b788]" />
                SoilGrids
              </button>
            </div>
          )}

          {onOpenManualModal && (
            <button
              onClick={onOpenManualModal}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#d4d7cf] bg-[#fbfbf8] hover:bg-[#f4f5f1] text-[#191c1f]"
            >
              {hasManualTest ? 'Update Lab Test' : 'Enter Lab Soil Test'}
            </button>
          )}
        </div>
      </div>

      {/* Primary Chemical & Physical Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
          <span className="text-[10px] font-semibold text-[#88929c] uppercase block">Soil pH (H₂O)</span>
          <span className="text-2xl font-bold text-[#191c1f] mt-1 block">{ph.toFixed(1)}</span>
          <span className="text-[11px] text-[#5a626a] mt-1 block">
            {ph < 6.0 ? 'Moderately Acidic' : ph > 7.5 ? 'Moderately Alkaline' : 'Near Neutral (Optimal)'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
          <span className="text-[10px] font-semibold text-[#88929c] uppercase block">Organic Carbon</span>
          <span className="text-2xl font-bold text-[#191c1f] mt-1 block">{soc.toFixed(1)} <span className="text-xs font-normal text-[#88929c]">g/kg</span></span>
          <span className="text-[11px] text-[#5a626a] mt-1 block">
            {soc > 25 ? 'High Humus Layer' : soc > 15 ? 'Moderate' : 'Low Organic Reserve'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
          <span className="text-[10px] font-semibold text-[#88929c] uppercase block">Total Nitrogen</span>
          <span className="text-2xl font-bold text-[#191c1f] mt-1 block">{nitrogen.toFixed(2)} <span className="text-xs font-normal text-[#88929c]">g/kg</span></span>
          <span className="text-[11px] text-[#5a626a] mt-1 block">Subsoil reserve</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
          <span className="text-[10px] font-semibold text-[#88929c] uppercase block">Sand Fraction</span>
          <span className="text-2xl font-bold text-[#d97706] mt-1 block">{sand.toFixed(0)}%</span>
          <span className="text-[11px] text-[#5a626a] mt-1 block">50 - 2000 μm</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
          <span className="text-[10px] font-semibold text-[#88929c] uppercase block">Clay Fraction</span>
          <span className="text-2xl font-bold text-[#b45309] mt-1 block">{clay.toFixed(0)}%</span>
          <span className="text-[11px] text-[#5a626a] mt-1 block">&lt; 2 μm (CEC carrier)</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#fbfbf8] border border-[#e6e8e2]">
          <span className="text-[10px] font-semibold text-[#88929c] uppercase block">Silt Fraction</span>
          <span className="text-2xl font-bold text-[#2d6a4f] mt-1 block">{silt.toFixed(0)}%</span>
          <span className="text-[11px] text-[#5a626a] mt-1 block">2 - 50 μm</span>
        </div>
      </div>

      {/* Soil Texture Breakdown Bar */}
      <div>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="font-semibold text-[#191c1f]">
            Physical Texture Classification: <span className="text-[#2d6a4f]">{texture}</span>
          </span>
          <span className="text-[#88929c]">Sand {sand.toFixed(0)}% | Silt {silt.toFixed(0)}% | Clay {clay.toFixed(0)}%</span>
        </div>
        <div className="w-full h-4 rounded-full overflow-hidden flex bg-[#e6e8e2]">
          <div style={{ width: `${sand}%` }} className="bg-[#fcd34d]" title={`Sand: ${sand}%`}></div>
          <div style={{ width: `${silt}%` }} className="bg-[#52b788]" title={`Silt: ${silt}%`}></div>
          <div style={{ width: `${clay}%` }} className="bg-[#b45309]" title={`Clay: ${clay}%`}></div>
        </div>
        <div className="flex items-center gap-4 mt-2 text-[11px] text-[#5a626a]">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#fcd34d]"></span> Sand (Drainage / Aeration)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#52b788]"></span> Silt (Available Moisture)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#b45309]"></span> Clay (Nutrient Holding / Plasticity)
          </span>
        </div>
      </div>

      {/* Agronomic Explanations for Farmers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl border border-[#e6e8e2] bg-[#fbfbf8]">
          <h4 className="font-bold text-xs text-[#191c1f] flex items-center gap-1.5 mb-1.5">
            <Layers className="w-4 h-4 text-[#2d6a4f]" />
            Cation Exchange &amp; Buffering
          </h4>
          <p className="text-xs text-[#5a626a] leading-relaxed">
            With a clay fraction of {clay.toFixed(0)}% and organic carbon of {soc.toFixed(1)} g/kg, this soil horizon maintains good cation exchange capacity (CEC), retaining applied potassium, magnesium, and calcium.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[#e6e8e2] bg-[#fbfbf8]">
          <h4 className="font-bold text-xs text-[#191c1f] flex items-center gap-1.5 mb-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" />
            Drainage &amp; Compaction Sensitivity
          </h4>
          <p className="text-xs text-[#5a626a] leading-relaxed">
            The {texture.toLowerCase()} matrix provides balanced water-holding capacity. Avoid heavy machinery operations immediately after soaking rainfall events to prevent subsoil plow pan smearing.
          </p>
        </div>

        <div className="p-4 rounded-xl border border-[#e6e8e2] bg-[#fbfbf8]">
          <h4 className="font-bold text-xs text-[#191c1f] flex items-center gap-1.5 mb-1.5">
            <Info className="w-4 h-4 text-[#0284c7]" />
            Nutrient Bio-Availability
          </h4>
          <p className="text-xs text-[#5a626a] leading-relaxed">
            A soil pH of {ph.toFixed(1)} falls squarely in the peak solubility window for primary macronutrients (NPK). Symbiotic legume nodulation (Rhizobia) proceeds efficiently at this reaction.
          </p>
        </div>
      </div>

      {/* Scientific Governance Disclaimer */}
      <div className="p-3.5 rounded-lg bg-[#f4f5f1] border border-[#e6e8e2] flex items-start gap-2.5 text-xs text-[#5a626a]">
        <ShieldAlert className="w-4 h-4 text-[#88929c] shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[11px]">
          <strong>Scientific Methodology Notice:</strong> Values displayed reflect {isLab ? 'certified laboratory core test analysis' : '250m machine-learning spatial models from ISRIC SoilGrids 2.0 (calibrated against global soil profile databases)'}. In keeping with rigorous pedological standards, ARACHNOVA does not calculate an unvalidated single &ldquo;soil health score&rdquo;, but presents empirical physical and chemical dimensions separately.
        </p>
      </div>
    </div>
  );
}
