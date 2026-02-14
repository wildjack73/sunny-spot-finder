import { Coordinates } from '../types';

export function buildHotelDetailLink(hotelName: string, coords: Coordinates): string {
  const checkin = getDateString(0);
  const checkout = getDateString(1);

  const params = new URLSearchParams({
    ss: hotelName,
    checkin: checkin,
    checkout: checkout,
    latitude: coords.latitude.toFixed(4),
    longitude: coords.longitude.toFixed(4),
    lang: 'fr',
  });

  return `https://www.booking.com/searchresults.fr.html?${params.toString()}`;
}

export function buildHotelSearchLink(coords: Coordinates, cityName?: string): string {
  const checkin = getDateString(0);
  const checkout = getDateString(1);
  return buildSearchUrl(coords, checkin, checkout, cityName);
}

export function buildWeekendSearchLink(coords: Coordinates, cityName?: string): string {
  const nextSaturday = getNextWeekendDate();
  const sunday = new Date(nextSaturday);
  sunday.setDate(sunday.getDate() + 1);
  return buildSearchUrl(coords, formatDate(nextSaturday), formatDate(sunday), cityName);
}

function buildSearchUrl(
  coords: Coordinates,
  checkin: string,
  checkout: string,
  cityName?: string,
): string {
  const lat = coords.latitude.toFixed(4);
  const lon = coords.longitude.toFixed(4);
  const destination = cityName ? `${cityName}, France` : `${lat},${lon}`;

  const params = new URLSearchParams({
    destination: destination,
    latLong: `${lat},${lon}`,
    d1: checkin,
    d2: checkout,
    sort: 'DISTANCE_FROM_LANDMARK',
    adults: '2',
  });

  return `https://fr.hotels.com/Hotel-Search?${params.toString()}`;
}

function getDateString(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return formatDate(date);
}

function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getNextWeekendDate(): Date {
  const now = new Date();
  const day = now.getDay();
  const daysUntilSaturday = (6 - day + 7) % 7 || 7;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + daysUntilSaturday);
  return saturday;
}
