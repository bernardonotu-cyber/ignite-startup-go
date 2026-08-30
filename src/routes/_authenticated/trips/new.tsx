import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { generateItinerary } from "@/lib/itinerary.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/trips/new")({
  head: () => ({ meta: [{ title: "New Trip — World Portal" }] }),
  component: NewTrip,
});

const INTERESTS = ["Food", "Culture", "Nature", "Adventure", "Nightlife", "Beach", "History", "Shopping", "Art", "Relaxation"];

function NewTrip() {
  const navigate = useNavigate();
  const genFn = useServerFn(generateItinerary);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    destination: "",
    start_date: "",
    end_date: "",
    travelers: 2,
    budget_level: "moderate",
    travel_style: "balanced",
    interests: [] as string[],
  });

  const toggleInterest = (i: string) => {
    setForm((f) => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i] }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let tripId: string | null = null;
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not signed in");
      const { data: trip, error } = await supabase.from("trips").insert({
        ...form,
        user_id: user.user.id,
      }).select().single();
      if (error || !trip) throw new Error(error?.message ?? "Could not create the trip");
      tripId = trip.id;

      toast.info("Vivid AI is building your itinerary…");
      await genFn({ data: { tripId: trip.id } });
      toast.success("Itinerary ready!");
      navigate({ to: "/trips/$tripId", params: { tripId: trip.id } });
    } catch (err: any) {
      const message = err?.message ?? "Failed to create trip";
      if (tripId) {
        // The trip exists — take the user there so they can retry generation.
        toast.error(`${message} — trip saved, you can retry generating there.`);
        navigate({ to: "/trips/$tripId", params: { tripId } });
        return;
      }
      toast.error(message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted/20 py-10">
      <div className="mx-auto max-w-2xl px-6">
        <Link to="/dashboard" className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1 h-4 w-4" /> Back to trips
        </Link>
        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold tracking-tight">Plan a new trip</h1>
            <p className="mt-1 text-sm text-muted-foreground">Tell us the basics — AI does the rest.</p>
          </div>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" placeholder="e.g. Tokyo, Japan" required value={form.destination}
                onChange={(e) => setForm({ ...form, destination: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start">Start date</Label>
                <Input id="start" type="date" required value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="end">End date</Label>
                <Input id="end" type="date" required value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="travelers">Travelers</Label>
                <Input id="travelers" type="number" min={1} value={form.travelers}
                  onChange={(e) => setForm({ ...form, travelers: parseInt(e.target.value) || 1 })} />
              </div>
              <div>
                <Label>Budget</Label>
                <Select value={form.budget_level} onValueChange={(v) => setForm({ ...form, budget_level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="budget">Budget</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="luxury">Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Style</Label>
                <Select value={form.travel_style} onValueChange={(v) => setForm({ ...form, travel_style: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relaxed">Relaxed</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="packed">Action-packed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label>Interests</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {INTERESTS.map((i) => (
                  <button key={i} type="button" onClick={() => toggleInterest(i)}
                    className={`rounded-full border px-3 py-1 text-sm transition ${form.interests.includes(i) ? "border-primary bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                    {i}
                  </button>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Building your itinerary…" : (<><Sparkles className="mr-2 h-4 w-4" /> Generate itinerary</>)}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
