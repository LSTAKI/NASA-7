'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Farm, Coordinates } from '@/types';
import { useActiveFarm } from '@/hooks/useActiveFarm';
import { MapPin, Navigation, Layers, Info } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatCoordinates } from '@/lib/utils/formatters';

interface GlobalMapProps {
  onLocationSelect?: (coords: Coordinates) => void;
  selectedCoords?: Coordinates | null;
  className?: string;
  height?: string;
}

export function GlobalMap({
  onLocationSelect,
  selectedCoords,
  className = '',
  height = '420px'
}: GlobalMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const clickMarkerRef = useRef<maplibregl.Marker | null>(null);

  const { farms, activeFarm, setActiveFarmId } = useActiveFarm();
  const [currentZoom, setCurrentZoom] = useState<number>(3);
  const [clickedLocation, setClickedLocation] = useState<Coordinates | null>(
    selectedCoords || (activeFarm ? activeFarm.location : { latitude: 30, longitude: 0 })
  );

  // Initialize MapLibre
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initialLat = activeFarm?.location.latitude ?? 20;
    const initialLon = activeFarm?.location.longitude ?? 10;

    const mapInstance = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://tile.openstreetmap.org/{z}/{x}/{y}.png'
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
          }
        },
        layers: [
          {
            id: 'osm-tiles-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19
          }
        ]
      },
      center: [initialLon, initialLat],
      zoom: 3,
      minZoom: 1.5,
      maxZoom: 18
    });

    mapInstance.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');
    mapInstance.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    mapInstance.on('zoom', () => {
      setCurrentZoom(Number(mapInstance.getZoom().toFixed(1)));
    });

    mapInstance.on('click', (e) => {
      const coords: Coordinates = {
        latitude: Number(e.lngLat.lat.toFixed(4)),
        longitude: Number(e.lngLat.lng.toFixed(4))
      };
      setClickedLocation(coords);
      if (onLocationSelect) onLocationSelect(coords);

      // Update click marker
      if (clickMarkerRef.current) {
        clickMarkerRef.current.setLngLat([coords.longitude, coords.latitude]);
      } else {
        const el = document.createElement('div');
        el.className = 'w-4 h-4 rounded-full bg-[#d97706] border-2 border-white ring-2 ring-[#d97706]/40 animate-bounce';
        clickMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat([coords.longitude, coords.latitude])
          .addTo(mapInstance);
      }
    });

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  // Update Farm Markers
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    farms.forEach(farm => {
      const el = document.createElement('div');
      const isActive = activeFarm?.id === farm.id;
      el.className = `arachnova-farm-pin ${isActive ? 'arachnova-farm-pin-active' : ''}`;
      el.title = `${farm.name} (${farm.country})`;

      // Popup
      const popup = new maplibregl.Popup({ offset: 12, closeButton: false }).setHTML(`
        <div style="font-family: inherit; font-size: 12px; padding: 6px; color: #1e2420;">
          <strong style="color: #18392b; display: block; font-size: 13px; font-weight: 700;">${farm.name}</strong>
          <span style="color: #616d64; font-size: 11px;">${farm.region ? farm.region + ', ' : ''}${farm.country}</span>
          <div style="margin-top: 5px; font-size: 11px; color: #2e7d32; font-weight: 600;">
            <strong>${farm.areaHectares} ha</strong> &bull; <span style="text-transform: capitalize;">${farm.irrigationType}</span>
          </div>
          <div style="margin-top: 3px; font-size: 10px; color: #8d9890; font-family: monospace;">
            Lat: ${farm.location.latitude.toFixed(2)}°, Lon: ${farm.location.longitude.toFixed(2)}°
          </div>
        </div>
      `);

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        setActiveFarmId(farm.id);
        setClickedLocation(farm.location);
        if (onLocationSelect) onLocationSelect(farm.location);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([farm.location.longitude, farm.location.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  }, [farms, activeFarm?.id, setActiveFarmId, onLocationSelect]);

  // Fly to active farm if changed
  const flyToActiveFarm = () => {
    if (!map.current || !activeFarm) return;
    map.current.flyTo({
      center: [activeFarm.location.longitude, activeFarm.location.latitude],
      zoom: 6,
      essential: true,
      duration: 1500
    });
    setClickedLocation(activeFarm.location);
  };

  const resetGlobalView = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: [15, 20],
      zoom: 2.2,
      duration: 1200
    });
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden border border-[#e8e5dc] bg-[#f4f1ea] shadow-2xs ${className}`}>
      {/* Map Header Overlay Bar */}
      <div className="absolute top-3 left-3 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-[#e8e5dc] shadow-xs flex items-center gap-2 pointer-events-auto">
          <Layers className="w-4 h-4 text-[#2e7d32]" />
          <span className="text-xs font-bold text-[#1e2420]">Interactive Farm Map</span>
          <Badge variant="sage" size="sm">
            {farms.length} Registered Farms
          </Badge>
        </div>

        {clickedLocation && (
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#e8e5dc] shadow-xs flex items-center gap-1.5 text-xs text-[#333c36] pointer-events-auto">
            <MapPin className="w-3.5 h-3.5 text-[#d4973b]" />
            <span className="font-mono font-medium text-[11px]">
              {formatCoordinates(clickedLocation.latitude, clickedLocation.longitude)}
            </span>
          </div>
        )}
      </div>

      {/* Map Action Quick Buttons Overlay */}
      <div className="absolute bottom-6 right-3 z-10 flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={flyToActiveFarm}
          title="Fly to active farm coordinates"
          className="bg-white/95 hover:bg-white text-[#1e2420] p-2.5 rounded-xl border border-[#e8e5dc] shadow-sm flex items-center gap-2 text-xs font-semibold hover:text-[#2e7d32] transition-all cursor-pointer"
        >
          <Navigation className="w-4 h-4 text-[#2e7d32]" />
          <span className="hidden sm:inline">Active Farm</span>
        </button>
        <button
          onClick={resetGlobalView}
          title="Reset to global view"
          className="bg-white/95 hover:bg-white text-[#616d64] p-2.5 rounded-xl border border-[#e8e5dc] shadow-sm flex items-center gap-2 text-xs font-semibold hover:text-[#1e2420] transition-all cursor-pointer"
        >
          <span className="text-xs">World View</span>
        </button>
      </div>

      {/* Map Attribution and Tip Overlay */}
      <div className="absolute bottom-2.5 left-3 z-10 pointer-events-none text-[10px] text-[#616d64] bg-white/95 px-2.5 py-1 rounded-lg border border-[#e8e5dc] shadow-2xs flex items-center gap-1.5">
        <Info className="w-3 h-3 text-[#2e7d32]" />
        <span>Click map to sample coordinates &bull; OpenStreetMap &bull; MapLibre GL</span>
      </div>

      {/* Map Container */}
      <div ref={mapContainer} style={{ width: '100%', height }} />
    </div>
  );
}
