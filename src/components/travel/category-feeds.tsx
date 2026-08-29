import { Plane } from "lucide-react";
import { DESTINATIONS } from "@/lib/travel-catalog";
import { Row } from "@/components/travel/destination-explorer";
import { CarCard, StayCard } from "@/components/travel/vehicle-stay-detail";

export function FlightFeed() {
  const rows = DESTINATIONS.map((d) => ({ d, f: d.flights[0]! }));
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {rows.map(({ d, f }) => (
        <Row
          key={f.id}
          icon={Plane}
          title={`${f.airline} → ${d.city}`}
          meta={`${f.route} · ${f.depart} → ${f.arrive}`}
          tags={[f.duration, f.stops, f.cabin]}
          price={f.price}
          unit="round trip / person"
          item={{
            id: f.id,
            kind: "flight",
            title: `${f.airline} · ${f.route}`,
            subtitle: `${f.duration} · ${f.stops} · ${f.cabin}`,
            price: f.price,
            destination: d.city,
          }}
        />
      ))}
    </div>
  );
}

export function CarFeed() {
  const rows = DESTINATIONS.map((d) => ({ d, c: d.cars[0]! }));
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {rows.map(({ d, c }) => (
        <CarCard key={c.id} car={c} city={d.city} titleOverride={`${c.name} · ${d.city}`} />
      ))}
    </div>
  );
}

export function StayFeed() {
  const rows = DESTINATIONS.map((d) => ({ d, s: d.stays[0]! }));
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {rows.map(({ d, s }) => (
        <StayCard key={s.id} stay={s} city={d.city} titleOverride={`${s.name} · ${d.city}`} />
      ))}
    </div>
  );
}
