import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getFeaturedWeather } from "@/lib/weather.functions";
import { weatherInfo } from "@/lib/weather-codes";
import { CloudSun, ArrowRight } from "lucide-react";

export function WeatherStrip() {
  const fetchAll = useServerFn(getFeaturedWeather);
  const { data, isLoading } = useQuery({
    queryKey: ["weather", "featured"],
    queryFn: () => fetchAll(),
    staleTime: 10 * 60_000,
    refetchInterval: 15 * 60_000,
  });

  return (
    <div>
      {isLoading || !data ? (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {data.map((w) => {
            const info = weatherInfo(w.current.code);
            const Icon = info.icon;
            return (
              <Link
                key={w.name}
                to="/weather"
                search={{ q: `${w.name}, ${w.country}` }}
                className="press group"
              >
                <Card className="h-full p-4 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex items-start justify-between">
                    <Icon className="h-7 w-7 text-primary transition duration-300 group-hover:scale-110" />
                    <span className="text-2xl font-semibold tabular-nums">{Math.round(w.current.temp)}°</span>
                  </div>
                  <p className="mt-3 truncate text-sm font-medium">{w.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{w.country}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {info.label} · ↑{Math.round(w.days[0]!.max)}° ↓{Math.round(w.days[0]!.min)}°
                  </p>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
      <div className="mt-5 flex justify-center">
        <Link
          to="/weather"
          search={{ q: "" }}
          className="press inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <CloudSun className="h-4 w-4" /> Search weather for any country
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
