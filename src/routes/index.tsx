import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/logo";
import { TripBasketProvider } from "@/lib/trip-basket";
import { TripBasketSheet } from "@/components/travel/trip-basket-sheet";
import { DestinationExplorer } from "@/components/travel/destination-explorer";
import { FlightFeed, CarFeed, StayFeed } from "@/components/travel/category-feeds";
import { DESTINATIONS } from "@/lib/travel-catalog";
import { Sparkles, Plane, Car, Hotel, MapPin, Search, Compass, Ticket } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BUBOLI — Explore, Shop and Build Your Whole Trip" },
      {
        name: "description",
        content:
          "Explore destinations with real history and photos, then add flights, car rentals and hotels to your trip basket — and build your journey piece by piece.",
      },
      { property: "og:title", content: "BUBOLI — Explore, Shop and Build Your Whole Trip" },
      {
        property: "og:description",
        content: "A social way to explore places, compare flights, cars and stays, and build your trip like a shopping basket.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <TripBasketProvider>
      <Landing />
    </TripBasketProvider>
  );
}

function SectionHeader({
  eyebrow,
  title,
  body,
  tint,
}: {
  eyebrow: string;
  title: string;
  body: string;
  tint: string;
}) {
  return (
    <div className="mb-8 max-w-2xl">
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${tint}`}>
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <p className="mt-2 text-muted-foreground">{body}</p>
    </div>
  );
}

function Landing() {
  const [picked, setPicked] = useState(DESTINATIONS[0]!.id);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed top-0 z-40 w-full">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 text-white backdrop-blur">
            <Logo className="h-6 w-6" />
            <span className="text-base font-semibold tracking-tight">BUBOLI</span>
          </div>
          <nav className="hidden items-center gap-1 rounded-full bg-black/30 px-2 py-1.5 text-sm text-white backdrop-blur md:flex">
            {[
              { label: "Explore", id: "explore" },
              { label: "Flights", id: "flights" },
              { label: "Cars", id: "cars" },
              { label: "Stays", id: "stays" },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className="rounded-full px-3 py-1.5 transition hover:bg-white/15"
              >
                {n.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="hidden sm:block">
              <Button variant="ghost" className="rounded-full bg-black/30 text-white backdrop-blur hover:bg-white/20 hover:text-white">
                Sign in
              </Button>
            </Link>
            <TripBasketSheet />
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[92vh] w-full overflow-hidden">
        <img
          src="/images/travel-hero.jpg"
          alt="Coastal road at sunset"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-grape/70 via-sunset/40 to-lagoon/70 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50" />

        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-16 pt-32 text-white md:px-8">
          <span className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> Explore · Add to basket · Fly
          </span>
          <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Shop the world,<br />
            one layer at a time.
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/85 md:text-lg">
            Scroll through places worth going, read their story, then drop flights, rides and rooms
            into your trip basket. You stay in control of every piece.
          </p>

          <div className="mt-8 w-full max-w-2xl rounded-3xl border border-white/20 bg-white/12 p-3 backdrop-blur-xl">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/95 px-3 text-neutral-900">
                <MapPin className="h-4 w-4 shrink-0 text-sunset" />
                <Select value={picked} onValueChange={setPicked}>
                  <SelectTrigger className="border-0 bg-transparent shadow-none focus:ring-0">
                    <SelectValue placeholder="Where to?" />
                  </SelectTrigger>
                  <SelectContent>
                    {DESTINATIONS.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.city}, {d.country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                size="lg"
                className="rounded-2xl bg-sunset text-sunset-foreground hover:bg-sunset/90"
                onClick={() => scrollTo("explore")}
              >
                <Search className="mr-2 h-4 w-4" /> Explore places
              </Button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 px-1 text-xs text-white/85">
              {["Flights", "Car rental", "Hotels & resorts", "Day-by-day AI plan"].map((t) => (
                <span key={t} className="rounded-full bg-white/15 px-2.5 py-1">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* QUICK LAYERS */}
      <section className="border-b bg-gradient-to-r from-lagoon/10 via-mango/10 to-grape/10">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {[
            { icon: Compass, label: "Pick a place", body: "Photos, history, best season, daily budget.", id: "explore", tint: "bg-lagoon/15 text-lagoon" },
            { icon: Plane, label: "Add a flight", body: "Routes, cabins, stops and real timings.", id: "flights", tint: "bg-grape/15 text-grape" },
            { icon: Car, label: "Add a ride", body: "Airport pickup, 4x4s, scooters, drivers.", id: "cars", tint: "bg-mango/20 text-mango" },
            { icon: Hotel, label: "Add a stay", body: "Riads, resorts, villas, design hostels.", id: "stays", tint: "bg-leaf/15 text-leaf" },
          ].map(({ icon: Icon, label, body, id, tint }) => (
            <button
              key={label}
              onClick={() => scrollTo(id)}
              className="rounded-2xl border bg-card p-5 text-left transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className={`inline-flex rounded-xl p-2.5 ${tint}`}>
                <Icon className="h-5 w-5" />
              </span>
              <p className="mt-3 font-semibold">{label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{body}</p>
            </button>
          ))}
        </div>
      </section>

      {/* EXPLORE */}
      <section id="explore" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-20 md:px-8">
        <SectionHeader
          eyebrow="Layer 1 · Destinations"
          title="Places worth the flight"
          body="Tap any card to open its story — the history behind it, what people go for, and everything bookable there."
          tint="bg-lagoon/15 text-lagoon"
        />
        <DestinationExplorer />
      </section>

      {/* FLIGHTS */}
      <section id="flights" className="scroll-mt-24 bg-grape/5 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Layer 2 · Flights"
            title="Get there your way"
            body="Compare routes and cabins across our destinations, then add the one that fits to your basket."
            tint="bg-grape/15 text-grape"
          />
          <FlightFeed />
        </div>
      </section>

      {/* CARS */}
      <section id="cars" className="scroll-mt-24 bg-mango/5 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Layer 3 · Cars & pickups"
            title="Wheels for the ground game"
            body="Airport pickups, cliff-road SUVs, scooters and private drivers — priced per day, cancel free."
            tint="bg-mango/20 text-mango"
          />
          <CarFeed />
        </div>
      </section>

      {/* STAYS */}
      <section id="stays" className="scroll-mt-24 bg-leaf/5 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Layer 4 · Hotels & resorts"
            title="Where you wake up matters"
            body="Cave suites, riads, beach villas and design hostels — hand-picked in each city."
            tint="bg-leaf/15 text-leaf"
          />
          <StayFeed />
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-sunset via-grape to-lagoon opacity-90" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white md:px-8">
          <Badge className="mb-4 bg-white/20 text-white hover:bg-white/25">
            <Ticket className="mr-1 h-3.5 w-3.5" /> Final layer
          </Badge>
          <h2 className="text-3xl font-semibold tracking-tight md:text-5xl">
            Turn your basket into a real itinerary
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">
            When your trip feels right, BUBOLI's AI turns everything you picked into a day-by-day plan
            with timings, costs and local tips.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/trips/new">
              <Button size="lg" className="bg-white text-neutral-900 hover:bg-white/90">
                <Sparkles className="mr-2 h-4 w-4" /> Build my itinerary
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white">
                Create free account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t px-4 py-10 text-center text-sm text-muted-foreground md:px-8">
        © {new Date().getFullYear()} BUBOLI. Built for travelers who like being in control.
      </footer>
    </div>
  );
}
