# Theme switcher: Black & Gold ↔ Classic Light

## Goal
Add a theme toggle button so visitors can switch between the new **World Portal black & gold** theme (default) and the **previous colorful light theme** (white background, dark text, sunset/lagoon/grape/mango accents).

## Approach

1. **Restore the classic palette as a scoped theme** in `src/styles.css`
   - Keep `:root` as the current black & gold theme (default).
   - Re-add the previous light theme values under a `html.light` class (background white, dark foreground, gold accents remapped back to sunset/lagoon/grape/mango, dark primary, neutral borders).
   - The existing `.dark` block stays as an alias of black & gold so nothing breaks.

2. **Create a small theme hook** — `src/lib/theme.tsx`
   - Reads saved preference from `localStorage` (`wp-theme`: `"gold"` | `"light"`), defaults to `"gold"`.
   - Applies/removes the `light` class on `<html>` and persists the choice.
   - Respects hydration: initial value applied in `useEffect` to avoid SSR mismatch; a tiny inline script isn't needed since the default is the dark gold theme.

3. **Add the toggle button to the site header** (`src/routes/index.tsx` nav, plus the shared headers on passport-visa, documents, dashboard pages)
   - A round icon button next to the trip-basket plane icon: `Sun` icon in gold theme, `MoonStar`/`Sparkles` icon in light theme, with a tooltip/aria-label "Switch theme".
   - Uses the existing `press` tactile animation so it matches the site's interactions.

4. **Verify**
   - Toggle on the landing page: colors flip across all sections (hero, cards, feeds, basket, footer) since everything uses semantic tokens.
   - Reload page: chosen theme persists.

## Technical details
- Files: `src/styles.css` (add `html.light` token block), new `src/lib/theme.tsx` hook, header edits in `src/routes/index.tsx`, `src/routes/passport-visa.tsx`, `src/routes/track.tsx`, `src/routes/_authenticated/dashboard.tsx`, `src/routes/_authenticated/documents/*.tsx`.
- No backend or database changes. No new dependencies.
- Images and the plane animation are unaffected (they sit above token colors).
