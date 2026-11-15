'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Search, Bell, User, RefreshCw, Sparkles, MapPin } from 'lucide-react';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { Badge } from '@/components/ui/Badge';
import { formatCoordinates } from '@/lib/utils/formatters';

interface AppHeaderProps {
  onMenuToggle: () => void;
  onRefreshData?: () => void;
  isRefreshing?: boolean;
}

export function AppHeader({ onMenuToggle, onRefreshData, isRefreshing = false }: AppHeaderProps) {
  const pathname = usePathname();
  const { activeFarm } = useActiveFarm();
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    '/': {
      title: 'Global Intelligence Overview',
      subtitle: 'Earth observations, active soil indicators & climate monitoring'
    },
    '/earth-intelligence': {
      title: 'Earth Intelligence & NASA Observations',
      subtitle: 'Daily solar irradiance, satellite precipitation & thermal telemetry'
    },
    '/soil-intelligence': {
      title: 'Soil Health & Profile Intelligence',
      subtitle: 'ISRIC SoilGrids 250m estimates, textural analysis & carbon metrics'
    },
    '/climate-analysis': {
      title: 'Climate Risk & Water Balance Analysis',
      subtitle: 'ERA5 reanalysis baselines, ET0 deficits & historical climate trends'
    },
    '/farms': {
      title: 'Farm Management & Registry',
      subtitle: 'Georeferenced parcel inventory, crop histories & agronomic settings'
    },
    '/rotation-advisor': {
      title: 'Explainable AI Crop Rotation Advisor',
      subtitle: 'Multi-criteria agronomic scoring engine with botanical diversification'
    },
    '/simulator': {
      title: 'Cropping Strategy Simulator',
      subtitle: 'Multi-season scenario modeling: baseline vs soil, water & nutrient regimes'
    },
    '/reports': {
      title: 'Agricultural Analytics & Executive Reports',
      subtitle: 'Exportable field intelligence dossiers and seasonal compliance summaries'
    },
    '/settings': {
      title: 'Platform Settings & Data Governance',
      subtitle: 'API endpoints, telemetry caching thresholds & demonstration controls'
    }
  };

  const currentMeta = pageTitles[pathname] || {
    title: 'ARACHNOVA Platform',
    subtitle: 'Agricultural Earth Intelligence'
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#e6e8e2] px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-[#2a2f35] hover:bg-[#f4f5f1] focus:outline-none"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="truncate">
          <h1 className="text-base lg:text-lg font-bold text-[#191c1f] tracking-tight truncate flex items-center gap-2">
            {currentMeta.title}
          </h1>
          <p className="text-xs text-[#5a626a] hidden sm:block truncate">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Center: Search Interface */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-[#88929c] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search farm parcels, soil indices, crop taxonomy (e.g. Maize, Soil pH)..."
            className="w-full bg-[#f4f5f1] border border-[#e6e8e2] rounded-lg pl-9 pr-3 py-1.5 text-xs text-[#191c1f] placeholder-[#88929c] focus:outline-none focus:bg-white focus:border-[#52b788] transition-all"
          />
        </div>
      </div>

      {/* Right Controls: Active Coordinates, Refresh, Notifications, Profile */}
      <div className="flex items-center gap-2 lg:gap-3 shrink-0">
        {/* Active Farm Geotag Pill */}
        {activeFarm && (
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-[#f4f5f1] border border-[#e6e8e2] rounded-md text-[11px] text-[#2a2f35]">
            <MapPin className="w-3.5 h-3.5 text-[#2d6a4f]" />
            <span className="font-semibold text-[#1b4332]">{activeFarm.name}</span>
            <span className="text-[#88929c]">|</span>
            <span className="font-mono text-[10px] text-[#5a626a]">
              {formatCoordinates(activeFarm.location.latitude, activeFarm.location.longitude)}
            </span>
          </div>
        )}

        {/* Manual Refresh Trigger */}
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            disabled={isRefreshing}
            title="Refresh satellite telemetry and climate observations"
            className="p-2 rounded-lg text-[#5a626a] hover:text-[#1b4332] hover:bg-[#f4f5f1] transition-colors border border-transparent hover:border-[#e6e8e2] disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#2d6a4f]' : ''}`} />
          </button>
        )}

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-[#5a626a] hover:text-[#1b4332] hover:bg-[#f4f5f1] transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#d97706] ring-2 ring-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-[#e6e8e2] p-4 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#f4f5f1]">
                <span className="font-bold text-[#191c1f] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2d6a4f]" />
                  Agronomic Advisories
                </span>
                <Badge variant="sage" size="sm">2 New</Badge>
              </div>
              <div className="space-y-3">
                <div className="p-2 rounded-lg bg-[#f0f9ff] border border-[#bae6fd]">
                  <p className="font-semibold text-[#0369a1] text-[11px]">NASA POWER Observation Updated</p>
                  <p className="text-[10px] text-[#0369a1]/80 mt-0.5">
                    Latest daily precipitation reanalysis synchronized for {activeFarm?.name || 'Active Farm'}.
                  </p>
                </div>
                <div className="p-2 rounded-lg bg-[#fffbeb] border border-[#fde68a]">
                  <p className="font-semibold text-[#92400e] text-[11px]">Vapor Pressure Deficit Advisory</p>
                  <p className="text-[10px] text-[#92400e]/80 mt-0.5">
                    Consecutive high solar radiation and low relative humidity elevate ET0 to 4.8 mm/day.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full mt-3 pt-2 text-center text-[11px] font-semibold text-[#2d6a4f] hover:underline"
              >
                Close notifications
              </button>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#e6e8e2]">
          <div className="w-8 h-8 rounded-full bg-[#1b4332] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#74c69d]/40">
            AG
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-semibold text-[#191c1f] leading-none">Lead Agronomist</span>
            <span className="text-[10px] text-[#5a626a] mt-0.5">Global Ag Research</span>
          </div>
        </div>
      </div>
    </header>
  );
}
