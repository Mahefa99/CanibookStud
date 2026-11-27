begin;
create table public.females (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null default auth.uid() references public.profiles on delete cascade,
 name text not null check(name ~ '^[[:alpha:] ''-]{1,60}$'), breed text not null check(breed ~ '^[[:alpha:] ''-]{1,80}$'),
 birth_date date not null check(birth_date<=current_date),
 city text not null check(city in ('Asheville, NC','Austin, TX','Boulder, CO','Charleston, SC','Indianapolis, IN','Madison, WI','Miami, FL','Omaha, NE','Portland, ME','Seattle, WA')),
 pedigree_verified boolean not null default false,
 health text not null check(health in ('Not provided','Screening pending','Screening completed')),
 vaccines text not null check(vaccines in ('Not provided','Up to date','Update pending')),
 brucellosis_date date check(brucellosis_date<=current_date),
 availability text not null check(availability in ('Available','In heat soon','Unavailable')),
 visible boolean not null default false,
 -- A fixed-size RGB thumbnail cannot carry EXIF, original filenames or GPS metadata.
 photo_rgb text not null check(length(photo_rgb)=307200 and photo_rgb !~ '[^A-Za-z0-9+/]')
);
alter table public.females enable row level security;
revoke all on public.females from public,anon,authenticated;
grant select on public.females to anon,authenticated;
grant insert(name,breed,birth_date,city,health,vaccines,brucellosis_date,availability,photo_rgb) on public.females to authenticated;
grant update(visible,availability) on public.females to authenticated;
create policy female_public on public.females for select using(visible);
create policy female_owner on public.females for all to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());

create table public.mating_proposals (
 id uuid primary key default gen_random_uuid(), female_id uuid not null references public.females on delete cascade,
 stud_id uuid not null references public.studs on delete cascade, female_owner uuid not null references public.profiles,
 stud_owner uuid not null references public.profiles, female_name text not null, stud_name text not null,
 status text not null check(status in ('awaiting_stud','awaiting_female','accepted','declined')),
 created_at timestamptz not null default now()
);
create unique index mating_open_pair on public.mating_proposals(female_id,stud_id) where status<>'declined';
alter table public.mating_proposals enable row level security;
revoke all on public.mating_proposals from public,anon,authenticated;
grant select on public.mating_proposals to authenticated;
create policy mating_participants on public.mating_proposals for select to authenticated using(auth.uid() in (female_owner,stud_owner));

create function public.propose_mating(f uuid,s uuid) returns void language plpgsql security definer set search_path='' as $$
declare dam public.females; male public.studs; actor uuid:=auth.uid();
begin
 select * into strict dam from public.females where id=f and (visible or owner_id=actor) and availability<>'Unavailable' for share;
 select * into strict male from public.studs where id=s and status='published' and brucellosis_date between current_date-13 and current_date for share;
 if actor is null or actor not in (dam.owner_id,male.owner_id) or dam.owner_id=male.owner_id then raise exception 'Unavailable'; end if;
 insert into public.mating_proposals(female_id,stud_id,female_owner,stud_owner,female_name,stud_name,status)
 values(f,s,dam.owner_id,male.owner_id,dam.name,male.name,case when actor=dam.owner_id then 'awaiting_stud' else 'awaiting_female' end);
end $$;
create function public.decide_mating(p uuid,approve boolean) returns void language plpgsql security definer set search_path='' as $$
begin
 update public.mating_proposals set status=case when not approve then 'declined' when status='awaiting_stud' then 'awaiting_female' else 'accepted' end
 where id=p and approve is not null and ((status='awaiting_stud' and stud_owner=auth.uid()) or (status='awaiting_female' and female_owner=auth.uid()));
 if not found then raise exception 'Decision unavailable'; end if;
end $$;
revoke all on function public.propose_mating(uuid,uuid),public.decide_mating(uuid,boolean) from public,anon;
grant execute on function public.propose_mating(uuid,uuid),public.decide_mating(uuid,boolean) to authenticated;
commit;
