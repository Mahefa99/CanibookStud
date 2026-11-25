begin;
create table public.breeder_subscriptions (
  id uuid primary key default gen_random_uuid(),
  breeder_id uuid not null references public.profiles(id),
  plan text not null check(plan in ('starter','pro','unlimited')),
  cadence text not null check(cadence in ('month','year')),
  price_id text not null,
  created_at timestamptz not null default now(),
  checkout_id text unique,
  subscription_id text unique,
  status text not null default 'checkout' check(status in
    ('checkout','expired','incomplete','incomplete_expired','trialing','active','past_due','canceled','unpaid','paused')),
  revision integer not null default 0
);
create unique index one_open_breeder_subscription on public.breeder_subscriptions(breeder_id)
  where status not in ('expired','incomplete_expired','canceled');
alter table public.breeder_subscriptions enable row level security;
revoke all on public.breeder_subscriptions from public,anon,authenticated;
grant select on public.breeder_subscriptions to authenticated;
grant select,insert,update on public.breeder_subscriptions to service_role;
create policy read_own_subscription on public.breeder_subscriptions for select to authenticated
using (breeder_id=(select auth.uid()));
commit;
