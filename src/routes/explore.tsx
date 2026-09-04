import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { ThemeToggle } from "@/components/theme-toggle";
import { TripBasketSheet } from "@/components/travel/trip-basket-sheet";
import { DestinationExplorer } from "@/components/travel/destination-explorer";
import { FlightFeed, CarFeed, StayFeed } from "@/components/travel/category-feeds";
import { TravelerFeed } from "@/components/travel/traveler-feed";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/explore")({
  head: () => ({
    meta: [
      { title: "Explore Destinations — E-Embassy" },
      { name: "description", content: "Browse destinations, places to visit, flights, cars and stays — and build your trip basket piece by piece." },
      { property: "og:title", content: "Explore Destinations — E-Embassy" },
      { property: "og:description", content: "Browse destinations, places to visit, flights, cars and stays — and build your trip basket piece by piece." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExplorePage,
});

function Section({ eyebrow, title, blurb, children }: { eyebrow: string; title: string; blurb: string; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12">
      <Reveal className="mb-6 max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{blurb}</p>
      </Reveal>
      {children}
    </section>
  );
}

function ExplorePage() {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/dashboard" className="flex items-center gap-2">
            <Logo className="h-7" />
          </Link>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <Link to="/dashboard"><Button variant="ghost" className="press rounded-full">Hub</Button></Link>
            <Link to="/passport-visa"><Button variant="ghost" className="press rounded-full">Passport & Visa</Button></Link>
            <Link to="/hire"><Button variant="ghost" className="press rounded-full">Hire a Pro</Button></Link>
            <Link to="/track"><Button variant="ghost" className="press rounded-full">Track</Button></Link>
            <Link to="/weather" search={{ q: "" }}><Button variant="ghost" className="press rounded-full">Weather</Button></Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <TripBasketSheet />
          </div>
        </div>
      </header>

      <main className="pb-16">
        <div className="mx-auto max-w-6xl px-6 pt-10">
          <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to hub
          </Link>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Explore places</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Open a destination to see the places you can visit, entrance fees, local guides, flights, cars and stays — add anything to your basket.
          </p>
        </div>

        <Section eyebrow="Layer 01" title="Destinations" blurb="Tap a city to open its full layer: history, places, guides, flights, cars and stays.">
          <DestinationExplorer />
        </Section>

        <Section eyebrow="Layer 02" title="Traveler moments" blurb="Real posts from travelers, tagged with the exact spot.">
          <TravelerFeed />
        </Section>

        <Section eyebrow="Layer 03" title="Flights" blurb="Handpicked routes across every destination.">
          <Reveal><FlightFeed /></Reveal>
        </Section>

        <Section eyebrow="Layer 04" title="Cars" blurb="See photos, specs and condition before you book.">
          <Reveal><CarFeed /></Reveal>
        </Section>

        <Section eyebrow="Layer 05" title="Stays" blurb="Hotels, villas and resorts with full room details.">
          <Reveal><StayFeed /></Reveal>
        </Section>
      </main>
    </div>
  );
}
