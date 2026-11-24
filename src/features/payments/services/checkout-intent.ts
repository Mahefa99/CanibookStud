import "server-only";
import type Stripe from "stripe";
import type { Database } from "@/src/types/database";
import type { paymentsAdmin } from "@/src/lib/supabase/payments-admin";

export async function checkoutIntent(row: Database["public"]["Tables"]["reservations"]["Row"],
  purpose: "puppy_purchase" | "stud_deposit", stripe: Stripe, db: ReturnType<typeof paymentsAdmin>
): Promise<{message:string} | {secret:string; cents:number; fee:number}> {
    if (row.status === "paid") return { message:"Your payment has been confirmed." };

    // No destination charge. Capture on platform; transfer only after mating approval.
    const intent = row.payment_intent_id
      ? await stripe.paymentIntents.retrieve(row.payment_intent_id)
      : await stripe.paymentIntents.create({
          amount:row.deposit_cents,currency:row.currency,payment_method_types:["card"],
          capture_method:"automatic",transfer_group:row.id,
          metadata:{ purpose,reservation_id:row.id },
        }, { idempotencyKey:(purpose === "stud_deposit" ? "stud-deposit-" : "puppy-purchase-")+row.id });
    if (!row.payment_intent_id) {
      const saved = await db.from("reservations").update({payment_intent_id:intent.id})
        .eq("id",row.id).is("payment_intent_id",null).select("id").maybeSingle();
      if (saved.error) throw saved.error;
      if (!saved.data) return { message:"Your checkout was opened elsewhere. Try again to resume." };
    }
    if (intent.status === "succeeded" || intent.status === "processing") return { message:"Payment submitted. Server confirmation is pending." };
    if (intent.status === "canceled" || !intent.client_secret) return { message:"Checkout is unavailable. Contact support." };
    return { secret:intent.client_secret,cents:row.deposit_cents,fee:row.platform_fee_cents };
}
