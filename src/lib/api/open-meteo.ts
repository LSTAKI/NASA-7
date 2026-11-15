// ARACHNOVA - Open-Meteo Historical / Archive Weather Service
// Retrieves ERA5 / ERA5-Land reanalysis observations for environmental baseline and trends.

import { Coordinates, OpenMeteoResponse, HistoricalWeatherRecord } from '@/types';
import { DEMO_OPEN_METEO } from '@/data/mock/demonstration-data';

interface OpenMeteoCacheEntry {
  timestamp: number;
  data: OpenMeteoResponse;
}

const cache = new Map<string, OpenMeteoCacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour

export async function fetchHistoricalWeather(
  coords: Coordinates,
  startDateStr?: string,
  endDateStr?: string
): Promise<OpenMeteoResponse> {
  const { latitude, longitude } = coords;

  if (
    typeof latitude !== 'number' ||
    typeof longitude !== 'number' ||
    isNaN(latitude) ||
    isNaN(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error('Invalid coordinates: Latitude must be -90 to 90 and Longitude must be -180 to 180.');
  }

  // Open-Meteo ERA5 archive has ~5 days latency
  const today = new Date();
  const defaultEnd = new Date(today);
  defaultEnd.setDate(today.getDate() - 5);
  const defaultStart = new Date(defaultEnd);
  defaultStart.setDate(defaultEnd.getDate() - 30);

  const formatIsoDate = (d: Date) => d.toISOString().split('T')[0];

  const start_date = startDateStr || formatIsoDate(defaultStart);
  const end_date = endDateStr || formatIsoDate(defaultEnd);

  const cacheKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}_${start_date}_${end_date}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = new URL('https://archive-api.open-meteo.com/v1/archive');
  url.searchParams.set('latitude', latitude.toFixed(4));
  url.searchParams.set('longitude', longitude.toFixed(4));
  url.searchParams.set('start_date', start_date);
  url.searchParams.set('end_date', end_date);
  url.searchParams.set(
    'daily',
    'temperature_2m_mean,precipitation_sum,relative_humidity_2m_mean,et0_fao_evapotranspiration,soil_temperature_0_to_7cm_mean,soil_moisture_0_to_7cm_mean'
  );
  url.searchParams.set('timezone', 'auto');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'ARACHNOVA-Agri-Intelligence/1.0'
      },
      next: { revalidate: 3600 }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`Open-Meteo API HTTP ${res.status}: ${res.statusText}. Using fallback.`);
      return getFallbackWeather(coords, start_date, end_date);
    }

    const json = await res.json();
    const daily = json?.daily;

    if (!daily || !daily.time) {
      console.warn('Open-Meteo response missing daily block. Using fallback.');
      return getFallbackWeather(coords, start_date, end_date);
    }

    const times: string[] = daily.time;
    const temps: (number | null)[] = daily.temperature_2m_mean || [];
    const precips: (number | null)[] = daily.precipitation_sum || [];
    const humidities: (number | null)[] = daily.relative_humidity_2m_mean || [];
    const et0s: (number | null)[] = daily.et0_fao_evapotranspiration || [];
    const soilTemps: (number | null)[] = daily.soil_temperature_0_to_7cm_mean || [];
    const soilMoistures: (number | null)[] = daily.soil_moisture_0_to_7cm_mean || [];

    const dailyRecords: HistoricalWeatherRecord[] = [];
    let sumTemp = 0;
    let countTemp = 0;
    let sumRain = 0;
    let sumEt0 = 0;
    let sumSoilMoist = 0;
    let countSoilMoist = 0;
    let sumSoilTemp = 0;
    let countSoilTemp = 0;

    for (let i = 0; i < times.length; i++) {
      const date = times[i];
      const t = temps[i] ?? null;
      const p = precips[i] ?? null;
      const h = humidities[i] ?? null;
      const et = et0s[i] ?? null;
      const st = soilTemps[i] ?? null;
      const sm = soilMoistures[i] ?? null;

      if (t !== null) {
        sumTemp += t;
        countTemp++;
      }
      if (p !== null && p >= 0) sumRain += p;
      if (et !== null && et >= 0) sumEt0 += et;
      if (sm !== null && sm >= 0) {
        sumSoilMoist += sm;
        countSoilMoist++;
      }
      if (st !== null) {
        sumSoilTemp += st;
        countSoilTemp++;
      }

      dailyRecords.push({
        date,
        temperatureMean: t,
        precipitation: p,
        relativeHumidity: h,
        et0Evapotranspiration: et,
        soilTemperature: st,
        soilMoisture: sm
      });
    }

    const totalRain = Number(sumRain.toFixed(1));
    const totalEt0 = Number(sumEt0.toFixed(1));

    const normalizedResponse: OpenMeteoResponse = {
      source: 'OPEN_METEO_ERA5_ARCHIVE',
      attribution: 'Open-Meteo Historical Weather API (ERA5/ERA5-Land reanalysis products)',
      coordinates: coords,
      elevation: json.elevation,
      dailyRecords,
      summary: {
        avgTemp: countTemp > 0 ? Number((sumTemp / countTemp).toFixed(1)) : 0,
        totalRain,
        totalEt0,
        avgSoilMoisture: countSoilMoist > 0 ? Number((sumSoilMoist / countSoilMoist).toFixed(3)) : 0,
        avgSoilTemp: countSoilTemp > 0 ? Number((sumSoilTemp / countSoilTemp).toFixed(1)) : 0,
        waterDeficit: Number((totalRain - totalEt0).toFixed(1))
      },
      isDemonstrationData: false
    };

    cache.set(cacheKey, { timestamp: Date.now(), data: normalizedResponse });
    return normalizedResponse;
  } catch (err: unknown) {
    console.warn('Open-Meteo fetch error:', err);
    return getFallbackWeather(coords, start_date, end_date);
  }
}

function getFallbackWeather(coords: Coordinates, start_date: string, end_date: string): OpenMeteoResponse {
  return {
    ...DEMO_OPEN_METEO,
    coordinates: coords,
    isDemonstrationData: true,
    attribution: 'DEMONSTRATION FALLBACK (Live Open-Meteo service unreachable from current network)'
  };
}
