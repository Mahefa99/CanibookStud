begin;

create type public.listing_status as enum ('draft', 'published');
create type public.litter_listing_type as enum ('free', 'premium');

create table public.studs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  breed text not null check (length(trim(breed)) > 0),
  akc_number text,
  brucellosis_date date,
  ofa_url text,
  photos text[] not null default '{}',
  price integer not null check (price >= 0), -- USD cents
  status public.listing_status not null default 'draft',
  lat double precision not null check (lat between -90 and 90),
  lng double precision not null check (lng between -180 and 180)
);

-- Publication must be validated on writes, independently of the Supabase client.
create function public.check_stud_publication() returns trigger
language plpgsql set search_path = '' as $$
declare today date := (now() at time zone 'UTC')::date;
begin
  if new.status = 'published' and (
    coalesce(new.akc_number, '') !~ '[^[:space:]]' or new.brucellosis_date is null
    or new.brucellosis_date not between today - 13 and today
  ) then
    raise exception 'Publication requires an AKC number and a brucellosis test aged 0 to 13 days.' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger validate_stud before insert or update on public.studs
for each row execute function public.check_stud_publication();
comment on column public.studs.lat is 'Public offset from city center, computed before insert.';
comment on column public.studs.lng is 'Public offset from city center, computed before insert.';

create table public.litters (
  id uuid primary key default gen_random_uuid(),
  breeder_id uuid not null references public.profiles(id) on delete cascade,
  breed text not null check (length(trim(breed)) > 0),
  birth_date date not null,
  puppy_count integer not null check (puppy_count > 0),
  puppy_price integer not null check (puppy_price >= 0), -- USD cents
  listing_type public.litter_listing_type not null default 'free',
  status public.listing_status not null default 'draft',
  expires_at timestamptz,
  check (status = 'draft' or listing_type <> 'free' or expires_at is not null)
);
create index studs_owner_idx on public.studs(owner_id);
create index litters_breeder_idx on public.litters(breeder_id);

alter table public.studs enable row level security;
alter table public.litters enable row level security;
revoke all on public.studs, public.litters from public, anon, authenticated;
grant select on public.studs, public.litters to anon, authenticated;
grant insert, update, delete on public.studs, public.litters to authenticated;

-- Recheck the moving window on reads even if the row has not been updated.
create policy studs_public on public.studs for select to anon, authenticated
  using (status = 'published' and brucellosis_date between
    (now() at time zone 'UTC')::date - 13 and (now() at time zone 'UTC')::date);
create policy studs_owner on public.studs for all to authenticated
  using (owner_id = (select auth.uid())) with check (owner_id = (select auth.uid()));

create policy litters_public on public.litters for select to anon, authenticated
  using (status = 'published' and (expires_at is null or expires_at > now()));
create policy litters_owner on public.litters for all to authenticated
  using (breeder_id = (select auth.uid())) with check (breeder_id = (select auth.uid()));

commit;

