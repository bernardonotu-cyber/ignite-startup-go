# Plan: Tour Guides inside "Places You Can Visit"

Add a tour guide layer to the Places section so that when someone opens a destination and browses the places they can visit, they also see real guides who can take them around — with photos, credentials, languages, and fees — and can add a guide to the basket like any other item.

## What the user sees

Inside the **Places** tab of a destination (`places-layer.tsx`), each place card gains a **"Guides for this place"** strip below its distance matrix. Expanding a place now reveals two things: how close everything else is (already there), and who can take you there.

Each guide appears as a card with:

- **Photo** of the guide
- **Name and title** (e.g. "Nikos Alexiou · Licensed Caldera Guide")
- **Rating and tour count** (e.g. 4.9 · 340 tours)
- **Languages spoken** (flag-free text badges: English, Greek, French)
- **Years of experience** and a short bio line
- **Specialty tags** matching the place category (Archaeology, Food, Photography, Hiking)
- **Fee** — priced per half-day, full-day, or per-person depending on the guide
- **Group size** they take and what's included (transport, entrance fees, lunch)
- **Add to basket** button with the same ripple/pop behaviour as every other add button

Clicking a guide card opens a **detail dialog** — same pattern as the existing car and stay cards in `vehicle-stay-detail.tsx` — showing the large photo, full bio, full itinerary of what the tour covers, the places they guide, cancellation policy, and the add button.

## Coverage

Every one of the 6 destinations gets guides: Santorini, Tokyo, Marrakech, Cape Town, Rio, Bali.

Guides are attached to **specific places**, not just the city. A Santorini archaeology guide shows under Akrotiri Excavations and Ancient Thera; a sunset photography guide shows under Oia Sunset Castle and Amoudi Bay. So every place has at least one relevant guide, and popular places have two or three.

Some guides are **city-wide** ("takes you round the whole city") and show on every place in that destination, marked with a "Full city tour" badge — this is the option for someone who wants one guide for everything rather than per-site.

## Also added

A **Guides tab** at the destination level, alongside Flights / Cars / Stays / Places, listing every guide for that city in one place for people who want to browse guides first and pick places after.

## Technical notes

- New `src/lib/guides-catalog.ts` — `TourGuide` type (`id`, `name`, `title`, `image`, `bio`, `rating`, `tours`, `years`, `languages[]`, `specialties[]`, `placeIds[]`, `cityWide`, `fee`, `feeUnit`, `groupSize`, `includes[]`, `cancellation`) plus a `GUIDES: Record<destinationId, TourGuide[]>` map and a `guidesForPlace(destinationId, placeId)` helper that merges place-specific and city-wide guides.
- Generate guide portraits into `public/images/guide-*.jpg` — roughly 3 guides per destination, 18 total, each looking regionally appropriate and professional.
- New `src/components/travel/guide-card.tsx` with `GuideCard` (compact strip card) and `GuideDetailDialog` (nested dialog, matching the car/stay dialog pattern).
- Extend `places-layer.tsx`: when a place is selected, render the guides strip under the existing distance matrix.
- Add a `guide` kind to `BasketItem` in `trip-basket.tsx` and a matching icon/label in the basket sheet.
- Styling uses existing design tokens only — works in both the black-and-gold and colourful light themes, no hardcoded colours.

## Still pending

The backend plan (moving the catalog, basket, and checkout into the database) and the earlier ripple/code-export items are still unapproved. If the backend build goes ahead, guides become a `tour_guides` table seeded from this catalog — the same swap as every other catalog. Building guides as a catalog first means nothing has to be redone.

## Verification

- Open each of the 6 destinations, select every place, and confirm at least one guide appears with a loaded photo.
- Confirm city-wide guides appear on all places in their destination and carry the badge.
- Open a guide detail dialog from inside the destination modal and confirm the nested dialog stacks correctly and closes cleanly.
- Add a guide to the basket and confirm it appears with the right price and label.
- Check both themes for contrast and layout.
