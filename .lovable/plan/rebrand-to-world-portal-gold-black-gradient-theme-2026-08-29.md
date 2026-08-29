# Rebrand to "World Portal" + Gold & Black Gradient Theme

## 1. Rename: BUBOLI → World Portal

Replace every user-facing "BUBOLI" occurrence:
- `src/routes/__root.tsx` — title, description, og/twitter meta
- Headers/wordmarks in `index.tsx`, `auth.tsx`, `dashboard.tsx`, `passport-visa.tsx`, `track.tsx`, `documents/*`, `admin/documents.tsx` (`<span className="tracking-[0.14em]">BUBOLI</span>`)
- `src/components/logo.tsx` — alt text
- Footer/landing copy in `index.tsx`
- Keep application reference prefix `BUB-XXXXXX` as-is (internal code) unless you'd like `WPR-XXXXXX` too — flag as optional.

## 2. Gold & Black Theme (`src/styles.css`)

Dark-first palette built around warm gold:
- Background: deep near-black with subtle warm undertone
- Foreground: soft warm white
- Primary / accents: rich gold (oklch warm yellow), with `--sunset`/`--mango` tokens retuned to gold range
- `text-gradient-warm` becomes a gold gradient (deep amber → bright gold → champagne)
- Existing `glass-panel`, `shine`, card surfaces stay but pick up the new tokens automatically since everything uses semantic colors
- Default the app to the dark palette so the black-gold gradient is the first impression (set `class="dark"` on `<html>` in `__root.tsx`, or make the light `:root` itself the dark gold theme — pick one and keep it consistent)

Hero and section backgrounds get a tasteful black → gold-tinted radial/linear gradient overlay; buttons and highlights in gold with black text for contrast.

## 3. Verify

- Build check, then preview pass over landing, auth, passport-visa, and basket to confirm contrast and that no old name/color remains.

## Technical details

- All color work happens only in `src/styles.css` tokens + a gradient utility; components already use semantic tokens, so no per-component hardcoding.
- No backend or schema changes.
