interface WeatherInfo {
  label: string;
  emoji: string;
  isSunny: boolean;
}

const weatherCodeMap: Record<number, WeatherInfo> = {
  0: { label: 'Ciel dégagé', emoji: '☀️', isSunny: true },
  1: { label: 'Principalement dégagé', emoji: '🌤️', isSunny: true },
  2: { label: 'Partiellement nuageux', emoji: '⛅', isSunny: true },
  3: { label: 'Couvert', emoji: '☁️', isSunny: false },
  45: { label: 'Brouillard', emoji: '🌫️', isSunny: false },
  48: { label: 'Brouillard givrant', emoji: '🌫️', isSunny: false },
  51: { label: 'Bruine légère', emoji: '🌦️', isSunny: false },
  53: { label: 'Bruine modérée', emoji: '🌦️', isSunny: false },
  55: { label: 'Bruine dense', emoji: '🌦️', isSunny: false },
  56: { label: 'Bruine verglaçante', emoji: '🌧️', isSunny: false },
  57: { label: 'Bruine verglaçante dense', emoji: '🌧️', isSunny: false },
  61: { label: 'Pluie légère', emoji: '🌧️', isSunny: false },
  63: { label: 'Pluie modérée', emoji: '🌧️', isSunny: false },
  65: { label: 'Pluie forte', emoji: '🌧️', isSunny: false },
  66: { label: 'Pluie verglaçante', emoji: '🌧️', isSunny: false },
  67: { label: 'Pluie verglaçante forte', emoji: '🌧️', isSunny: false },
  71: { label: 'Neige légère', emoji: '🌨️', isSunny: false },
  73: { label: 'Neige modérée', emoji: '🌨️', isSunny: false },
  75: { label: 'Neige forte', emoji: '🌨️', isSunny: false },
  77: { label: 'Grains de neige', emoji: '🌨️', isSunny: false },
  80: { label: 'Averses légères', emoji: '🌧️', isSunny: false },
  81: { label: 'Averses modérées', emoji: '🌧️', isSunny: false },
  82: { label: 'Averses violentes', emoji: '🌧️', isSunny: false },
  85: { label: 'Averses de neige', emoji: '🌨️', isSunny: false },
  86: { label: 'Averses de neige fortes', emoji: '🌨️', isSunny: false },
  95: { label: 'Orage', emoji: '⛈️', isSunny: false },
  96: { label: 'Orage avec grêle', emoji: '⛈️', isSunny: false },
  99: { label: 'Orage violent avec grêle', emoji: '⛈️', isSunny: false },
};

const defaultWeather: WeatherInfo = {
  label: 'Inconnu',
  emoji: '❓',
  isSunny: false,
};

export function getWeatherInfo(code: number): WeatherInfo {
  return weatherCodeMap[code] ?? defaultWeather;
}

export function isSunnyCode(code: number): boolean {
  return getWeatherInfo(code).isSunny;
}
