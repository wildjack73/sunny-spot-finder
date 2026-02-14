import { Coordinates, WeatherData } from '../types';
import { getWeatherInfo } from '../utils/weatherCodes';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

interface OpenMeteoResponse {
  current: {
    weather_code: number;
    temperature_2m: number;
    wind_speed_10m: number;
  };
}

export async function fetchWeatherAtPoint(coords: Coordinates): Promise<WeatherData> {
  const url = `${BASE_URL}?latitude=${coords.latitude}&longitude=${coords.longitude}&current=weather_code,temperature_2m,wind_speed_10m`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur météo: ${response.status}`);
  }

  const data: OpenMeteoResponse = await response.json();
  const info = getWeatherInfo(data.current.weather_code);

  return {
    coordinates: coords,
    weatherCode: data.current.weather_code,
    temperature: Math.round(data.current.temperature_2m),
    windSpeed: Math.round(data.current.wind_speed_10m),
    ...info,
  };
}

export async function fetchWeatherAtMultiplePoints(
  points: Coordinates[],
): Promise<WeatherData[]> {
  if (points.length === 0) return [];

  const latitudes = points.map((p) => p.latitude.toFixed(4)).join(',');
  const longitudes = points.map((p) => p.longitude.toFixed(4)).join(',');

  const url = `${BASE_URL}?latitude=${latitudes}&longitude=${longitudes}&current=weather_code,temperature_2m,wind_speed_10m`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Erreur météo batch: ${response.status}`);
  }

  const data = await response.json();

  // Open-Meteo returns an array when multiple coordinates are given
  const results: OpenMeteoResponse[] = Array.isArray(data) ? data : [data];

  return results.map((result, index) => {
    const info = getWeatherInfo(result.current.weather_code);
    return {
      coordinates: points[index],
      weatherCode: result.current.weather_code,
      temperature: Math.round(result.current.temperature_2m),
      windSpeed: Math.round(result.current.wind_speed_10m),
      ...info,
    };
  });
}
