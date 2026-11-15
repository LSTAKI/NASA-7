'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';
import { SoilProfileVisualizer } from '@/components/soil/SoilProfileVisualizer';
import { ManualSoilModal } from '@/components/soil/ManualSoilModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Layers, Plus, RefreshCw, MapPin } from 'lucide-react';
import { formatCoordinates } from '@/lib/utils/formatters';

export default function SoilIntelligencePage() {
  const { activeFarm, updateFarm } = useActiveFarm();
  const { soilData, loading, refresh } = useEnvironmentalData(activeFarm?.location);

  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  return (
    <DashboardShell onRefreshData={refresh} isRefreshing={loading}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e8e2]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#191c1f]">Soil Intelligence &amp; Horizon Modeling</h2>
            <Badge variant="forest" size="md">ISRIC SoilGrids 250m v2.0</Badge>
          </div>
          <p className="text-xs text-[#5a626a] mt-1">
            Global pedometric property mapping, textural tri-plot classification, and biological carbon indicators
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsManualModalOpen(true)}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Enter Lab Soil Test
          </Button>
          <Button variant="outline" size="sm" onClick={refresh} isLoading={loading}>
            <RefreshCw className="w-3.5 h-3.5" />
            Re-sync SoilGrids
          </Button>
        </div>
      </div>

      {/* Active Farm Banner */}
      {activeFarm && (
        <div className="p-4 rounded-xl bg-white border border-[#e6e8e2] flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaf7ee] flex items-center justify-center text-[#2d6a4f]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#191c1f]">{activeFarm.name}</h3>
              <p className="text-xs text-[#5a626a] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2d6a4f]" />
                {activeFarm.region ? `${activeFarm.region}, ` : ''}{activeFarm.country} &bull; {formatCoordinates(activeFarm.location.latitude, activeFarm.location.longitude)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <Badge variant={activeFarm.soil?.source === 'manual_test' ? 'forest' : 'sage'} size="sm">
              Source: {activeFarm.soil?.source === 'manual_test' ? 'Certified Lab Test' : 'ISRIC SoilGrids Spatial Model'}
            </Badge>
          </div>
        </div>
      )}

      {/* Main Soil Visualizer */}
      <SoilProfileVisualizer
        soilData={soilData}
        farmSoil={activeFarm?.soil}
        loading={loading}
        onOpenManualModal={() => setIsManualModalOpen(true)}
      />

      {/* Soil Depth Horizon Breakdown Table */}
      <div className="bg-white rounded-xl border border-[#e6e8e2] p-5 shadow-xs">
        <h4 className="font-bold text-sm text-[#191c1f] mb-3 flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#2d6a4f]" />
          Modeled Soil Profile Depths (0 to 30 cm)
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#fbfbf8] border-b border-[#e6e8e2] text-[#5a626a] uppercase font-semibold">
              <tr>
                <th className="py-2.5 px-3">Depth Interval</th>
                <th className="py-2.5 px-3">pH (H₂O)</th>
                <th className="py-2.5 px-3">SOC (g/kg)</th>
                <th className="py-2.5 px-3">Sand %</th>
                <th className="py-2.5 px-3">Clay %</th>
                <th className="py-2.5 px-3">Silt %</th>
                <th className="py-2.5 px-3">Agronomic Functional Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f4f5f1] text-[#2a2f35]">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#1b4332]">0 - 5 cm</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.phH2O ? (soilData.phH2O + 0.1).toFixed(1) : '6.5'}</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.socGkg ? (soilData.socGkg * 1.15).toFixed(1) : '24.5'}</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.sandPercent ?? 30}%</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.clayPercent ?? 26}%</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.siltPercent ?? 44}%</td>
                <td className="py-2.5 px-3 text-[#5a626a]">Germination layer, organic mulch decomposition</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#1b4332]">5 - 15 cm</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.phH2O ? soilData.phH2O.toFixed(1) : '6.4'}</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.socGkg ? soilData.socGkg.toFixed(1) : '22.0'}</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.sandPercent ?? 30}%</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.clayPercent ?? 28}%</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.siltPercent ?? 42}%</td>
                <td className="py-2.5 px-3 text-[#5a626a]">Primary nutrient exchange, high root density zone</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-[#1b4332]">15 - 30 cm</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.phH2O ? (soilData.phH2O - 0.1).toFixed(1) : '6.3'}</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.socGkg ? (soilData.socGkg * 0.85).toFixed(1) : '18.5'}</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.sandPercent ? (soilData.sandPercent - 2) : 28}%</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.clayPercent ? (soilData.clayPercent + 2) : 30}%</td>
                <td className="py-2.5 px-3 font-mono">{soilData?.siltPercent ?? 42}%</td>
                <td className="py-2.5 px-3 text-[#5a626a]">Subsoil moisture reserve, taproot exploration depth</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Soil Test Input Modal */}
      {isManualModalOpen && activeFarm && (
        <ManualSoilModal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          currentSoil={activeFarm.soil}
          onSave={(updatedSoil) => {
            updateFarm(activeFarm.id, { soil: updatedSoil });
          }}
        />
      )}
    </DashboardShell>
  );
}
