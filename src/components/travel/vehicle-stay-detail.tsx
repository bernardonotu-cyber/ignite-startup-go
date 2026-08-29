import { useState } from "react";
import {
  Car as CarIcon,
  Hotel,
  Gauge,
  Fuel,
  Users,
  Briefcase,
  Snowflake,
  Wrench,
  ShieldCheck,
  CalendarClock,
  Sparkles,
  BedDouble,
  Ruler,
  Eye,
  LogIn,
  LogOut,
  Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Car, Stay } from "@/lib/travel-catalog";
import { AddButton } from "@/components/travel/destination-explorer";

const CONDITION_TONE: Record<string, string> = {
  Excellent: "bg-leaf/15 text-leaf border-leaf/30",
  "Very good": "bg-lagoon/15 text-lagoon border-lagoon/30",
  Good: "bg-mango/15 text-mango border-mango/30",
};

function ConditionBadge({ condition }: { condition: string }) {
  return (
    <Badge variant="outline" className={`text-[11px] font-medium ${CONDITION_TONE[condition] ?? ""}`}>
      {condition} condition
    </Badge>
  );
}

function Spec({ icon: Icon, label, value }: { icon: typeof CarIcon; label: string; value: string }) {
  return (
    <div className="rounded-xl border bg-muted/40 p-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <p className="mt-2 text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-sm font-medium leading-tight">{value}</p>
    </div>
  );
}

function PreviewCard({
  image,
  alt,
  title,
  meta,
  tags,
  price,
  unit,
  condition,
  onOpen,
  children,
}: {
  image: string;
  alt: string;
  title: string;
  meta: string;
  tags: string[];
  price: number;
  unit: string;
  condition: string;
  onOpen: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="group overflow-hidden rounded-2xl border bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-foreground/15 hover:shadow-lg">
      <button type="button" onClick={onOpen} className="press flex w-full gap-4 p-3 text-left">
        <img
          src={image}
          alt={alt}
          loading="lazy"
          width={1024}
          height={768}
          className="h-24 w-32 flex-none rounded-xl object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="truncate font-medium tracking-tight">{title}</p>
            <ConditionBadge condition={condition} />
          </div>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((t) => (
              <Badge key={t} variant="outline" className="text-[11px] font-normal">
                {t}
              </Badge>
            ))}
          </div>
        </div>
      </button>
      <div className="flex items-center justify-between border-t px-4 py-3">
        <div>
          <p className="text-lg font-semibold tabular-nums">${price.toLocaleString()}</p>
          <p className="text-[11px] text-muted-foreground">{unit}</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={onOpen} className="press text-xs font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            View details
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}

export function CarCard({ car, city, titleOverride }: { car: Car; city: string; titleOverride?: string }) {
  const [open, setOpen] = useState(false);
  const item = {
    id: car.id,
    kind: "car" as const,
    title: car.name,
    subtitle: `${car.type} · ${car.pickup}`,
    price: car.price,
    destination: city,
  };

  return (
    <>
      <PreviewCard
        image={car.image}
        alt={`${car.name} rental in ${city}`}
        title={titleOverride ?? car.name}
        meta={`${car.type} · Pickup: ${car.pickup}`}
        tags={[`${car.seats} seats`, car.transmission, `${car.year}`]}
        price={car.price}
        unit="per day"
        condition={car.condition}
        onOpen={() => setOpen(true)}
      >
        <AddButton item={item} />
      </PreviewCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto p-0">
          <img src={car.image} alt={car.name} loading="lazy" width={1024} height={768} className="h-56 w-full object-cover" />
          <div className="space-y-5 p-6 pt-4">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <CarIcon className="h-5 w-5 text-sunset" /> {car.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {car.type} · {city} · Pickup at {car.pickup}
              </p>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-2">
              <ConditionBadge condition={car.condition} />
              <Badge variant="secondary" className="text-[11px]">{car.year} model</Badge>
              <Badge variant="secondary" className="text-[11px]">{car.perks}</Badge>
            </div>

            <div className="rounded-2xl border bg-card p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-sunset" /> Condition report
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{car.conditionNote}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Spec icon={Gauge} label="Mileage" value={car.mileage} />
              <Spec icon={Fuel} label="Fuel" value={car.fuel} />
              <Spec icon={Users} label="Seats" value={`${car.seats} · ${car.transmission}`} />
              <Spec icon={Briefcase} label="Luggage" value={car.luggage} />
              <Spec icon={Snowflake} label="Air con" value={car.airCon} />
              <Spec icon={Wrench} label="Last serviced" value={car.lastServiced} />
              <Spec icon={ShieldCheck} label="Insurance" value={car.insurance} />
              <Spec icon={CalendarClock} label="Cancellation" value={car.cancellation} />
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-2xl font-semibold tabular-nums">${car.price.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">per day</p>
              </div>
              <AddButton item={item} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export function StayCard({ stay, city, titleOverride }: { stay: Stay; city: string; titleOverride?: string }) {
  const [open, setOpen] = useState(false);
  const item = {
    id: stay.id,
    kind: "stay" as const,
    title: stay.name,
    subtitle: `${stay.kind} · ${stay.area}`,
    price: stay.price,
    destination: city,
  };

  return (
    <>
      <PreviewCard
        image={stay.image}
        alt={`${stay.name} in ${city}`}
        title={titleOverride ?? stay.name}
        meta={`${stay.kind} · ${stay.area} · ★ ${stay.rating}`}
        tags={stay.perks.split(" · ")}
        price={stay.price}
        unit="per night"
        condition={stay.condition}
        onOpen={() => setOpen(true)}
      >
        <AddButton item={item} />
      </PreviewCard>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto p-0">
          <img src={stay.image} alt={stay.name} loading="lazy" width={1024} height={768} className="h-56 w-full object-cover" />
          <div className="space-y-5 p-6 pt-4">
            <DialogHeader className="space-y-1 text-left">
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Hotel className="h-5 w-5 text-sunset" /> {stay.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {stay.kind} · {stay.area}, {city}
              </p>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-2">
              <ConditionBadge condition={stay.condition} />
              <Badge variant="secondary" className="flex items-center gap-1 text-[11px]">
                <Star className="h-3 w-3 fill-mango text-mango" /> {stay.rating} guest rating
              </Badge>
              <Badge variant="secondary" className="text-[11px]">Cleanliness {stay.cleanliness}/10</Badge>
              <Badge variant="secondary" className="text-[11px]">{stay.renovated}</Badge>
            </div>

            <div className="rounded-2xl border bg-card p-4">
              <h4 className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-sunset" /> Condition report
              </h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{stay.conditionNote}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Spec icon={BedDouble} label="Room" value={stay.roomType} />
              <Spec icon={Ruler} label="Size" value={stay.roomSize} />
              <Spec icon={Users} label="Sleeps" value={`${stay.beds} · ${stay.maxGuests} guests`} />
              <Spec icon={Eye} label="View" value={stay.view} />
              <Spec icon={LogIn} label="Check-in" value={stay.checkIn} />
              <Spec icon={LogOut} label="Check-out" value={stay.checkOut} />
              <Spec icon={CalendarClock} label="Cancellation" value={stay.cancellation} />
              <Spec icon={ShieldCheck} label="Highlights" value={stay.perks} />
            </div>

            <div>
              <h4 className="text-sm font-semibold">Amenities</h4>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {stay.amenities.map((a) => (
                  <Badge key={a} variant="outline" className="text-[11px] font-normal">
                    {a}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="text-2xl font-semibold tabular-nums">${stay.price.toLocaleString()}</p>
                <p className="text-[11px] text-muted-foreground">per night</p>
              </div>
              <AddButton item={item} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
