import { Coordinates } from '../types';

const CAMREF = '1011l424119';
const BASE_URL = 'https://www.expedia.fr/Hotel-Search';

export function buildExpediaHotelLink(coords: Coordinates): string {
  const checkin = getDateString(0); // today
  const checkout = getDateString(1); // tomorrow

  const params = new URLSearchParams({
    latLong: `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`,
    d1: checkin,
    d2: checkout,
    sort: 'DISTANCE',
    CAMREF: CAMREF,
  });

  return `${BASE_URL}?${params.toString()}`;
}

export function buildExpediaWeekendLink(coords: Coordinates): string {
  const nextSaturday = getNextWeekendDate();
  const sunday = new Date(nextSaturday);
  sunday.setDate(sunday.getDate() + 1);

  const params = new URLSearchParams({
    latLong: `${coords.latitude.toFixed(4)},${coords.longitude.toFixed(4)}`,
    d1: formatDate(nextSaturday),
    d2: formatDate(sunday),
    sort: 'DISTANCE',
    CAMREF: CAMREF,
  });

  return `${BASE_URL}?${params.toString()}`;
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
