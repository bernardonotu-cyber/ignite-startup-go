-- roles
create type public.app_role as enum ('admin','moderator','user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users can read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- passport services
create table public.passport_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  blurb text not null default '',
  processing text not null default '',
  validity text not null default '',
  price numeric not null default 0,
  documents text[] not null default '{}',
  accent text not null default 'lagoon',
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select on public.passport_services to anon, authenticated;
grant all on public.passport_services to service_role;
alter table public.passport_services enable row level security;
create policy "Anyone can view active passport services" on public.passport_services for select to anon, authenticated using (active);
create policy "Admins manage passport services" on public.passport_services for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
grant insert, update, delete on public.passport_services to authenticated;

-- visa rules
create table public.visa_rules (
  id uuid primary key default gen_random_uuid(),
  origin_country text not null default 'Any other country',
  destination_country text not null,
  destination_id text,
  requirement text not null default 'e_visa',
  type_label text not null default 'Tourist e-Visa',
  stay text not null default '',
  processing text not null default '',
  fee numeric not null default 0,
  entries text not null default 'Single entry',
  documents text[] not null default '{}',
  note text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (origin_country, destination_country, type_label)
);
grant select on public.visa_rules to anon, authenticated;
grant insert, update, delete on public.visa_rules to authenticated;
grant all on public.visa_rules to service_role;
alter table public.visa_rules enable row level security;
create policy "Anyone can view active visa rules" on public.visa_rules for select to anon, authenticated using (active);
create policy "Admins manage visa rules" on public.visa_rules for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- applications
create type public.application_status as enum ('submitted','in_review','at_embassy','decision','ready','delivered','rejected');

create table public.document_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  reference text not null unique,
  kind text not null,
  passport_service_id uuid references public.passport_services(id) on delete set null,
  visa_rule_id uuid references public.visa_rules(id) on delete set null,
  service_name text not null,
  origin_country text,
  destination_country text,
  travel_date date,
  full_name text not null,
  email text not null,
  phone text,
  passport_number text,
  nationality text,
  travelers integer not null default 1,
  notes text,
  price numeric not null default 0,
  status public.application_status not null default 'submitted',
  admin_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.document_applications to authenticated;
grant all on public.document_applications to service_role;
alter table public.document_applications enable row level security;
create policy "Users read own applications" on public.document_applications for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "Users create own applications" on public.document_applications for insert to authenticated with check (user_id = auth.uid());
create policy "Admins update applications" on public.document_applications for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create table public.application_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.document_applications(id) on delete cascade,
  status public.application_status not null,
  note text,
  created_at timestamptz not null default now()
);
grant select, insert on public.application_events to authenticated;
grant all on public.application_events to service_role;
alter table public.application_events enable row level security;
create policy "Users read own application events" on public.application_events for select to authenticated using (
  exists (select 1 from public.document_applications a where a.id = application_id and (a.user_id = auth.uid() or public.has_role(auth.uid(),'admin')))
);
create policy "Owner or admin insert events" on public.application_events for insert to authenticated with check (
  exists (select 1 from public.document_applications a where a.id = application_id and (a.user_id = auth.uid() or public.has_role(auth.uid(),'admin')))
);

-- updated_at triggers
create trigger passport_services_updated_at before update on public.passport_services for each row execute function public.handle_updated_at();
create trigger visa_rules_updated_at before update on public.visa_rules for each row execute function public.handle_updated_at();
create trigger document_applications_updated_at before update on public.document_applications for each row execute function public.handle_updated_at();

-- seed passport services
insert into public.passport_services (slug,name,blurb,processing,validity,price,documents,accent,sort_order) values
('pp-new','New passport application','First-time applicants — we prep the forms, book the appointment and track it to delivery.','4 – 6 weeks','10 years',185,array['Birth certificate (original)','Government-issued photo ID','2 recent passport photos','Proof of address'],'lagoon',1),
('pp-renew','Passport renewal','Expiring soon? Renew by mail with a guided checklist and status tracking.','3 – 4 weeks','10 years',140,array['Current or recently expired passport','2 recent passport photos','Name-change document (if any)'],'grape',2),
('pp-express','Express / expedited','Trip in a hurry — priority handling, courier both ways and a dedicated case agent.','5 – 8 business days','10 years',310,array['Proof of travel (ticket or itinerary)','Current passport or birth certificate','2 recent passport photos'],'sunset',3),
('pp-child','Child passport (under 16)','Both-parent consent handled, with appointment slots that fit school hours.','4 – 6 weeks','5 years',160,array['Child''s birth certificate','Both parents'' IDs','Parental consent form','2 child passport photos'],'mango',4),
('pp-lost','Lost or stolen replacement','Report, invalidate and replace — including emergency travel documents if you''re abroad.','2 – 3 weeks','10 years',225,array['Police report','Photo ID','Statement of loss form','2 recent passport photos'],'leaf',5);

-- seed default (visa required) rules
insert into public.visa_rules (origin_country,destination_country,destination_id,requirement,type_label,stay,processing,fee,entries,documents,note) values
('Any other country','Greece (Schengen)','santorini','sticker','Sticker visa','Up to 90 days in any 180','15 – 20 days',90,'Multiple entry',array['Schengen application form','Travel insurance (€30,000 cover)','Hotel bookings','Bank statements (3 months)','Return flight reservation'],'Apply at the Greek embassy or a visa centre in your country of residence.'),
('Any other country','Japan','tokyo','e_visa','Tourist e-Visa','Up to 90 days','5 – 7 days',45,'Single entry',array['Passport bio page scan','Daily itinerary','Proof of funds','Return ticket'],'Issued electronically — print the approval or keep it on your phone.'),
('Any other country','Morocco','marrakech','e_visa','Tourist e-Visa','30 days','3 – 5 days',40,'Single entry',array['Passport scan','Passport photo','Hotel or riad confirmation','Return ticket'],'For nationalities not on the visa-exempt list.'),
('Any other country','South Africa','capetown','e_visa','Tourist e-Visa','Up to 90 days','7 – 10 days',38,'Single entry',array['Passport with 2 blank pages','Proof of accommodation','Bank statements','Return ticket'],'Children travelling need an unabridged birth certificate.'),
('Any other country','Brazil','rio','e_visa','Tourist e-Visa','90 days','5 – 8 days',81,'Multiple entry',array['Passport scan','Digital photo','Proof of funds','Itinerary or return ticket'],'Fully online — approval arrives by email as a PDF.'),
('Any other country','Indonesia','bali','on_arrival','Visa on arrival','30 days (extendable once)','At the airport counter',35,'Single entry',array['Passport valid 6+ months','Return ticket','Customs declaration QR'],'Can be pre-paid online as e-VOA to skip the airport queue.');

-- seed visa-free rules for common visa-exempt origins
insert into public.visa_rules (origin_country,destination_country,destination_id,requirement,type_label,stay,processing,fee,entries,documents,note)
select o.origin, d.dest, d.did, 'visa_free', 'Visa-free', d.stay, 'Immediate at immigration', 0, 'Multiple entry', d.docs, d.note
from (values
  ('United States'),('United Kingdom'),('Germany'),('France'),('Canada'),('Australia')
) as o(origin)
cross join (values
  ('Greece (Schengen)','santorini','90 days',array['Valid passport (3+ months beyond stay)','ETIAS travel authorisation'],'Visa-exempt for short stays; ETIAS pre-authorisation applies.'),
  ('Japan','tokyo','90 days',array['Valid passport','Onward or return ticket'],'Landing card completed on arrival.'),
  ('Morocco','marrakech','90 days',array['Passport valid 6+ months','Accommodation address'],'Enter without a visa for tourism.'),
  ('South Africa','capetown','90 days',array['Passport valid 30 days beyond stay','2 blank passport pages'],'Visa-exempt for tourism.'),
  ('Brazil','rio','90 days',array['Passport valid 6+ months','Proof of onward travel'],'Visa-exempt for tourism.'),
  ('Indonesia','bali','30 days',array['Passport valid 6+ months','Return ticket'],'Visa-exempt short stay; e-VOA available for longer trips.')
) as d(dest,did,stay,docs,note);

-- visa-required examples for a few common origins
insert into public.visa_rules (origin_country,destination_country,destination_id,requirement,type_label,stay,processing,fee,entries,documents,note)
select o.origin, v.destination_country, v.destination_id, v.requirement, v.type_label, v.stay, v.processing, v.fee, v.entries, v.documents, v.note
from (values ('Nigeria'),('India'),('Kenya'),('Ghana'),('Pakistan'),('Egypt')) as o(origin)
cross join (select destination_country, destination_id, requirement, type_label, stay, processing, fee, entries, documents, note from public.visa_rules where origin_country = 'Any other country') v;
