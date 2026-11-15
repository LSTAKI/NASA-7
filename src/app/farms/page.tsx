'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { FarmCard } from '@/components/farms/FarmCard';
import { FarmRegistrationModal } from '@/components/farms/FarmRegistrationModal';
import { FarmEditModal } from '@/components/farms/FarmEditModal';
import { GlobalMap } from '@/components/maps/GlobalMap';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, MapPin, Database } from 'lucide-react';
import { Coordinates, Farm } from '@/types';

export default function FarmManagementPage() {
  const { farms, activeFarm, activeFarmId, setActiveFarmId, addFarm, updateFarm, deleteFarm } = useActiveFarm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);
  const [pickedCoords, setPickedCoords] = useState<Coordinates | null>(null);

  const handleMapLocationSelect = (coords: Coordinates) => {
    setPickedCoords(coords);
  };

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e8e2]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#191c1f]">Farm Management &amp; Parcel Registry</h2>
            <Badge variant="forest" size="md">{farms.length} Parcels Active</Badge>
          </div>
          <p className="text-xs text-[#5a626a] mt-1">
            Georeferenced field parcels with persistent local storage and PostgreSQL-ready schema
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setPickedCoords(activeFarm?.location || { latitude: 40.0, longitude: -90.0 });
            setIsModalOpen(true);
          }}
          className="text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Register New Parcel
        </Button>
      </div>

      {/* Map Section for Interactive Picking */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-[#191c1f] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#2d6a4f]" />
            Interactive Parcel Picker
          </span>
          <span className="text-[#88929c]">
            Click anywhere on the map to set coordinates for a new parcel
          </span>
        </div>
        <GlobalMap
          onLocationSelect={handleMapLocationSelect}
          selectedCoords={pickedCoords}
          height="320px"
        />
        {pickedCoords && (
          <div className="p-3 bg-[#eaf7ee] border border-[#c7e9d2] rounded-lg flex items-center justify-between text-xs text-[#1b4332]">
            <span>
              Target Coordinates Selected: <strong>{pickedCoords.latitude.toFixed(4)}°, {pickedCoords.longitude.toFixed(4)}°</strong>
            </span>
            <button
              onClick={() => setIsModalOpen(true)}
              className="font-bold underline hover:opacity-80"
            >
              Register Parcel at this Location &rarr;
            </button>
          </div>
        )}
      </div>

      {/* Registered Farm Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-[#191c1f]">Registered Parcels ({farms.length})</h3>
          <span className="text-xs text-[#5a626a]">Click a parcel to set as active analysis focus</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {farms.map(farm => (
            <FarmCard
              key={farm.id}
              farm={farm}
              isActive={farm.id === activeFarmId}
              onSelect={setActiveFarmId}
              onEdit={(f) => setEditingFarm(f)}
              onDelete={deleteFarm}
            />
          ))}
        </div>
      </div>

      {/* Edit Modal */}
      {editingFarm && (
        <FarmEditModal
          isOpen={Boolean(editingFarm)}
          onClose={() => setEditingFarm(null)}
          farm={editingFarm}
          onSave={(id, updates) => {
            updateFarm(id, updates);
            setEditingFarm(null);
          }}
        />
      )}

      {/* Persistence Architecture Information */}
      <div className="p-4 rounded-xl bg-white border border-[#e6e8e2] shadow-xs flex items-start gap-3">
        <Database className="w-5 h-5 text-[#2d6a4f] shrink-0 mt-0.5" />
        <div className="text-xs text-[#5a626a] leading-relaxed">
          <strong className="text-[#191c1f] block mb-0.5">Database Migration Schema Note:</strong>
          All parcel entities follow PostgreSQL / PostGIS geometry conventions (<code className="font-mono text-[11px] bg-[#f4f5f1] px-1 py-0.5 rounded">Point(longitude, latitude)</code>, <code className="font-mono text-[11px] bg-[#f4f5f1] px-1 py-0.5 rounded">area_ha NUMERIC</code>, <code className="font-mono text-[11px] bg-[#f4f5f1] px-1 py-0.5 rounded">soil_properties JSONB</code>). In this browser session, records are persistently cached in <code className="font-mono text-[11px] bg-[#f4f5f1] px-1 py-0.5 rounded">localStorage</code> and will immediately transfer to cloud relational stores upon backend activation.
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <FarmRegistrationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialCoords={pickedCoords}
          onSave={addFarm}
        />
      )}
    </DashboardShell>
  );
}
