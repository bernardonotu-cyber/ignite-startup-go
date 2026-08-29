ALTER TABLE public.visa_rules
  ADD COLUMN IF NOT EXISTS purpose text NOT NULL DEFAULT 'tourism',
  ADD COLUMN IF NOT EXISTS purpose_label text NOT NULL DEFAULT 'Tourism / Holiday';

UPDATE public.visa_rules SET purpose = 'tourism', purpose_label = 'Tourism / Holiday';

CREATE INDEX IF NOT EXISTS visa_rules_purpose_idx ON public.visa_rules (purpose);

INSERT INTO public.visa_rules
  (origin_country, destination_country, destination_id, requirement, type_label, stay, processing, fee, entries, documents, note, purpose, purpose_label)
SELECT 'Any other country', d.country, d.dest_id, p.requirement, p.type_label, p.stay, p.processing, p.fee, p.entries, p.documents, p.note, p.purpose, p.purpose_label
FROM (VALUES
  ('Greece (Schengen)', 'santorini'),
  ('Japan', 'tokyo'),
  ('Morocco', 'marrakech'),
  ('South Africa', 'capetown'),
  ('Brazil', 'rio'),
  ('Indonesia', 'bali')
) AS d(country, dest_id)
CROSS JOIN (VALUES
  ('business', 'Business', 'sticker', 'Business visa', 'Up to 90 days', '10 - 15 days', 120,
    'Multiple entry',
    ARRAY['Passport valid 6+ months','Invitation letter from host company','Company cover letter','Proof of funds','Return ticket']::text[],
    'For meetings, conferences, trade fairs and supplier visits. No paid local employment allowed.'),
  ('study', 'Study', 'sticker', 'Student visa', 'Duration of course', '3 - 6 weeks', 180,
    'Multiple entry',
    ARRAY['Acceptance letter from the school','Proof of tuition payment','Proof of funds / sponsor letter','Medical certificate','Passport photos']::text[],
    'Required for enrolled courses longer than a short-stay visit.'),
  ('work', 'Work', 'sticker', 'Work permit visa', 'Length of contract', '4 - 8 weeks', 260,
    'Multiple entry',
    ARRAY['Signed employment contract','Employer work-permit approval','Qualification certificates','Police clearance','Medical report']::text[],
    'Your employer usually starts the permit locally before you apply.'),
  ('family', 'Family visit', 'e_visa', 'Family visit visa', 'Up to 90 days', '7 - 12 days', 95,
    'Single entry',
    ARRAY['Invitation letter from family member','Host ID or residence permit','Proof of relationship','Accommodation proof','Return ticket']::text[],
    'For visiting relatives or friends who live in the country.'),
  ('medical', 'Medical', 'e_visa', 'Medical treatment visa', 'Up to 60 days (extendable)', '5 - 10 days', 110,
    'Single entry',
    ARRAY['Letter from the treating hospital','Referral from your local doctor','Proof of funds for treatment','Travel insurance','Return ticket']::text[],
    'Companion visas can be added for one or two family members.'),
  ('transit', 'Transit', 'on_arrival', 'Transit visa', 'Up to 96 hours', 'At the airport or 2 - 3 days online', 30,
    'Single entry',
    ARRAY['Onward ticket to a third country','Passport valid 6+ months','Visa for the final destination (if required)']::text[],
    'Only needed if you leave the airport transit area or change terminals.')
) AS p(purpose, purpose_label, requirement, type_label, stay, processing, fee, entries, documents, note);