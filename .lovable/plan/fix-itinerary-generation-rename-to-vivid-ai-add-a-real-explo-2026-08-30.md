# Fix itinerary generation, rename to Vivid AI, add a real Explore page

## 1. Itinerary generation

The generator calls the AI model and writes days/activities into the trip. Right now a failure shows only a generic toast, so the real cause is hidden. Fix in this order:

- Run the generator end-to-end against a real trip and read the actual error (auth, model response shape, or database insert).
- Harden the generator: retry once with a stricter prompt if the model returns an unexpected shape, and surface the real error message in the toast instead of a generic one.
- Fail softly on the trip form: if the itinerary step fails, still create the trip and land the user on the trip page with a "Retry generation" button, rather than leaving them stuck on the form.
- Add a "Regenerate itinerary" action on the trip page.

## 2. "Plan a trip with Vivid AI"

Rename every user-visible mention of the planner from "AI" to "Vivid AI": dashboard quick-action card and empty state, the new-trip page heading/subtitle/button, and the trip page generation copy. Also update the page titles/descriptions for those routes.

## 3. Explore places inside the portal

Clicking "Explore destinations" currently links to `/`, the public landing page — that is why it feels like being kicked out of the app.

- Add a dedicated `/explore` page that keeps the signed-in header (nav, basket, theme, sign out) and renders the destination explorer, traveler feed, and category feeds.
- Point the dashboard's "Explore destinations" card and the header "Explore" link at `/explore` instead of `/`.
- Give `/explore` its own page metadata.

## Technical notes

- Generator lives in `src/lib/itinerary.functions.ts` (protected server function, Lovable AI Gateway, `google/gemini-3.6-flash`).
- Verify via one real invocation plus a browser pass on the trip flow before calling it done.
- New route `src/routes/explore.tsx` reusing existing `DestinationExplorer` / feed components; no data-model changes.
