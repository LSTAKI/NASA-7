// ARACHNOVA - Demonstration / Fallback Data
// Explicitly tagged as simulated demonstration data for offline resilience and interface verification.

import { NasaPowerResponse, OpenMeteoResponse, SoilGridsResponse, AgriculturalInsight } from '@/types';

export const DEMO_NASA_POWER: NasaPowerResponse = {
  source: 'NASA_POWER_AG_POINT',
  attribution: 'DEMONSTRATION SIMULATION (Derived from historical NASA POWER climatology)',
  isDemonstrationData: true,
  coordinates: { latitude: 42.0308, longitude: -93.6319 },
  startDate: '2026-10-15',
  endDate: '2026-11-14',
  summary: {
    avgTemperature: 12.8,
    totalPrecipitation: 64.2,
    maxTemperature: 21.4,
    minTemperature: 3.1,
    avgSolarRadiation: 14.2
  },
  dailyRecords: Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(2026, 9, 15 + i);
    const dateStr = d.toISOString().split('T')[0];
    const t2m = Number((10 + 6 * Math.sin(i / 4) + (Math.sin(i * 1.5) * 2)).toFixed(1));
    const t2mMax = Number((t2m + 4 + Math.random() * 2).toFixed(1));
    const t2mMin = Number((t2m - 4 - Math.random() * 2).toFixed(1));
    const precipitation = i % 5 === 0 ? Number((8 + Math.random() * 12).toFixed(1)) : (i % 7 === 0 ? Number((2 + Math.random() * 4).toFixed(1)) : 0);
    const solarRadiation = Number((12 + 5 * Math.cos(i / 5)).toFixed(1));
    return {
      date: dateStr,
      t2m,
      t2mMax,
      t2mMin,
      precipitation,
      solarRadiation
    };
  })
};

export const DEMO_OPEN_METEO: OpenMeteoResponse = {
  source: 'OPEN_METEO_ERA5_ARCHIVE',
  attribution: 'DEMONSTRATION SIMULATION (Derived from ERA5 reanalysis reference baselines)',
  isDemonstrationData: true,
  coordinates: { latitude: 42.0308, longitude: -93.6319 },
  elevation: 290,
  summary: {
    avgTemp: 13.1,
    totalRain: 62.8,
    totalEt0: 51.4,
    avgSoilMoisture: 0.31,
    avgSoilTemp: 11.5,
    waterDeficit: 11.4
  },
  dailyRecords: Array.from({ length: 30 }).map((_, i) => {
    const d = new Date(2026, 9, 15 + i);
    const dateStr = d.toISOString().split('T')[0];
    const temperatureMean = Number((11 + 5 * Math.sin(i / 4)).toFixed(1));
    const precipitation = i % 5 === 0 ? Number((7 + Math.random() * 10).toFixed(1)) : 0;
    const relativeHumidity = Number((65 + 15 * Math.sin(i / 3)).toFixed(0));
    const et0Evapotranspiration = Number((1.5 + 1.2 * Math.cos(i / 6)).toFixed(2));
    const soilTemperature = Number((temperatureMean - 1.2).toFixed(1));
    const soilMoisture = Number((0.28 + 0.08 * Math.sin(i / 5)).toFixed(3));
    return {
      date: dateStr,
      temperatureMean,
      precipitation,
      relativeHumidity,
      et0Evapotranspiration,
      soilTemperature,
      soilMoisture
    };
  })
};

export const DEMO_SOIL_DATA: SoilGridsResponse = {
  source: 'ISRIC_SOILGRIDS_V2',
  attribution: 'DEMONSTRATION SIMULATION (Calibrated against global SoilGrids 250m references)',
  isDemonstrationData: true,
  coordinates: { latitude: 42.0308, longitude: -93.6319 },
  phH2O: 6.4,
  socGkg: 28.5,
  socPercent: 2.85,
  nitrogenGkg: 2.4,
  sandPercent: 22,
  clayPercent: 28,
  siltPercent: 50,
  textureClass: 'Silt Loam / Clay Loam',
  dataCompleteness: 94
};

export const DEMO_INSIGHTS: AgriculturalInsight[] = [
  {
    id: 'ins-01',
    type: 'water_stress',
    severity: 'advisory',
    title: 'Post-Monsoon Subsoil Moisture Depletion',
    observation: 'Cumulative 30-day ET0 (51.4 mm) exceeds late-season precipitation in dryland blocks. Top 0-7cm soil moisture index stands at 0.28 m³/m³.',
    agronomicRecommendation: 'Prioritize deep-taprooted legume species (Chickpea or Pigeon Pea) or establish mulch cover to attenuate evaporative vapor pressure losses.',
    confidence: 'High (Verified across ERA5 and NASA POWER)',
    dataSource: 'NASA POWER + ERA5 Reanalysis',
    timestamp: '2026-11-14T08:30:00Z'
  },
  {
    id: 'ins-02',
    type: 'soil_health',
    severity: 'info',
    title: 'Biological Nitrogen Fixation Opportunity',
    observation: 'Soil organic carbon levels (2.85%) indicate active microbial potential, but consecutive cereal sequences have drawn down labile mineralized nitrogen.',
    agronomicRecommendation: 'Incorporate Bradyrhizobium-inoculated soybean or hairy vetch cover crop before the next maize planting to regenerate 50-80 kg N/ha biologically.',
    confidence: 'Moderate (Modelled SoilGrids estimate)',
    dataSource: 'ISRIC SoilGrids 2.0',
    timestamp: '2026-11-12T14:15:00Z'
  },
  {
    id: 'ins-03',
    type: 'rainfall_anomaly',
    severity: 'info',
    title: 'Favorable Sowing Soil Moisture Window',
    observation: 'Recent precipitation events deliver 64.2 mm cumulative water recharge, raising effective field capacity to optimal germination thresholds.',
    agronomicRecommendation: 'Soil temperature (11.5°C) is ideal for winter wheat or chickpea drill seeding over the upcoming 7-10 day window before sub-freezing night dips.',
    confidence: 'High (NASA POWER Satellite Climatology)',
    dataSource: 'NASA POWER Daily Point',
    timestamp: '2026-11-10T11:00:00Z'
  }
];
