import { Coordinates } from '../types';

// Hotels.com search by coordinates
// Affiliate tracking: the Creator Program tracks via cookies when users
// click through from the app. For proper tracking, create a generic
// "search hotels" link in your Expedia Creator dashboard and set it below.
const AFFILIATE_BASE_URL: string | null = null; // Set your Creator link here if available

export function buildHotelSearchLink(coords: Coordinates): string {
  const checkin = getDateString(0);
  const checkout = getDateString(1);
  return buildSearchUrl(coords, checkin, checkout);
}

export function buildWeekendSearchLink(coords: Coordinates): string {
  const nextSaturday = getNextWeekendDate();
  const sunday = new Date(nextSaturday);
  sunday.setDate(sunday.getDate() + 1);
  return buildSearchUrl(coords, formatDate(nextSaturday), formatDate(sunday));
}

function buildSearchUrl(coords: Coordinates, checkin: string, checkout: string): string {
  const lat = coords.latitude.toFixed(4);
  const lon = coords.longitude.toFixed(4);

  const params = new URLSearchParams({
    'q-destination': '',
    latLong: `${lat},${lon}`,
    'q-check-in': checkin,
    'q-check-out': checkout,
    'sort-order': 'DISTANCE',
  });

  return `https://www.hotels.com/search.do?${params.toString()}`;
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
