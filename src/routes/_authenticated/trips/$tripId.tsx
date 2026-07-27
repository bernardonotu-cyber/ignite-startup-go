import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { generateItinerary } from "@/lib/itinerary.functions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ArrowLeft, MapPin, Calendar, Clock, DollarSign, Sparkles, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export const Route = createFileRoute("/_authenticated/trips/$tripId")({
  head: () => ({ meta: [{ title: "Trip — BUBOLI" }] }),
  component: TripDetail,
});

type DayWithActs = Tables<"itinerary_days"> & { activities: Tables<"itinerary_activities">[] };

function TripDetail() {
  const { tripId } = Route.useParams();
  const navigate = useNavigate();
  const regen = useServerFn(generateItinerary);
  const [trip, setTrip] = useState<Tables<"trips"> | null>(null);
  const [days, setDays] = useState<DayWithActs[]>([]);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const load = async () => {
    const { data: t } = await supabase.from("trips").select("*").eq("id", tripId).single();
    setTrip(t);
    const { data: d } = await supabase.from("itinerary_days")
      .select("*, activities:itinerary_activities(*)")
      .eq("trip_id", tripId)
      .order("day_number");
    const sorted = (d ?? []).map((day: any) => ({
      ...day,
      activities: (day.activities ?? []).sort((a: any, b: any) => (a.start_time ?? "").localeCompare(b.start_time ?? "")),
    }));
    setDays(sorted);
    setLoading(false);
  };

  useEffect(() => { load(); }, [tripId]);

  const handleRegenerate = async () => {
    setRegenerating(true);
    try {
      await regen({ data: { tripId } });
      toast.success("Itinerary regenerated");
      await load();
    } catch (err: any) {
      toast.error(err.message ?? "Failed to regenerate");
    } finally { setRegenerating(false); }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this trip?")) return;
    await supabase.from("trips").delete().eq("id", tripId);
    navigate({ to: "/dashboard" });
  };

  if (loading) return <div className="p-10 text-sm text-muted-foreground">Loading…</div>;
  if (!trip) return <div className="p-10">Trip not found.</div>;

  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto max-w-5xl px-6 py-4">
          <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="mr-1 h-4 w-4" /> All trips
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge variant="secondary" className="mb-3"><MapPin className="mr-1 h-3 w-3" />{trip.destination}</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">{trip.destination}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />
                {new Date(trip.start_date).toLocaleDateString()} – {new Date(trip.end_date).toLocaleDateString()}</span>
              <span>{trip.travelers} travelers</span>
              <span className="capitalize">{trip.budget_level}</span>
              <span className="capitalize">{trip.travel_style}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRegenerate} disabled={regenerating}>
              <Sparkles className="mr-2 h-4 w-4" /> {regenerating ? "Regenerating…" : "Regenerate"}
            </Button>
            <Button variant="ghost" size="icon" onClick={handleDelete}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>

        {days.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-sm text-muted-foreground">No itinerary yet.</p>
            <Button className="mt-4" onClick={handleRegenerate} disabled={regenerating}>
              <Sparkles className="mr-2 h-4 w-4" /> Generate itinerary
            </Button>
          </Card>
        ) : (
          <div className="space-y-6">
            {days.map((day) => (
              <Card key={day.id} className="overflow-hidden">
                <div className="border-b bg-muted/30 px-6 py-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wider text-muted-foreground">Day {day.day_number} · {new Date(day.date).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</div>
                      <h3 className="mt-1 text-xl font-semibold">{day.title}</h3>
                    </div>
                  </div>
                  {day.notes && <p className="mt-2 text-sm text-muted-foreground">{day.notes}</p>}
                </div>
                <div className="divide-y">
                  {day.activities.map((a) => (
                    <div key={a.id} className="flex gap-4 px-6 py-4">
                      <div className="w-16 shrink-0 text-sm font-medium text-muted-foreground">
                        <Clock className="mb-1 h-3.5 w-3.5" />
                        {a.start_time?.slice(0, 5)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <h4 className="font-medium">{a.title}</h4>
                          <Badge variant="outline" className="capitalize">{a.type}</Badge>
                        </div>
                        {a.description && <p className="mt-1 text-sm text-muted-foreground">{a.description}</p>}
                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
                          {a.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{a.location}</span>}
                          {a.estimated_cost != null && <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{Number(a.estimated_cost).toFixed(0)}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
