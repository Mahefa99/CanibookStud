"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";
import { paymentsAdmin } from "@/src/lib/supabase/payments-admin";
import { getStripe } from "@/src/lib/stripe/server";

export async function releaseEscrow(_: string, form: FormData): Promise<string> {
  const id = z.string().uuid().safeParse(form.get("reservation"));
  const { data: { user } } = await createClient().auth.getUser();
  if (!user || !id.success) return "Sign in and select a reservation.";
  try {
    const stripe = getStripe();
    const db = paymentsAdmin();
    const claim = await db.rpc("claim_release", { reservation: id.data, breeder: user.id });
    if (claim.error) return "Release unavailable. Check payment, hold time and Stripe onboarding.";
    const { data: row, error } = await db.from("reservations").select("*")
      .eq("id", id.data).eq("breeder_id", user.id).single();
    if (error || !row.payment_intent_id || !row.release_destination || !row.release_started_at)
      return "Unable to verify this reservation.";
    if (row.transfer_id) return "Funds already released.";
    const intent = await stripe.paymentIntents.retrieve(row.payment_intent_id, { expand: ["latest_charge"] });
    const charge = intent.latest_charge;
    if (!charge || typeof charge === "string" || charge.refunded || charge.amount_refunded || charge.disputed ||
        intent.status !== "succeeded" || intent.amount_received !== row.deposit_cents ||
        intent.currency !== row.currency || intent.metadata.reservation_id !== row.id)
      return "The payment cannot be released.";
    const amount = row.deposit_cents - row.platform_fee_cents;
    // Recover if Stripe succeeded but the database write was interrupted.
    const existing = await stripe.transfers.list({ transfer_group: row.id, limit: 2 });
    let transfer = existing.data[0];
    if (existing.data.length > 1) return "Multiple transfers found. Contact support.";
    if (!transfer) {
      // Never issue a fresh transfer after Stripe's idempotency retention window.
      if (Date.now() - Date.parse(row.release_started_at) >= 20 * 3600000)
        return "Release needs manual reconciliation. Contact support.";
      transfer = await stripe.transfers.create({
        amount, currency: row.currency, destination: row.release_destination,
        source_transaction: charge.id, transfer_group: row.id, metadata: { reservation_id: row.id },
      }, { idempotencyKey: "release-" + row.id });
    }
    if (transfer.amount !== amount || transfer.currency !== row.currency || transfer.amount_reversed ||
        transfer.destination !== row.release_destination || transfer.source_transaction !== charge.id ||
        transfer.metadata.reservation_id !== row.id) return "Transfer requires review.";
    const saved = await db.from("reservations").update({ transfer_id: transfer.id, completed_at: new Date().toISOString() })
      .eq("id", row.id).is("transfer_id", null);
    if (saved.error) return "Transfer submitted. Retry to reconcile its status.";
    revalidatePath("/dashboard/reservations");
    return "Funds released.";
  } catch {
    return "Unable to confirm release. Retry to check its status.";
  }
}
