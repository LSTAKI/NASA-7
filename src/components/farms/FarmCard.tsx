'use client';

import React from 'react';
import { Farm } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { MapPin, Sprout, Trash2, Edit2, CheckCircle2 } from 'lucide-react';
import { formatCoordinates } from '@/lib/utils/formatters';

interface FarmCardProps {
  farm: Farm;
  isActive: boolean;
  onSelect: (id: string) => void;
  onEdit?: (farm: Farm) => void;
  onDelete?: (id: string) => void;
}

export function FarmCard({ farm, isActive, onSelect, onEdit, onDelete }: FarmCardProps) {
  return (
    <div
      onClick={() => onSelect(farm.id)}
      className={`p-5 rounded-xl border transition-all cursor-pointer bg-white relative ${
        isActive
          ? 'border-[#2d6a4f] shadow-md ring-2 ring-[#2d6a4f]/20'
          : 'border-[#e6e8e2] hover:border-[#b7e4c7] shadow-xs'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-[#191c1f]">{farm.name}</h4>
            {isActive && (
              <Badge variant="forest" size="sm">
                <CheckCircle2 className="w-3 h-3" />
                Active Focus
              </Badge>
            )}
          </div>
          <p className="text-xs text-[#5a626a] flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5 text-[#2d6a4f]" />
            {farm.region ? `${farm.region}, ` : ''}{farm.country}
          </p>
        </div>

        <div className="text-right">
          <span className="text-sm font-bold text-[#1b4332] block">{farm.areaHectares} ha</span>
          <span className="text-[10px] text-[#88929c] capitalize">{farm.irrigationType}</span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-[#f4f5f1] grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-[10px] text-[#88929c] uppercase font-semibold block">Coordinates</span>
          <span className="font-mono text-[11px] text-[#2a2f35]">
            {formatCoordinates(farm.location.latitude, farm.location.longitude)}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#88929c] uppercase font-semibold block">Soil Profile</span>
          <span className="text-[11px] text-[#2a2f35]">
            {farm.soil?.phH2O ? `pH ${farm.soil.phH2O.toFixed(1)} • SOC ${farm.soil.organicCarbon}g/kg` : 'Pending sync'}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#f4f5f1] flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {farm.currentCrops.map((c, i) => (
            <Badge key={i} variant="sage" size="sm" className="capitalize text-[10px]">
              <Sprout className="w-2.5 h-2.5" />
              {c.replace('_', ' ')}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          {onEdit && (
            <button
              onClick={() => onEdit(farm)}
              className="p-1.5 text-[#5a626a] hover:text-[#1b4332] rounded-md hover:bg-[#f4f5f1] transition-colors"
              title="Edit Farm Details"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => {
                if (confirm(`Remove parcel "${farm.name}" from registry?`)) {
                  onDelete(farm.id);
                }
              }}
              className="p-1.5 text-[#88929c] hover:text-[#dc2626] rounded-md hover:bg-[#fef2f2] transition-colors"
              title="Delete Farm"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
