import { Coordinates, PointOfInterest, POIType } from '../types';
import { haversineDistance } from '../utils/geo';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const SEARCH_RADIUS_M = 15000; // 15 km around the sunny spot

interface OverpassElement {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
}

function buildOverpassQuery(coords: Coordinates): string {
  const { latitude, longitude } = coords;
  const r = SEARCH_RADIUS_M;

  return `[out:json][timeout:10];
(
  node["natural"="beach"](around:${r},${latitude},${longitude});
  way["natural"="beach"](around:${r},${latitude},${longitude});
  node["leisure"="park"](around:${r},${latitude},${longitude});
  way["leisure"="park"](around:${r},${latitude},${longitude});
  node["leisure"="nature_reserve"](around:${r},${latitude},${longitude});
  way["leisure"="nature_reserve"](around:${r},${latitude},${longitude});
  node["tourism"="viewpoint"](around:${r},${latitude},${longitude});
  node["natural"="water"]["water"="lake"](around:${r},${latitude},${longitude});
  way["natural"="water"]["water"="lake"](around:${r},${latitude},${longitude});
  node["route"="hiking"](around:${r},${latitude},${longitude});
  way["route"="hiking"](around:${r},${latitude},${longitude});
);
out center 50;`;
}

function classifyPOI(tags: Record<string, string>): { type: POIType; emoji: string } {
  if (tags.natural === 'beach') return { type: 'beach', emoji: '🏖️' };
  if (tags.natural === 'water' && tags.water === 'lake') return { type: 'lake', emoji: '🌊' };
  if (tags.tourism === 'viewpoint') return { type: 'viewpoint', emoji: '🏔️' };
  if (tags.route === 'hiking') return { type: 'hiking', emoji: '🥾' };
  if (tags.leisure === 'nature_reserve') return { type: 'nature', emoji: '🌿' };
  if (tags.leisure === 'park') return { type: 'park', emoji: '🌳' };
  return { type: 'nature', emoji: '🌿' };
}

export async function fetchPOIsNearSpot(
  spotCoords: Coordinates,
): Promise<PointOfInterest[]> {
  const query = buildOverpassQuery(spotCoords);

  const response = await fetch(OVERPASS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `data=${encodeURIComponent(query)}`,
  });

  if (!response.ok) return [];

  const data = await response.json();
  const elements: OverpassElement[] = data.elements || [];

  const pois: PointOfInterest[] = [];
  const seenNames = new Set<string>();

  for (const el of elements) {
    const tags = el.tags || {};
    const name = tags.name;
    if (!name || seenNames.has(name)) continue;
    seenNames.add(name);

    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    if (lat == null || lon == null) continue;

    const coords: Coordinates = { latitude: lat, longitude: lon };
    const { type, emoji } = classifyPOI(tags);
    const distance = Math.round(haversineDistance(spotCoords, coords) * 10) / 10;

    pois.push({
      id: String(el.id),
      name,
      coordinates: coords,
      type,
      emoji,
      distance,
    });
  }

  pois.sort((a, b) => a.distance - b.distance);
  return pois.slice(0, 10);
}
