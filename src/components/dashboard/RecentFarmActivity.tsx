'use client';

import React from 'react';
import Link from 'next/link';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, Sprout, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

export function RecentFarmActivity() {
  const { activeFarm } = useActiveFarm();

  if (!activeFarm) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#e8e5dc] p-5 lg:p-6 shadow-2xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#f3efe9]">
        <div>
          <h3 className="font-bold text-[#1e2420] text-base tracking-tight flex items-center gap-2">
            Active Farm &amp; Field Details
          </h3>
          <p className="text-xs text-[#616d64] mt-0.5">
            Registered parcel information, current crops, and soil metrics
          </p>
        </div>
        <Link href="/farms">
          <Button variant="outline" size="sm" className="text-xs">
            Manage Farms <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {/* Farm Name & Geo Summary */}
        <div className="p-4 rounded-xl bg-[#fdfcf9] border border-[#e8e5dc]">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-bold text-base text-[#1e2420]">{activeFarm.name}</h4>
              <p className="text-xs text-[#616d64] flex items-center gap-1.5 mt-1 font-medium">
                <MapPin className="w-4 h-4 text-[#2e7d32]" />
                {activeFarm.region ? `${activeFarm.region}, ` : ''}{activeFarm.country}
              </p>
            </div>
            <Badge variant="forest" size="md">
              {activeFarm.areaHectares} Hectares
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3.5 border-t border-[#f3efe9] text-xs">
            <div>
              <span className="text-[#8d9890] block text-[10px] uppercase font-bold tracking-wider">Irrigation</span>
              <span className="font-semibold text-[#1e2420] capitalize mt-0.5 block">{activeFarm.irrigationType}</span>
            </div>
            <div>
              <span className="text-[#8d9890] block text-[10px] uppercase font-bold tracking-wider">Coordinates</span>
              <span className="font-mono text-[11px] font-semibold text-[#1e2420] mt-0.5 block">
                {activeFarm.location.latitude.toFixed(2)}°, {activeFarm.location.longitude.toFixed(2)}°
              </span>
            </div>
            <div>
              <span className="text-[#8d9890] block text-[10px] uppercase font-bold tracking-wider">Soil pH</span>
              <span className="font-semibold text-[#1e2420] mt-0.5 block">
                {activeFarm.soil?.phH2O ? `${activeFarm.soil.phH2O.toFixed(1)} pH` : 'Unsampled'}
              </span>
            </div>
            <div>
              <span className="text-[#8d9890] block text-[10px] uppercase font-bold tracking-wider">Soil Organic Carbon</span>
              <span className="font-semibold text-[#1e2420] mt-0.5 block">
                {activeFarm.soil?.organicCarbon ? `${activeFarm.soil.organicCarbon} g/kg` : 'Unsampled'}
              </span>
            </div>
          </div>
        </div>

        {/* Current Cropping Sequence */}
        <div className="p-4 rounded-xl border border-[#e8e5dc] bg-white">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#616d64] block mb-2.5">
            Current &amp; Historical Crop Rotation
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {activeFarm.currentCrops.map((crop, idx) => (
              <Badge key={idx} variant="sage" size="md" className="capitalize">
                <Sprout className="w-3.5 h-3.5 text-[#2e7d32]" />
                Current: {crop.replace('_', ' ')}
              </Badge>
            ))}
            {activeFarm.historicalCrops?.map((crop, idx) => (
              <Badge key={idx} variant="charcoal" size="md" className="capitalize">
                Preceding: {crop.replace('_', ' ')}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Launch Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <Link href="/rotation-advisor" className="w-full">
            <Button variant="primary" size="md" className="w-full justify-between text-xs">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white" />
                Run Crop Rotation Advisor
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/simulator" className="w-full">
            <Button variant="secondary" size="md" className="w-full justify-between text-xs">
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#18392b]" />
                Simulate Multi-Season Strategies
              </span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
