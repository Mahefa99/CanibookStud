import "server-only";
import { redirect } from "next/navigation";
import type Stripe from "stripe";
import { createClient } from "@/src/lib/supabase/server";
import { paymentsAdmin } from "@/src/lib/supabase/payments-admin";
import { getStripe } from "@/src/lib/stripe/server";

export function canReceiveTransfers(account: Stripe.Account): boolean {
  return account.type === "express" && account.details_submitted && account.payouts_enabled
    && account.capabilities?.transfers === "active";
}

export async function currentBreeder() {
  const db = createClient();
  const { data: { user } } = await db.auth.getUser();
  if (!user) redirect("/login");
  const { data, error } = await db.from("account_activities").select("activity")
    .eq("profile_id",user.id).eq("activity","breeder").maybeSingle();
  if (error) throw new Error("Unable to verify breeder access.");
  return { user, breeder: Boolean(data), db };
}

export async function ensureConnectAccount() {
  const { user, breeder } = await currentBreeder();
  if (!breeder) redirect("/access-denied");
  const stripe = getStripe();
  const db = paymentsAdmin();
  const { error: claimError } = await db.from("stripe_connect_accounts")
    .upsert({ breeder_id: user.id }, { onConflict: "breeder_id", ignoreDuplicates: true });
  if (claimError) throw new Error("Unable to start onboarding.");
  const { data: row,error } = await db.from("stripe_connect_accounts")
    .select("stripe_account_id,created_at").eq("breeder_id",user.id).single();
  if (error) throw new Error("Unable to read onboarding status.");
  if (row.stripe_account_id) return row.stripe_account_id;
  // Stripe can prune idempotency keys after 24 hours. Reconcile stale attempts first.
  if (Date.now()-Date.parse(row.created_at) >= 23*3600000) throw new Error("Contact support to reconcile the pending Stripe account.");
  const account = await stripe.accounts.create({
    type: "express", country:"US", capabilities: { transfers: { requested:true } },
    metadata: { canibook_breeder_id: user.id },
  }, { idempotencyKey: "canibook-express-"+user.id });
  const { error: saveError } = await db.from("stripe_connect_accounts")
    .update({ stripe_account_id:account.id }).eq("breeder_id",user.id);
  if (saveError) throw new Error("Unable to save onboarding progress. Please retry.");
  return account.id;
}

