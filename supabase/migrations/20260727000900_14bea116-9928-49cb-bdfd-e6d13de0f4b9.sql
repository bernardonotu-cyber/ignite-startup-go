create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

create policy "Users can manage their own profile"
  on public.profiles
  for all
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create type public.trip_status as enum ('draft', 'planned', 'archived');

create table public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  destination text not null,
  start_date date not null,
  end_date date not null,
  travelers integer not null default 1,
  budget_level text not null default 'moderate',
  interests text[] not null default '{}',
  travel_style text not null default 'balanced',
  status trip_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select, insert, update, delete on public.trips to authenticated;
grant all on public.trips to service_role;

alter table public.trips enable row level security;

create policy "Users can manage their own trips"
  on public.trips
  for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

create table public.itinerary_days (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references public.trips(id) on delete cascade,
  day_number integer not null,
  date date not null,
  title text not null,
  notes text,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.itinerary_days to authenticated;
grant all on public.itinerary_days to service_role;

alter table public.itinerary_days enable row level security;

create policy "Users can manage itinerary days of their trips"
  on public.itinerary_days
  for all
  to authenticated
  using (trip_id in (select id from public.trips where user_id = auth.uid()))
  with check (trip_id in (select id from public.trips where user_id = auth.uid()));

create table public.itinerary_activities (
  id uuid primary key default gen_random_uuid(),
  day_id uuid not null references public.itinerary_days(id) on delete cascade,
  start_time time,
  title text not null,
  description text,
  type text not null default 'activity',
  location text,
  estimated_cost numeric(10,2),
  booking_link text,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.itinerary_activities to authenticated;
grant all on public.itinerary_activities to service_role;

alter table public.itinerary_activities enable row level security;

create policy "Users can manage activities of their trips"
  on public.itinerary_activities
  for all
  to authenticated
  using (day_id in (select d.id from public.itinerary_days d join public.trips t on d.trip_id = t.id where t.user_id = auth.uid()))
  with check (day_id in (select d.id from public.itinerary_days d join public.trips t on d.trip_id = t.id where t.user_id = auth.uid()));

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();