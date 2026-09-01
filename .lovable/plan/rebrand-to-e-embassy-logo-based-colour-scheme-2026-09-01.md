# Rebrand to E-Embassy + logo-based colour scheme

## 1. Logo

- Publish the uploaded `E-EMBASSY_MAIN_AW.svg` as a hosted asset and point `src/components/logo.tsx` at it (alt text "E-Embassy").
- Because it is a wide wordmark, header usage switches from a square icon to a height-constrained mark (`h-7 w-auto`) and the separate "World Portal" text label next to it is removed where the wordmark already contains the name.
- Favicon: generate a square, padded PNG from the logo mark into `public/favicon.png` (replacing the current one) and keep the root route link pointing at it.

## 2. Name change: World Portal → E-Embassy

Replace every user-facing occurrence across the 18 files that mention it, including:
- `src/routes/__root.tsx` title, description, author, og/twitter meta
- Headers and copy in `index.tsx`, `auth.tsx`, `reset-password.tsx`, `passport-visa.tsx`, `track.tsx`, `explore.tsx`, `hire.tsx`, `dashboard.tsx`, `profile.tsx`, `documents/*`, `trips/*`, `admin/documents.tsx`
- Internal storage keys (`wp.auth.redirect`, `wp-theme`) stay as-is so existing sessions/preferences don't break.

## 3. Colour scheme from the logo

Logo palette sampled: sky cyan (#00A0E0), deep royal blue (#0043BF), navy/black, gold (#E0C040) and a small red accent.

- `:root` (default theme) becomes **deep navy + cyan/gold**: near-black navy background, soft white foreground, cyan-blue primary, gold as the secondary accent for highlights and badges.
- Accent tokens retuned: `--sunset` → gold, `--lagoon` → sky cyan, `--grape` → royal blue, `--mango` → warm gold, `--leaf` unchanged.
- `.dark` mirrors the same identity (as today).
- `html.light` becomes the light counterpart of the new brand: white background, navy text, royal-blue primary, cyan/gold accents — so the existing theme toggle keeps working and both modes stay on-brand.
- `text-gradient-warm` gradient becomes cyan → royal blue → gold; body radial glows switch to cyan and gold tints.

All components already use semantic tokens, so no per-component colour edits are needed.

## 4. Verify

- Build check, then a preview pass over landing, auth, passport & visa, hire, and dashboard in both themes for contrast and no remaining old name/colours.

## Technical details

- Files touched: `src/components/logo.tsx`, `src/styles.css`, `public/favicon.png`, plus the name strings in the route files listed above.
- No backend, schema, or business-logic changes.
