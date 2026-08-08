import { useMemo, useState } from "react";
import { Ticket, MapPin, Clock, Navigation, Check, Plus, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { PLACES, distanceKm, formatKm, driveTime, type Place } from "@/lib/places-catalog";
import { useTripBasket } from "@/lib/trip-basket";

function AddPlace({ place, city }: { place: Place; city: string }) {
  const { add, has } = useTripBasket();
  const added = has(place.id);
  return (
    <Button
      size="sm"
      variant={added ? "secondary" : place.fee === 0 ? "outline" : "default"}
      onClick={() => {
        if (added) return;
        add({
          id: place.id,
          kind: "place",
          title: place.name,
          subtitle: `${place.area} · ${place.category}`,
          price: place.fee,
          destination: city,
        });
        toast.success(`${place.name} added to your basket`);
      }}
    >
      {added ? <Check className="mr-1 h-4 w-4" /> : <Plus className="mr-1 h-4 w-4" />}
      {added ? "In basket" : "Add"}
    </Button>
  );
}

export function PlacesLayer({ destinationId, city }: { destinationId: string; city: string }) {
  const places = PLACES[destinationId] ?? [];
  const [anchorId, setAnchorId] = useState<string>(places[0]?.id ?? "");
  const anchor = places.find((p) => p.id === anchorId) ?? places[0];

  const neighbours = useMemo(() => {
    if (!anchor) return [];
    return places
      .filter((p) => p.id !== anchor.id)
      .map((p) => ({ place: p, km: distanceKm(anchor, p) }))
      .sort((a, b) => a.km - b.km);
  }, [anchor, places]);

  if (places.length === 0) {
    return <p className="pt-4 text-sm text-muted-foreground">Places for this destination are coming soon.</p>;
  }

  const freeCount = places.filter((p) => p.fee === 0).length;

  return (
    <div className="space-y-5 pt-4">
      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <Badge variant="secondary">{places.length} places in {city}</Badge>
        <Badge className="bg-leaf text-leaf-foreground hover:bg-leaf">{freeCount} free to enter</Badge>
        <span>Tap a place to see how close everything else is.</span>
      </div>

      <div className="space-y-3">
        {places.map((p) => {
          const selected = p.id === anchor?.id;
          return (
            <div
              key={p.id}
              className={`rounded-2xl border bg-card p-4 transition ${selected ? "ring-2 ring-sunset" : ""}`}
            >
              <div className="flex flex-wrap items-start gap-3">
                <button
                  onClick={() => setAnchorId(p.id)}
                  className="min-w-[12rem] flex-1 text-left"
                  aria-pressed={selected}
                >
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{p.name}</p>
                    <Badge variant="outline" className="text-[11px] font-normal">
                      {p.category}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{p.blurb}</p>
                  <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {p.area}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {p.hours}
                    </span>
                  </div>
                </button>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    {p.fee === 0 ? (
                      <p className="text-lg font-semibold text-leaf">Free</p>
                    ) : (
                      <p className="text-lg font-semibold">${p.fee}</p>
                    )}
                    <p className="text-[11px] text-muted-foreground">{p.feeNote ?? "entry / person"}</p>
                  </div>
                  <AddPlace place={p} city={city} />
                </div>
              </div>

              {selected && neighbours.length > 0 && (
                <div className="mt-4 rounded-xl border bg-muted/40 p-3">
                  <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <Route className="h-3.5 w-3.5" /> Distance from {p.name}
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {neighbours.map(({ place, km }) => (
                      <li key={place.id} className="flex items-center justify-between gap-3 text-sm">
                        <span className="truncate">{place.name}</span>
                        <span className="flex shrink-0 items-center gap-2 text-xs text-muted-foreground">
                          <Navigation className="h-3 w-3" />
                          {formatKm(km)}
                          <span className="opacity-70">· ~{driveTime(km)} drive</span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Ticket className="h-3.5 w-3.5" /> Fees are typical adult prices and can change seasonally.
      </p>
    </div>
  );
}
