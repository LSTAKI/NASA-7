'use client';

import { useState, useEffect, useCallback } from 'react';
import { Farm } from '@/types';
import { INITIAL_FARMS } from '@/data/mock/farms';

const STORAGE_KEY_FARMS = 'arachnova_registered_farms_v1';
const STORAGE_KEY_ACTIVE = 'arachnova_active_farm_id_v1';

export function useActiveFarm() {
  const [farms, setFarms] = useState<Farm[]>(() => {
    if (typeof window === 'undefined') return INITIAL_FARMS;
    try {
      const storedFarms = localStorage.getItem(STORAGE_KEY_FARMS);
      if (storedFarms) {
        const parsed = JSON.parse(storedFarms);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_FARMS;
  });

  const [activeFarmId, setActiveFarmIdState] = useState<string>(() => {
    if (typeof window === 'undefined') return INITIAL_FARMS[0].id;
    try {
      const storedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE);
      if (storedActiveId) return storedActiveId;
    } catch {
      // fallback
    }
    return INITIAL_FARMS[0].id;
  });

  const [isLoaded, setIsLoaded] = useState(true);

  // Sync with external storage updates if changed across tabs or components
  useEffect(() => {
    const handleStorage = () => {
      try {
        const storedFarms = localStorage.getItem(STORAGE_KEY_FARMS);
        const storedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE);
        if (storedFarms) {
          const parsed = JSON.parse(storedFarms);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFarms(parsed);
          }
        }
        if (storedActiveId) {
          setActiveFarmIdState(storedActiveId);
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('arachnova_active_farm_changed', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('arachnova_active_farm_changed', handleStorage);
    };
  }, []);

  const setActiveFarmId = useCallback((id: string) => {
    setActiveFarmIdState(id);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE, id);
      window.dispatchEvent(new Event('arachnova_active_farm_changed'));
    } catch (e) {
      console.warn('Failed to persist active farm ID', e);
    }
  }, []);

  const addFarm = useCallback((newFarmData: Omit<Farm, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `farm-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const farm: Farm = {
      ...newFarmData,
      id,
      createdAt: now,
      updatedAt: now
    };

    setFarms(prev => {
      const updated = [farm, ...prev];
      try {
        localStorage.setItem(STORAGE_KEY_FARMS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save farm', e);
      }
      return updated;
    });

    setActiveFarmId(id);
    return farm;
  }, [setActiveFarmId]);

  const updateFarm = useCallback((id: string, updates: Partial<Farm>) => {
    setFarms(prev => {
      const updated = prev.map(f => (f.id === id ? { ...f, ...updates, updatedAt: new Date().toISOString() } : f));
      try {
        localStorage.setItem(STORAGE_KEY_FARMS, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to update farm', e);
      }
      return updated;
    });
  }, []);

  const deleteFarm = useCallback((id: string) => {
    setFarms(prev => {
      const filtered = prev.filter(f => f.id !== id);
      const remaining = filtered.length > 0 ? filtered : INITIAL_FARMS;
      try {
        localStorage.setItem(STORAGE_KEY_FARMS, JSON.stringify(remaining));
      } catch (e) {
        console.warn('Failed to persist deletion', e);
      }
      if (activeFarmId === id) {
        setActiveFarmId(remaining[0].id);
      }
      return remaining;
    });
  }, [activeFarmId, setActiveFarmId]);

  const activeFarm = farms.find(f => f.id === activeFarmId) || farms[0] || INITIAL_FARMS[0];

  return {
    farms,
    activeFarm,
    activeFarmId,
    setActiveFarmId,
    addFarm,
    updateFarm,
    deleteFarm,
    isLoaded
  };
}
