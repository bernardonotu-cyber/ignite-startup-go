import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import { streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";

const TripInput = z.object({
  tripId: z.string().uuid(),
});

const ActivitySchema = z.object({
  title: z.string(),
  description: z.string(),
  type: z.string(),
  start_time: z.string(),
  location: z.string(),
  estimated_cost: z.number().nullable(),
});

const ALLOWED_TYPES = ["activity", "food", "transport", "accommodation", "sightseeing"] as const;

const ItinerarySchema = z.object({
  days: z.array(z.object({
    day_number: z.number(),
    title: z.string(),
    notes: z.string(),
    activities: z.array(ActivitySchema),
  })),
});

export const generateItinerary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TripInput.parse(input))
  .handler(async ({ data, context }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const { data: trip, error: tErr } = await context.supabase
      .from("trips").select("*").eq("id", data.tripId).single();
    if (tErr || !trip) throw new Error("Trip not found");

    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const dayCount = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1);

    const gateway = createLovableAiGatewayProvider(key);
    const prompt = `You are an expert travel planner. Build a detailed ${dayCount}-day itinerary for a trip.

Destination: ${trip.destination}
Dates: ${trip.start_date} to ${trip.end_date}
Travelers: ${trip.travelers}
Budget level: ${trip.budget_level}
Travel style: ${trip.travel_style}
Interests: ${(trip.interests as string[]).join(", ") || "general sightseeing"}

Create exactly ${dayCount} days numbered 1 to ${dayCount}. Each day: 4-6 activities with realistic timing, real specific place names, honest cost estimates in USD (a number, or null if unknown), mix of sightseeing, food, and rest. start_time must be "HH:MM" 24h format. type must be one of: ${ALLOWED_TYPES.join(", ")}. notes summarizes the day's theme. Return JSON only.`;

    let itinerary: z.infer<typeof ItinerarySchema>;
    try {
      const result = streamText({
        model: gateway("google/gemini-3.6-flash"),
        output: Output.object({ schema: ItinerarySchema }),
        prompt,
      });
      itinerary = (await result.output) as z.infer<typeof ItinerarySchema>;
    } catch (error) {
      if (!NoObjectGeneratedError.isInstance(error) || !error.text) throw error;
      const raw = error.text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
      const parsed = ItinerarySchema.safeParse(JSON.parse(raw));
      if (!parsed.success) throw new Error("The AI returned an unexpected format. Please try again.");
      itinerary = parsed.data;
    }

    itinerary.days = itinerary.days.map((d) => ({
      ...d,
      activities: d.activities.map((a) => ({
        ...a,
        type: (ALLOWED_TYPES as readonly string[]).includes(a.type) ? a.type : "activity",
      })),
    }));


    // Clear existing days for this trip
    await context.supabase.from("itinerary_days").delete().eq("trip_id", data.tripId);

    for (const day of itinerary.days) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + (day.day_number - 1));
      const { data: dayRow, error: dErr } = await context.supabase
        .from("itinerary_days")
        .insert({
          trip_id: data.tripId,
          day_number: day.day_number,
          date: date.toISOString().slice(0, 10),
          title: day.title,
          notes: day.notes,
        })
        .select().single();
      if (dErr || !dayRow) throw dErr;

      if (day.activities.length) {
        await context.supabase.from("itinerary_activities").insert(
          day.activities.map((a) => ({
            day_id: dayRow.id,
            title: a.title,
            description: a.description,
            type: a.type,
            start_time: a.start_time,
            location: a.location,
            estimated_cost: a.estimated_cost,
          }))
        );
      }
    }

    await context.supabase.from("trips").update({ status: "planned" }).eq("id", data.tripId);
    return { ok: true, days: itinerary.days.length };
  });
