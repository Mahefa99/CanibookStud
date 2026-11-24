begin;

create table public.reservation_contracts (
  id uuid primary key references public.reservations(id),
  buyer_id uuid not null references public.profiles(id),
  breeder_id uuid not null references public.profiles(id),
  issued_at timestamptz not null,
  terms text[] not null,
  pdf bytea not null
);
create table public.contract_signatures (
  contract_id uuid not null references public.reservation_contracts(id),
  signer_id uuid not null references public.profiles(id),
  signed_at timestamptz not null default now(),
  signer_ip inet not null,
  primary key(contract_id, signer_id)
);
alter table public.reservation_contracts enable row level security;
alter table public.contract_signatures enable row level security;
revoke all on public.reservation_contracts, public.contract_signatures from public, anon, authenticated;
grant select on public.reservation_contracts, public.contract_signatures to authenticated;
create policy participants_read_contract on public.reservation_contracts for select to authenticated
using ((select auth.uid()) in (buyer_id, breeder_id));
create policy participants_read_signatures on public.contract_signatures for select to authenticated
using (exists (select 1 from public.reservation_contracts c where c.id = contract_id));

-- Single US Letter page. Inputs are fixed English terms and normalized database identifiers.
create function public.render_contract_pdf(lines text[]) returns bytea
language plpgsql immutable set search_path = '' as $$
declare
  body text := E'BT /F1 10 Tf 14 TL 44 744 Td\n';
  doc text := E'%PDF-1.4\n';
  objects text[];
  offsets integer[] := '{}';
  part text;
  idx integer;
  xref integer;
begin
  foreach part in array lines loop
    body := body || '(' || replace(replace(replace(part, chr(92),chr(92)||chr(92)),'(',chr(92)||'('),')',chr(92)||')') || E') Tj T*\n';
  end loop;
  body := body || 'ET';
  objects := array['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Length '||octet_length(body)||E' >>\nstream\n'||body||E'\nendstream'];
  for idx in 1..5 loop
    offsets := array_append(offsets,octet_length(doc));
    doc := doc || idx || E' 0 obj\n' || objects[idx] || E'\nendobj\n';
  end loop;
  xref := octet_length(doc);
  doc := doc || E'xref\n0 6\n0000000000 65535 f \n';
  foreach idx in array offsets loop
    doc := doc || lpad(idx::text,10,'0') || E' 00000 n \n';
  end loop;
  return convert_to(doc || E'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' || xref || E'\n%%EOF\n','UTF8');
end;
$$;

create function public.issue_paid_contract(r public.reservations) returns void
language plpgsql security definer set search_path = '' set timezone = 'UTC' as $$
declare lines text[];
begin
  if r.status <> 'paid' then return; end if;
  lines := array[
    'CanibookStud - Reservation agreement (v1)', 'Reservation: '||r.id,
    'Payment confirmed (UTC): '||r.paid_at, 'Buyer account: '||r.buyer_id,
    'Breeder account: '||r.breeder_id,
    case when r.stud_id is not null then 'Stud deposit - listing: '||r.stud_id
      else 'Puppy #'||r.puppy_number||' - litter: '||r.litter_id end,
    'Total paid: USD '||round(r.deposit_cents/100.0,2),
    'Included platform fee: USD '||round(r.platform_fee_cents/100.0,2),
    '', 'The buyer and breeder agree to the reservation identified above.',
    'CanibookStud facilitates the reservation and is not a party to this agreement.',
    'Pickup or other arrangements must be agreed between the parties.',
    'Payment and signatures are recorded separately.'
  ];
  insert into public.reservation_contracts values
    (r.id,r.buyer_id,r.breeder_id,r.paid_at,lines,public.render_contract_pdf(lines))
    on conflict(id) do nothing;
end;
$$;
create function public.on_paid_contract() returns trigger language plpgsql
security definer set search_path = '' as $$
begin perform public.issue_paid_contract(new); return new; end;
$$;
create trigger issue_contract after insert or update of status on public.reservations
for each row when (new.status = 'paid') execute function public.on_paid_contract();
select public.issue_paid_contract(r) from public.reservations r where r.status='paid';

-- Only the trusted server supplies the verified session identity and client IP.
create function public.sign_contract(contract uuid, signer uuid, address inet) returns void
language plpgsql security definer set search_path = '' set timezone = 'UTC' as $$
declare c public.reservation_contracts; signatures text[];
begin
  select * into strict c from public.reservation_contracts where id=contract
    and signer in (buyer_id,breeder_id) for update;
  insert into public.contract_signatures(contract_id,signer_id,signer_ip) values(contract,signer,address)
    on conflict do nothing;
  select array_agg(line order by s.signed_at,s.signer_id,entry.ord) into signatures
    from public.contract_signatures s cross join lateral unnest(array[
      case when s.signer_id=c.buyer_id then 'Buyer' else 'Breeder' end || ' electronically signed: ' || s.signed_at,
      'Account: '||s.signer_id, 'IP: '||host(s.signer_ip)
    ]) with ordinality as entry(line,ord) where s.contract_id=contract;
  update public.reservation_contracts set pdf=public.render_contract_pdf(c.terms||signatures) where id=contract;
end;
$$;
revoke all on function public.issue_paid_contract(public.reservations), public.on_paid_contract(),
  public.render_contract_pdf(text[]), public.sign_contract(uuid,uuid,inet) from public,anon,authenticated;
grant execute on function public.sign_contract(uuid,uuid,inet) to service_role;
commit;
