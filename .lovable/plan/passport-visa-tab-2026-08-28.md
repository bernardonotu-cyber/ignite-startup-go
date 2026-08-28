# Passport & Visa tab

Add a dedicated Passport & Visa section to BUBOLI, separate from the existing travel layers, so travelers can sort out documents before booking.

## What the user gets

- A new "Passport & Visa" tab in the top navigation that opens its own page at `/passport-visa`.
- Two switchable panels on that page:
  - **Passport**: new application, renewal, and express/expedited options — each with processing time, validity, required documents checklist, and a price. Addable to the trip basket.
  - **Visa**: a picker for destination country (from the existing destination catalog) showing the visa types available (tourist e-visa, visa on arrival, sticker visa, visa-free), stay duration, processing time, required documents, embassy/fee amount, and a "free / not required" badge where applicable. Addable to the trip basket.
- A short "How it works" strip: choose service, upload documents, track status, receive document — presented as steps (informational, no upload backend in this pass).
- Same premium look as the rest of the site: reveal-on-scroll cards, press/shine interactions, colored accents.

## Basket behaviour

Basket gains a new item kind `document`, with a passport-style icon and the label "Documents", so passport/visa services appear alongside flights, cars, stays and attractions and roll into the estimated total.

## Technical notes

- `src/lib/documents-catalog.ts` — new static catalog: passport service tiers and per-destination visa rules keyed by the existing destination ids/countries.
- `src/components/travel/documents-layer.tsx` — tabbed UI (shadcn Tabs), reusing `Reveal`, `AddButton`-style add-to-basket buttons and `Badge`.
- `src/routes/passport-visa.tsx` — new public route with its own `head()` (unique title, description, og/twitter tags) rendering the header, the documents layer, and the footer.
- `src/lib/trip-basket.tsx` and `src/components/travel/trip-basket-sheet.tsx` — extend `BasketKind` with `document` and map it to an icon/label.
- `src/routes/index.tsx` — add the nav link to the new page; landing layers stay unchanged.

No database or backend changes; data is static like the rest of the catalogs.
