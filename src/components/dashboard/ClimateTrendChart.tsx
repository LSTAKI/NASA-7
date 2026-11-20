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

  // Merge records by date (preserve 100% of existing logic)
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
    <div className="bg-white rounded-2xl border border-[#e8e5dc] p-5 lg:p-6 shadow-2xs flex flex-col justify-between">
      {/* Header and Toggle Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-[#f3efe9]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#1e2420] text-base tracking-tight">
              Growing Conditions &amp; Weather History
            </h3>
            <Badge variant="sage" size="sm">
              Daily Point
            </Badge>
          </div>
          <p className="text-xs text-[#616d64] mt-0.5">
            Simple 30-day tracking of temperature, rainfall and soil moisture for your crops
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center bg-[#f4f1ea] p-1 rounded-xl border border-[#e8e5dc]">
          <button
            onClick={() => setMetricMode('temperature')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              metricMode === 'temperature'
                ? 'bg-white text-[#18392b] shadow-xs'
                : 'text-[#616d64] hover:text-[#1e2420]'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 text-[#2e7d32]" />
            Temperature
          </button>
          <button
            onClick={() => setMetricMode('water_balance')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              metricMode === 'water_balance'
                ? 'bg-white text-[#18392b] shadow-xs'
                : 'text-[#616d64] hover:text-[#1e2420]'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5 text-[#0284c7]" />
            Rain &amp; ET₀
          </button>
          <button
            onClick={() => setMetricMode('soil_moisture')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              metricMode === 'soil_moisture'
                ? 'bg-white text-[#18392b] shadow-xs'
                : 'text-[#616d64] hover:text-[#1e2420]'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-[#528c70]" />
            Soil Moisture
          </button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-72">
        <ResponsiveContainer width="100%" height="100%">
          {metricMode === 'temperature' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" vertical={false} />
              <XAxis dataKey="date" stroke="#8d9890" fontSize={11} tickLine={false} />
              <YAxis stroke="#8d9890" fontSize={11} tickLine={false} unit="°C" domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e8e5dc',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="t2mMax"
                name="High Temp (°C)"
                stroke="#d4973b"
                strokeWidth={1.8}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="t2m"
                name="Mean Temp (°C)"
                stroke="#2e7d32"
                strokeWidth={2.4}
                dot={{ r: 2.5, fill: '#2e7d32' }}
              />
              <Line
                type="monotone"
                dataKey="t2mMin"
                name="Low Temp (°C)"
                stroke="#0284c7"
                strokeWidth={1.8}
                dot={false}
              />
            </ComposedChart>
          ) : metricMode === 'water_balance' ? (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" vertical={false} />
              <XAxis dataKey="date" stroke="#8d9890" fontSize={11} tickLine={false} />
              <YAxis stroke="#8d9890" fontSize={11} tickLine={false} unit=" mm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e8e5dc',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar
                dataKey="precipitationNasa"
                name="Rainfall (mm)"
                fill="#2e7d32"
                radius={[4, 4, 0, 0]}
              />
              <Line
                type="monotone"
                dataKey="et0"
                name="Water Demand ET₀ (mm)"
                stroke="#d4973b"
                strokeWidth={2.2}
                dot={{ r: 2.5, fill: '#d4973b' }}
              />
            </ComposedChart>
          ) : (
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" vertical={false} />
              <XAxis dataKey="date" stroke="#8d9890" fontSize={11} tickLine={false} />
              <YAxis stroke="#8d9890" fontSize={11} tickLine={false} unit="%" domain={[0, 60]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e8e5dc',
                  borderRadius: '12px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey="soilMoisture"
                name="Soil Moisture (vol %)"
                stroke="#528c70"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#528c70' }}
              />
              <Line
                type="monotone"
                dataKey="soilTemp"
                name="Soil Temperature (°C)"
                stroke="#d4973b"
                strokeWidth={1.8}
                dot={false}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Footer Attribution */}
      <div className="flex items-center justify-between text-[11px] text-[#8d9890] pt-3.5 border-t border-[#f3efe9] mt-2">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#2e7d32]" />
          30-day observational window
        </span>
        <span>NASA POWER AG &bull; ECMWF ERA5-Land</span>
      </div>
    </div>
  );
}
