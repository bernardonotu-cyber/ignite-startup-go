import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
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
  days: z.array(
    z.object({
      day_number: z.number(),
      title: z.string(),
      notes: z.string(),
      activities: z.array(ActivitySchema),
    })
  ).min(1),
});

const JSON_SCHEMA = {
  name: "itinerary",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["days"],
    properties: {
      days: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["day_number", "title", "notes", "activities"],
          properties: {
            day_number: { type: "integer" },
            title: { type: "string" },
            notes: { type: "string" },
            activities: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: false,
                required: ["title", "description", "type", "start_time", "location", "estimated_cost"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  type: { type: "string", enum: [...ALLOWED_TYPES] },
                  start_time: { type: "string" },
                  location: { type: "string" },
                  estimated_cost: { type: ["number", "null"] },
                },
              },
            },
          },
        },
      },
    },
  },
} as const;

async function callGateway(apiKey: string, prompt: string) {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "google/gemini-3.6-flash",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_schema", json_schema: JSON_SCHEMA },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    if (res.status === 429) throw new Error("Vivid AI is busy right now — please try again in a moment.");
    if (res.status === 402 || res.status === 403) {
      throw new Error("Vivid AI is unavailable: the workspace AI credits or access need attention.");
    }
    throw new Error(`Vivid AI request failed (${res.status}). ${body.slice(0, 200)}`);
  }

  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const content = json.choices?.[0]?.message?.content ?? "";
  const cleaned = content.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  if (!cleaned) throw new Error("Vivid AI returned an empty response. Please try again.");
  return ItinerarySchema.parse(JSON.parse(cleaned));
}

export const generateItinerary = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => TripInput.parse(input))
  .handler(async ({ data, context }) => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Vivid AI is not configured (missing API key).");

    const { data: trip, error: tErr } = await context.supabase
      .from("trips").select("*").eq("id", data.tripId).single();
    if (tErr || !trip) throw new Error("Trip not found");

    const startDate = new Date(trip.start_date);
    const endDate = new Date(trip.end_date);
    const dayCount = Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 86400000) + 1);

    const prompt = `You are Vivid AI, an expert travel planner. Build a detailed ${dayCount}-day itinerary for a trip.

Destination: ${trip.destination}
Dates: ${trip.start_date} to ${trip.end_date}
Travelers: ${trip.travelers}
Budget level: ${trip.budget_level}
Travel style: ${trip.travel_style}
Interests: ${(trip.interests as string[] | null)?.join(", ") || "general sightseeing"}

Create exactly ${dayCount} days numbered 1 to ${dayCount}. Each day: 4-6 activities with realistic timing, real specific place names, honest cost estimates in USD (a number, or null if unknown), mix of sightseeing, food, and rest. start_time must be "HH:MM" 24h format. type must be one of: ${ALLOWED_TYPES.join(", ")}. notes summarizes the day's theme. Return JSON only.`;

    let itinerary: z.infer<typeof ItinerarySchema>;
    try {
      itinerary = await callGateway(key, prompt);
    } catch (first) {
      // One stricter retry before giving up.
      try {
        itinerary = await callGateway(
          key,
          `${prompt}\n\nIMPORTANT: respond with valid JSON matching the schema exactly. No prose, no markdown fences.`
        );
      } catch {
        throw first instanceof Error ? first : new Error("Vivid AI could not build this itinerary. Please try again.");
      }
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
      if (dErr || !dayRow) throw new Error(dErr?.message ?? "Could not save the itinerary.");

      if (day.activities.length) {
        const { error: aErr } = await context.supabase.from("itinerary_activities").insert(
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
        if (aErr) throw new Error(aErr.message);
      }
    }

    await context.supabase.from("trips").update({ status: "planned" }).eq("id", data.tripId);
    return { ok: true, days: itinerary.days.length };
  });
