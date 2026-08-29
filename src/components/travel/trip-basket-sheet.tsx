import {
  Plane,
  Trash2,
  Hotel,
  Car,
  MapPin,
  Sparkles,
  Ticket,
  BookUser,
  UserRound,
  Briefcase,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTripBasket, type BasketKind } from "@/lib/trip-basket";

const KIND_ICON: Record<BasketKind, typeof Plane> = {
  destination: MapPin,
  flight: Plane,
  car: Car,
  stay: Hotel,
  place: Ticket,
  document: BookUser,
  guide: UserRound,
  pro: Briefcase,
};

const KIND_LABEL: Record<BasketKind, string> = {
  destination: "Destination",
  flight: "Flight",
  car: "Car",
  stay: "Stay",
  place: "Attraction",
  document: "Documents",
  guide: "Tour guide",
  pro: "Hired pro",
};

export function TripBasketSheet() {
  const { items, remove, clear, total, count } = useTripBasket();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label={`Open your trip basket (${count} items)`}
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white ring-1 ring-white/30 backdrop-blur transition hover:bg-white/25"
        >
          <Plane className="h-5 w-5 -rotate-45" />
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sunset px-1 text-[11px] font-bold text-sunset-foreground">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Plane className="h-5 w-5 -rotate-45 text-sunset" /> Your trip basket
          </SheetTitle>
          <SheetDescription>
            Build your journey piece by piece — destination, flight, ride, stay.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-4">
          {items.length === 0 && (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nothing in your basket yet. Explore below and start adding.
            </div>
          )}
          {items.map((item) => {
            const Icon = KIND_ICON[item.kind];
            return (
              <div key={item.id} className="flex items-start gap-3 rounded-xl border bg-card p-3">
                <span className="mt-0.5 rounded-lg bg-muted p-2">
                  <Icon className="h-4 w-4 text-foreground" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                      {KIND_LABEL[item.kind]}
                    </Badge>
                    <span className="truncate text-xs text-muted-foreground">{item.destination}</span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium">{item.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-sm font-semibold">
                    {item.price > 0 ? `$${item.price.toLocaleString()}` : "—"}
                  </span>
                  <button
                    onClick={() => remove(item.id)}
                    aria-label={`Remove ${item.title}`}
                    className="text-muted-foreground transition hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Estimated total</span>
            <span className="text-lg font-semibold">${total.toLocaleString()}</span>
          </div>
          <Separator className="my-3" />
          <div className="space-y-2">
            <Link to="/trips/new" className="block">
              <Button className="w-full" size="lg" disabled={items.length === 0}>
                <Sparkles className="mr-2 h-4 w-4" /> Turn into an itinerary
              </Button>
            </Link>
            <Button variant="ghost" className="w-full" onClick={clear} disabled={items.length === 0}>
              Clear basket
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
