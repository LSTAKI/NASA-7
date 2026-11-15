import { NextRequest, NextResponse } from 'next/server';
import { fetchNasaPowerDaily } from '@/lib/api/nasa-power';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');
  const start = searchParams.get('start') || undefined;
  const end = searchParams.get('end') || undefined;

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
    const data = await fetchNasaPowerDaily({ latitude, longitude }, start, end);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown internal server error';
    return NextResponse.json(
      { error: 'Failed to retrieve NASA POWER daily data.', details: message },
      { status: 500 }
    );
  }
}
