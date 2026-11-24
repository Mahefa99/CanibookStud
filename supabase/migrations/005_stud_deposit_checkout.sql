begin;
-- One checkout per buyer and stud during the pending/paid reservation lifecycle.
create unique index reservations_buyer_stud_idx on public.reservations(buyer_id, stud_id);
commit;
