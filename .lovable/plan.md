# Make sign-in work reliably

The application page stays behind sign-in — that's fine. The problem is the sign-in itself: creating an account currently requires an email confirmation before a session exists, so after "Account created" the app sends you to the dashboard, the auth gate finds no session, and bounces you back to the sign-in screen. Failed sign-ins also give no visible reason.

## What changes

1. **Sign-up signs you in immediately.** Turn on instant account confirmation in the backend so a new account has a working session right away, instead of waiting on a confirmation email.
2. **No more bounce loop.** After sign-in or sign-up, wait until the session is actually established before navigating, and send the user to where they were trying to go (e.g. the passport/visa application page) instead of always the dashboard.
3. **Clear errors.** Show the real reason a sign-in fails (wrong password, email not confirmed, rate limited) in the form, plus a "Forgot password?" link and a reset-password page so a locked-out account can recover.
4. **Header reflects being signed in.** Show an account/sign-out control once signed in, so it's obvious the login worked.
5. **Google sign-in enabled.** Configure the Google provider so the "Continue with Google" button actually works instead of erroring.
6. **The signed-in home becomes a real hub.** The dashboard currently shows only "My documents" and "Your trips" — nothing else is reachable without going back to the landing page. Rework it into a control center:
   - Top nav with links to every area: Explore (home), Passport & Visa, Hire a Pro, Track application, plus the theme toggle, trip basket, and sign-out.
   - Quick-access cards on the dashboard itself for each feature — plan a trip (AI), check travel documents, hire a professional, track an application — so nothing requires leaving the signed-in area to discover features.
   - Keeps the existing trips grid and documents list below the quick actions.

## Technical notes

- `supabase--configure_auth` with `auto_confirm_email: true`; `supabase--configure_social_auth` for Google.
- `src/routes/auth.tsx`: add a `redirect` search param, await `getUser()` after the auth call before navigating, surface `error.message` inline, add forgot-password via `resetPasswordForEmail` with `redirectTo: origin + "/reset-password"`.
- New public `src/routes/reset-password.tsx` handling the recovery link and calling `updateUser({ password })`.
- `src/routes/_authenticated/route.tsx`: pass the blocked path as `redirect` on the redirect to `/auth` (gate itself unchanged otherwise).
- Root `onAuthStateChange` subscriber invalidates the router on sign-in/sign-out; header shows sign-out with proper cache teardown.

## Not changing

The apply/tracking pages stay behind login, and the form, pricing, visa rules and admin console are untouched.
