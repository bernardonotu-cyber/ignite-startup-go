import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export type PassportServiceRow = Database["public"]["Tables"]["passport_services"]["Row"];
export type VisaRuleRow = Database["public"]["Tables"]["visa_rules"]["Row"];
export type ApplicationRow = Database["public"]["Tables"]["document_applications"]["Row"];
export type ApplicationEventRow = Database["public"]["Tables"]["application_events"]["Row"];
export type ApplicationStatus = Database["public"]["Enums"]["application_status"];

function publicClient() {
  return createClient<Database>(
    process.env["SUPABASE_URL"]!,
    process.env["SUPABASE_PUBLISHABLE_KEY"]!,
    { auth: { storage: undefined, persistSession: false, autoRefreshToken: false } },
  );
}

export const getDocumentsCatalog = createServerFn({ method: "GET" }).handler(async () => {
  const db = publicClient();
  const [services, rules] = await Promise.all([
    db.from("passport_services").select("*").eq("active", true).order("sort_order"),
    db.from("visa_rules").select("*").eq("active", true).order("destination_country"),
  ]);
  if (services.error) throw services.error;
  if (rules.error) throw rules.error;
  return {
    services: services.data as PassportServiceRow[],
    rules: rules.data as VisaRuleRow[],
  };
});

export const getMyRoles = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", context.userId);
    if (error) throw error;
    return { roles: (data ?? []).map((r) => r.role as string) };
  });

const applicationSchema = z.object({
  kind: z.enum(["passport", "visa"]),
  passportServiceId: z.string().uuid().nullable().optional(),
  visaRuleId: z.string().uuid().nullable().optional(),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  passportNumber: z.string().trim().max(40).optional().or(z.literal("")),
  nationality: z.string().trim().max(80).optional().or(z.literal("")),
  travelDate: z.string().trim().max(20).optional().or(z.literal("")),
  travelers: z.number().int().min(1).max(20),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

function makeReference() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `BUB-${out}`;
}

export const submitApplication = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => applicationSchema.parse(data))
  .handler(async ({ data, context }) => {
    const db = publicClient();

    let serviceName = "";
    let price = 0;
    let originCountry: string | null = null;
    let destinationCountry: string | null = null;

    if (data.kind === "passport") {
      if (!data.passportServiceId) throw new Error("Choose a passport service");
      const { data: svc, error } = await db
        .from("passport_services")
        .select("*")
        .eq("id", data.passportServiceId)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      if (!svc) throw new Error("That passport service is no longer available");
      serviceName = svc.name;
      price = Number(svc.price);
    } else {
      if (!data.visaRuleId) throw new Error("Choose a visa option");
      const { data: rule, error } = await db
        .from("visa_rules")
        .select("*")
        .eq("id", data.visaRuleId)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      if (!rule) throw new Error("That visa option is no longer available");
      serviceName = `${rule.type_label} · ${rule.destination_country}`;
      price = Number(rule.fee);
      originCountry = rule.origin_country;
      destinationCountry = rule.destination_country;
    }

    const total = price * data.travelers;

    let inserted: ApplicationRow | null = null;
    for (let attempt = 0; attempt < 5 && !inserted; attempt++) {
      const { data: row, error } = await context.supabase
        .from("document_applications")
        .insert({
          user_id: context.userId,
          reference: makeReference(),
          kind: data.kind,
          passport_service_id: data.kind === "passport" ? data.passportServiceId! : null,
          visa_rule_id: data.kind === "visa" ? data.visaRuleId! : null,
          service_name: serviceName,
          origin_country: originCountry,
          destination_country: destinationCountry,
          travel_date: data.travelDate ? data.travelDate : null,
          full_name: data.fullName,
          email: data.email,
          phone: data.phone || null,
          passport_number: data.passportNumber || null,
          nationality: data.nationality || null,
          travelers: data.travelers,
          notes: data.notes || null,
          price: total,
        })
        .select("*")
        .maybeSingle();
      if (error && error.code !== "23505") throw error;
      if (row) inserted = row as ApplicationRow;
    }
    if (!inserted) throw new Error("Could not create your application, please try again");

    await context.supabase.from("application_events").insert({
      application_id: inserted.id,
      status: "submitted",
      note: "Application received. We are checking your details.",
    });

    return { reference: inserted.reference };
  });

export const listMyApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("document_applications")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { applications: (data ?? []) as ApplicationRow[] };
  });

export const getApplication = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ reference: z.string().trim().min(4).max(20) }).parse(d))
  .handler(async ({ data, context }) => {
    const { data: app, error } = await context.supabase
      .from("document_applications")
      .select("*")
      .eq("reference", data.reference.toUpperCase())
      .maybeSingle();
    if (error) throw error;
    if (!app) return { application: null, events: [] as ApplicationEventRow[] };
    const { data: events, error: evErr } = await context.supabase
      .from("application_events")
      .select("*")
      .eq("application_id", app.id)
      .order("created_at", { ascending: true });
    if (evErr) throw evErr;
    return { application: app as ApplicationRow, events: (events ?? []) as ApplicationEventRow[] };
  });

export const adminListApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("document_applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return { applications: (data ?? []) as ApplicationRow[] };
  });

export const adminUpdateStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.enum([
          "submitted",
          "in_review",
          "at_embassy",
          "decision",
          "ready",
          "delivered",
          "rejected",
        ]),
        note: z.string().trim().max(500).optional().or(z.literal("")),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("document_applications")
      .update({ status: data.status, admin_note: data.note || null })
      .eq("id", data.id);
    if (error) throw error;
    const { error: evErr } = await context.supabase
      .from("application_events")
      .insert({ application_id: data.id, status: data.status, note: data.note || null });
    if (evErr) throw evErr;
    return { ok: true };
  });

export const adminUpdatePassportService = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid(),
        name: z.string().trim().min(2).max(120),
        blurb: z.string().trim().max(400),
        processing: z.string().trim().max(80),
        validity: z.string().trim().max(80),
        price: z.number().min(0).max(100000),
        documents: z.array(z.string().trim().max(160)).max(20),
        active: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("passport_services").update(patch).eq("id", id);
    if (error) throw error;
    return { ok: true };
  });

export const adminUpdateVisaRule = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        id: z.string().uuid(),
        purpose: z
          .enum(["tourism", "business", "study", "work", "family", "medical", "transit"])
          .optional(),
        type_label: z.string().trim().min(2).max(80),
        requirement: z.string().trim().max(40),
        stay: z.string().trim().max(80),
        processing: z.string().trim().max(80),
        fee: z.number().min(0).max(100000),
        entries: z.string().trim().max(60),
        documents: z.array(z.string().trim().max(160)).max(20),
        note: z.string().trim().max(400),
        active: z.boolean(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { id, ...patch } = data;
    const { error } = await context.supabase.from("visa_rules").update(patch).eq("id", id);
    if (error) throw error;
    return { ok: true };
  });

export const adminListRules = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const [services, rules] = await Promise.all([
      context.supabase.from("passport_services").select("*").order("sort_order"),
      context.supabase
        .from("visa_rules")
        .select("*")
        .order("destination_country")
        .order("origin_country"),
    ]);
    if (services.error) throw services.error;
    if (rules.error) throw rules.error;
    return {
      services: services.data as PassportServiceRow[],
      rules: rules.data as VisaRuleRow[],
    };
  });
