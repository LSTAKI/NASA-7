'use client';

import { useState, useEffect, useCallback } from 'react';
import { Coordinates, NasaPowerResponse, OpenMeteoResponse, SoilGridsResponse } from '@/types';
import { DEMO_NASA_POWER, DEMO_OPEN_METEO, DEMO_SOIL_DATA } from '@/data/mock/demonstration-data';

interface UseEnvironmentalDataOptions {
  startDate?: string;
  endDate?: string;
  autoFetch?: boolean;
}

export function useEnvironmentalData(
  coords: Coordinates | null | undefined,
  options: UseEnvironmentalDataOptions = {}
) {
  const { startDate, endDate, autoFetch = true } = options;

  const [nasaData, setNasaData] = useState<NasaPowerResponse | null>(null);
  const [weatherData, setWeatherData] = useState<OpenMeteoResponse | null>(null);
  const [soilData, setSoilData] = useState<SoilGridsResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    if (!coords || typeof coords.latitude !== 'number' || typeof coords.longitude !== 'number') {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const lat = coords.latitude.toFixed(4);
    const lon = coords.longitude.toFixed(4);

    try {
      const nasaQuery = new URLSearchParams({ lat, lon });
      if (startDate) nasaQuery.set('start', startDate);
      if (endDate) nasaQuery.set('end', endDate);

      const weatherQuery = new URLSearchParams({ lat, lon });
      if (startDate) weatherQuery.set('start_date', startDate);
      if (endDate) weatherQuery.set('end_date', endDate);

      const soilQuery = new URLSearchParams({ lat, lon });

      // Run parallel queries with graceful degradation
      const [nasaRes, weatherRes, soilRes] = await Promise.allSettled([
        fetch(`/api/environment/nasa-power?${nasaQuery.toString()}`).then(r => r.json()),
        fetch(`/api/environment/historical-weather?${weatherQuery.toString()}`).then(r => r.json()),
        fetch(`/api/environment/soil?${soilQuery.toString()}`).then(r => r.json())
      ]);

      if (nasaRes.status === 'fulfilled' && !nasaRes.value.error) {
        setNasaData(nasaRes.value);
      } else {
        console.warn('NASA POWER API failed, falling back to demonstration baseline');
        setNasaData({ ...DEMO_NASA_POWER, coordinates: coords });
      }

      if (weatherRes.status === 'fulfilled' && !weatherRes.value.error) {
        setWeatherData(weatherRes.value);
      } else {
        console.warn('Open-Meteo API failed, falling back to demonstration baseline');
        setWeatherData({ ...DEMO_OPEN_METEO, coordinates: coords });
      }

      if (soilRes.status === 'fulfilled' && !soilRes.value.error) {
        setSoilData(soilRes.value);
      } else {
        console.warn('SoilGrids API failed, falling back to demonstration baseline');
        setSoilData({ ...DEMO_SOIL_DATA, coordinates: coords });
      }

      setLastUpdated(new Date());
    } catch (err: unknown) {
      console.error('Failed to retrieve environmental data:', err);
      setError('Unable to contact environmental observation APIs. Showing cached demonstration models.');
      setNasaData({ ...DEMO_NASA_POWER, coordinates: coords });
      setWeatherData({ ...DEMO_OPEN_METEO, coordinates: coords });
      setSoilData({ ...DEMO_SOIL_DATA, coordinates: coords });
    } finally {
      setLoading(false);
    }
  }, [coords?.latitude, coords?.longitude, startDate, endDate]);

  useEffect(() => {
    let ignore = false;
    if (autoFetch && coords) {
      Promise.resolve().then(() => {
        if (!ignore) {
          fetchData();
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [fetchData, autoFetch, coords?.latitude, coords?.longitude]);

  return {
    nasaData,
    weatherData,
    soilData,
    loading,
    error,
    lastUpdated,
    refresh: fetchData
  };
}
