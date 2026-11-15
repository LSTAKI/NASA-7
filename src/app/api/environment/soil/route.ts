import { NextRequest, NextResponse } from 'next/server';
import { fetchSoilGridsData } from '@/lib/api/soilgrids';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lonStr = searchParams.get('lon');

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
    const data = await fetchSoilGridsData({ latitude, longitude });
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown internal server error';
    return NextResponse.json(
      { error: 'Failed to retrieve ISRIC SoilGrids data.', details: message },
      { status: 500 }
    );
  }
}
