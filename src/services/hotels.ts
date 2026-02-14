import { Coordinates, Hotel } from '../types';
import { haversineDistance } from '../utils/geo';

interface OverpassElement {
  type: string;
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: {
    name?: string;
    stars?: string;
    phone?: string;
    website?: string;
    'contact:phone'?: string;
    'contact:website'?: string;
  };
}

export async function fetchHotelsNearSpot(coords: Coordinates): Promise<Hotel[]> {
  const query = `
    [out:json][timeout:10];
    (
      nwr["tourism"="hotel"](around:20000,${coords.latitude},${coords.longitude});
    );
    out center 30;
  `;

  const response = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!response.ok) return [];

  const data = await response.json();
  const elements: OverpassElement[] = data.elements || [];

  const hotels: Hotel[] = elements
    .filter((el) => el.tags?.name)
    .map((el) => {
      const lat = el.lat ?? el.center?.lat ?? 0;
      const lon = el.lon ?? el.center?.lon ?? 0;
      const tags = el.tags!;

      const starsRaw = tags.stars;
      let stars: number | null = null;
      if (starsRaw) {
        const parsed = parseInt(starsRaw, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 5) stars = parsed;
      }

      return {
        id: `${el.type}-${el.id}`,
        name: tags.name!,
        stars,
        coordinates: { latitude: lat, longitude: lon },
        distance: Math.round(haversineDistance(coords, { latitude: lat, longitude: lon }) * 10) / 10,
        phone: tags.phone || tags['contact:phone'],
        website: tags.website || tags['contact:website'],
      };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 10);

  return hotels;
}
