# Plan: Extend Ripple Animation + Share the Codebase

## Part 1 — Add the ripple effect to more sections

The ripple animation (`buboli-ripple` keyframe in `src/styles.css`) currently lives in **only one place**: the `AddButton` component inside `src/components/travel/destination-explorer.tsx`. When a user clicks an "Add" button, a colored ripple spreads from the click point. The rest of the landing page uses `press` and `shine` classes on buttons but has no ripple.

**Goal:** turn that one-off ripple into a reusable interaction and apply it across the key clickable surfaces on the home page so the whole experience feels consistent and premium.

### What to build

1. **A reusable `useRipple` hook** in `src/lib/use-ripple.ts`
   - Captures the click position, spawns a short-lived ripple span, and cleans it up after the 600ms animation.
   - Returns `{ ripples, onMouseDown }` to spread onto any clickable element.
   - Extracts the exact logic currently hardcoded in `AddButton` so nothing duplicates.

2. **A `<RippleButton>` wrapper** in `src/components/ui/ripple-button.tsx`
   - Thin wrapper around the existing `Button` that adds `relative overflow-hidden` and wires `useRipple`.
   - Keeps all current `Button` props (variant, size, className) so it's a drop-in replacement.

3. **Apply ripple to the home-page CTAs** in `src/routes/index.tsx`
   - Hero "Start planning" / "Explore destinations" buttons (lines ~131, 141, 218, 348, 353).
   - The destination quick-jump cards (line ~243).
   - The nav and basket bar buttons (lines ~98, 120).
   - Each click now emits a ripple from the exact point of contact, tinted by the button's `bg-current` color.

4. **Migrate `AddButton`** to use `useRipple` so there's a single source of truth for the effect, then remove the inline ripple state from `destination-explorer.tsx`.

### What stays the same
- The `buboli-ripple` keyframe in `styles.css` is unchanged — it already looks good.
- The `press` (scale-down) and `shine` (sweep) effects stay on the buttons; ripple layers on top.
- No theme, layout, or data changes. This is purely an interaction polish pass.

## Part 2 — Share the website so someone else can host & edit it

This is a settings/workflow task, not a code change. Lovable gives you three ways to get the full source code into someone else's hands:

**Option A — GitHub sync (recommended for handing off to a developer)**
- In the chat input, click the **Plus (+) menu → GitHub → Connect project**.
- Lovable pushes your full source code to a GitHub repo, then keeps it in two-way sync (your Lovable edits push to GitHub; their GitHub edits sync back).
- The other person clones the repo, edits in their own IDE (VS Code, etc.), and can host it on Vercel/Cloudflare/Netlify. They have full ownership of the code from there.
- Note: Lovable can export to GitHub but cannot import an existing repo.

**Option B — Download the codebase ZIP (paid plans)**
- Code editor → bottom of the file panel → **Download codebase**.
- Or Project settings → Git → Download codebase.
- Gives you a `.zip` of the whole project to hand over manually. Good for a one-time handoff where the other person won't co-edit in Lovable.

**Option C — Public remixing (share as a starting template)**
- Project settings → Sharing → enable **Public remixing**.
- Anyone with the project link gets an independent copy of the latest version (including source code) they can remix in their own Lovable account. They can't edit your original.

**What I'd recommend:** Use **Option A (GitHub sync)** — it's the cleanest way for the other person to plug the site into their own hosting and edit the code freely. Enable public remixing too if you also want a public "copy this" link.

### Important caveat
When you hand off the code, the backend (Lovable Cloud database, auth, AI) is tied to **your** project. The other person's hosted copy will need their own backend keys configured in their `.env`, or they'll need to set up their own Lovable Cloud / Supabase project. The code transfers cleanly, but the live data does not. I'll note this in a short `HANDOFF.md` you can include with the export.

## Verification
- After the ripple changes: open the preview, click every home-page CTA and confirm a ripple emits from the click point on each, with no console errors.
- Confirm `AddButton` still ripples and adds to the basket correctly.
- Run the build/typecheck to ensure no broken imports from the new hook/component.
