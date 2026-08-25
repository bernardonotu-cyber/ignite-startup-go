# Traveler Posts Feed

Add a social-style feed section to the landing page where visitors scroll through posts from tourists — a photo, who posted it, a short caption, and the location beneath the image.

## Where it goes

Between the Destinations ("Explore") section and the Flights section, as a new full-width band with its own heading, so the page reads: hero → stats → destinations → traveler posts → flights → cars → stays.

## What a post shows

- Photo of the site (zoo, temple, beach, viewpoint, market)
- Traveler name + avatar initials, and how long ago
- One-line caption
- Location line beneath the image: place name, city, country, with a pin icon
- Like count and a small "Add this place" action when the post matches a place already in the catalog, so it feeds into the trip basket

## Layout and feel

- Horizontally scrollable row on mobile, masonry-style responsive grid on desktop
- Cards reuse the existing premium treatment: rounded-3xl, scroll-reveal with staggered delay, press/shine hover feedback
- Colorful accents drawn from the existing palette (sunset, lagoon, grape, mango, leaf)
- A "Load more" button reveals a second batch so the feed feels endless without heavy loading

## Content

12 seeded posts covering the six existing destinations (Santorini, Tokyo, Marrakech, Cape Town, Rio, Bali), reusing the destination images already in the project plus a few newly generated photos for the site-specific shots (zoo/wildlife, market, temple).

## Technical notes

- New `src/lib/posts-catalog.ts` with a `Post` type (id, author, avatarInitials, image, caption, placeId, placeName, city, country, likes, postedAgo) and the seed array; posts link to existing `PLACES` entries by id where possible.
- New `src/components/travel/traveler-feed.tsx` renders the grid, handles the load-more state, and uses the existing `Reveal` component and `useTripBasket` for the add action.
- `src/routes/index.tsx` gains the new `<section id="moments">` and a nav/anchor link alongside the existing explore/flights/cars/stays anchors.
- Static content only — no database or auth changes.
