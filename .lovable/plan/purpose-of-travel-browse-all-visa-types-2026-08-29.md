# Purpose of travel + browse all visa types

## What you get

1. **Purpose dropdown in "Check your documents"**
   The wizard becomes three fields: Travelling from, Travelling to, and Purpose of travel — Tourism / Holiday, Business, Study, Work, Family visit, Medical, Transit. The result page then recommends the exact visa for that purpose instead of a generic tourist visa.

2. **"All visa types" section**
   Below the checker on the Passport & Visa page, a browsable grid of every visa type we handle (e-Visa, visa on arrival, sticker/embassy visa, business visa, student visa, work permit, transit visa, family visit visa, medical visa, visa-free/ETIAS). Each card shows the country, purpose, stay length, entries, processing time and fee, with an "Apply now" button that jumps straight into the application form with that visa preselected — so someone who already knows what they want can skip the questions.
   Filters at the top: by purpose and by destination country, plus a search box.

3. **Result page respects purpose**
   After the checker runs, matches are filtered to the chosen purpose; if none exists for that exact purpose we still show the closest options with a clear note, so the user is never left with an empty screen.

4. **Admin control**
   The admin documents console gets a Purpose field on each visa rule, so you can add/edit visa types and their prices per purpose from the backend — pricing stays fully editable as before.

## Technical notes

- Migration: add `purpose` (text, default `tourism`) and `purpose_label` to `public.visa_rules`, backfill existing rows, plus seed rows covering the additional purposes for the six destination countries. Existing GRANTs/RLS unchanged.
- `src/components/travel/requirement-wizard.tsx`: third `Select`, purpose carried through the `/passport-visa` search params (`from`, `to`, `purpose`).
- `src/routes/passport-visa.tsx`: `validateSearch` gains `purpose`; matching logic filters on it; new `AllVisaTypes` component (new file `src/components/travel/visa-types-grid.tsx`) with purpose/country filters linking to `/documents/apply?kind=visa&id=<ruleId>`.
- `src/lib/documents.functions.ts`: catalog already returns all active rules — no server change needed beyond the new columns flowing through generated types; admin update schema extended with `purpose`.
- `src/routes/_authenticated/admin/documents.tsx`: purpose select on the rule editor.
- Apply form keeps the preselected rule and shows its purpose in the summary.
