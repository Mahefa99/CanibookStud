begin;
lock table public.studs, public.stud_documents in share row exclusive mode;

create function public.has_stud_dna(listing uuid) returns boolean
language sql stable security definer set search_path='' as $$
  select exists(select 1 from public.stud_documents where stud_id=listing and kind='dna'
    and reference in ('Embark','Wisdom Panel') and status in ('pending','verified'));
$$;
revoke all on function public.has_stud_dna(uuid) from public,anon,authenticated;

create function public.enforce_stud_dna() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  if new.status='published' and not public.has_stud_dna(new.id) then
    raise exception 'Provide an Embark or Wisdom Panel DNA document before publication.' using errcode='23514';
  end if;
  return new;
end; $$;
create trigger validate_dna before insert or update on public.studs
for each row execute function public.enforce_stud_dna();

-- Synchronize changes to the evidence with publication on the parent row.
create function public.withdraw_invalid_dna() returns trigger
language plpgsql security definer set search_path='' as $$
begin
  perform 1 from public.studs where id=old.stud_id for update;
  if not public.has_stud_dna(old.stud_id) then
    update public.studs set status='draft' where id=old.stud_id and status='published';
  end if;
  return null;
end; $$;
create trigger recheck_dna after update or delete on public.stud_documents
for each row when(old.kind='dna') execute function public.withdraw_invalid_dna();

update public.studs set status='draft' where status='published' and not public.has_stud_dna(id);
commit;
