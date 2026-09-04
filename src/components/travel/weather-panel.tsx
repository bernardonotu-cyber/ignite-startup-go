import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { weatherInfo, type WeatherData } from "@/lib/weather-codes";
import { Droplets, Wind, Sunrise, Sunset, Umbrella } from "lucide-react";

function fmtTime(iso: string) {
  return iso.slice(11, 16);
}

function travelTip(w: WeatherData): string {
  const rainy = w.days.filter((d) => d.rainChance >= 50).length;
  const hot = w.days.some((d) => d.max >= 32);
  const cold = w.days.some((d) => d.min <= 5);
  if (rainy >= 3) return `Pack rain gear — showers likely ${rainy} of the next 7 days.`;
  if (hot) return "It gets hot this week — light clothing, sunscreen and water are your friends.";
  if (cold) return "Cold nights ahead — bring warm layers for the evenings.";
  return "Conditions look pleasant this week — great window for sightseeing.";
}

export function WeatherPanel({ weather, unit }: { weather: WeatherData; unit: "celsius" | "fahrenheit" }) {
  const info = weatherInfo(weather.current.code);
  const Icon = info.icon;
  const suffix = unit === "celsius" ? "°C" : "°F";

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              {weather.country ? `${weather.country} · ` : ""}Now
            </p>
            <h3 className="mt-1 text-2xl font-semibold tracking-tight">{weather.name}</h3>
            <Badge variant="secondary" className="mt-2">
              <Icon className="mr-1 h-3.5 w-3.5" /> {info.label}
            </Badge>
          </div>
          <div className="text-right">
            <p className="text-6xl font-semibold tabular-nums tracking-tight">
              {Math.round(weather.current.temp)}<span className="text-2xl align-top">{suffix}</span>
            </p>
            <p className="text-sm text-muted-foreground">Feels like {Math.round(weather.current.feelsLike)}{suffix}</p>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <span className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
            <Droplets className="h-4 w-4 text-primary" /> {weather.current.humidity}% humidity
          </span>
          <span className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
            <Wind className="h-4 w-4 text-primary" /> {Math.round(weather.current.wind)} km/h wind
          </span>
          <span className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
            <Sunrise className="h-4 w-4 text-primary" /> {fmtTime(weather.days[0]!.sunrise)}
          </span>
          <span className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2">
            <Sunset className="h-4 w-4 text-primary" /> {fmtTime(weather.days[0]!.sunset)}
          </span>
        </div>
        <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Umbrella className="h-4 w-4 text-primary" /> {travelTip(weather)}
        </p>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {weather.days.map((d) => {
          const di = weatherInfo(d.code);
          const DIcon = di.icon;
          return (
            <Card key={d.date} className="p-3 text-center">
              <p className="text-xs font-medium text-muted-foreground">
                {new Date(d.date + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" })}
              </p>
              <DIcon className="mx-auto mt-2 h-6 w-6 text-primary" />
              <p className="mt-2 text-sm font-semibold tabular-nums">
                {Math.round(d.max)}° <span className="font-normal text-muted-foreground">{Math.round(d.min)}°</span>
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">{d.rainChance}% rain</p>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
