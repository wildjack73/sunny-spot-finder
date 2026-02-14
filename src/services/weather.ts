import { Coordinates, WeatherData, SunnyForecast } from '../types';
import { getWeatherInfo, isSunnyCode } from '../utils/weatherCodes';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

interface OpenMeteoResponse {
  current: {
    weather_code: number;
    temperature_2m: number;
    wind_speed_10m: number;
  };
}

interface OpenMeteoHourlyResponse {
  hourly: {
    time: string[];
    weather_code: number[];
    temperature_2m: number[];
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

export async function fetchSunnyForecast(
  coords: Coordinates,
): Promise<SunnyForecast | null> {
  const url = `${BASE_URL}?latitude=${coords.latitude}&longitude=${coords.longitude}&hourly=weather_code,temperature_2m&forecast_days=2`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data: OpenMeteoHourlyResponse = await response.json();
  const now = new Date();

  for (let i = 0; i < data.hourly.time.length; i++) {
    const forecastTime = new Date(data.hourly.time[i]);
    if (forecastTime <= now) continue;

    const code = data.hourly.weather_code[i];
    if (isSunnyCode(code)) {
      const hoursUntilSun = Math.round(
        (forecastTime.getTime() - now.getTime()) / (1000 * 60 * 60),
      );
      const info = getWeatherInfo(code);
      const timeStr = forecastTime.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      return {
        hoursUntilSun,
        sunnyTime: timeStr,
        weatherCode: code,
        label: info.label,
        emoji: info.emoji,
        temperature: Math.round(data.hourly.temperature_2m[i]),
      };
    }
  }

  return null;
}
