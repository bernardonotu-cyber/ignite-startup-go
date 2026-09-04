import { Sun, CloudSun, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudSnow, CloudLightning, CloudHail } from "lucide-react";

export type WeatherInfo = { label: string; icon: typeof Sun };

export function weatherInfo(code: number): WeatherInfo {
  if (code === 0) return { label: "Clear sky", icon: Sun };
  if (code <= 2) return { label: code === 1 ? "Mostly clear" : "Partly cloudy", icon: CloudSun };
  if (code === 3) return { label: "Overcast", icon: Cloud };
  if (code === 45 || code === 48) return { label: "Fog", icon: CloudFog };
  if (code >= 51 && code <= 57) return { label: "Drizzle", icon: CloudDrizzle };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return { label: "Rain", icon: CloudRain };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86) return { label: "Snow", icon: CloudSnow };
  if (code === 66 || code === 67) return { label: "Icy rain", icon: CloudHail };
  if (code >= 95) return { label: "Thunderstorm", icon: CloudLightning };
  return { label: "Cloudy", icon: Cloud };
}

export type WeatherDay = {
  date: string;
  code: number;
  max: number;
  min: number;
  rainChance: number;
  sunrise: string;
  sunset: string;
};

export type WeatherData = {
  name: string;
  country?: string;
  timezone: string;
  current: {
    temp: number;
    feelsLike: number;
    humidity: number;
    wind: number;
    code: number;
    isDay: boolean;
  };
  days: WeatherDay[];
};

export const FEATURED_WEATHER = [
  { name: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503 },
  { name: "Bali", country: "Indonesia", lat: -8.65, lon: 115.2167 },
  { name: "Rio de Janeiro", country: "Brazil", lat: -22.9068, lon: -43.1729 },
  { name: "Cape Town", country: "South Africa", lat: -33.9249, lon: 18.4241 },
  { name: "Santorini", country: "Greece", lat: 36.3932, lon: 25.4615 },
  { name: "Marrakech", country: "Morocco", lat: 31.6295, lon: -7.9811 },
] as const;
