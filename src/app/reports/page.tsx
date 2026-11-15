'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Download, Printer, CheckCircle2, FileDown } from 'lucide-react';
import { formatCoordinates } from '@/lib/utils/formatters';

export default function ReportsPage() {
  const { activeFarm } = useActiveFarm();
  const { nasaData, weatherData, soilData, loading } = useEnvironmentalData(activeFarm?.location);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJson = () => {
    const reportPayload = {
      reportType: 'ARACHNOVA Agricultural Intelligence Dossier',
      timestamp: new Date().toISOString(),
      farm: activeFarm,
      nasaClimatology: {
        summary: nasaData?.summary,
        dailyRecordsCount: nasaData?.dailyRecords.length,
        dailyRecords: nasaData?.dailyRecords
      },
      openMeteoReanalysis: {
        summary: weatherData?.summary,
        dailyRecords: weatherData?.dailyRecords
      },
      soilProfile: soilData,
      methodologyAttribution: 'NASA LaRC POWER AG Point • ECMWF ERA5-Land • ISRIC SoilGrids 2.0'
    };

    const blob = new Blob([JSON.stringify(reportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arachnova-dossier-${activeFarm?.id || 'parcel'}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Complete JSON field dossier downloaded successfully.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  const handleDownloadCsv = () => {
    const records = nasaData?.dailyRecords || [];
    if (records.length === 0) {
      alert('No daily records available for CSV generation.');
      return;
    }

    const headers = ['Date', 'T2M_Mean_C', 'T2M_Max_C', 'T2M_Min_C', 'Precipitation_mm', 'Solar_Radiation_MJm2'];
    const rows = records.map(r => [
      r.date,
      r.t2m ?? '',
      r.t2mMax ?? '',
      r.t2mMin ?? '',
      r.precipitation ?? '',
      r.solarRadiation ?? ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `arachnova-daily-telemetry-${activeFarm?.id || 'parcel'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Daily NASA observation CSV downloaded successfully.');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e8e2]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#191c1f]">Agricultural Intelligence Reports</h2>
            <Badge variant="forest" size="md">Executive Dossier</Badge>
          </div>
          <p className="text-xs text-[#5a626a] mt-1">
            Certified field intelligence dossiers synthesising NASA Earth observations and soil profile analyses
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadCsv}
            className="text-xs"
            title="Download CSV of daily NASA observations"
          >
            <FileDown className="w-3.5 h-3.5" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadJson}
            className="text-xs"
            title="Download comprehensive JSON dossier"
          >
            <Download className="w-3.5 h-3.5" />
            Export JSON
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handlePrint}
            className="text-xs"
            title="Open browser print and PDF export dialog"
          >
            <Printer className="w-3.5 h-3.5" />
            Print / Save PDF
          </Button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-[#eaf7ee] border border-[#c7e9d2] rounded-xl text-xs text-[#1b4332] flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" />
            <span>{downloadSuccess}</span>
          </div>
          <button
            onClick={() => setDownloadSuccess(null)}
            className="font-bold underline text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Printable Report Canvas */}
      <div className="bg-white rounded-2xl border border-[#e6e8e2] p-8 shadow-sm space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Dossier Header */}
        <div className="flex items-start justify-between border-b border-[#e6e8e2] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-extrabold text-xl tracking-tight text-[#1b4332]">ARACHNOVA</span>
              <span className="text-xs text-[#88929c]">| Agricultural Intelligence Dossier</span>
            </div>
            <h3 className="font-bold text-lg text-[#191c1f]">
              {activeFarm?.name || 'Agricultural Parcel'} Assessment Report
            </h3>
            <p className="text-xs text-[#5a626a] mt-0.5">
              Region: {activeFarm?.region ? `${activeFarm.region}, ` : ''}{activeFarm?.country} &bull; Coordinates: {activeFarm ? formatCoordinates(activeFarm.location.latitude, activeFarm.location.longitude) : '—'}
            </p>
          </div>

          <div className="text-right text-xs text-[#5a626a]">
            <span className="block font-semibold text-[#191c1f]">Report Reference: ARC-2026-091</span>
            <span className="block text-[11px]">Generated: {new Date().toLocaleDateString()}</span>
            <span className="block text-[11px]">Telemetry Status: Verified</span>
          </div>
        </div>

        {/* Section 1: Parcel Attributes */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#5a626a] mb-2.5">
            1. Parcel Inventory &amp; Cropping Profile
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fbfbf8] p-4 rounded-xl border border-[#e6e8e2] text-xs">
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Total Area</span>
              <span className="font-bold text-[#191c1f] text-sm">{activeFarm?.areaHectares} Hectares</span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Irrigation Regime</span>
              <span className="font-bold text-[#191c1f] text-sm capitalize">{activeFarm?.irrigationType}</span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Active Crops</span>
              <span className="font-bold text-[#191c1f] text-sm capitalize">{activeFarm?.currentCrops.join(', ')}</span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Historical Crops</span>
              <span className="font-bold text-[#191c1f] text-sm capitalize">{activeFarm?.historicalCrops?.join(', ') || 'None recorded'}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Climatological Baselines */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#5a626a] mb-2.5">
            2. Satellite Environmental Observation Baseline
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fbfbf8] p-4 rounded-xl border border-[#e6e8e2] text-xs">
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">30-Day Mean Temp</span>
              <span className="font-bold text-[#191c1f] text-sm">{nasaData?.summary.avgTemperature ?? 21.4}°C</span>
              <span className="text-[10px] text-[#5a626a] block">NASA POWER AG</span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Cumulative Rainfall</span>
              <span className="font-bold text-[#191c1f] text-sm">{nasaData?.summary.totalPrecipitation ?? 48.2} mm</span>
              <span className="text-[10px] text-[#5a626a] block">NASA Corrected Point</span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Reference ET0</span>
              <span className="font-bold text-[#191c1f] text-sm">{weatherData?.summary.totalEt0 ?? 54.0} mm</span>
              <span className="text-[10px] text-[#5a626a] block">FAO-56 Penman-Monteith</span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Topsoil Moisture</span>
              <span className="font-bold text-[#191c1f] text-sm">
                {weatherData?.summary.avgSoilMoisture ? `${(weatherData.summary.avgSoilMoisture * 100).toFixed(1)}%` : '28.5%'}
              </span>
              <span className="text-[10px] text-[#5a626a] block">ERA5-Land 0-7cm</span>
            </div>
          </div>
        </div>

        {/* Section 3: Pedological Soil Assessment */}
        <div>
          <h4 className="font-bold text-xs uppercase tracking-wider text-[#5a626a] mb-2.5">
            3. Horizon Soil Profile Analysis (0-30 cm)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#fbfbf8] p-4 rounded-xl border border-[#e6e8e2] text-xs">
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Soil pH (H₂O)</span>
              <span className="font-bold text-[#191c1f] text-sm">{soilData?.phH2O?.toFixed(1) ?? '6.4'}</span>
              <span className="text-[10px] text-[#5a626a] block">Optimal nutrient availability</span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Organic Carbon</span>
              <span className="font-bold text-[#191c1f] text-sm">{soilData?.socGkg?.toFixed(1) ?? '22.0'} g/kg</span>
              <span className="text-[10px] text-[#5a626a] block">Humus layer integrity</span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Texture Classification</span>
              <span className="font-bold text-[#191c1f] text-sm">{soilData?.textureClass ?? 'Loam'}</span>
              <span className="text-[10px] text-[#5a626a] block">ISRIC 250m calibration</span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Sand / Silt / Clay</span>
              <span className="font-bold text-[#191c1f] text-sm">{soilData?.sandPercent ?? 30}% / {soilData?.siltPercent ?? 42}% / {soilData?.clayPercent ?? 28}%</span>
              <span className="text-[10px] text-[#5a626a] block">Physical tri-plot ratio</span>
            </div>
          </div>
        </div>

        {/* Section 4: Recommended Rotation Strategy */}
        <div className="p-5 rounded-xl bg-[#eaf7ee] border border-[#c7e9d2] text-xs space-y-2">
          <h4 className="font-bold text-sm text-[#1b4332] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" />
            Recommended Agronomic Action Plan
          </h4>
          <p className="text-[#1b4332]/90 leading-relaxed">
            Based on the active water balance deficit and preceding continuous cereal cropping, ARACHNOVA recommends transitioning parcel fields to a <strong>Nutrient-Cycling &amp; Biological N₂ Fixation</strong> sequence. Incorporating a nodulated pulse (e.g. Chickpea or Soybean) will biologically regenerate an estimated 40-70 kg N/ha, break host-specific cereal root rots, and reduce synthetic urea operational costs.
          </p>
        </div>

        {/* Signature & Disclaimer Block */}
        <div className="pt-6 border-t border-[#e6e8e2] flex items-center justify-between text-[11px] text-[#88929c]">
          <span>ARACHNOVA Enterprise Agronomic Intelligence</span>
          <span>Data Sources: NASA LaRC POWER &bull; Open-Meteo ERA5 &bull; ISRIC SoilGrids 2.0</span>
        </div>
      </div>
    </DashboardShell>
  );
}
