export function formatCoordinates(lat: number, lon: number): string {
  const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
  const lonStr = `${Math.abs(lon).toFixed(4)}° ${lon >= 0 ? 'E' : 'W'}`;
  return `${latStr}, ${lonStr}`;
}

export function formatNumber(val: number | null | undefined, decimals = 1, unit = ''): string {
  if (val === null || val === undefined || isNaN(val)) return '—';
  return `${val.toFixed(decimals)}${unit ? ' ' + unit : ''}`;
}

export function formatDateString(dateStr: string): string {
  if (!dateStr) return '—';
  // Handles YYYYMMDD or ISO format
  if (dateStr.length === 8 && !dateStr.includes('-')) {
    const y = dateStr.substring(0, 4);
    const m = dateStr.substring(4, 6);
    const d = dateStr.substring(6, 8);
    return `${y}-${m}-${d}`;
  }
  return dateStr.split('T')[0];
}

export function calculateWaterDeficit(rain: number, et0: number): { deficit: number; status: 'surplus' | 'moderate' | 'severe' } {
  const deficit = rain - et0;
  if (deficit >= 0) return { deficit, status: 'surplus' };
  if (deficit > -50) return { deficit, status: 'moderate' };
  return { deficit, status: 'severe' };
}
