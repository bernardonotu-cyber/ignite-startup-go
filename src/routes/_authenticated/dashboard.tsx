import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { TripBasketSheet } from "@/components/travel/trip-basket-sheet";
import { Reveal } from "@/components/reveal";
import { AccountMenu } from "@/components/account-menu";
import {
  Plus, MapPin, Calendar, Compass, BookUser, Briefcase, Radar, Sparkles, ArrowRight,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Trips — World Portal" },
      { name: "description", content: "All your trips in one place." },
    ],
  }),
  component: Dashboard,
});

const QUICK_ACTIONS = [
  {
    icon: Sparkles,
    title: "Plan a trip with Vivid AI",
    body: "Tell us the vibe — Vivid AI builds a full day-by-day itinerary in seconds.",
    to: "/trips/new",
    tint: "bg-grape/15 text-grape",
  },
  {
    icon: BookUser,
    title: "Passport & visa",
    body: "Check what your trip needs, apply, and track the paperwork.",
    to: "/passport-visa",
    tint: "bg-sunset/15 text-sunset",
  },
  {
    icon: Briefcase,
    title: "Hire a pro",
    body: "Photographers, chefs, interpreters, security — by city.",
    to: "/hire",
    tint: "bg-lagoon/15 text-lagoon",
  },
  {
    icon: Radar,
    title: "Track application",
    body: "See exactly where your passport or visa application is.",
    to: "/track",
    tint: "bg-leaf/15 text-leaf",
  },
  {
    icon: Compass,
    title: "Explore destinations",
    body: "Browse places, flights, cars and stays — build your basket.",
    to: "/explore",
    tint: "bg-mango/20 text-mango",
  },
] as const;

function Dashboard() {
  const [trips, setTrips] = useState<Tables<"trips">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("trips").select("*").order("start_date", { ascending: true })
      .then(({ data }) => { setTrips(data ?? []); setLoading(false); });
  }, []);


  return (
    <div className="min-h-screen bg-muted/20">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-semibold">World Portal</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <Link to="/explore">
              <Button variant="ghost" className="press rounded-full">Explore</Button>
            </Link>
            <Link to="/passport-visa">
              <Button variant="ghost" className="press rounded-full">Passport & Visa</Button>
            </Link>
            <Link to="/hire">
              <Button variant="ghost" className="press rounded-full">Hire a Pro</Button>
            </Link>
            <Link to="/track">
              <Button variant="ghost" className="press rounded-full">Track</Button>
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <TripBasketSheet />
            <AccountMenu />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Your travel hub</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Everything World Portal does, one tap away.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {QUICK_ACTIONS.map(({ icon: Icon, title, body, to, tint }, i) => (
            <Reveal key={title} delay={i * 60}>
              <Link to={to as any}>
                <Card className="press group h-full p-5 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <span className={`inline-flex rounded-xl p-2.5 transition duration-300 group-hover:scale-110 ${tint}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="mt-3 font-semibold tracking-tight">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100">
                    Open <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Card>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mb-6 mt-12 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Your trips</h2>
            <p className="mt-1 text-sm text-muted-foreground">Plan, organize, and reshape every journey.</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/documents">
              <Button variant="outline">My documents</Button>
            </Link>
            <Link to="/trips/new">
              <Button><Plus className="mr-2 h-4 w-4" /> New trip</Button>
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : trips.length === 0 ? (
          <Card className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <Logo className="h-10 w-10 opacity-50" />
            <h3 className="mt-4 text-lg font-semibold">No trips yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first trip and let Vivid AI build a full itinerary in seconds.
            </p>
            <Link to="/trips/new" className="mt-6">
              <Button><Plus className="mr-2 h-4 w-4" /> Plan your first trip</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trips.map((t) => (
              <Link key={t.id} to="/trips/$tripId" params={{ tripId: t.id }}>
                <Card className="group h-full overflow-hidden p-6 transition hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <MapPin className="h-5 w-5 text-primary" />
                    <Badge variant={t.status === "planned" ? "default" : "secondary"}>{t.status}</Badge>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold group-hover:underline">{t.destination}</h3>
                  <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {new Date(t.start_date).toLocaleDateString()} – {new Date(t.end_date).toLocaleDateString()}
                  </div>
                  <div className="mt-4 flex gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2 py-0.5 capitalize">{t.travel_style}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 capitalize">{t.budget_level}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5">{t.travelers} travelers</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
