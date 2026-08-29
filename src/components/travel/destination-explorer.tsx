import { useState } from "react";
import {
  Plane,
  Car,
  Hotel,
  MapPin,
  Star,
  Check,
  Plus,
  
  Users,
  Landmark,
  CalendarDays,
  Wallet,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { DESTINATIONS, type Destination } from "@/lib/travel-catalog";
import { useTripBasket, type BasketItem } from "@/lib/trip-basket";
import { PlacesLayer } from "@/components/travel/places-layer";
import { PLACES } from "@/lib/places-catalog";
import { Reveal } from "@/components/reveal";


const ACCENT: Record<string, string> = {
  sky: "from-lagoon/90 to-grape/80",
  violet: "from-grape/90 to-sunset/70",
  amber: "from-mango/90 to-sunset/80",
  teal: "from-leaf/90 to-lagoon/80",
  orange: "from-sunset/90 to-mango/80",
  emerald: "from-leaf/90 to-mango/70",
};

export function AddButton({ item }: { item: BasketItem }) {
  const { add, has } = useTripBasket();
  const added = has(item.id);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [pop, setPop] = useState(0);

  return (
    <Button
      size="sm"
      variant={added ? "secondary" : "default"}
      className="press relative overflow-hidden"
      onClick={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const id = Date.now();
        setRipples((r) => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
        setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 600);
        if (added) return;
        setPop((p) => p + 1);
        add(item);
        toast.success(`${item.title} added to your basket`);
      }}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute h-16 w-16 rounded-full bg-current/30"
          style={{
            left: r.x - 32,
            top: r.y - 32,
            animation: "buboli-ripple 600ms ease-out forwards",
          }}
        />
      ))}
      <span key={pop} className={`relative flex items-center ${pop ? "pop-once" : ""}`}>
        {added ? <Check className="mr-1 h-4 w-4" /> : <Plus className="mr-1 h-4 w-4" />}
        {added ? "In basket" : "Add"}
      </span>
    </Button>
  );
}

export function Row({
  icon: Icon,
  title,
  meta,
  tags,
  price,
  unit,
  item,
}: {
  icon: typeof Plane;
  title: string;
  meta: string;
  tags: string[];
  price: number;
  unit: string;
  item: BasketItem;
}) {
  return (
    <div className="group flex flex-wrap items-center gap-3 rounded-2xl border bg-card p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg">
      <span className="rounded-xl bg-muted p-2.5 transition duration-300 group-hover:scale-105 group-hover:bg-sunset/10 group-hover:text-sunset">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-[10rem] flex-1">
        <p className="font-medium tracking-tight">{title}</p>
        <p className="text-xs text-muted-foreground">{meta}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <Badge key={t} variant="outline" className="text-[11px] font-normal">
              {t}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-lg font-semibold tabular-nums">${price.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">{unit}</p>
        </div>
        <AddButton item={item} />
      </div>
    </div>
  );
}


function DestinationDetail({ d }: { d: Destination }) {
  return (
    <Tabs defaultValue="story" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="story">Story</TabsTrigger>
        <TabsTrigger value="places">Places</TabsTrigger>
        <TabsTrigger value="flights">Flights</TabsTrigger>
        <TabsTrigger value="cars">Cars</TabsTrigger>
        <TabsTrigger value="stays">Stays</TabsTrigger>
      </TabsList>

      <TabsContent value="places">
        <PlacesLayer destinationId={d.id} city={d.city} />
      </TabsContent>



      <TabsContent value="story" className="space-y-5 pt-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: CalendarDays, label: "Best time", value: d.bestTime },
            { icon: Wallet, label: "Avg / day", value: `$${d.avgDaily}` },
            { icon: Languages, label: "Language", value: d.language },
            { icon: MapPin, label: "Currency", value: d.currency },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border bg-muted/40 p-3">
              <Icon className="h-4 w-4 text-muted-foreground" />
              <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
              <p className="text-sm font-medium leading-tight">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border bg-card p-5">
          <h4 className="flex items-center gap-2 font-semibold">
            <Landmark className="h-4 w-4 text-sunset" /> The history
          </h4>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.history}</p>
        </div>

        <div className="space-y-2">
          <h4 className="font-semibold">What people go for</h4>
          {d.highlights.map((h) => (
            <div key={h.title} className="rounded-xl border bg-card p-4">
              <p className="text-sm font-medium">{h.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{h.blurb}</p>
            </div>
          ))}
        </div>

        <AddButton
          item={{
            id: `dest-${d.id}`,
            kind: "destination",
            title: `${d.city}, ${d.country}`,
            subtitle: d.tagline,
            price: 0,
            destination: d.city,
          }}
        />
      </TabsContent>

      <TabsContent value="flights" className="space-y-3 pt-4">
        {d.flights.map((f) => (
          <Row
            key={f.id}
            icon={Plane}
            title={f.airline}
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
      </TabsContent>

      <TabsContent value="cars" className="space-y-3 pt-4">
        {d.cars.map((c) => (
          <CarCard key={c.id} car={c} city={d.city} />
        ))}
      </TabsContent>

      <TabsContent value="stays" className="space-y-3 pt-4">
        {d.stays.map((s) => (
          <StayCard key={s.id} stay={s} city={d.city} />
        ))}
      </TabsContent>

    </Tabs>
  );
}

export function DestinationExplorer() {
  const [open, setOpen] = useState<Destination | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DESTINATIONS.map((d, i) => (
          <Reveal key={d.id} delay={i * 70}>
          <button
            onClick={() => setOpen(d)}
            className="press shine group h-full w-full overflow-hidden rounded-3xl border bg-card text-left shadow-sm transition duration-500 hover:-translate-y-1.5 hover:border-foreground/15 hover:shadow-2xl"
          >

            <div className="relative h-52 overflow-hidden">
              <img
                src={d.image}
                alt={`${d.city}, ${d.country}`}
                loading="lazy"
                width={1024}
                height={768}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${ACCENT[d.color]} mix-blend-multiply opacity-40`} />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <p className="text-xs uppercase tracking-widest opacity-90">{d.country}</p>
                <h3 className="text-2xl font-semibold leading-tight drop-shadow">{d.city}</h3>
              </div>
            </div>
            <div className="space-y-3 p-5">
              <p className="text-sm text-muted-foreground">{d.tagline}</p>
              <div className="flex flex-wrap gap-1.5">
                {d.vibes.map((v) => (
                  <Badge key={v} variant="secondary" className="text-[11px]">
                    {v}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center justify-between border-t pt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {(PLACES[d.id] ?? []).length} places
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" /> ${d.avgDaily}/day
                </span>
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <Star className="h-3.5 w-3.5 fill-mango text-mango" />{" "}
                  {(PLACES[d.id] ?? []).filter((p) => p.fee === 0).length} free
                </span>
              </div>
            </div>
          </button>
          </Reveal>
        ))}
      </div>


      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto p-0">
          {open && (
            <>
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={open.image}
                  alt={`${open.city}, ${open.country}`}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="h-full w-full object-cover"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${ACCENT[open.color]} opacity-50`} />
              </div>
              <div className="space-y-4 p-6 pt-4">
                <DialogHeader className="space-y-1 text-left">
                  <DialogTitle className="text-2xl">
                    {open.city}, {open.country}
                  </DialogTitle>
                  <p className="text-sm text-muted-foreground">{open.tagline}</p>
                </DialogHeader>
                <DestinationDetail d={open} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
