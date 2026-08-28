import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { TripBasketProvider } from "@/lib/trip-basket";
import { TripBasketSheet } from "@/components/travel/trip-basket-sheet";
import { DestinationExplorer } from "@/components/travel/destination-explorer";
import { FlightFeed, CarFeed, StayFeed } from "@/components/travel/category-feeds";
import { TravelerFeed } from "@/components/travel/traveler-feed";

import { DESTINATIONS } from "@/lib/travel-catalog";
import { HeroPlane, ScrollPlane } from "@/components/travel/plane-flight";
import { Sparkles, Plane, Car, Hotel, MapPin, Search, Compass, Ticket, ArrowRight } from "lucide-react";

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
    <Reveal className="mb-10 max-w-2xl">
      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${tint}`}>
        {eyebrow}
      </span>
      <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-tight md:text-[2.75rem]">{title}</h2>
      <p className="mt-3 text-base leading-relaxed text-muted-foreground">{body}</p>
      <span className="mt-6 block h-px w-24 bg-gradient-to-r from-sunset via-mango to-transparent" />
    </Reveal>
  );
}

function Landing() {
  const [picked, setPicked] = useState(DESTINATIONS[0]!.id);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header
        className={`fixed top-0 z-40 w-full transition-all duration-500 ${
          scrolled ? "bg-background/80 py-2 shadow-sm backdrop-blur-xl" : "py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8">
          <div
            className={`press flex items-center gap-2 rounded-full px-4 py-2 transition-colors duration-500 ${
              scrolled ? "text-foreground" : "bg-black/30 text-white backdrop-blur"
            }`}
          >
            <Logo className="h-6 w-6" />
            <span className="text-base font-semibold tracking-[0.14em]">BUBOLI</span>
          </div>
          <nav
            className={`hidden items-center gap-1 rounded-full px-2 py-1.5 text-sm transition-colors duration-500 md:flex ${
              scrolled ? "border bg-card/70 text-foreground backdrop-blur" : "bg-black/30 text-white backdrop-blur"
            }`}
          >
            {[
              { label: "Explore", id: "explore" },
              { label: "Moments", id: "moments" },
              { label: "Flights", id: "flights" },

              { label: "Cars", id: "cars" },
              { label: "Stays", id: "stays" },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() => scrollTo(n.id)}
                className={`press rounded-full px-3.5 py-1.5 transition ${
                  scrolled ? "hover:bg-muted" : "hover:bg-white/15"
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/auth" className="hidden sm:block">
              <Button
                variant="ghost"
                className={`press rounded-full transition-colors duration-500 ${
                  scrolled ? "" : "bg-black/30 text-white backdrop-blur hover:bg-white/20 hover:text-white"
                }`}
              >
                Sign in
              </Button>
            </Link>
            <TripBasketSheet />
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-[96vh] w-full overflow-hidden">
        <img
          src="/images/travel-hero.jpg"
          alt="Coastal road at sunset"
          width={1920}
          height={1080}
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-grape/55 via-sunset/25 to-lagoon/55 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/55" />

        <div className="relative z-10 mx-auto grid min-h-[96vh] max-w-7xl grid-cols-1 items-end gap-10 px-4 pb-16 pt-36 text-white md:px-8 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rise-in">
            <span className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-[11px] uppercase tracking-[0.22em] backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Explore · Basket · Fly
            </span>
            <h1 className="max-w-3xl text-[2.6rem] font-semibold leading-[1.02] tracking-tight md:text-7xl">
              Shop the world,
              <br />
              <span className="text-gradient-warm">one layer at a time.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85 md:text-lg">
              Scroll through places worth going, read their story, then drop flights, rides and rooms
              into your trip basket. You stay in control of every piece.
            </p>

            <div className="mt-10 flex max-w-lg flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
              {[
                { k: "6", v: "Curated cities" },
                { k: "36+", v: "Places with fees" },
                { k: "1", v: "Basket to rule it all" },
              ].map((s) => (
                <div key={s.v}>
                  <p className="text-2xl font-semibold tabular-nums">{s.k}</p>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/65">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rise-in w-full rounded-[28px] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-2xl" style={{ animationDelay: "140ms" }}>
            <p className="px-1 pb-3 text-xs uppercase tracking-[0.2em] text-white/70">Start your basket</p>
            <div className="flex flex-col gap-2">
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
                className="press shine w-full rounded-2xl bg-sunset text-sunset-foreground hover:bg-sunset/90"
                onClick={() => scrollTo("explore")}
              >
                <Search className="mr-2 h-4 w-4" /> Explore places
              </Button>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 px-1 text-xs text-white/85">
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
      <section className="border-b bg-gradient-to-r from-lagoon/8 via-mango/8 to-grape/8">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-4">
          {[
            { icon: Compass, label: "Pick a place", body: "Photos, history, best season, daily budget.", id: "explore", tint: "bg-lagoon/15 text-lagoon" },
            { icon: Plane, label: "Add a flight", body: "Routes, cabins, stops and real timings.", id: "flights", tint: "bg-grape/15 text-grape" },
            { icon: Car, label: "Add a ride", body: "Airport pickup, 4x4s, scooters, drivers.", id: "cars", tint: "bg-mango/20 text-mango" },
            { icon: Hotel, label: "Add a stay", body: "Riads, resorts, villas, design hostels.", id: "stays", tint: "bg-leaf/15 text-leaf" },
          ].map(({ icon: Icon, label, body, id, tint }, i) => (
            <Reveal key={label} delay={i * 80}>
              <button
                onClick={() => scrollTo(id)}
                className="press shine group h-full w-full rounded-2xl border bg-card p-6 text-left transition duration-500 hover:-translate-y-1.5 hover:border-foreground/15 hover:shadow-xl"
              >
                <span className={`inline-flex rounded-xl p-2.5 transition duration-300 group-hover:scale-110 ${tint}`}>
                  <Icon className="h-5 w-5" />
                </span>
                <p className="mt-4 font-semibold tracking-tight">{label}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-foreground opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                  Open layer <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EXPLORE */}
      <section id="explore" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-24 md:px-8">
        <SectionHeader
          eyebrow="Layer 1 · Destinations"
          title="Places worth the flight"
          body="Tap any card to open its story — the history behind it, what people go for, and everything bookable there."
          tint="bg-lagoon/15 text-lagoon"
        />
        <DestinationExplorer />
      </section>

      {/* TRAVELER MOMENTS */}
      <section id="moments" className="scroll-mt-24 bg-gradient-to-b from-sunset/5 via-background to-lagoon/5 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Layer 2 · Traveler moments"
            title="Real people, real places"
            body="Scroll through what travelers are posting right now — zoos, temples, markets and beaches, with the exact location under every shot. Tap add and it lands in your basket."
            tint="bg-sunset/15 text-sunset"
          />
          <TravelerFeed />
        </div>
      </section>



      {/* FLIGHTS */}
      <section id="flights" className="scroll-mt-24 bg-grape/5 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Layer 3 · Flights"
            title="Get there your way"
            body="Compare routes and cabins across our destinations, then add the one that fits to your basket."
            tint="bg-grape/15 text-grape"
          />
          <Reveal>
            <FlightFeed />
          </Reveal>
        </div>
      </section>

      {/* CARS */}
      <section id="cars" className="scroll-mt-24 bg-mango/5 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Layer 4 · Cars & pickups"
            title="Wheels for the ground game"
            body="Airport pickups, cliff-road SUVs, scooters and private drivers — priced per day, cancel free."
            tint="bg-mango/20 text-mango"
          />
          <Reveal>
            <CarFeed />
          </Reveal>
        </div>
      </section>

      {/* STAYS */}
      <section id="stays" className="scroll-mt-24 bg-leaf/5 py-24">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <SectionHeader
            eyebrow="Layer 5 · Hotels & resorts"
            title="Where you wake up matters"
            body="Cave suites, riads, beach villas and design hostels — hand-picked in each city."
            tint="bg-leaf/15 text-leaf"
          />
          <Reveal>
            <StayFeed />
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-28">
        <div className="absolute inset-0 bg-gradient-to-r from-sunset via-grape to-lagoon opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.28),transparent_60%)]" />
        <Reveal className="relative z-10 mx-auto max-w-3xl px-4 text-center text-white md:px-8">
          <Badge className="mb-5 bg-white/20 text-white hover:bg-white/25">
            <Ticket className="mr-1 h-3.5 w-3.5" /> Final layer
          </Badge>
          <h2 className="text-3xl font-semibold leading-[1.08] tracking-tight md:text-5xl">
            Turn your basket into a real itinerary
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/85">
            When your trip feels right, BUBOLI's AI turns everything you picked into a day-by-day plan
            with timings, costs and local tips.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link to="/trips/new">
              <Button size="lg" className="press shine bg-white text-neutral-900 hover:bg-white/90">
                <Sparkles className="mr-2 h-4 w-4" /> Build my itinerary
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="press border-white/40 bg-transparent text-white hover:bg-white/15 hover:text-white">
                Create free account
              </Button>
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="border-t px-4 py-12 text-center text-sm text-muted-foreground md:px-8">
        © {new Date().getFullYear()} BUBOLI. Built for travelers who like being in control.
      </footer>
    </div>
  );
}
