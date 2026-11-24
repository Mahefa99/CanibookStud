begin;
-- Separate evidence from case metadata so listing the queue never fetches images.
create table public.kyc_evidence (
  case_id uuid not null references public.kyc_cases(id) on delete cascade,
  kind text not null check (kind in ('selfie','identity')),
  content bytea not null check (octet_length(content) between 12 and 1048576),
  primary key(case_id,kind)
);
alter table public.kyc_evidence enable row level security;
revoke all on public.kyc_evidence from public, anon, authenticated;
grant select on public.kyc_evidence to authenticated;
create policy case_participant_reads_evidence on public.kyc_evidence for select to authenticated
using (exists (select 1 from public.kyc_cases c where c.id=case_id
  and (c.profile_id=(select auth.uid()) or (select public.is_platform_admin()))));

create function public.submit_identity_evidence(selfie text, identity_image text) returns uuid
language plpgsql security definer set search_path = '' as $$
declare applicant uuid := auth.uid(); new_case uuid; picture bytea;
begin
  if applicant is null then raise exception 'Authentication required' using errcode='42501'; end if;
  perform pg_advisory_xact_lock(hashtextextended(applicant::text, 0));
  if exists(select 1 from public.kyc_cases where profile_id=applicant and status in ('approved','pending')) then
    raise exception 'An active case already exists' using errcode='23505';
  end if;
  foreach picture in array array[decode(selfie,'base64'),decode(identity_image,'base64')] loop
    if picture is null or octet_length(picture) not between 12 and 1048576 or
      (substring(picture from 1 for 3) <> decode('ffd8ff','hex') and
       substring(picture from 1 for 8) <> decode('89504e470d0a1a0a','hex')) then
      raise exception 'Invalid evidence image' using errcode='22023';
    end if;
  end loop;
  insert into public.kyc_cases(profile_id) values(applicant) returning id into new_case;
  insert into public.kyc_evidence values(new_case,'selfie',decode(selfie,'base64')),
    (new_case,'identity',decode(identity_image,'base64'));
  return new_case;
end;
$$;
revoke all on function public.submit_identity_evidence(text,text) from public,anon;
grant execute on function public.submit_identity_evidence(text,text) to authenticated;
commit;
