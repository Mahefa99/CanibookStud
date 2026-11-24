begin;

create table public.stripe_connect_accounts (
  breeder_id uuid primary key references public.profiles(id),
  stripe_account_id text unique,
  created_at timestamptz not null default now(),
  onboarding_complete boolean not null default false
);

create table public.reservations (
  id uuid primary key default gen_random_uuid(),
  stud_id uuid not null references public.studs(id),
  buyer_id uuid not null references public.profiles(id),
  breeder_id uuid not null references public.profiles(id),
  deposit_cents integer not null check (deposit_cents > 0),
  platform_fee_cents integer not null check (platform_fee_cents between 0 and deposit_cents),
  currency text not null default 'usd' check (currency = 'usd'),
  payment_intent_id text unique,
  status text not null default 'pending' check (status in ('pending','paid')),
  paid_at timestamptz,
  check (buyer_id <> breeder_id),
  check ((status = 'paid') = (paid_at is not null)),
  check (status <> 'paid' or payment_intent_id is not null)
);
alter table public.stripe_connect_accounts enable row level security;
alter table public.reservations enable row level security;
revoke all on public.stripe_connect_accounts, public.reservations from public, anon, authenticated;
grant select on public.stripe_connect_accounts, public.reservations to authenticated;
grant select,insert,update on public.stripe_connect_accounts, public.reservations to service_role;
create policy connect_owner_read on public.stripe_connect_accounts for select to authenticated
using (breeder_id = (select auth.uid()));
create policy reservation_party_read on public.reservations for select to authenticated
using ((select auth.uid()) in (buyer_id,breeder_id));

-- A repeated signed event locks the same row and preserves the original paid_at.
create function public.confirm_stud_deposit(reservation_id uuid, intent_id text, received integer, paid_currency text)
returns void language plpgsql security invoker set search_path = '' as $$
declare item public.reservations;
begin
  select * into strict item from public.reservations where id = reservation_id for update;
  if item.payment_intent_id is distinct from intent_id or item.deposit_cents <> received
     or item.currency <> paid_currency then
    raise exception 'Reservation and payment do not match';
  end if;
  if item.status = 'pending' then
    update public.reservations set status='paid', paid_at=now() where id=item.id;
  end if;
end;
$$;
revoke all on function public.confirm_stud_deposit(uuid,text,integer,text) from public, anon, authenticated;
grant execute on function public.confirm_stud_deposit(uuid,text,integer,text) to service_role;
commit;
