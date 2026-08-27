# Plane Flying Across the Home Page

Add a subtle, premium animation of a plane crossing the landing page as you scroll.

## What you'll see

- A small plane silhouette that glides across the hero on load, leaving a soft dotted vapour trail that fades behind it.
- As you scroll down the page, a second plane drifts diagonally across the section backgrounds (behind cards, never blocking clicks), moving at a slower parallax pace so it feels like it's high above.
- The plane tilts slightly and its trail shortens as it exits the screen, then re-enters at the next major section.
- Respects reduced-motion settings: users who prefer less motion get a static plane or none at all.

## Technical notes

- New component `src/components/travel/plane-flight.tsx`: absolutely positioned, `pointer-events-none`, `aria-hidden`, using the Lucide `Plane` icon plus an SVG dashed path for the trail.
- Animation via new CSS keyframes in `src/styles.css` (`buboli-fly`, trail dash-offset), following the existing `@utility` pattern (`press`, `shine`, `rise-in`).
- Mounted in `src/routes/index.tsx`: one instance layered in the hero (`z` below hero content), one page-level instance behind the Explore/Moments band.
- Scroll-linked drift uses the existing scroll listener already present in `Landing`, with `transform` only (no layout thrash).
- Existing `prefers-reduced-motion` block in `src/styles.css` already neutralises the animation.

No data, backend, or basket logic changes.
