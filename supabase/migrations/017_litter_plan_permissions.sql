begin;
-- The database owns the introductory period, including for older clients
-- that still send an expiry timestamp. Only a trusted billing writer can upgrade a litter.
create function public.guard_litter_plan() returns trigger
language plpgsql security invoker set search_path='' as $$
begin
  if current_user in ('authenticated','anon') then
    if tg_op='INSERT' then
      if new.listing_type <> 'free' then
        raise exception 'Premium placement requires confirmed payment' using errcode='42501';
      end if;
      new.expires_at := now() + interval '7 days';
    elsif new.listing_type is distinct from old.listing_type or new.expires_at is distinct from old.expires_at then
      raise exception 'Listing plan and expiration are managed by billing' using errcode='42501';
    end if;
  end if;
  return new;
end; $$;
create trigger guard_litter_plan before insert or update of listing_type,expires_at on public.litters
for each row execute function public.guard_litter_plan();
alter table public.litters alter column expires_at set default (now() + interval '7 days');
commit;
