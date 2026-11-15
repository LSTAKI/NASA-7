'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Layers } from 'lucide-react';
import { SoilProperties } from '@/types';

interface ManualSoilModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (soil: SoilProperties) => void;
  currentSoil?: SoilProperties;
}

export function ManualSoilModal({ isOpen, onClose, onSave, currentSoil }: ManualSoilModalProps) {
  const [ph, setPh] = useState(String(currentSoil?.phH2O ?? '6.5'));
  const [soc, setSoc] = useState(String(currentSoil?.organicCarbon ?? '20.0'));
  const [nitrogen, setNitrogen] = useState(String(currentSoil?.nitrogen ?? '1.8'));
  const [sand, setSand] = useState(String(currentSoil?.sand ?? '35'));
  const [clay, setClay] = useState(String(currentSoil?.clay ?? '25'));
  const [silt, setSilt] = useState(String(currentSoil?.silt ?? '40'));
  const [depth, setDepth] = useState(currentSoil?.depthRange || '0-30cm');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      phH2O: parseFloat(ph) || 6.5,
      organicCarbon: parseFloat(soc) || 15.0,
      nitrogen: parseFloat(nitrogen) || 1.2,
      sand: parseFloat(sand) || 33,
      clay: parseFloat(clay) || 33,
      silt: parseFloat(silt) || 34,
      source: 'manual_test',
      depthRange: depth,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#e6e8e2] shadow-2xl max-w-lg w-full p-6 text-[#191c1f]">
        <div className="flex items-center justify-between pb-3 border-b border-[#f4f5f1]">
          <div>
            <h3 className="font-bold text-lg text-[#191c1f]">Enter Laboratory Soil Analysis</h3>
            <p className="text-xs text-[#5a626a]">
              Override modelled SoilGrids estimates with certified lab soil test reports
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Soil pH (in H2O)</label>
              <input
                type="number"
                step="0.05"
                required
                value={ph}
                onChange={e => setPh(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Organic Carbon (g/kg)</label>
              <input
                type="number"
                step="0.1"
                required
                value={soc}
                onChange={e => setSoc(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Sand (%)</label>
              <input
                type="number"
                step="1"
                required
                value={sand}
                onChange={e => setSand(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Clay (%)</label>
              <input
                type="number"
                step="1"
                required
                value={clay}
                onChange={e => setClay(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Silt (%)</label>
              <input
                type="number"
                step="1"
                required
                value={silt}
                onChange={e => setSilt(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Total Nitrogen (g/kg)</label>
              <input
                type="number"
                step="0.05"
                value={nitrogen}
                onChange={e => setNitrogen(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#2a2f35] mb-1">Core Sampling Depth</label>
              <select
                value={depth}
                onChange={e => setDepth(e.target.value)}
                className="w-full bg-[#fbfbf8] border border-[#e6e8e2] rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#2d6a4f]"
              >
                <option value="0-15cm">0 - 15cm (Topsoil plow layer)</option>
                <option value="0-30cm">0 - 30cm (Standard root horizon)</option>
                <option value="30-60cm">30 - 60cm (Subsoil horizon)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f4f5f1]">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save Lab Analysis
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
