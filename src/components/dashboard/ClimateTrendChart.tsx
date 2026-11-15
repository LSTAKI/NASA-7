'use client';

import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { NasaPowerResponse, OpenMeteoResponse } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Calendar, BarChart2, Thermometer, Droplets } from 'lucide-react';

interface ClimateTrendChartProps {
  nasaData: NasaPowerResponse | null;
  weatherData: OpenMeteoResponse | null;
}

type MetricMode = 'temperature' | 'water_balance' | 'soil_moisture';

interface MergedClimatePoint {
  date: string;
  fullDate: string;
  t2m?: number | null;
  t2mMax?: number | null;
  t2mMin?: number | null;
  precipitationNasa?: number | null;
  solarRadiation?: number | null;
  tempOpenMeteo?: number | null;
  precipOpenMeteo?: number | null;
  et0?: number | null;
  soilMoisture?: number | null;
  soilTemp?: number | null;
}

export function ClimateTrendChart({ nasaData, weatherData }: ClimateTrendChartProps) {
  const [metricMode, setMetricMode] = useState<MetricMode>('temperature');

  // Merge records by date
  const nasaRecords = nasaData?.dailyRecords || [];
  const weatherRecords = weatherData?.dailyRecords || [];

  const dateMap = new Map<string, MergedClimatePoint>();

  nasaRecords.forEach(r => {
    dateMap.set(r.date, {
      date: r.date.substring(5), // MM-DD for clean axis
      fullDate: r.date,
      t2m: r.t2m,
      t2mMax: r.t2mMax,
      t2mMin: r.t2mMin,
      precipitationNasa: r.precipitation,
      solarRadiation: r.solarRadiation
    });
  });

  weatherRecords.forEach(r => {
    const existing = dateMap.get(r.date) || {
      date: r.date.substring(5),
      fullDate: r.date
    };
    dateMap.set(r.date, {
      ...existing,
      tempOpenMeteo: r.temperatureMean,
      precipOpenMeteo: r.precipitation,
      et0: r.et0Evapotranspiration,
      soilMoisture: r.soilMoisture !== null ? Number((r.soilMoisture * 100).toFixed(1)) : null,
      soilTemp: r.soilTemperature
    });
  });

  const chartData = Array.from(dateMap.values()).sort((a, b) => a.fullDate.localeCompare(b.fullDate));

  return (
    <div className="bg-white rounded-xl border border-[#e6e8e2] p-5 shadow-xs flex flex-col justify-between">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#f4f5f1]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#191c1f] text-base tracking-tight">
              Historical Environmental Observations
            </h3>
            <Badge variant="sage" size="sm">
              Daily Point
            </Badge>
          </div>
          <p className="text-xs text-[#5a626a] mt-0.5">
            Synchronized from NASA POWER AG and Open-Meteo ERA5 reanalysis
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#f4f5f1] p-1 rounded-lg border border-[#e6e8e2]">
          <button
            onClick={() => setMetricMode('temperature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              metricMode === 'temperature'
                ? 'bg-white text-[#1b4332] shadow-xs'
                : 'text-[#5a626a] hover:text-[#191c1f]'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 text-[#2d6a4f]" />
            Temperature
          </button>
          <button
            onClick={() => setMetricMode('water_balance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              metricMode === 'water_balance'
                ? 'bg-white text-[#1b4332] shadow-xs'
                : 'text-[#5a626a] hover:text-[#191c1f]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#0284c7]" />
            Rain &amp; ET0
          </button>
          <button
            onClick={() => setMetricMode('soil_moisture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              metricMode === 'soil_moisture'
                ? 'bg-white text-[#1b4332] shadow-xs'
                : 'text-[#5a626a] hover:text-[#191c1f]'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-[#52b788]" />
            Soil Moisture
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          {metricMode === 'temperature' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1ec" vertical={false} />
              <XAxis dataKey="date" stroke="#88929c" fontSize={11} tickLine={false} />
              <YAxis stroke="#88929c" fontSize={11} tickLine={false} unit="°C" domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e6e8e2',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="t2mMax"
                name="T2M Max (NASA)"
                stroke="#d97706"
                strokeWidth={1.8}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="t2m"
                name="T2M Mean (NASA)"
                stroke="#2d6a4f"
                strokeWidth={2.2}
                dot={{ r: 2 }}
              />
              <Line
                type="monotone"
                dataKey="t2mMin"
                name="T2M Min (NASA)"
                stroke="#0284c7"
                strokeWidth={1.8}
                dot={false}
              />
            </ComposedChart>
          ) : metricMode === 'water_balance' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1ec" vertical={false} />
              <XAxis dataKey="date" stroke="#88929c" fontSize={11} tickLine={false} />
              <YAxis stroke="#88929c" fontSize={11} tickLine={false} unit=" mm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e6e8e2',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar
                dataKey="precipitationNasa"
                name="Precipitation (mm)"
                fill="#2d6a4f"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="et0"
                name="Evapotranspiration ET0 (mm)"
                stroke="#d97706"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </ComposedChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f1ec" vertical={false} />
              <XAxis dataKey="date" stroke="#88929c" fontSize={11} tickLine={false} />
              <YAxis stroke="#88929c" fontSize={11} tickLine={false} unit="%" domain={[0, 60]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e6e8e2',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="soilMoisture"
                name="Soil Moisture 0-7cm (vol %)"
                stroke="#52b788"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="soilTemp"
                name="Soil Temp 0-7cm (°C)"
                stroke="#d97706"
                strokeWidth={1.8}
                dot={false}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Attribution */}
      <div className="flex items-center justify-between text-[11px] text-[#88929c] pt-3 border-t border-[#f4f5f1] mt-2">
        <span className="flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-[#2d6a4f]" />
          30-day observational sequence
        </span>
        <span>Sources: NASA Langley LaRC &bull; ECMWF ERA5-Land</span>
      </div>
    </div>
  );
}
