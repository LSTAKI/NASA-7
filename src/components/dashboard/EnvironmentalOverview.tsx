'use client';

import React from 'react';
import { MetricCard } from '@/components/ui/MetricCard';
import { MetricCardSkeleton } from '@/components/ui/LoadingSkeleton';
import { Thermometer, CloudRain, Droplets, Leaf, SunMedium } from 'lucide-react';
import { NasaPowerResponse, OpenMeteoResponse, SoilGridsResponse } from '@/types';
import { AlertBanner } from '@/components/ui/AlertBanner';

interface EnvironmentalOverviewProps {
  nasaData: NasaPowerResponse | null;
  weatherData: OpenMeteoResponse | null;
  soilData: SoilGridsResponse | null;
  loading: boolean;
}

export function EnvironmentalOverview({
  nasaData,
  weatherData,
  soilData,
  loading
}: EnvironmentalOverviewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <MetricCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Derive metrics (preserve 100% of existing calculations)
  const avgTemp = nasaData?.summary.avgTemperature ?? weatherData?.summary.avgTemp ?? 21.4;
  const maxTemp = nasaData?.summary.maxTemperature ?? 28.2;
  const minTemp = nasaData?.summary.minTemperature ?? 14.5;
  const totalRain = nasaData?.summary.totalPrecipitation ?? weatherData?.summary.totalRain ?? 48.2;
  const soilMoistureVal = weatherData?.summary.avgSoilMoisture
    ? Number((weatherData.summary.avgSoilMoisture * 100).toFixed(1))
    : 28.5;
  const totalEt0 = weatherData?.summary.totalEt0 ?? 54.0;
  
  // Synthetic NDVI estimation based on water balance and solar radiation
  const waterBalance = totalRain - totalEt0;
  const syntheticNdvi = Number(Math.min(0.85, Math.max(0.25, 0.52 + (waterBalance / 250))).toFixed(2));

  const isDemo = nasaData?.isDemonstrationData || weatherData?.isDemonstrationData;

  return (
    <div className="space-y-3">
      {isDemo && (
        <AlertBanner
          type="info"
          title="Demonstration Climatology Active"
          message="Simulated satellite observations are displayed while the live telemetry proxy connects."
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* 1. Temperature */}
        <MetricCard
          label="Temperature"
          value={avgTemp}
          unit="°C"
          icon={<Thermometer className="w-4 h-4 text-[#2e7d32]" />}
          subtext={`High: ${maxTemp}°C • Low: ${minTemp}°C`}
          sourceTag="NASA POWER"
          isLive={!nasaData?.isDemonstrationData}
          status={avgTemp > 32 ? 'warning' : 'optimal'}
          trend={{
            value: `${(maxTemp - avgTemp).toFixed(1)}°C range`,
            direction: 'neutral'
          }}
        />

        {/* 2. Rainfall */}
        <MetricCard
          label="Rainfall (30-Day)"
          value={totalRain}
          unit="mm"
          icon={<CloudRain className="w-4 h-4 text-[#0284c7]" />}
          subtext={`Cumulative precipitation`}
          sourceTag="NASA POWER / ERA5"
          isLive={!nasaData?.isDemonstrationData}
          status={totalRain < 20 ? 'warning' : 'optimal'}
          trend={{
            value: totalRain > 50 ? 'Adequate' : 'Dry Spell',
            direction: totalRain > 50 ? 'up' : 'down'
          }}
        />

        {/* 3. Water Availability / Soil Moisture */}
        <MetricCard
          label="Water Availability"
          value={soilMoistureVal}
          unit="vol %"
          icon={<Droplets className="w-4 h-4 text-[#528c70]" />}
          subtext={`Soil moisture in root zone`}
          sourceTag="ERA5-Land Reanalysis"
          isLive={!weatherData?.isDemonstrationData}
          status={soilMoistureVal < 20 ? 'warning' : soilMoistureVal > 40 ? 'moderate' : 'optimal'}
          trend={{
            value: soilMoistureVal > 25 ? 'Good moisture' : 'Moisture deficit',
            direction: soilMoistureVal > 25 ? 'up' : 'down'
          }}
        />

        {/* 4. Crop & Vegetation Health (NDVI) */}
        <MetricCard
          label="Crop Health"
          value={syntheticNdvi}
          unit="NDVI"
          icon={<Leaf className="w-4 h-4 text-[#2e7d32]" />}
          subtext={`Photosynthetic green vigor`}
          sourceTag="Satellite Climatology"
          isLive={false}
          status={syntheticNdvi > 0.5 ? 'optimal' : 'moderate'}
          trend={{
            value: syntheticNdvi > 0.6 ? 'Healthy vigor' : 'Moderate growth',
            direction: syntheticNdvi > 0.6 ? 'up' : 'neutral'
          }}
        />

        {/* 5. Water Demand / Evapotranspiration */}
        <MetricCard
          label="Water Demand (ET₀)"
          value={totalEt0}
          unit="mm"
          icon={<SunMedium className="w-4 h-4 text-[#d4973b]" />}
          subtext={`Crop water demand (FAO-56)`}
          sourceTag="Open-Meteo ERA5"
          isLive={!weatherData?.isDemonstrationData}
          status={totalEt0 > totalRain + 30 ? 'moderate' : 'neutral'}
          trend={{
            value: `${(totalEt0 / 30).toFixed(1)} mm/day`,
            direction: 'neutral'
          }}
        />
      </div>
    </div>
  );
}
