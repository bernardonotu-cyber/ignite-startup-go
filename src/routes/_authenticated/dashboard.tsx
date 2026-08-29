import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/logo";
import { Plus, MapPin, Calendar, LogOut } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "Your Trips — BUBOLI" },
      { name: "description", content: "All your trips in one place." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Tables<"trips">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("trips").select("*").order("start_date", { ascending: true })
      .then(({ data }) => { setTrips(data ?? []); setLoading(false); });
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-semibold">BUBOLI</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Your trips</h1>
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
              Create your first trip and let AI build a full itinerary in seconds.
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
