'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { EnvironmentalOverview } from '@/components/dashboard/EnvironmentalOverview';
import { ClimateTrendChart } from '@/components/dashboard/ClimateTrendChart';
import { AgriculturalInsights } from '@/components/dashboard/AgriculturalInsights';
import { RecentFarmActivity } from '@/components/dashboard/RecentFarmActivity';
import { GlobalMap } from '@/components/maps/GlobalMap';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { useEnvironmentalData } from '@/hooks/useEnvironmentalData';
import { Globe, Satellite, ArrowUpRight, Sparkles, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { formatCoordinates } from '@/lib/utils/formatters';

export default function OverviewPage() {
  const { activeFarm, farms } = useActiveFarm();
  const { nasaData, weatherData, soilData, loading, refresh, lastUpdated } = useEnvironmentalData(
    activeFarm?.location
  );

  const [selectedMapCoords, setSelectedMapCoords] = useState(activeFarm?.location || null);

  return (
    <DashboardShell onRefreshData={refresh} isRefreshing={loading}>
      {/* 1. Welcome Section & Global Overview Header */}
      <section className="bg-gradient-to-r from-[#1b4332] via-[#24543f] to-[#2d6a4f] rounded-2xl p-6 lg:p-8 text-white shadow-md relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 pointer-events-none blur-2xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="sage" size="sm" className="bg-[#52b788]/20 text-[#95d5b2] border-[#52b788]/30">
                <Satellite className="w-3.5 h-3.5 text-[#74c69d]" />
                NASA Earth Observation &bull; ERA5 Hybrid
              </Badge>
              <span className="text-xs text-[#95d5b2]/80">
                Updated {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              ARACHNOVA — Global Agricultural Intelligence
            </h2>

            <p className="text-sm text-[#d8f3dc]/90 leading-relaxed">
              Connecting NASA Earth Observation datasets, satellite climate reanalysis, and ISRIC SoilGrids 250m telemetry with explainable agronomic crop rotation science.
            </p>

            {activeFarm && (
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#95d5b2]">
                <span className="flex items-center gap-1 font-semibold text-white">
                  <MapPin className="w-3.5 h-3.5 text-[#74c69d]" />
                  Active Focus: {activeFarm.name} ({activeFarm.country})
                </span>
                <span>&bull;</span>
                <span className="font-mono">
                  {formatCoordinates(activeFarm.location.latitude, activeFarm.location.longitude)}
                </span>
                <span>&bull;</span>
                <span>{activeFarm.areaHectares} ha</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <Link href="/rotation-advisor">
              <Button variant="secondary" size="md" className="w-full justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  Run AI Rotation Advisor
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/farms">
              <Button variant="outline" size="md" className="w-full justify-between text-xs bg-white/10 text-white border-white/20 hover:bg-white/20">
                <span>Manage {farms.length} Registered Farms</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Environmental Indicators Bar (5 Metric Cards) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#191c1f] uppercase tracking-wider">
            Satellite Environmental Indicators
          </h3>
          <span className="text-xs text-[#5a626a]">Real-time telemetry query</span>
        </div>
        <EnvironmentalOverview
          nasaData={nasaData}
          weatherData={weatherData}
          soilData={soilData}
          loading={loading}
        />
      </section>

      {/* 3. Global Interactive Map (MapLibre GL) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#191c1f] uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#2d6a4f]" />
              Geospatial Agricultural Observer
            </h3>
            <p className="text-xs text-[#5a626a]">
              Click any global coordinate to extract NASA POWER climatology and soil profiles
            </p>
          </div>
          <span className="text-xs font-medium text-[#2d6a4f]">
            {activeFarm?.name} Selected
          </span>
        </div>
        <GlobalMap
          onLocationSelect={(coords) => setSelectedMapCoords(coords)}
          selectedCoords={selectedMapCoords}
          height="400px"
        />
      </section>

      {/* 4. Historical Climate Trend Chart & Agricultural Insights */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClimateTrendChart nasaData={nasaData} weatherData={weatherData} />
        </div>
        <div className="lg:col-span-1">
          <AgriculturalInsights />
        </div>
      </section>

      {/* 5. Recent Farm Activity & Quick Action Dossier */}
      <section>
        <RecentFarmActivity />
      </section>
    </DashboardShell>
  );
}
