import { Coordinates } from '../types';

const CAMREF = '1011|424119';
const PARTNERIZE_BASE = 'https://prf.hn/click';

// Build a Partnerize tracked deep link to Hotels.com search
function buildTrackedLink(destinationUrl: string): string {
  const encodedUrl = encodeURIComponent(destinationUrl);
  return `${PARTNERIZE_BASE}/camref:${CAMREF}/destination:${encodedUrl}`;
}

export function buildExpediaHotelLink(coords: Coordinates): string {
  const checkin = getDateString(0); // today
  const checkout = getDateString(1); // tomorrow
  const lat = coords.latitude.toFixed(4);
  const lon = coords.longitude.toFixed(4);

  const destination = `https://www.hotels.com/search.do?q-destination=&latLong=${lat},${lon}&q-check-in=${checkin}&q-check-out=${checkout}&sort-order=DISTANCE`;

  return buildTrackedLink(destination);
}

export function buildExpediaWeekendLink(coords: Coordinates): string {
  const nextSaturday = getNextWeekendDate();
  const sunday = new Date(nextSaturday);
  sunday.setDate(sunday.getDate() + 1);
  const lat = coords.latitude.toFixed(4);
  const lon = coords.longitude.toFixed(4);

  const destination = `https://www.hotels.com/search.do?q-destination=&latLong=${lat},${lon}&q-check-in=${formatDate(nextSaturday)}&q-check-out=${formatDate(sunday)}&sort-order=DISTANCE`;

  return buildTrackedLink(destination);
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
  const day = now.getDay(); // 0=Sun, 6=Sat
  const daysUntilSaturday = (6 - day + 7) % 7 || 7;
  const saturday = new Date(now);
  saturday.setDate(now.getDate() + daysUntilSaturday);
  return saturday;
}
