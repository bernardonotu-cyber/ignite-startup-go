# Let anyone reach the passport / visa application form

Right now the application form lives behind the login gate (`/documents/apply` sits under the protected area), so visitors who aren't signed in get bounced to `/auth` and never see the page where details and documents are entered. Only one account exists in the backend, and new sign-ups need an email confirmation before a session exists — so a new user who "creates an account" is still logged out and lands back on the sign-in screen. That's the loop you're hitting.

## What changes

1. **The application page becomes public.** Move the apply screen to `/apply` (no login required). It keeps the same three steps: choose service, enter your details, confirm the price. Old `/documents/apply` links redirect there, so the buttons on the Passport & Visa page keep working.
2. **Guests can submit.** Submitting without an account creates the application against your email and returns the reference code. Signed-in users still get the application attached to their account so it shows in their dashboard.
3. **Guest tracking.** After submitting, the confirmation/tracking screen is reachable with the reference code plus the email used, without signing in. Signed-in owners and admins keep full access as today.
4. **Sign-up actually signs you in.** Turn on instant account confirmation so creating an account gives a working session immediately, and show a clear message instead of a silent redirect when it doesn't.
5. **Clear sign-in messaging.** Wrong password / unconfirmed email now surfaces a readable error instead of appearing to do nothing.

## Technical notes

- New public route `src/routes/apply.tsx` with the current form; `src/routes/_authenticated/documents/apply.tsx` becomes a redirect stub. Same for a public `src/routes/documents/$reference.tsx`-style status view guarded by reference + email match.
- `submitApplication` drops `requireSupabaseAuth` and instead reads the optional bearer session: `user_id` set when present, `null` for guests. Requires a migration making `document_applications.user_id` nullable, plus RLS/GRANT updates: `anon` INSERT allowed with no policy-readable SELECT; guest reads go through a server function using the service-role client after verifying `reference` + `email`, never through direct anon SELECT.
- `getApplication` split into `getMyApplication` (auth, unchanged) and `getApplicationByReference` (public, requires matching email).
- Auth: enable auto-confirm email sign-ups so `signUp()` returns a session; surface `error.message` in the auth form.

## Not changing

Admin console, pricing/catalog data, visa rules, and the rest of the site stay as they are.
