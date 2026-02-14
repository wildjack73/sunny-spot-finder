import { Coordinates } from '../types';

interface NominatimResponse {
  address: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    county?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export interface LocationName {
  city: string;
  department: string;
}

export async function reverseGeocode(coords: Coordinates): Promise<LocationName | null> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${coords.latitude}&lon=${coords.longitude}&format=json&addressdetails=1&accept-language=fr`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'SunnyApp/1.0' },
    });
    if (!response.ok) return null;

    const data: NominatimResponse = await response.json();
    const addr = data.address;

    const city = addr.city || addr.town || addr.village || addr.municipality || 'Zone inconnue';
    const department = addr.county || addr.state || '';

    return { city, department };
  } catch {
    return null;
  }
}
