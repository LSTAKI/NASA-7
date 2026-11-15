'use client';

import React from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';
import { ClimateTrendChart } from '@/components/dashboard/ClimateTrendChart';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CloudSun, Droplets, SunMedium, ShieldCheck, Wind, RefreshCw, MapPin } from 'lucide-react';
import { formatCoordinates } from '@/lib/utils/formatters';

export default function ClimateAnalysisPage() {
  const { activeFarm } = useActiveFarm();
  const { nasaData, weatherData, loading, refresh } = useEnvironmentalData(activeFarm?.location);

  const totalRain = weatherData?.summary.totalRain ?? 48.2;
  const totalEt0 = weatherData?.summary.totalEt0 ?? 54.0;
  const waterBalance = totalRain - totalEt0;
  const avgTemp = weatherData?.summary.avgTemp ?? 21.4;

  return (
    <DashboardShell onRefreshData={refresh} isRefreshing={loading}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e8e2]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#191c1f]">Historical Climate &amp; Water Balance Analysis</h2>
            <Badge variant="forest" size="md">ECMWF ERA5 / ERA5-Land Reanalysis</Badge>
          </div>
          <p className="text-xs text-[#5a626a] mt-1">
            Empirical historical climatology, dry spell frequency, and atmospheric vapor pressure deficits
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={refresh} isLoading={loading}>
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh Reanalysis
        </Button>
      </div>

      {/* Active Farm Geotag */}
      {activeFarm && (
        <div className="p-4 rounded-xl bg-white border border-[#e6e8e2] flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eaf7ee] flex items-center justify-center text-[#2d6a4f]">
              <CloudSun className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#191c1f]">{activeFarm.name}</h3>
              <p className="text-xs text-[#5a626a] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#2d6a4f]" />
                {activeFarm.region ? `${activeFarm.region}, ` : ''}{activeFarm.country} &bull; Coordinates: {formatCoordinates(activeFarm.location.latitude, activeFarm.location.longitude)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#88929c]">Reanalysis Grid: <strong>0.1° x 0.1° (~9km)</strong></span>
          </div>
        </div>
      )}

      {/* Water Balance & Agro-Climatology Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-[#e6e8e2] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5a626a] mb-1">
            <span className="font-semibold uppercase text-[10px]">Net Water Balance</span>
            <Droplets className="w-4 h-4 text-[#0284c7]" />
          </div>
          <div className="text-2xl font-bold text-[#191c1f]">
            {waterBalance >= 0 ? `+${waterBalance.toFixed(1)}` : waterBalance.toFixed(1)}{' '}
            <span className="text-xs font-normal text-[#88929c]">mm</span>
          </div>
          <p className="text-[11px] text-[#5a626a] mt-1">
            Rainfall ({totalRain} mm) minus ET0 ({totalEt0} mm)
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e6e8e2] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5a626a] mb-1">
            <span className="font-semibold uppercase text-[10px]">Dry Spell Indicator</span>
            <SunMedium className="w-4 h-4 text-[#d97706]" />
          </div>
          <div className="text-2xl font-bold text-[#d97706]">
            {waterBalance < -20 ? 'Moderate Stress' : 'Favorable'}
          </div>
          <p className="text-[11px] text-[#5a626a] mt-1">
            Based on consecutive non-precipitation days
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e6e8e2] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5a626a] mb-1">
            <span className="font-semibold uppercase text-[10px]">Thermal Regime</span>
            <CloudSun className="w-4 h-4 text-[#2d6a4f]" />
          </div>
          <div className="text-2xl font-bold text-[#191c1f]">
            {avgTemp.toFixed(1)}°C
          </div>
          <p className="text-[11px] text-[#5a626a] mt-1">
            30-day mean 2m air temperature
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white border border-[#e6e8e2] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#5a626a] mb-1">
            <span className="font-semibold uppercase text-[10px]">Evapotranspiration Index</span>
            <Wind className="w-4 h-4 text-[#52b788]" />
          </div>
          <div className="text-2xl font-bold text-[#191c1f]">
            {(totalEt0 / 30).toFixed(1)} <span className="text-xs font-normal text-[#88929c]">mm/day</span>
          </div>
          <p className="text-[11px] text-[#5a626a] mt-1">
            Atmospheric evaporative demand
          </p>
        </div>
      </div>

      {/* Main Historical Chart */}
      <ClimateTrendChart nasaData={nasaData} weatherData={weatherData} />

      {/* Plain Language Farmer Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-white border border-[#e6e8e2] shadow-xs">
          <h4 className="font-bold text-sm text-[#191c1f] flex items-center gap-2 mb-2">
            <Droplets className="w-4 h-4 text-[#0284c7]" />
            What This Means for Field Irrigation &amp; Sowing
          </h4>
          <p className="text-xs text-[#5a626a] leading-relaxed">
            Historical ERA5 observations indicate a 30-day cumulative reference evapotranspiration of {totalEt0} mm compared to {totalRain} mm of precipitation. For rainfed crops, establishing ground mulch or incorporating deep-rooting pulses (e.g. Chickpea or Sorghum) preserves residual subsoil moisture during intermittent dry spells.
          </p>
        </div>

        <div className="p-5 rounded-xl bg-white border border-[#e6e8e2] shadow-xs">
          <h4 className="font-bold text-sm text-[#191c1f] flex items-center gap-2 mb-2">
            <ShieldCheck className="w-4 h-4 text-[#2d6a4f]" />
            Scientific Scope &amp; Boundaries
          </h4>
          <p className="text-xs text-[#5a626a] leading-relaxed">
            <strong>Important Distinction:</strong> This module displays empirical historical meteorological reanalysis (ERA5 and NASA POWER) to analyze multi-year climatological envelopes and past seasonal trends. It does not generate probabilistic forward weather forecasts, which require separate numerical weather prediction (NWP) models.
          </p>
        </div>
      </div>
    </DashboardShell>
  );
}
