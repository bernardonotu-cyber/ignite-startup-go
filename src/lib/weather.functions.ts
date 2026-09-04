import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { FEATURED_WEATHER, type WeatherData } from "./weather-codes";

const geoSchema = z.object({ query: z.string().min(1).max(100) });
const weatherSchema = z.object({
  lat: z.number(),
  lon: z.number(),
  unit: z.enum(["celsius", "fahrenheit"]).default("celsius"),
});

export type LocationResult = {
  name: string;
  country: string;
  admin1?: string;
  lat: number;
  lon: number;
};

export const searchLocations = createServerFn({ method: "GET" })
  .inputValidator((input) => geoSchema.parse(input))
  .handler(async ({ data }): Promise<LocationResult[]> => {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(data.query)}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Location search failed");
    const json = (await res.json()) as { results?: any[] };
    return (json.results ?? []).map((r) => ({
      name: r.name,
      country: r.country ?? "",
      admin1: r.admin1,
      lat: r.latitude,
      lon: r.longitude,
    }));
  });

async function fetchWeather(
  lat: number,
  lon: number,
  unit: "celsius" | "fahrenheit",
  name: string,
  country?: string,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset",
    timezone: "auto",
    forecast_days: "7",
    temperature_unit: unit,
  });
  const res = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`);
  if (!res.ok) throw new Error("Weather fetch failed");
  const j = (await res.json()) as any;
  return {
    name,
    country,
    timezone: j.timezone,
    current: {
      temp: j.current.temperature_2m,
      feelsLike: j.current.apparent_temperature,
      humidity: j.current.relative_humidity_2m,
      wind: j.current.wind_speed_10m,
      code: j.current.weather_code,
      isDay: j.current.is_day === 1,
    },
    days: (j.daily.time as string[]).map((date, i) => ({
      date,
      code: j.daily.weather_code[i],
      max: j.daily.temperature_2m_max[i],
      min: j.daily.temperature_2m_min[i],
      rainChance: j.daily.precipitation_probability_max?.[i] ?? 0,
      sunrise: j.daily.sunrise[i],
      sunset: j.daily.sunset[i],
    })),
  };
}

export const getWeather = createServerFn({ method: "GET" })
  .inputValidator((input) => weatherSchema.extend({ name: z.string().optional(), country: z.string().optional() }).parse(input))
  .handler(async ({ data }) => fetchWeather(data.lat, data.lon, data.unit, data.name ?? "Selected location", data.country));

export const getFeaturedWeather = createServerFn({ method: "GET" }).handler(async (): Promise<WeatherData[]> => {
  const results = await Promise.all(
    FEATURED_WEATHER.map((f) => fetchWeather(f.lat, f.lon, "celsius", f.name, f.country)),
  );
  return results;
});
