import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { TripBasketSheet } from "@/components/travel/trip-basket-sheet";
import { WeatherPanel } from "@/components/travel/weather-panel";
import { searchLocations, getWeather, type LocationResult } from "@/lib/weather.functions";
import { FEATURED_WEATHER } from "@/lib/weather-codes";
import { CloudSun, Search, ArrowLeft } from "lucide-react";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/weather")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "Weather Report — E-Embassy" },
      { name: "description", content: "Check live weather conditions and a 7-day forecast for any country or city before you travel." },
      { property: "og:title", content: "Weather Report — E-Embassy" },
      { property: "og:description", content: "Check live weather conditions and a 7-day forecast for any country or city before you travel." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WeatherPage,
});

type Picked = { name: string; country: string; lat: number; lon: number } | null;

function WeatherPage() {
  const { q } = Route.useSearch();
  const [term, setTerm] = useState(q);
  const [picked, setPicked] = useState<Picked>(null);
  const [unit, setUnit] = useState<"celsius" | "fahrenheit">("celsius");
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  const search = useServerFn(searchLocations);
  const fetchWeather = useServerFn(getWeather);

  // Resolve ?q= into coordinates once
  useEffect(() => {
    if (!q || picked) return;
    search({ data: { query: q.split(",")[0]! } }).then((results) => {
      const first = results[0];
      if (first) setPicked({ name: first.name, country: first.country, lat: first.lat, lon: first.lon });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const { data: suggestions } = useQuery({
    queryKey: ["weather-search", term],
    queryFn: () => search({ data: { query: term } }),
    enabled: term.trim().length >= 2,
    staleTime: 5 * 60_000,
  });

  const { data: weather, isLoading } = useQuery({
    queryKey: ["weather", "detail", picked?.lat, picked?.lon, unit],
    queryFn: () =>
      fetchWeather({
        data: { lat: picked!.lat, lon: picked!.lon, unit, name: picked!.name, country: picked!.country },
      }),
    enabled: !!picked,
    staleTime: 10 * 60_000,
    refetchInterval: 15 * 60_000,
  });

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (r: LocationResult) => {
    setPicked({ name: r.name, country: r.country, lat: r.lat, lon: r.lon });
    setTerm(`${r.name}, ${r.country}`);
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Logo className="h-7" />
          </Link>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <Link to="/explore"><Button variant="ghost" className="press rounded-full">Explore</Button></Link>
            <Link to="/passport-visa"><Button variant="ghost" className="press rounded-full">Passport & Visa</Button></Link>
            <Link to="/hire"><Button variant="ghost" className="press rounded-full">Hire a Pro</Button></Link>
            <Link to="/track"><Button variant="ghost" className="press rounded-full">Track</Button></Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <TripBasketSheet />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 pb-16">
        <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Home
        </Link>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Weather report</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Check the sky before you fly</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Live conditions and a 7-day forecast for any country or city.
            </p>
          </div>
          <div className="flex rounded-full border bg-card p-1 text-sm">
            {(["celsius", "fahrenheit"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnit(u)}
                className={`press rounded-full px-3.5 py-1.5 font-medium transition ${
                  unit === u ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {u === "celsius" ? "°C" : "°F"}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div ref={boxRef} className="relative mt-8 max-w-xl">
          <div className="flex items-center gap-2 rounded-2xl border bg-card px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-primary/40">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={term}
              onChange={(e) => { setTerm(e.target.value); setOpen(true); }}
              onFocus={() => setOpen(true)}
              placeholder="Search any country or city — Japan, Lagos, Paris…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
          {open && suggestions && suggestions.length > 0 && term.trim().length >= 2 && (
            <Card className="absolute z-20 mt-2 w-full divide-y overflow-hidden p-0 shadow-xl">
              {suggestions.map((r, i) => (
                <button
                  key={`${r.lat}-${r.lon}-${i}`}
                  onClick={() => choose(r)}
                  className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition hover:bg-muted"
                >
                  <span className="font-medium">{r.name}</span>
                  <span className="text-xs text-muted-foreground">{[r.admin1, r.country].filter(Boolean).join(", ")}</span>
                </button>
              ))}
            </Card>
          )}
        </div>

        {/* Quick chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {FEATURED_WEATHER.map((f) => (
            <button
              key={f.name}
              onClick={() => choose({ name: f.name, country: f.country, lat: f.lat, lon: f.lon })}
              className={`press rounded-full border px-3.5 py-1.5 text-sm transition ${
                picked?.name === f.name ? "border-primary bg-primary/10 text-primary" : "bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Result */}
        <div className="mt-8">
          {picked ? (
            isLoading || !weather ? (
              <div className="space-y-4">
                <Skeleton className="h-56 rounded-2xl" />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
                  {Array.from({ length: 7 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
                </div>
              </div>
            ) : (
              <WeatherPanel weather={weather} unit={unit} />
            )
          ) : (
            <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <CloudSun className="h-10 w-10 text-primary/50" />
              <h3 className="mt-4 text-lg font-semibold">Search for a place to see its weather</h3>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Type any country or city above, or tap one of the quick picks.
              </p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
