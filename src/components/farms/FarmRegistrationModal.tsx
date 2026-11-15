'use client';

import React, { useState } from 'react';
import { Farm, Coordinates, IrrigationType } from '@/types';
import { Button } from '@/components/ui/Button';
import { X, MapPin, Sprout, Layers } from 'lucide-react';

interface FarmRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (farmData: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialCoords?: Coordinates | null;
}

export function FarmRegistrationModal({
  isOpen,
  onClose,
  onSave,
  initialCoords
}: FarmRegistrationModalProps) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState('United States');
  const [region, setRegion] = useState('');
  const [latitude, setLatitude] = useState(initialCoords?.latitude ? String(initialCoords.latitude) : '40.0');
  const [longitude, setLongitude] = useState(initialCoords?.longitude ? String(initialCoords.longitude) : '-90.0');
  const [areaHectares, setAreaHectares] = useState('50');
  const [irrigationType, setIrrigationType] = useState<IrrigationType>('rainfed');
  const [currentCrops, setCurrentCrops] = useState('maize, soybean');
  const [phH2O, setPhH2O] = useState('6.5');
  const [organicCarbon, setOrganicCarbon] = useState('20.0');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const latNum = parseFloat(latitude);
    const lonNum = parseFloat(longitude);
    const areaNum = parseFloat(areaHectares) || 10;
    const cropsArr = currentCrops.split(',').map(s => s.trim().toLowerCase()).filter(Boolean);

    onSave({
      name: name || 'New Agricultural Parcel',
      country,
      region,
      location: {
        latitude: isNaN(latNum) ? 40.0 : latNum,
        longitude: isNaN(lonNum) ? -90.0 : lonNum
      },
      areaHectares: areaNum,
      irrigationType,
      currentCrops: cropsArr.length ? cropsArr : ['maize'],
      historicalCrops: ['cover_crop_mix'],
      soil: {
        phH2O: parseFloat(phH2O) || 6.5,
        organicCarbon: parseFloat(organicCarbon) || 15.0,
        nitrogen: 1.5,
        sand: 30,
        clay: 30,
        silt: 40,
        source: 'manual_test',
        depthRange: '0-30cm',
        lastUpdated: new Date().toISOString().split('T')[0]
      }
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#e6e8e2] shadow-2xl max-w-xl w-full p-6 text-[#191c1f]">
        <div className="flex items-center justify-between pb-3 border-b border-[#f4f5f1]">
          <div>
            <h3 className="font-bold text-lg text-[#191c1f]">Register New Agricultural Parcel</h3>
            <p className="text-xs text-[#5a626a]">
              Add field coordinates to establish NASA Earth Observation &amp; Soil telemetry
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
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Farm / Parcel Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Green Valley Plot 4"
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
                placeholder="e.g. United States, India, Kenya"
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
                placeholder="e.g. maize, soybean, wheat"
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>

          <div className="p-3 bg-[#f4f5f1] rounded-xl border border-[#e6e8e2]">
            <span className="text-[11px] font-semibold text-[#1b4332] block mb-2">
              Initial Soil Measurements (Optional - Can be synchronized from SoilGrids)
            </span>
            <div className="grid grid-cols-2 gap-3">
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
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f4f5f1]">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save &amp; Establish Telemetry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
