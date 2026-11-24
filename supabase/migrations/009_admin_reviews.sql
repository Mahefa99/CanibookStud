begin;
create function public.is_platform_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists(select 1 from auth.users u where u.id = auth.uid()
    and u.raw_app_meta_data->>'role' = 'admin');
$$;
revoke all on function public.is_platform_admin() from public,anon;
grant execute on function public.is_platform_admin() to authenticated;
create policy admin_read_profiles on public.profiles for select to authenticated using ((select public.is_platform_admin()));
create policy admin_read_cases on public.kyc_cases for select to authenticated using ((select public.is_platform_admin()));
create policy admin_read_reservations on public.reservations for select to authenticated using ((select public.is_platform_admin()));

alter table public.kyc_cases add column reviewed_by uuid references public.profiles(id),
  add column reviewed_at timestamptz, add column review_note text;

-- The pending predicate serializes competing reviews. The reviewer cannot edit the score.
create function public.review_kyc(case_id uuid, decision public.kyc_status, note text)
returns boolean language plpgsql security definer set search_path = '' as $$
begin
  if not public.is_platform_admin() then
    raise exception 'Admin access required' using errcode='42501';
  end if;
  if decision not in ('approved','rejected') or note is null or length(trim(note)) not between 1 and 500 then
    return false;
  end if;
  update public.kyc_cases set status=decision,reviewed_at=now(),reviewed_by=auth.uid(),review_note=trim(note)
    where id=case_id and status='pending' and (decision='rejected' or face_match_score>90);
  return found;
end;
$$;
revoke all on function public.review_kyc(uuid,public.kyc_status,text) from public,anon;
grant execute on function public.review_kyc(uuid,public.kyc_status,text) to authenticated;
commit;
