begin;

create type public.account_activity as enum ('breeder','buyer','professional','club','sponsor','transporter');
create type public.kyc_status as enum ('pending','approved','rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (length(trim(display_name)) between 1 and 100),
  email text,
  created_at timestamptz not null default now()
);
create table public.account_activities (
  profile_id uuid not null references public.profiles(id) on delete cascade,
  activity public.account_activity not null,
  primary key (profile_id, activity)
);
create table public.kyc_cases (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  status public.kyc_status not null default 'pending',
  face_match_score numeric check (face_match_score between 0 and 100),
  created_at timestamptz not null default now(),
  check (status <> 'approved' or (face_match_score is not null and face_match_score > 90))
);
create index kyc_cases_profile_idx on public.kyc_cases(profile_id);

alter table public.profiles enable row level security;
alter table public.account_activities enable row level security;
alter table public.kyc_cases enable row level security;
revoke all on public.profiles, public.account_activities, public.kyc_cases from public, anon, authenticated;
grant select on public.profiles, public.account_activities, public.kyc_cases to authenticated;
grant update(display_name) on public.profiles to authenticated;

create policy read_own_profile on public.profiles for select to authenticated using (id = (select auth.uid()));
create policy edit_own_profile on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy read_own_activities on public.account_activities for select to authenticated
  using (profile_id = (select auth.uid()));
create policy read_own_kyc on public.kyc_cases for select to authenticated
  using (profile_id = (select auth.uid()));

-- Auth owns email. Users may choose marketplace activities, never staff permissions.
-- This trigger runs in the Auth transaction, including when email confirmation is required.
create function public.bootstrap_account() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles(id, display_name, email)
  values (new.id, coalesce(nullif(left(trim(new.raw_user_meta_data->>'display_name'),100),''),'Member'), new.email);
  insert into public.account_activities(profile_id, activity)
  select distinct new.id, allowed.activity
  from unnest(enum_range(null::public.account_activity)) as allowed(activity)
  where jsonb_typeof(new.raw_user_meta_data->'activities') = 'array'
    and (new.raw_user_meta_data->'activities') ? allowed.activity::text;
  return new;
end;
$$;
revoke all on function public.bootstrap_account() from public, anon, authenticated;
create trigger bootstrap_canibook_account after insert on auth.users
for each row execute function public.bootstrap_account();

create function public.sync_profile_email() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.profiles set email = new.email where id = new.id;
  return new;
end;
$$;
revoke all on function public.sync_profile_email() from public, anon, authenticated;
create trigger sync_canibook_email after update of email on auth.users
for each row when (old.email is distinct from new.email) execute function public.sync_profile_email();

-- Provision accounts that predate the application schema.
insert into public.profiles (id,display_name,email)
select id, coalesce(nullif(left(trim(raw_user_meta_data->>'display_name'),100),''),'Member'), email
from auth.users on conflict (id) do nothing;
insert into public.account_activities(profile_id,activity)
select u.id, a.activity from auth.users u
cross join unnest(enum_range(null::public.account_activity)) as a(activity)
where jsonb_typeof(u.raw_user_meta_data->'activities')='array'
  and (u.raw_user_meta_data->'activities') ? a.activity::text
on conflict do nothing;
commit;
