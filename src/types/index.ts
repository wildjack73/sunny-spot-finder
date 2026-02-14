export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface WeatherData {
  coordinates: Coordinates;
  weatherCode: number;
  temperature: number;
  windSpeed: number;
  label: string;
  emoji: string;
  isSunny: boolean;
}

export interface SunnySpot {
  coordinates: Coordinates;
  weather: WeatherData;
  distance: number; // km
  bearing: number; // degrees
  direction: string; // "Nord", "Sud-Est", etc.
  estimatedTime: number; // minutes
}

export type SearchStatus = 'idle' | 'locating' | 'checking_weather' | 'searching' | 'found' | 'already_sunny' | 'no_sun_found' | 'error';
