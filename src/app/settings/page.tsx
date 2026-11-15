'use client';

import React, { useState } from 'react';
import { DashboardShell } from '@/components/layout/DashboardShell';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Settings, Database, Server, CheckCircle2, Activity } from 'lucide-react';
import { INITIAL_FARMS } from '@/data/mock/farms';

interface DiagnosticResult {
  endpoint: string;
  status: 'pending' | 'success' | 'fallback' | 'error';
  latencyMs: number;
  message: string;
}

export default function SettingsPage() {
  const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
  const [cacheCleared, setCacheCleared] = useState<boolean>(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult[] | null>(null);

  const resetAllData = () => {
    if (confirm('Reset registered parcels to default global benchmark farms?')) {
      localStorage.setItem('arachnova_registered_farms_v1', JSON.stringify(INITIAL_FARMS));
      localStorage.setItem('arachnova_active_farm_id_v1', INITIAL_FARMS[0].id);
      setCacheCleared(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    }
  };

  const runDiagnostics = async () => {
    setIsDiagnosing(true);
    const results: DiagnosticResult[] = [];

    const endpoints = [
      { name: 'NASA POWER Daily Point Proxy', url: '/api/environment/nasa-power?lat=42.0308&lon=-93.6319' },
      { name: 'Open-Meteo ERA5 Reanalysis Proxy', url: '/api/environment/historical-weather?lat=42.0308&lon=-93.6319' },
      { name: 'ISRIC SoilGrids 2.0 REST Proxy', url: '/api/environment/soil?lat=42.0308&lon=-93.6319' }
    ];

    for (const ep of endpoints) {
      const start = performance.now();
      try {
        const res = await fetch(ep.url);
        const latency = Math.round(performance.now() - start);
        if (res.ok) {
          const json = await res.json();
          results.push({
            endpoint: ep.name,
            status: json.isDemonstrationData ? 'fallback' : 'success',
            latencyMs: latency,
            message: json.isDemonstrationData ? 'Demonstration fallback active' : `Live API verified (${latency} ms)`
          });
        } else {
          results.push({
            endpoint: ep.name,
            status: 'error',
            latencyMs: latency,
            message: `HTTP ${res.status} returned`
          });
        }
      } catch (err: unknown) {
        results.push({
          endpoint: ep.name,
          status: 'error',
          latencyMs: Math.round(performance.now() - start),
          message: 'Network connection unreachable'
        });
      }
    }

    setDiagnostics(results);
    setIsDiagnosing(false);
  };

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e6e8e2]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-[#191c1f]">Platform Settings &amp; Data Governance</h2>
            <Badge variant="forest" size="md">System v1.0</Badge>
          </div>
          <p className="text-xs text-[#5a626a] mt-1">
            API telemetry endpoints, caching policies, and agronomic unit conventions
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={runDiagnostics}
          isLoading={isDiagnosing}
          className="text-xs"
        >
          <Activity className="w-3.5 h-3.5" />
          Run Endpoint Diagnostics
        </Button>
      </div>

      {cacheCleared && (
        <div className="p-3.5 bg-[#eaf7ee] border border-[#c7e9d2] rounded-xl text-xs text-[#1b4332] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2d6a4f]" />
          <span>Local storage cleared and benchmark farms restored. Reloading session...</span>
        </div>
      )}

      {/* Diagnostics Results Panel */}
      {diagnostics && (
        <div className="bg-white rounded-xl border border-[#e6e8e2] p-5 shadow-xs space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#f4f5f1]">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#191c1f] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#2d6a4f]" />
              Telemetry Health Probe Results
            </h3>
            <span className="text-[10px] text-[#88929c]">Just now</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {diagnostics.map((d, i) => (
              <div key={i} className="p-3 rounded-lg border border-[#e6e8e2] bg-[#fbfbf8] text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-[#191c1f] text-[11px] truncate">{d.endpoint}</span>
                  <Badge
                    variant={d.status === 'success' ? 'forest' : d.status === 'fallback' ? 'amber' : 'danger'}
                    size="sm"
                  >
                    {d.status === 'success' ? 'Live 200' : d.status === 'fallback' ? 'Fallback' : 'Error'}
                  </Badge>
                </div>
                <div className="text-[11px] text-[#5a626a]">{d.message}</div>
                <div className="text-[10px] text-[#88929c] mt-1 font-mono">Roundtrip: {d.latencyMs} ms</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* 1. Units & Localization */}
        <div className="bg-white rounded-xl border border-[#e6e8e2] p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#191c1f] flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#2d6a4f]" />
            Agronomic Units &amp; Conventions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-[#fbfbf8] border border-[#e6e8e2] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#191c1f] block">Unit System</span>
                <span className="text-[#5a626a]">Area in hectares, temperature in Celsius, precipitation in millimeters</span>
              </div>
              <div className="flex items-center gap-1 bg-white p-1 rounded-md border border-[#e6e8e2]">
                <button
                  onClick={() => setUnits('metric')}
                  className={`px-3 py-1 rounded font-semibold ${units === 'metric' ? 'bg-[#2d6a4f] text-white' : 'text-[#5a626a]'}`}
                >
                  Metric (ha, °C, mm)
                </button>
                <button
                  onClick={() => setUnits('imperial')}
                  className={`px-3 py-1 rounded font-semibold ${units === 'imperial' ? 'bg-[#2d6a4f] text-white' : 'text-[#5a626a]'}`}
                >
                  US (Acres, °F, in)
                </button>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#fbfbf8] border border-[#e6e8e2] flex items-center justify-between">
              <div>
                <span className="font-semibold text-[#191c1f] block">Soil Property Standard</span>
                <span className="text-[#5a626a]">ISRIC / FAO standard depths (0-30cm root exploration zone)</span>
              </div>
              <Badge variant="sage" size="md">0-30cm Topsoil</Badge>
            </div>
          </div>
        </div>

        {/* 2. API Endpoints & Health Matrix */}
        <div className="bg-white rounded-xl border border-[#e6e8e2] p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#191c1f] flex items-center gap-2">
            <Server className="w-4 h-4 text-[#2d6a4f]" />
            Live Earth Observation &amp; Pedometric Proxies
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#fbfbf8] border-b border-[#e6e8e2] text-[#5a626a] uppercase font-semibold">
                <tr>
                  <th className="py-2.5 px-3">Service Provider</th>
                  <th className="py-2.5 px-3">Internal Next.js Proxy Route</th>
                  <th className="py-2.5 px-3">External Endpoint Base</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Caching Policy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f4f5f1] text-[#2a2f35]">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#1b4332]">NASA POWER</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">/api/environment/nasa-power</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#5a626a]">power.larc.nasa.gov</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="sage" size="sm">Active Proxy</Badge>
                  </td>
                  <td className="py-2.5 px-3 text-[#5a626a]">1 Hour TTL</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#1b4332]">Open-Meteo ERA5</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">/api/environment/historical-weather</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#5a626a]">archive-api.open-meteo.com</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="sage" size="sm">Active Proxy</Badge>
                  </td>
                  <td className="py-2.5 px-3 text-[#5a626a]">1 Hour TTL</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-[#1b4332]">ISRIC SoilGrids 2.0</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">/api/environment/soil</td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#5a626a]">rest.isric.org/soilgrids</td>
                  <td className="py-2.5 px-3">
                    <Badge variant="sage" size="sm">Active Proxy</Badge>
                  </td>
                  <td className="py-2.5 px-3 text-[#5a626a]">24 Hours TTL</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. Persistence Management */}
        <div className="bg-white rounded-xl border border-[#e6e8e2] p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-[#191c1f] flex items-center gap-2">
            <Database className="w-4 h-4 text-[#2d6a4f]" />
            Local Persistence &amp; Benchmark Reset
          </h3>
          <p className="text-xs text-[#5a626a]">
            Parcels and local calibrations are currently stored in the browser&apos;s localStorage cache. Resetting will restore the 4 default multi-continental benchmark farms (USA, India, Kenya, Spain).
          </p>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetAllData}
              className="text-xs text-[#dc2626] border-[#fecaca] hover:bg-[#fef2f2]"
            >
              Reset Parcels to Global Benchmarks
            </Button>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
