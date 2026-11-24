import { createClient } from "@/src/lib/supabase/server";
import { formatUsdCents } from "@/src/lib/money";
import { ReleaseForm } from "./release-form";

export async function BreederReservations() {
  const db = createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) return null;
  const { data, error } = await db.from("reservations")
    .select("id,stud_id,puppy_number,deposit_cents,platform_fee_cents,paid_at,completed_at")
    .eq("breeder_id", user.id).eq("status", "paid").order("paid_at", { ascending: false });
  if (error) throw new Error("Unable to load reservations.");
  return <section className="space-y-4"><h1 className="font-display text-3xl">Paid reservations</h1>
    {!data.length && <p>No paid reservations yet.</p>}
    {data.map(row => {
      const available = Date.parse(row.paid_at ?? "") + (row.stud_id ? 0 : 48 * 3600000);
      return <article key={row.id} className="surface space-y-2 p-4">
        <h2>{row.stud_id ? "Stud deposit" : "Puppy #" + row.puppy_number}</h2>
        <p>Reservation {row.id}</p>
        <p>Breeder proceeds {formatUsdCents(row.deposit_cents - row.platform_fee_cents)}</p>
        {row.completed_at ? <p>Completed — funds released</p> : Date.now() >= available
          ? <ReleaseForm id={row.id} stud={Boolean(row.stud_id)} />
          : <p>Available from {new Date(available).toUTCString()}</p>}
      </article>;
    })}
  </section>;
}
