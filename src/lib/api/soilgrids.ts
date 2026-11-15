// ARACHNOVA - ISRIC SoilGrids REST API Integration Service
// Modelled global soil profile estimates from ISRIC - World Soil Information

import { Coordinates, SoilGridsResponse } from '@/types';
import { DEMO_SOIL_DATA } from '@/data/mock/demonstration-data';

interface SoilCacheEntry {
  timestamp: number;
  data: SoilGridsResponse;
}

const soilCache = new Map<string, SoilCacheEntry>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24-hour cache for static soil properties

export async function fetchSoilGridsData(coords: Coordinates): Promise<SoilGridsResponse> {
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

  const cacheKey = `${latitude.toFixed(3)}_${longitude.toFixed(3)}`;
  const cached = soilCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  // Construct query URL
  const url = new URL('https://rest.isric.org/soilgrids/v2.0/properties/query');
  url.searchParams.set('lat', latitude.toFixed(4));
  url.searchParams.set('lon', longitude.toFixed(4));
  // Request top 0-30cm depths
  ['phh2o', 'soc', 'nitrogen', 'sand', 'clay', 'silt'].forEach(prop => {
    url.searchParams.append('property', prop);
  });
  ['0-5cm', '5-15cm', '15-30cm'].forEach(depth => {
    url.searchParams.append('depth', depth);
  });
  url.searchParams.append('value', 'mean');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
        'User-Agent': 'ARACHNOVA-Agri-Intelligence/1.0'
      },
      next: { revalidate: 86400 }
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`SoilGrids API HTTP ${res.status}: ${res.statusText}. Using fallback.`);
      return getFallbackSoilData(coords);
    }

    const json = await res.json();
    const layers = json?.properties?.layers;

    if (!layers || !Array.isArray(layers)) {
      console.warn('SoilGrids response missing layers. Using fallback.');
      return getFallbackSoilData(coords);
    }

    // Helper to calculate weighted mean across available depths (0-30cm)
    const getPropertyMean = (propName: string, conversionFactor: number): number | null => {
      const layer = layers.find((l: { name?: string }) => l.name === propName);
      if (!layer || !layer.depths || !Array.isArray(layer.depths)) return null;

      let totalVal = 0;
      let count = 0;
      for (const d of layer.depths) {
        const mean = d.values?.mean;
        if (mean !== undefined && mean !== null && mean >= 0) {
          totalVal += mean;
          count++;
        }
      }
      if (count === 0) return null;
      return Number(((totalVal / count) * conversionFactor).toFixed(2));
    };

    // ISRIC SoilGrids Units:
    // phh2o: pH * 10 -> factor 0.1
    // soc: dg/kg -> factor 0.1 gives g/kg; factor 0.01 gives %
    // nitrogen: cg/kg -> factor 0.01 gives g/kg
    // sand, clay, silt: g/kg -> factor 0.1 gives %
    const phH2O = getPropertyMean('phh2o', 0.1);
    const socGkg = getPropertyMean('soc', 0.1);
    const socPercent = socGkg !== null ? Number((socGkg / 10).toFixed(2)) : null;
    const nitrogenGkg = getPropertyMean('nitrogen', 0.01);
    const sandPercent = getPropertyMean('sand', 0.1);
    const clayPercent = getPropertyMean('clay', 0.1);
    const siltPercent = getPropertyMean('silt', 0.1);

    // Compute data completeness
    const metrics = [phH2O, socGkg, nitrogenGkg, sandPercent, clayPercent, siltPercent];
    const presentCount = metrics.filter(m => m !== null).length;
    const completeness = Math.round((presentCount / metrics.length) * 100);

    // USDA texture classification approximation
    let textureClass = 'Loam (Estimated)';
    if (sandPercent !== null && clayPercent !== null && siltPercent !== null) {
      if (clayPercent >= 40) textureClass = 'Clay';
      else if (sandPercent >= 70) textureClass = 'Sandy Loam / Sand';
      else if (siltPercent >= 80) textureClass = 'Silt';
      else if (clayPercent >= 27 && clayPercent < 40 && sandPercent <= 45) textureClass = 'Clay Loam';
      else if (sandPercent >= 45 && clayPercent <= 20) textureClass = 'Sandy Loam';
      else if (siltPercent >= 50 && clayPercent <= 27) textureClass = 'Silt Loam';
      else textureClass = 'Loam';
    }

    const normalizedResponse: SoilGridsResponse = {
      source: 'ISRIC_SOILGRIDS_V2',
      attribution: 'ISRIC - World Soil Information (SoilGrids 250m v2.0 Global Soil Estimates)',
      coordinates: coords,
      phH2O,
      socGkg,
      socPercent,
      nitrogenGkg,
      sandPercent,
      clayPercent,
      siltPercent,
      textureClass,
      dataCompleteness: completeness,
      isDemonstrationData: false
    };

    soilCache.set(cacheKey, { timestamp: Date.now(), data: normalizedResponse });
    return normalizedResponse;
  } catch (err: unknown) {
    console.warn('ISRIC SoilGrids fetch error:', err);
    return getFallbackSoilData(coords);
  }
}

function getFallbackSoilData(coords: Coordinates): SoilGridsResponse {
  return {
    ...DEMO_SOIL_DATA,
    coordinates: coords,
    isDemonstrationData: true,
    attribution: 'DEMONSTRATION FALLBACK (Modelled estimate calibrated against global SoilGrids references)'
  };
}
