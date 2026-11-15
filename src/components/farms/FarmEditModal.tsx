'use client';

import React, { useState } from 'react';
import { Farm, IrrigationType } from '@/types';
import { Button } from '@/components/ui/Button';
import { X } from 'lucide-react';

interface FarmEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm: Farm;
  onSave: (id: string, updates: Partial<Farm>) => void;
}

export function FarmEditModal({
  isOpen,
  onClose,
  farm,
  onSave
}: FarmEditModalProps) {
  const [name, setName] = useState(farm.name);
  const [country, setCountry] = useState(farm.country);
  const [region, setRegion] = useState(farm.region || '');
  const [latitude, setLatitude] = useState(String(farm.location.latitude));
  const [longitude, setLongitude] = useState(String(farm.location.longitude));
  const [areaHectares, setAreaHectares] = useState(String(farm.areaHectares));
  const [irrigationType, setIrrigationType] = useState<IrrigationType>(farm.irrigationType);
  const [currentCrops, setCurrentCrops] = useState(farm.currentCrops.join(', '));
  const [phH2O, setPhH2O] = useState(String(farm.soil?.phH2O ?? '6.5'));
  const [organicCarbon, setOrganicCarbon] = useState(String(farm.soil?.organicCarbon ?? '20.0'));

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    const areaNum = parseFloat(areaHectares) || farm.areaHectares;
    const cropsArr = currentCrops.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    onSave(farm.id, {
      name,
      country,
      region,
      location: {
        latitude: isNaN(latNum) ? farm.location.latitude : latNum,
        longitude: isNaN(lonNum) ? farm.location.longitude : lonNum
      },
      areaHectares: areaNum,
      irrigationType,
      currentCrops: cropsArr.length ? cropsArr : farm.currentCrops,
      soil: farm.soil ? {
        ...farm.soil,
        phH2O: parseFloat(phH2O) || farm.soil.phH2O,
        organicCarbon: parseFloat(organicCarbon) || farm.soil.organicCarbon,
        lastUpdated: new Date().toISOString().split('T')[0]
      } : undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#e6e8e2] shadow-2xl max-w-xl w-full p-6 text-[#191c1f]">
        <div className="flex items-center justify-between pb-3 border-b border-[#f4f5f1]">
          <div>
            <h3 className="font-bold text-lg text-[#191c1f]">Edit Agricultural Parcel</h3>
            <p className="text-xs text-[#5a626a]">
              Update agronomic characteristics for &ldquo;{farm.name}&rdquo;
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#88929c] hover:text-[#191c1f] hover:bg-[#f4f5f1]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Parcel Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Country</label>
              <input
                type="text"
                required
                value={country}
                onChange={e => setCountry(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                required
                value={latitude}
                onChange={e => setLatitude(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                required
                value={longitude}
                onChange={e => setLongitude(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Area (Hectares)</label>
              <input
                type="number"
                step="0.1"
                required
                value={areaHectares}
                onChange={e => setAreaHectares(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Irrigation System</label>
              <select
                value={irrigationType}
                onChange={e => setIrrigationType(e.target.value as IrrigationType)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              >
                <option value="rainfed">Rainfed (Dryland)</option>
                <option value="drip">Drip Irrigation</option>
                <option value="sprinkler">Sprinkler / Pivot</option>
                <option value="flood">Canal / Surface Flood</option>
                <option value="furrow">Furrow Irrigation</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Current Crops (comma separated)</label>
              <input
                type="text"
                value={currentCrops}
                onChange={e => setCurrentCrops(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#f4f5f1] rounded-xl border border-[#e6e8e2] grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-semibold text-[#5a626a] mb-0.5">Soil pH (H2O)</label>
              <input
                type="number"
                step="0.1"
                value={phH2O}
                onChange={e => setPhH2O(e.target.value)}
                className="w-full bg-white border border-[#e6e8e2] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-[#5a626a] mb-0.5">Organic Carbon (g/kg)</label>
              <input
                type="number"
                step="0.1"
                value={organicCarbon}
                onChange={e => setOrganicCarbon(e.target.value)}
                className="w-full bg-white border border-[#e6e8e2] rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f4f5f1]">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
