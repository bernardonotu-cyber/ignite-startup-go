import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sparkles, Map, Calendar, Compass } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Voyage — AI Travel Operating System" },
      { name: "description", content: "Plan your entire trip in one place. AI-powered itineraries, bookings, and day-by-day guides tailored to you." },
      { property: "og:title", content: "Voyage — AI Travel Operating System" },
      { property: "og:description", content: "Plan your entire trip in one place with AI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="absolute top-0 z-20 flex w-full items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2 text-white">
          <Compass className="h-6 w-6" />
          <span className="text-lg font-semibold tracking-tight">Voyage</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/auth"><Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">Sign in</Button></Link>
          <Link to="/auth"><Button className="bg-white text-neutral-900 hover:bg-white/90">Get started</Button></Link>
        </div>
      </header>

      <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden">
        <img src="/images/travel-hero.jpg" alt="Coastal road at sunset" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/80" />
        <div className="relative z-10 mx-auto flex h-full max-w-5xl flex-col items-start justify-end px-6 pb-24 text-white md:px-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" /> The AI travel operating system
          </span>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Plan every trip.<br/>In one beautiful place.
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/80 md:text-lg">
            Voyage turns a destination and a few dates into a complete, day‑by‑day itinerary — powered by AI and built for real travelers.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/auth"><Button size="lg" className="bg-white text-neutral-900 hover:bg-white/90">Start planning free</Button></Link>
            <a href="#features"><Button size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:bg-white/10">See how it works</Button></a>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-6xl px-6 py-24 md:px-12">
        <div className="grid gap-8 md:grid-cols-3">
          {[
            { icon: Sparkles, title: "AI itineraries", body: "Describe your trip; get a full day-by-day plan with timing, locations, and cost estimates." },
            { icon: Map, title: "One place for everything", body: "Destinations, activities, bookings and notes — organized by day, ready when you land." },
            { icon: Calendar, title: "Effortless changes", body: "Reshape any day in seconds. Add a stop, swap an activity, extend your trip." },
          ].map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl border bg-card p-6">
              <Icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground md:px-12">
        © {new Date().getFullYear()} Voyage. Built for travelers.
      </footer>
    </div>
  );
}
