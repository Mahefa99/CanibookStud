begin;
create table public.breeder_licenses (
  id uuid primary key default gen_random_uuid(),
  breeder_id uuid not null unique references public.profiles(id) on delete cascade,
  license_number text not null check(length(trim(license_number)) between 1 and 100),
  content bytea not null check(octet_length(content) between 12 and 1048576),
  status text not null default 'pending' check(status in ('pending','verified','rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  review_note text
);
alter table public.breeder_licenses enable row level security;
revoke all on public.breeder_licenses from public,anon,authenticated;
grant select on public.breeder_licenses to authenticated;
create policy license_private_read on public.breeder_licenses for select to authenticated
using (breeder_id=(select auth.uid()) or (select public.is_platform_admin()));

create function public.submit_breeder_license(number_text text, document text) returns void
language plpgsql security definer set search_path='' as $$
declare bytes bytea;
begin
  if not exists(select 1 from public.account_activities where profile_id=auth.uid() and activity='breeder')
    then raise exception 'Breeder account required' using errcode='42501'; end if;
  bytes:=decode(document,'base64');
  if not (substring(bytes from 1 for 5)=decode('255044462d','hex') or substring(bytes from 1 for 3)=decode('ffd8ff','hex')
    or substring(bytes from 1 for 8)=decode('89504e470d0a1a0a','hex')) then raise exception 'Unsupported file'; end if;
  insert into public.breeder_licenses(breeder_id,license_number,content) values(auth.uid(),trim(number_text),bytes)
    on conflict(breeder_id) do update set id=excluded.id,license_number=excluded.license_number,content=excluded.content,
    status='pending',submitted_at=now(),reviewed_by=null,reviewed_at=null,review_note=null;
end; $$;
create function public.review_breeder_license(document_id uuid,decision text,note text) returns boolean
language plpgsql security definer set search_path='' as $$
begin
  if not public.is_platform_admin() then raise exception 'Admin required' using errcode='42501'; end if;
  update public.breeder_licenses set status=decision,reviewed_at=now(),reviewed_by=auth.uid(),review_note=trim(note)
    where id=document_id and breeder_id<>auth.uid() and status='pending' and decision in ('verified','rejected')
    and length(trim(note)) between 1 and 500;
  return found;
end; $$;
revoke all on function public.submit_breeder_license(text,text),public.review_breeder_license(uuid,text,text) from public,anon,authenticated;
grant execute on function public.submit_breeder_license(text,text),public.review_breeder_license(uuid,text,text) to authenticated;
commit;
