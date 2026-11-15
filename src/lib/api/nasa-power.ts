// ARACHNOVA - NASA POWER API Service
// Integration with NASA Langley Research Center POWER Project Daily Point API

import { Coordinates, NasaPowerResponse, NasaDailyRecord } from '@/types';
import { DEMO_NASA_POWER } from '@/data/mock/demonstration-data';

interface NasaCacheEntry {
  timestamp: number;
  data: NasaPowerResponse;
}

const cache = new Map<string, NasaCacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60; // 1 hour cache

export async function fetchNasaPowerDaily(
  coords: Coordinates,
  startDateStr?: string,
  endDateStr?: string
): Promise<NasaPowerResponse> {
  const { latitude, longitude } = coords;

  // Validate coordinates
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

  // Default to recent 30-day window
  // Note: NASA POWER daily observations typically have a latency of 2-4 days.
  const today = new Date();
  const defaultEnd = new Date(today);
  defaultEnd.setDate(today.getDate() - 5);
  const defaultStart = new Date(defaultEnd);
  defaultStart.setDate(defaultEnd.getDate() - 30);

  const formatNasaDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
  };

  const startParam = startDateStr?.replace(/-/g, '') || formatNasaDate(defaultStart);
  const endParam = endDateStr?.replace(/-/g, '') || formatNasaDate(defaultEnd);

  const cacheKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}_${startParam}_${endParam}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const url = new URL('https://power.larc.nasa.gov/api/temporal/daily/point');
  url.searchParams.set('parameters', 'T2M,T2M_MAX,T2M_MIN,PRECTOTCORR,ALLSKY_SFC_SW_DWN');
  url.searchParams.set('community', 'AG');
  url.searchParams.set('longitude', longitude.toFixed(4));
  url.searchParams.set('latitude', latitude.toFixed(4));
  url.searchParams.set('start', startParam);
  url.searchParams.set('end', endParam);
  url.searchParams.set('format', 'JSON');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'ARACHNOVA-Agri-Intelligence/1.0'
      },
      next: { revalidate: 3600 } // Next.js cache
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`NASA POWER API HTTP ${res.status}: ${res.statusText}. Using fallback.`);
      return getFallbackNasaData(coords, startParam, endParam);
    }

    const json = await res.json();
    const parameterObj = json?.properties?.parameter;

    if (!parameterObj) {
      console.warn('NASA POWER response missing properties.parameter. Using fallback.');
      return getFallbackNasaData(coords, startParam, endParam);
    }

    const t2mMap = parameterObj.T2M || {};
    const t2mMaxMap = parameterObj.T2M_MAX || {};
    const t2mMinMap = parameterObj.T2M_MIN || {};
    const precMap = parameterObj.PRECTOTCORR || {};
    const solarMap = parameterObj.ALLSKY_SFC_SW_DWN || {};

    const dates = Object.keys(t2mMap).sort();
    const dailyRecords: NasaDailyRecord[] = [];

    let sumT2m = 0;
    let countT2m = 0;
    let sumPrec = 0;
    let maxTemp = -999;
    let minTemp = 999;
    let sumSolar = 0;
    let countSolar = 0;

    for (const dateKey of dates) {
      // NASA POWER uses -999 for missing values
      const cleanVal = (val: number | undefined) => {
        if (val === undefined || val === -999 || val < -900) return null;
        return val;
      };

      const t2m = cleanVal(t2mMap[dateKey]);
      const t2mMax = cleanVal(t2mMaxMap[dateKey]);
      const t2mMin = cleanVal(t2mMinMap[dateKey]);
      const prec = cleanVal(precMap[dateKey]);
      const solar = cleanVal(solarMap[dateKey]);

      if (t2m !== null) {
        sumT2m += t2m;
        countT2m++;
      }
      if (prec !== null && prec >= 0) {
        sumPrec += prec;
      }
      if (t2mMax !== null && t2mMax > maxTemp) maxTemp = t2mMax;
      if (t2mMin !== null && t2mMin < minTemp) minTemp = t2mMin;
      if (solar !== null && solar >= 0) {
        sumSolar += solar;
        countSolar++;
      }

      dailyRecords.push({
        date: `${dateKey.substring(0, 4)}-${dateKey.substring(4, 6)}-${dateKey.substring(6, 8)}`,
        t2m,
        t2mMax,
        t2mMin,
        precipitation: prec,
        solarRadiation: solar
      });
    }

    const normalizedResponse: NasaPowerResponse = {
      source: 'NASA_POWER_AG_POINT',
      attribution: 'NASA Langley Research Center (LaRC) POWER Project',
      coordinates: coords,
      startDate: startParam,
      endDate: endParam,
      dailyRecords,
      summary: {
        avgTemperature: countT2m > 0 ? Number((sumT2m / countT2m).toFixed(1)) : 0,
        totalPrecipitation: Number(sumPrec.toFixed(1)),
        maxTemperature: maxTemp > -900 ? Number(maxTemp.toFixed(1)) : 0,
        minTemperature: minTemp < 900 ? Number(minTemp.toFixed(1)) : 0,
        avgSolarRadiation: countSolar > 0 ? Number((sumSolar / countSolar).toFixed(1)) : 0
      },
      isDemonstrationData: false
    };

    cache.set(cacheKey, { timestamp: Date.now(), data: normalizedResponse });
    return normalizedResponse;
  } catch (err: unknown) {
    console.warn('NASA POWER API fetch error:', err);
    return getFallbackNasaData(coords, startParam, endParam);
  }
}

function getFallbackNasaData(coords: Coordinates, startParam: string, endParam: string): NasaPowerResponse {
  return {
    ...DEMO_NASA_POWER,
    coordinates: coords,
    startDate: startParam,
    endDate: endParam,
    isDemonstrationData: true,
    attribution: 'DEMONSTRATION FALLBACK (Live NASA POWER service unreachable from current network)'
  };
}
