import "server-only";
import type Stripe from "stripe";
import { z } from "zod";
import { paymentsAdmin } from "@/src/lib/supabase/payments-admin";
import { getStripe } from "@/src/lib/stripe/server";
import { syncSubscription } from "./subscription-webhooks";
import { canReceiveTransfers } from "./connect";

export async function applyStripeEvent(event: Stripe.Event): Promise<void> {
  if (event.livemode) throw new Error("Unexpected live event.");
  await syncSubscription(event);
  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    // Only a platform charge tagged by our deposit checkout can settle a reservation.
    if (event.account || !["stud_deposit","puppy_purchase"].includes(intent.metadata.purpose ?? "")) return;
    const reservation = z.string().uuid().parse(intent.metadata.reservation_id);
    if (intent.status !== "succeeded" || intent.transfer_data || intent.application_fee_amount != null) {
      throw new Error("Unexpected deposit charge configuration.");
    }
    const { error } = await paymentsAdmin().rpc("confirm_stud_deposit", {
      reservation_id: reservation, intent_id: intent.id,
      received: intent.amount_received, paid_currency: intent.currency,
    });
    if (error) throw new Error("Deposit reconciliation failed.");
  }
  if (event.type === "account.updated") {
    const account = event.data.object;
    if (event.account && event.account !== account.id) throw new Error("Mismatched connected account.");
    if (!account.metadata?.canibook_breeder_id) return;
    // Older Stripe notifications can arrive after newer ones. Read current capabilities.
    const latest = await getStripe().accounts.retrieve(account.id);
    const { data,error } = await paymentsAdmin().from("stripe_connect_accounts")
      .update({ onboarding_complete: canReceiveTransfers(latest) })
      .eq("stripe_account_id",account.id).eq("breeder_id",account.metadata.canibook_breeder_id)
      .select("breeder_id").maybeSingle();
    if (error || !data) throw new Error("Account reconciliation pending.");
  }
}

