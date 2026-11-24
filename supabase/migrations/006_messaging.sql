begin;

grant delete on public.reservations to service_role;

alter table public.reservations alter column stud_id drop not null,
  add column litter_id uuid references public.litters(id),
  add column puppy_number integer,
  add constraint reservation_animal check (
    (stud_id is not null and litter_id is null and puppy_number is null) or
    (stud_id is null and litter_id is not null and puppy_number is not null and puppy_number > 0)
  ), add unique(litter_id, puppy_number);

-- The ordinal is the stable identity of a puppy within its litter.
create function public.claim_puppy(listing uuid, puppy integer, buyer uuid, fee integer)
returns uuid language plpgsql security invoker set search_path='' as $$
declare l public.litters; r public.reservations;
begin
  select * into strict l from public.litters where id=listing for update;
  if l.status <> 'published' or l.expires_at <= now() or
     l.birth_date > (now() at time zone 'UTC')::date - 56 or
     puppy not between 1 and l.puppy_count or buyer=l.breeder_id or fee<0 or
     not exists(select 1 from public.stripe_connect_accounts a where a.breeder_id=l.breeder_id
       and a.onboarding_complete and a.stripe_account_id is not null) then
    raise exception 'Puppy unavailable';
  end if;
  insert into public.reservations(litter_id,puppy_number,buyer_id,breeder_id,deposit_cents,platform_fee_cents)
  values(listing,puppy,buyer,l.breeder_id,l.puppy_price+fee,fee)
  on conflict(litter_id,puppy_number) do nothing;
  select * into strict r from public.reservations where litter_id=listing and puppy_number=puppy;
  if r.buyer_id<>buyer or r.breeder_id<>l.breeder_id then raise exception 'Puppy unavailable'; end if;
  return r.id;
end;
$$;
revoke all on function public.claim_puppy(uuid,integer,uuid,integer) from public,anon,authenticated;
grant execute on function public.claim_puppy(uuid,integer,uuid,integer) to service_role;

create table public.conversations (
  id uuid primary key references public.reservations(id),
  stud_id uuid references public.studs(id), litter_id uuid references public.litters(id),
  buyer_id uuid not null references public.profiles(id), breeder_id uuid not null references public.profiles(id),
  created_at timestamptz not null default now(), check(num_nonnulls(stud_id,litter_id)=1)
);
create table public.messages (
  id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.conversations(id),
  sender_id uuid not null default auth.uid() references public.profiles(id),
  content text not null check(length(trim(content)) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index messages_thread_time on public.messages(conversation_id,created_at,id);
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
revoke all on public.conversations,public.messages from public,anon,authenticated;
grant select on public.conversations,public.messages to authenticated;
grant insert(conversation_id,content) on public.messages to authenticated;
create policy paid_participants on public.conversations for select to authenticated using (
  (select auth.uid()) in (buyer_id,breeder_id) and exists (
    select 1 from public.reservations r where r.id=conversations.id and r.status='paid'
  )
);
create policy thread_read on public.messages for select to authenticated using (
  exists(select 1 from public.conversations c where c.id=conversation_id)
);
create policy thread_send on public.messages for insert to authenticated with check (
  sender_id=(select auth.uid()) and exists(select 1 from public.conversations c where c.id=conversation_id)
);

-- Settlement and chat creation commit together. Backfill already-paid stud deposits.
create function public.open_paid_thread() returns trigger language plpgsql security definer set search_path='' as $$
begin
  insert into public.conversations(id,stud_id,litter_id,buyer_id,breeder_id)
  values(new.id,new.stud_id,new.litter_id,new.buyer_id,new.breeder_id) on conflict(id) do nothing;
  return new;
end;
$$;
revoke all on function public.open_paid_thread() from public,anon,authenticated;
create trigger paid_thread after insert or update of status on public.reservations
for each row when(new.status='paid') execute function public.open_paid_thread();
insert into public.conversations(id,stud_id,litter_id,buyer_id,breeder_id)
select id,stud_id,litter_id,buyer_id,breeder_id from public.reservations where status='paid';

-- Only the verified buyer can request contact details for this specific paid reservation.
create function public.breeder_contact(thread uuid) returns table(email text,phone text)
language sql stable security definer set search_path='' as $$
  select u.email::text,nullif(u.phone,'')::text from public.reservations r
  join auth.users u on u.id=r.breeder_id
  where r.id=thread and r.status='paid' and r.buyer_id=(select auth.uid());
$$;
revoke all on function public.breeder_contact(uuid) from public,anon;
grant execute on function public.breeder_contact(uuid) to authenticated;
commit;

