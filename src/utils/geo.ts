import { Coordinates } from '../types';

const EARTH_RADIUS_KM = 6371;

export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

export function haversineDistance(from: Coordinates, to: Coordinates): number {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(from.latitude)) *
      Math.cos(toRadians(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function getBearing(from: Coordinates, to: Coordinates): number {
  const dLon = toRadians(to.longitude - from.longitude);
  const fromLat = toRadians(from.latitude);
  const toLat = toRadians(to.latitude);
  const y = Math.sin(dLon) * Math.cos(toLat);
  const x =
    Math.cos(fromLat) * Math.sin(toLat) -
    Math.sin(fromLat) * Math.cos(toLat) * Math.cos(dLon);
  const bearing = toDegrees(Math.atan2(y, x));
  return (bearing + 360) % 360;
}

export function getCardinalDirection(bearing: number): string {
  const directions = [
    'Nord', 'Nord-Est', 'Est', 'Sud-Est',
    'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest',
  ];
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

export function destinationPoint(
  from: Coordinates,
  distanceKm: number,
  bearingDeg: number,
): Coordinates {
  const d = distanceKm / EARTH_RADIUS_KM;
  const brng = toRadians(bearingDeg);
  const lat1 = toRadians(from.latitude);
  const lon1 = toRadians(from.longitude);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(d) +
      Math.cos(lat1) * Math.sin(d) * Math.cos(brng),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(brng) * Math.sin(d) * Math.cos(lat1),
      Math.cos(d) - Math.sin(lat1) * Math.sin(lat2),
    );

  return {
    latitude: toDegrees(lat2),
    longitude: toDegrees(lon2),
  };
}

export function generateSurroundingPoints(
  center: Coordinates,
  distances: number[] = [5, 10, 15, 20, 30, 50, 80, 100],
  directions: number = 8,
): Coordinates[] {
  const points: Coordinates[] = [];
  const angleStep = 360 / directions;

  for (const distance of distances) {
    for (let i = 0; i < directions; i++) {
      const bearing = i * angleStep;
      points.push(destinationPoint(center, distance, bearing));
    }
  }

  return points;
}

export function estimateTravelTime(distanceKm: number): number {
  // Average speed: ~50 km/h accounting for roads not being straight
  const avgSpeedKmh = 50;
  return Math.round((distanceKm / avgSpeedKmh) * 60);
}
