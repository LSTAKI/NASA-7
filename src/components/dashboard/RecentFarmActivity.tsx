'use client';

import React from 'react';
import Link from 'next/link';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MapPin, Sprout, Layers, ArrowRight, Sparkles, TrendingUp } from 'lucide-react';
import { formatCoordinates } from '@/lib/utils/formatters';

export function RecentFarmActivity() {
  const { activeFarm } = useActiveFarm();

  if (!activeFarm) return null;

  return (
    <div className="bg-white rounded-xl border border-[#e6e8e2] p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#f4f5f1]">
        <div>
          <h3 className="font-bold text-[#191c1f] text-base tracking-tight flex items-center gap-2">
            Active Farm Profile
          </h3>
          <p className="text-xs text-[#5a626a] mt-0.5">
            Registered parcel status and cropping intelligence
          </p>
        </div>
        <Link href="/farms">
          <Button variant="ghost" size="sm" className="text-xs">
            Manage Farms <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {/* Farm Name & Geo Summary */}
        <div className="p-3.5 rounded-lg bg-[#fbfbf8] border border-[#e6e8e2]">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-bold text-sm text-[#191c1f]">{activeFarm.name}</h4>
              <p className="text-xs text-[#5a626a] flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-[#2d6a4f]" />
                {activeFarm.region ? `${activeFarm.region}, ` : ''}{activeFarm.country}
              </p>
            </div>
            <Badge variant="forest" size="md">
              {activeFarm.areaHectares} Hectares
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#f0f1ec] text-xs">
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Irrigation</span>
              <span className="font-medium text-[#191c1f] capitalize">{activeFarm.irrigationType}</span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Coordinates</span>
              <span className="font-mono text-[11px] text-[#191c1f]">
                {activeFarm.location.latitude.toFixed(2)}°, {activeFarm.location.longitude.toFixed(2)}°
              </span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Soil pH</span>
              <span className="font-medium text-[#191c1f]">
                {activeFarm.soil?.phH2O ? `${activeFarm.soil.phH2O.toFixed(1)} pH` : 'Unsampled'}
              </span>
            </div>
            <div>
              <span className="text-[#88929c] block text-[10px] uppercase font-semibold">Organic Carbon</span>
              <span className="font-medium text-[#191c1f]">
                {activeFarm.soil?.organicCarbon ? `${activeFarm.soil.organicCarbon} g/kg` : 'Unsampled'}
              </span>
            </div>
          </div>
        </div>

        {/* Current Cropping Sequence */}
        <div className="p-3.5 rounded-lg border border-[#e6e8e2] bg-white">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#5a626a] block mb-2">
            Active &amp; Historical Crop Rotation
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {activeFarm.currentCrops.map((crop, idx) => (
              <Badge key={idx} variant="sage" size="md" className="capitalize">
                <Sprout className="w-3.5 h-3.5 text-[#2d6a4f]" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <Link href="/rotation-advisor" className="w-full">
            <Button variant="primary" size="md" className="w-full justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#74c69d]" />
                Run Rotation Advisor
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
          <Link href="/simulator" className="w-full">
            <Button variant="secondary" size="md" className="w-full justify-between text-xs">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#2d6a4f]" />
                Simulate Strategies
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
