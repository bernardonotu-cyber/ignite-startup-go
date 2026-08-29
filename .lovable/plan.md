# Plan: Build the Backend for World Portal

## Where the backend stands today

Part of the backend already exists and works. Verified in the database:

- `profiles`, `user_roles` — accounts and admin roles
- `trips`, `itinerary_days`, `itinerary_activities` — AI trip planner storage
- `visa_rules`, `passport_services`, `document_applications`, `application_events` — the passport/visa flow with admin-editable pricing and status tracking

So the **documents side is fully backed by the database.** The **travel shopping side is not.**

## What is actually missing

1. **All travel inventory is hardcoded in the frontend.** `src/lib/travel-catalog.ts` (destinations, flights, cars, stays), `src/lib/places-catalog.ts` (attractions, fees, coordinates), and `src/lib/posts-catalog.ts` (Traveler Moments) are static TypeScript arrays. Nothing can be added, priced, or edited without a code change.
2. **The basket is browser-only.** `src/lib/trip-basket.tsx` saves to `localStorage`. Clear the browser or switch device and the trip is gone. Nothing is ever recorded server-side.
3. **There is no checkout.** A user can build a full basket and there is no way to submit it, no order, no reference number, no record for you to fulfil.

## What to build

### 1. Move the travel catalog into the database

New tables, each with RLS and grants:

- `destinations` — country/city, blurb, hero image, accent color, best season, currency, language, sort order, `active`
- `flights` — linked to destination: airline, route, times, cabin, price, tags
- `cars` — linked to destination: model, category, images, mileage, service history, fuel, insurance, condition rating, daily price
- `stays` — linked to destination: name, type (hotel/resort/villa), images, room size, beds, amenities, condition rating, nightly price
- `places` — linked to destination: name, category, latitude, longitude, entrance fee (nullable = free), opening hours, description, image

Public read access via `anon` SELECT on `active` rows; writes restricted to admins through the existing `has_role` function.

The current hardcoded arrays get seeded into these tables as literal INSERT rows in the migration, so the site looks identical the moment it switches over — nothing goes blank.

### 2. Traveler Moments becomes real

- `traveler_posts` table — author, avatar, image, caption, destination, tagged place, created date, `published` flag.
- Seeded from the existing posts so the feed keeps working.
- Later this is what lets real users post their own moments.

### 3. Persist the basket and add checkout

- `baskets` / `basket_items` — a signed-in user's basket saves to the database and follows them across devices. Guests keep using `localStorage`, and the basket **merges into their account on sign-in** so nothing is lost.
- `bookings` and `booking_items` — checkout snapshots the basket into an immutable order with a reference code (same pattern as the existing document applications), a total, traveler details, and a status.
- `booking_events` — status timeline, mirroring `application_events`, so users can track a booking the same way they track a visa.

### 4. Server functions

New `src/lib/catalog.functions.ts` and `src/lib/bookings.functions.ts`:

- Public reads: destinations with their flights/cars/stays/places, and the traveler feed.
- Authenticated: load/save basket, submit checkout, list my bookings, track one booking by reference.
- Admin-only: create/update/deactivate any catalog row, list all bookings, advance a booking's status.

Prices are always recalculated server-side from the database at checkout — never trusted from the client.

### 5. Admin console extension

Extend the existing admin dashboard with tabs to manage destinations, flights, cars, stays, places, traveler posts, and incoming bookings — matching how visa rules and passport pricing are already managed today.

### 6. Frontend rewiring

Swap the static imports for loader-backed queries. The destination explorer, category feeds, places layer, moments feed, and basket all read live data. Component structure, styling, animations, and both themes are untouched — this is a data-source swap, not a redesign.

## Explicitly not in this plan

**Real payments.** Checkout will produce a booking with a total and a reference code, but will not charge a card. Wiring Stripe or Paddle is a separate step — say the word and I'll plan it after this lands.

## Still pending from before

The earlier plan covered two other items you asked about — extending the ripple animation across the home page, and exporting the code via GitHub sync so someone else can host and edit it. Those are independent of this backend work and can be done before or after. Tell me if you want them folded into this build or handled separately.

## Verification

- Confirm every new public table has RLS enabled plus explicit GRANTs.
- Load the home page and confirm destinations, cars, stays, places, and moments all render from the database with the same content as before.
- Build a basket signed out, sign in, and confirm it merged rather than vanished.
- Complete a checkout and confirm the booking, its items, and its first timeline event all appear in the database and in the admin console.
- Attempt an admin-only write as a normal user and confirm it is rejected.
