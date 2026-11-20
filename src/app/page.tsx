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
import {
  Satellite,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Globe2,
  Layers,
  CloudSun,
  TrendingUp,
  Sprout,
  Compass
} from 'lucide-react';
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

  const quickNavLinks = [
    {
      title: 'Earth Intelligence',
      desc: 'Solar energy & weather',
      href: '/earth-intelligence',
      icon: Globe2,
      accent: 'text-[#2e7d32] bg-[#eaf3ee]'
    },
    {
      title: 'Soil Intelligence',
      desc: 'Soil layers & organic carbon',
      href: '/soil-intelligence',
      icon: Layers,
      accent: 'text-[#d4973b] bg-[#fef9ee]'
    },
    {
      title: 'Climate Analysis',
      desc: 'Rainfall & moisture deficits',
      href: '/climate-analysis',
      icon: CloudSun,
      accent: 'text-[#0284c7] bg-[#f0f7ff]'
    },
    {
      title: 'Crop Rotation Advisor',
      desc: 'AI crop recommendations',
      href: '/rotation-advisor',
      icon: Sparkles,
      accent: 'text-[#2e7d32] bg-[#eaf3ee]'
    },
    {
      title: 'Strategy Simulator',
      desc: 'Multi-season yield & soil plans',
      href: '/simulator',
      icon: TrendingUp,
      accent: 'text-[#528c70] bg-[#eaf3ee]'
    }
  ];

  return (
    <DashboardShell onRefreshData={refresh} isRefreshing={loading}>
      {/* 1. Welcoming Farm Header */}
      <section className="bg-gradient-to-br from-[#18392b] via-[#204a37] to-[#286043] rounded-3xl p-6 lg:p-8 text-white shadow-sm border border-[#244b39]/40 relative overflow-hidden">
        {/* Subtle decorative leaf aura */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="sage" size="sm" className="bg-[#528c70]/30 text-[#d4eedb] border-[#73aa8f]/30">
                <Satellite className="w-3.5 h-3.5 text-[#a8d5ba]" />
                NASA Earth Observation &bull; ERA5 Hybrid
              </Badge>
              <span className="text-xs text-[#a8d5ba]/90 font-medium">
                Updated {lastUpdated ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Live'}
              </span>
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Welcome to your farm overview
            </h2>

            <p className="text-sm text-[#d4eedb]/90 leading-relaxed">
              Here&apos;s a simple look at your farm, soil and growing conditions, powered by NASA satellite observations and sustainable agronomic science.
            </p>

            {activeFarm && (
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-[#d4eedb]/90">
                <span className="flex items-center gap-1.5 font-bold text-white bg-white/10 px-3 py-1 rounded-full border border-white/15">
                  <MapPin className="w-3.5 h-3.5 text-[#a8d5ba]" />
                  {activeFarm.name} ({activeFarm.country})
                </span>
                <span className="hidden sm:inline text-white/50">&bull;</span>
                <span className="font-mono text-[11px] font-medium">
                  {formatCoordinates(activeFarm.location.latitude, activeFarm.location.longitude)}
                </span>
                <span className="hidden sm:inline text-white/50">&bull;</span>
                <span className="font-semibold">{activeFarm.areaHectares} hectares</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap lg:flex-col gap-2.5 shrink-0">
            <Link href="/rotation-advisor">
              <Button variant="secondary" size="md" className="w-full justify-between text-xs font-bold shadow-xs">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#18392b]" />
                  Run AI Rotation Advisor
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/farms">
              <Button variant="outline" size="md" className="w-full justify-between text-xs bg-white/10 text-white border-white/20 hover:bg-white/20">
                <span className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-[#a8d5ba]" />
                  Manage {farms.length} Registered Farms
                </span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Quick Navigation Shortcuts */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#616d64] uppercase tracking-wider flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#2e7d32]" />
            Quick Exploration
          </h3>
          <span className="text-xs text-[#8d9890]">Explore full platform features</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickNavLinks.map(link => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="bg-white rounded-2xl border border-[#e8e5dc] p-3.5 hover:border-[#c5dfcc] hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl ${link.accent}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#8d9890] group-hover:text-[#2e7d32] transition-colors" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1e2420] group-hover:text-[#2e7d32] transition-colors">
                    {link.title}
                  </h4>
                  <p className="text-[11px] text-[#616d64] mt-0.5 truncate">
                    {link.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Key Farm Indicators */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1e2420] tracking-tight">
              Key Farm Indicators
            </h3>
            <p className="text-xs text-[#616d64]">
              Daily satellite and root-zone observations for your fields
            </p>
          </div>
          <span className="text-xs font-medium text-[#2e7d32]">Live telemetry</span>
        </div>
        <EnvironmentalOverview
          nasaData={nasaData}
          weatherData={weatherData}
          soilData={soilData}
          loading={loading}
        />
      </section>

      {/* 4. Interactive Farm Map */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1e2420] tracking-tight flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-[#2e7d32]" />
              Interactive Farm Map
            </h3>
            <p className="text-xs text-[#616d64]">
              Explore your farm location and see satellite readings anywhere in the world
            </p>
          </div>
          <span className="text-xs font-semibold text-[#2e7d32] bg-[#eaf3ee] px-2.5 py-1 rounded-full border border-[#c5dfcc]">
            {activeFarm?.name} Selected
          </span>
        </div>
        <GlobalMap
          onLocationSelect={(coords) => setSelectedMapCoords(coords)}
          selectedCoords={selectedMapCoords}
          height="400px"
        />
      </section>

      {/* 5. Historical Weather Charts & Field Advice */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ClimateTrendChart nasaData={nasaData} weatherData={weatherData} />
        </div>
        <div className="lg:col-span-1">
          <AgriculturalInsights />
        </div>
      </section>

      {/* 6. Active Farm & Field Details */}
      <section>
        <RecentFarmActivity />
      </section>
    </DashboardShell>
  );
}
