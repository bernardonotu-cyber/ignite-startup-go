import { Plane, Car, Hotel } from "lucide-react";
import { DESTINATIONS } from "@/lib/travel-catalog";
import { Row } from "@/components/travel/destination-explorer";

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
        <Row
          key={c.id}
          icon={Car}
          title={`${c.name} · ${d.city}`}
          meta={`${c.type} · Pickup: ${c.pickup}`}
          tags={[`${c.seats} seats`, c.transmission, c.perks]}
          price={c.price}
          unit="per day"
          item={{
            id: c.id,
            kind: "car",
            title: c.name,
            subtitle: `${c.type} · ${c.pickup}`,
            price: c.price,
            destination: d.city,
          }}
        />
      ))}
    </div>
  );
}

export function StayFeed() {
  const rows = DESTINATIONS.map((d) => ({ d, s: d.stays[0]! }));
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {rows.map(({ d, s }) => (
        <Row
          key={s.id}
          icon={Hotel}
          title={`${s.name} · ${d.city}`}
          meta={`${s.kind} · ${s.area} · ★ ${s.rating}`}
          tags={s.perks.split(" · ")}
          price={s.price}
          unit="per night"
          item={{
            id: s.id,
            kind: "stay",
            title: s.name,
            subtitle: `${s.kind} · ${s.area}`,
            price: s.price,
            destination: d.city,
          }}
        />
      ))}
    </div>
  );
}
