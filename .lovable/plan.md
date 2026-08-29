# Hire a Pro — standalone freelancer tab

A new top-level page where travellers hire local professionals for their trip, picked from a dropdown of categories and then from real profiles inside each category.

## What the user gets

A new nav tab **Hire a Pro** (route `/hire`) alongside Passport & Visa, with:

- A **profession dropdown** listing: Photographer, Videographer, Private chef/cook, Barber/stylist, Personal shopper, Interpreter/translator, Private security, Babysitter/nanny, Event planner, plus a general "Freelancer / other".
- A second dropdown for **city** (the six existing destinations) and an optional search box.
- Choosing a profession instantly shows the **professionals in that field** — cards with photo, name, headline, rating, years of experience, languages, day/hour rate, and availability.
- Clicking a card opens a detail dialog: full bio, gear/skills, what's included, sample packages, cancellation policy, and an **Add to basket** button so the hire joins the same trip basket as flights, stays, cars and guides.
- Empty-state message when a city has no one in that field yet.

## Content

A curated static catalog of professionals — roughly 3 per profession spread across the six destinations (~30 profiles), each with a generated portrait image, so every dropdown option shows real picks. Same shape and quality bar as the existing tour-guide catalog.

## Technical notes

- `src/lib/pros-catalog.ts` — `PROFESSIONS` list (value, label, icon key, blurb) and `PROS` array typed `TravelPro` (id, professionId, city, name, headline, image, bio, rating, jobs, years, languages, skills, rate, rateUnit, includes, packages, cancellation, availability). Helper selectors by profession/city.
- `src/components/travel/pro-card.tsx` — card + detail dialog, mirroring `guide-card.tsx`, reusing `AddButton`.
- `src/components/travel/hire-explorer.tsx` — the dropdown filters + results grid.
- `src/routes/hire.tsx` — new route with its own `head()` metadata (unique title/description/OG) and the same header/footer treatment as `passport-visa.tsx`.
- `src/lib/trip-basket.tsx` + `trip-basket-sheet.tsx` — add a `pro` basket kind with icon and label.
- Header nav links updated on the home and passport pages to include the new tab.
- Portrait images generated into `public/images/pro-*.jpg`.

No database changes; this reuses the existing static-catalog pattern. It can be moved to the backend later alongside the other catalogs.
