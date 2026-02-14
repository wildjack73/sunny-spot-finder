import { Coordinates, SunnySpot, WeatherData } from '../types';
import {
  generateSurroundingPoints,
  haversineDistance,
  getBearing,
  getCardinalDirection,
  estimateTravelTime,
} from '../utils/geo';
import { fetchWeatherAtMultiplePoints } from './weather';

const BATCH_SIZE = 20; // Open-Meteo handles up to ~50 coords per request

export async function findNearestSunnySpot(
  userLocation: Coordinates,
  onProgress?: (searched: number, total: number) => void,
): Promise<SunnySpot | null> {
  const distances = [5, 10, 15, 20, 30, 50, 80, 100, 130, 160, 200];
  const allPoints = generateSurroundingPoints(userLocation, distances, 8);
  const totalPoints = allPoints.length;
  let searched = 0;

  // Process in batches to avoid overwhelming the API
  const sunnySpots: SunnySpot[] = [];

  for (let i = 0; i < allPoints.length; i += BATCH_SIZE) {
    const batch = allPoints.slice(i, i + BATCH_SIZE);

    try {
      const weatherResults = await fetchWeatherAtMultiplePoints(batch);

      for (const weather of weatherResults) {
        if (weather.isSunny) {
          const distance = haversineDistance(userLocation, weather.coordinates);
          const bearing = getBearing(userLocation, weather.coordinates);

          sunnySpots.push({
            coordinates: weather.coordinates,
            weather,
            distance: Math.round(distance * 10) / 10,
            bearing,
            direction: getCardinalDirection(bearing),
            estimatedTime: estimateTravelTime(distance),
          });
        }
      }

      searched += batch.length;
      onProgress?.(searched, totalPoints);

      // If we found sunny spots in closer distances, no need to check further
      if (sunnySpots.length > 0 && i >= 24) {
        // After checking 5km, 10km, 15km rings
        break;
      }
    } catch (error) {
      console.warn(`Erreur batch ${i}:`, error);
      searched += batch.length;
      onProgress?.(searched, totalPoints);
    }
  }

  if (sunnySpots.length === 0) return null;

  // Sort by distance and return the closest
  sunnySpots.sort((a, b) => a.distance - b.distance);
  return sunnySpots[0];
}
