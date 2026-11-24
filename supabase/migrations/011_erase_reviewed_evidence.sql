begin;

alter table public.kyc_cases add column evidence_deleted_at timestamptz;

-- Serialize erasure with review. Keep the original decision and its timestamp.
create function public.erase_reviewed_evidence(target uuid) returns boolean
language plpgsql security definer set search_path = '' as $$
declare
  item public.kyc_cases;
begin
  select * into item from public.kyc_cases
    where id = target and profile_id = auth.uid() for update;
  if not found or item.status not in ('approved','rejected') then return false; end if;
  if item.evidence_deleted_at is not null then return true; end if;
  delete from public.kyc_evidence where case_id = item.id;
  if not found then return false; end if;
  update public.kyc_cases set evidence_deleted_at = now() where id = item.id;
  return true;
end;
$$;
revoke all on function public.erase_reviewed_evidence(uuid) from public, anon;
grant execute on function public.erase_reviewed_evidence(uuid) to authenticated;
commit;
