begin;

alter table public.reservations
  add column release_started_at timestamptz,
  add column release_destination text,
  add column transfer_id text unique,
  add column completed_at timestamptz,
  add constraint reservation_release_state check (
    (release_started_at is null) = (release_destination is null)
    and (completed_at is null) = (transfer_id is null)
    and (completed_at is null or release_started_at is not null)
    and (release_started_at is null or status = 'paid')
  );

-- Lock the amount's reservation and snapshot the recipient once for all retries.
create function public.claim_release(reservation uuid, breeder uuid)
returns void language plpgsql set search_path = '' as $$
declare
  item public.reservations;
  destination text;
begin
  select * into strict item from public.reservations
    where id = reservation and breeder_id = breeder for update;
  if item.status <> 'paid' or item.deposit_cents <= item.platform_fee_cents
     or (item.litter_id is not null and now() < item.paid_at + interval '48 hours') then
    raise exception 'Reservation is not eligible for release';
  end if;
  if item.release_started_at is null then
    select stripe_account_id into strict destination from public.stripe_connect_accounts
      where breeder_id = breeder and onboarding_complete and stripe_account_id is not null;
    update public.reservations set release_started_at = now(), release_destination = destination
      where id = reservation;
  end if;
end;
$$;
revoke all on function public.claim_release(uuid,uuid) from public, anon, authenticated;
grant execute on function public.claim_release(uuid,uuid) to service_role;
commit;
