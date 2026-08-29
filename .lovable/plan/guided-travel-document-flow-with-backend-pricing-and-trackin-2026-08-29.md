# Guided travel-document flow with backend pricing and tracking

Make the passport & visa journey simple enough for anyone: answer two questions, get told exactly what you need, apply, then track it.

## What the traveler sees

1. **Trip check (on the home page)** — a prominent card at the top: "Where are you travelling from?" and "Where are you going?" (two dropdowns) plus number of travellers. One button: "Check my requirements".
2. **Result page** — plain-language verdict for that route:
   - "You don't need a visa" (with the conditions: passport validity, max stay), or
   - "You need a visa" — the visa types available, fee, processing time, documents.
   - Alongside it, a passport prompt: "Passport expiring within 6 months or don't have one? Apply here."
   - Buttons go straight to the matching application form.
3. **Application form** — sign in required. Simple steps: your details → travel dates → confirm the service and price → submit. On submit they get a **reference code** (e.g. BUB-4F2A9K).
4. **Tracking page** — enter the reference code (or open it from the dashboard) to see a status timeline: Submitted → In review → Submitted to embassy → Decision → Ready/Delivered, with dates and any note from the team.
5. **Dashboard** — a "My documents" list showing each application, its status and reference.

## Admin (you)

A protected `/admin/documents` page, visible only to admin accounts:
- Edit passport service prices, processing times, description and required-document lists.
- Edit visa options per country: fee, stay, processing time, requirements, and whether a visa is required for a given origin country.
- View all applications and move them along the status timeline, adding a note the traveler sees.

Prices on the public pages are read live from the database, so nothing is hard-coded.

## Technical notes

Database (new tables, all with RLS + grants):
- `user_roles` + `app_role` enum + `has_role()` security-definer function (admin gate).
- `passport_services` — name, blurb, processing, validity, price, documents[], accent, active. Seeded from the current static catalog.
- `visa_rules` — origin_country, destination_country, requirement (visa_free / e_visa / on_arrival / sticker), stay, processing, fee, entries, documents[], note, active. Seeded from the current catalog with a "default" origin plus a few common origins.
- `document_applications` — user_id, reference (unique), kind (passport/visa), service_id/visa_rule_id, origin_country, destination_country, travel_date, applicant fields, price_at_submission, status enum, admin_note. Owner reads/writes own; admins read/update all.
- `application_events` — application_id, status, note, created_at (the timeline).

Code:
- `src/lib/documents.functions.ts` — server functions: public reads for services/visa rules (publishable client), authenticated submit + list-own + get-by-reference, admin-only list/update/pricing mutations guarded by `has_role`.
- `src/components/travel/requirement-wizard.tsx` — the two-dropdown check, placed near the top of `src/routes/index.tsx`.
- `src/routes/passport-visa.tsx` — keeps the browse tabs but now driven by DB data; result state read from search params (`from`, `to`).
- `src/routes/_authenticated/documents/apply.$kind.tsx`, `src/routes/_authenticated/documents/index.tsx`, `src/routes/track.tsx` (reference lookup).
- `src/routes/_authenticated/admin/documents.tsx` — admin console, gated by role check.
- Existing `src/lib/documents-catalog.ts` becomes the seed source only; UI reads from the database.

Country lists come from the existing destination catalog plus a short list of common origin countries. No payment processing in this pass — applications record the price and status only.
