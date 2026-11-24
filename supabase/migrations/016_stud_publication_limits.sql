begin;
create index studs_published_owner_idx on public.studs(owner_id) where status='published';

-- An active or trialing subscription grants the paid allowance; all other accounts use Free.
create function public.stud_quota(owner_uuid uuid)
returns table(plan_name text, maximum integer, used bigint)
language sql stable security definer set search_path='' as $$
  with current_plan as (
    select coalesce((select plan from public.breeder_subscriptions
      where breeder_id=owner_uuid and status in ('active','trialing')), 'free') as name
  )
  select name, case name when 'free' then 1 when 'starter' then 3 when 'pro' then 10 end,
    (select count(*) from public.studs where owner_id=owner_uuid and status='published')
  from current_plan;
$$;
revoke all on function public.stud_quota(uuid) from public,anon,authenticated;

create function public.my_stud_quota() returns table(plan_name text, maximum integer, used bigint)
language sql stable security definer set search_path='' as $$
  select * from public.stud_quota(auth.uid()) where auth.uid() is not null;
$$;
revoke all on function public.my_stud_quota() from public,anon;
grant execute on function public.my_stud_quota() to authenticated;

create function public.check_stud_quota() returns trigger
language plpgsql security definer set search_path='' as $$
declare quota record;
begin
  if new.status <> 'published' then return new; end if;
  if tg_op='UPDATE' and old.status='published' and old.owner_id=new.owner_id then return new; end if;
  -- Serialize admission to the last slot across all listings owned by the same breeder.
  perform pg_advisory_xact_lock(hashtextextended(new.owner_id::text,16));
  select * into strict quota from public.stud_quota(new.owner_id);
  if quota.used >= quota.maximum then
    raise exception 'Published stud limit reached' using errcode='P0160';
  end if;
  return new;
end;
$$;
create trigger validate_stud_quota before insert or update of status,owner_id on public.studs
for each row execute function public.check_stud_quota();
commit;
