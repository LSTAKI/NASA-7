import { NextRequest, NextResponse } from 'next/server';
import { fetchHistoricalWeather } from '@/lib/api/open-meteo';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');
  const startDate = searchParams.get('start_date') || undefined;
  const endDate = searchParams.get('end_date') || undefined;

  if (!latStr || !lonStr) {
    return NextResponse.json(
      { error: 'Missing required query parameters: "lat" and "lon" are required.' },
      { status: 400 }
    );
  }

  const latitude = parseFloat(latStr);
  const longitude = parseFloat(lonStr);

  if (isNaN(latitude) || isNaN(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return NextResponse.json(
      { error: 'Invalid coordinates: latitude must be between -90 and 90; longitude between -180 and 180.' },
      { status: 400 }
    );
  }

  try {
    const data = await fetchHistoricalWeather({ latitude, longitude }, startDate, endDate);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown internal server error';
    return NextResponse.json(
      { error: 'Failed to retrieve historical weather reanalysis.', details: message },
      { status: 500 }
    );
  }
}
