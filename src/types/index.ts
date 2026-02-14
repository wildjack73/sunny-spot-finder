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

export interface SunnyForecast {
  hoursUntilSun: number;
  sunnyTime: string; // "14:00"
  weatherCode: number;
  label: string;
  emoji: string;
  temperature: number;
}

export interface PointOfInterest {
  id: string;
  name: string;
  coordinates: Coordinates;
  type: POIType;
  emoji: string;
  distance: number; // km from sunny spot
}

export type POIType = 'beach' | 'park' | 'viewpoint' | 'lake' | 'hiking' | 'nature';

export interface Hotel {
  id: string;
  name: string;
  stars: number | null;
  coordinates: Coordinates;
  distance: number; // km from sunny spot
  phone?: string;
  website?: string;
}

export type SearchStatus = 'idle' | 'locating' | 'checking_weather' | 'searching' | 'found' | 'already_sunny' | 'no_sun_found' | 'error';
