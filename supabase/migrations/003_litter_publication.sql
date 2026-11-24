begin;

alter table public.litters add column photos text[] not null default '{}'
  check (cardinality(photos) <= 4);

-- Preserve existing records. Underage legacy listings return to private drafts.
update public.litters set status = 'draft'
where status = 'published' and birth_date > (now() at time zone 'UTC')::date - 56;

create function public.validate_litter_publication() returns trigger
language plpgsql set search_path = '' as $$
begin
  if new.status = 'published' and new.birth_date > (now() at time zone 'UTC')::date - 56 then
    raise exception 'Puppies must be at least 56 days old.' using errcode = '23514';
  end if;
  if exists (select 1 from unnest(new.photos) as path
    where path is null or split_part(path,'/',1) <> new.breeder_id::text
      or split_part(path,'/',2) <> new.id::text) then
    raise exception 'Invalid litter photo path.' using errcode = '23514';
  end if;
  return new;
end;
$$;
create trigger validate_litter before insert or update on public.litters
for each row execute function public.validate_litter_publication();

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('litter-photos','litter-photos',false,1048576,array['image/jpeg','image/png','image/webp']);

create policy litter_photos_upload on storage.objects for insert to authenticated
with check (bucket_id='litter-photos' and split_part(name,'/',1)=(select auth.uid())::text);
create policy litter_photos_owner_read on storage.objects for select to authenticated
using (bucket_id='litter-photos' and split_part(name,'/',1)=(select auth.uid())::text);
create policy litter_photos_owner_delete on storage.objects for delete to authenticated
using (bucket_id='litter-photos' and split_part(name,'/',1)=(select auth.uid())::text);
create policy litter_photos_listing_read on storage.objects for select to anon, authenticated
using (bucket_id='litter-photos' and exists (
  select 1 from public.litters l where l.id::text = split_part(storage.objects.name,'/',2)
    and storage.objects.name = any(l.photos) and l.status='published'
    and (l.expires_at is null or l.expires_at > now())
));
commit;
