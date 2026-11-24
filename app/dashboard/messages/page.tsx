import { PaidThreads } from "@/src/features/messaging/components/paid-threads";
import { createClient } from "@/src/lib/supabase/server";
import { cancelPuppyCheckout } from "@/src/features/payments/actions/cancel-puppy-checkout";

export default async function MessagesPage() {
  const db=createClient();
  const {data:{user}}=await db.auth.getUser();
  const pending=user ? await db.from("reservations").select("id,puppy_number")
    .eq("buyer_id",user.id).eq("status","pending").not("litter_id","is",null)
    .not("payment_intent_id","is",null) : null;
  return <section className="space-y-4"><h1 className="font-display text-4xl">Messages</h1>
    <PaidThreads />
    {pending?.data?.map(r=><form key={r.id} action={cancelPuppyCheckout}>
      <input type="hidden" name="reservation" value={r.id} />
      <button className="underline">Cancel unpaid checkout for puppy #{r.puppy_number} · {r.id.slice(0,8)}</button>
    </form>)}
  </section>;
}
