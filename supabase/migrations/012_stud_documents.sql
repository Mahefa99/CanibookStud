begin;
create table public.stud_documents (
  id uuid primary key default gen_random_uuid(),
  stud_id uuid not null references public.studs on delete cascade,
  kind text not null check(kind in ('dna','akc','brucellosis')),
  reference text,
  content bytea not null check(octet_length(content) between 12 and 1048576),
  status text not null default 'pending' check(status in ('pending','verified','rejected')),
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles,
  unique(stud_id,kind)
);
alter table public.stud_documents enable row level security;
revoke all on public.stud_documents from public,anon,authenticated;
grant select on public.stud_documents to authenticated;
create policy private_document_read on public.stud_documents for select to authenticated using
  ((select public.is_platform_admin()) or exists(select 1 from public.studs s where s.id=stud_id and s.owner_id=(select auth.uid())));

create function public.submit_stud_document(listing uuid, category text, image text, provider text)
returns void language plpgsql security definer set search_path='' as $$
declare s public.studs; bytes bytea; ref text;
begin
  select * into strict s from public.studs where id=listing and owner_id=auth.uid() for update;
  if category='dna' and (provider is null or provider not in ('Embark','Wisdom Panel')) then raise exception 'Unsupported provider'; end if;
  ref:=case category when 'dna' then provider when 'akc' then s.akc_number else to_char(s.brucellosis_date,'YYYY-MM-DD') end;
  if nullif(trim(ref),'') is null then raise exception 'Missing listing details'; end if;
  bytes:=decode(image,'base64');
  if not (substring(bytes from 1 for 5)=decode('255044462d','hex') or substring(bytes from 1 for 3)=decode('ffd8ff','hex')
    or substring(bytes from 1 for 8)=decode('89504e470d0a1a0a','hex')) then raise exception 'Unsupported file'; end if;
  insert into public.stud_documents(stud_id,kind,reference,content) values(listing,category,ref,bytes)
    on conflict(stud_id,kind) do update set id=excluded.id,reference=excluded.reference,content=excluded.content,
      status='pending',submitted_at=now(),reviewed_at=null,reviewed_by=null;
end; $$;

create function public.review_stud_document(document uuid,decision text) returns boolean
language plpgsql security definer set search_path='' as $$
begin
  if not public.is_platform_admin() then raise exception 'Admin required' using errcode='42501'; end if;
  update public.stud_documents set status=decision,reviewed_at=now(),reviewed_by=auth.uid()
    where id=document and status='pending' and decision in ('verified','rejected');
  return found;
end; $$;

-- Only the label and status are public. A changed registry number or test date requires new evidence.
create function public.stud_document_signals(listing uuid) returns table(kind text,status text)
language sql stable security definer set search_path='' as $$
  select d.kind, case when d.kind='brucellosis' and d.status='verified'
      and s.brucellosis_date not between (now() at time zone 'UTC')::date-13 and (now() at time zone 'UTC')::date
    then 'expired' else d.status end
  from public.stud_documents d join public.studs s on s.id=d.stud_id
  where s.id=listing and s.status='published' and d.status in ('pending','verified')
    and (d.kind<>'akc' or d.reference=s.akc_number)
    and (d.kind<>'brucellosis' or d.reference=to_char(s.brucellosis_date,'YYYY-MM-DD'));
$$;
revoke all on function public.submit_stud_document(uuid,text,text,text), public.review_stud_document(uuid,text),
  public.stud_document_signals(uuid) from public,anon,authenticated;
grant execute on function public.submit_stud_document(uuid,text,text,text),public.review_stud_document(uuid,text) to authenticated;
grant execute on function public.stud_document_signals(uuid) to anon,authenticated;
commit;
