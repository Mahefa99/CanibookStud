begin;
create table public.sponsor_slots (
 id uuid primary key default gen_random_uuid(),
 club_id uuid not null references public.profiles(id),
 event_name text not null check(length(trim(event_name)) between 1 and 100),
 placement text not null check(length(trim(placement)) between 1 and 100),
 slot_day date not null
);
create unique index sponsor_slot_inventory on public.sponsor_slots
 (club_id,lower(trim(event_name)),lower(trim(placement)),slot_day);
create table public.sponsor_requests (
 id uuid primary key default gen_random_uuid(),
 slot_id uuid not null references public.sponsor_slots(id),
 sponsor_id uuid not null references public.profiles(id),
 status text not null default 'held' check(status in ('held','pending','accepted','declined','expired')),
 deadline timestamptz not null,
 proposal text check(length(trim(proposal)) between 1 and 2000)
);
create unique index one_sponsor_per_slot on public.sponsor_requests(slot_id)
 where status in ('held','pending','accepted');
alter table public.sponsor_slots enable row level security;
alter table public.sponsor_requests enable row level security;
revoke all on public.sponsor_slots,public.sponsor_requests from public,anon,authenticated;
grant select on public.sponsor_slots,public.sponsor_requests to authenticated;
grant insert(club_id,event_name,placement,slot_day) on public.sponsor_slots to authenticated;
create policy slots_read on public.sponsor_slots for select to authenticated using(true);
create policy club_creates_inventory on public.sponsor_slots for insert to authenticated with check(
 club_id=auth.uid() and slot_day >= (now() at time zone 'UTC')::date and
 exists(select 1 from public.account_activities where profile_id=auth.uid() and activity='club'));
create policy parties_read_proposal on public.sponsor_requests for select to authenticated using(
 sponsor_id=auth.uid() or exists(select 1 from public.sponsor_slots s where s.id=slot_id and s.club_id=auth.uid()));

create function public.hold_sponsor_slot(slot uuid) returns uuid language plpgsql security definer set search_path='' as $$
declare s public.sponsor_slots; r public.sponsor_requests; t timestamptz;
begin
 select * into strict s from public.sponsor_slots where id=slot for update;
 t:=clock_timestamp();
 if s.club_id=auth.uid() or s.slot_day<(t at time zone 'UTC')::date or not exists
 (select 1 from public.account_activities where profile_id=auth.uid() and activity='sponsor')
 then raise exception 'Unavailable' using errcode='42501'; end if;
 update public.sponsor_requests set status='expired' where slot_id=slot and status in ('held','pending') and deadline<=t;
 select * into r from public.sponsor_requests where slot_id=slot and status in ('held','pending','accepted');
 if found then
   if r.sponsor_id=auth.uid() and r.status='held' then return r.id; end if;
   raise exception 'Slot unavailable' using errcode='23505';
 end if;
 insert into public.sponsor_requests(slot_id,sponsor_id,deadline) values(slot,auth.uid(),t+interval '15 minutes') returning id into r.id;
 return r.id;
end; $$;

create function public.advance_sponsor_request(request_id uuid, action_name text, message text)
returns boolean language plpgsql security definer set search_path='' as $$
declare s public.sponsor_slots; r public.sponsor_requests; t timestamptz;
begin
 select slots.* into strict s from public.sponsor_slots slots join public.sponsor_requests q on q.slot_id=slots.id
 where q.id=request_id and auth.uid() in (slots.club_id,q.sponsor_id) for update of slots;
 select * into strict r from public.sponsor_requests where id=request_id for update;
 t:=clock_timestamp();
 if r.status in ('pending','held') and (r.deadline<=t or s.slot_day<(t at time zone 'UTC')::date) then
   update public.sponsor_requests set status='expired' where id=r.id; return false;
 end if;
 if r.status='held' and r.sponsor_id=auth.uid() and action_name='submit' and length(trim(message)) between 1 and 2000 then
   update public.sponsor_requests set proposal=trim(message),status='pending',deadline=t+interval '168 hours' where id=r.id;
 elsif r.status='pending' and s.club_id=auth.uid() and action_name in ('accepted','declined') then
   update public.sponsor_requests set status=action_name where id=r.id;
 else return false;
 end if;
 return true;
end; $$;

-- Public inventory exposes availability only; expired requests never block a calendar read.
create function public.sponsor_calendar(day_filter date) returns table(slot uuid,event_name text,placement text,available boolean)
language sql stable security definer set search_path='' as $$
 select s.id,s.event_name,s.placement,not exists(select from public.sponsor_requests r where r.slot_id=s.id
 and (r.status='accepted' or (r.status in ('held','pending') and r.deadline>now())))
 from public.sponsor_slots s where s.slot_day=day_filter and day_filter>=(now() at time zone 'UTC')::date
 order by s.event_name,s.placement,s.id;
$$;
revoke all on function public.hold_sponsor_slot(uuid),public.advance_sponsor_request(uuid,text,text),public.sponsor_calendar(date) from public,anon,authenticated;
grant execute on function public.hold_sponsor_slot(uuid),public.advance_sponsor_request(uuid,text,text) to authenticated;
grant execute on function public.sponsor_calendar(date) to authenticated,anon;
commit;
