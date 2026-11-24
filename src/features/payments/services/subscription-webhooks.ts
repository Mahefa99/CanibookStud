import "server-only";
import type Stripe from "stripe";
import { paymentsAdmin } from "@/src/lib/supabase/payments-admin";
import { getStripe } from "@/src/lib/stripe/server";

export async function syncSubscription(event:Stripe.Event) {
  if(event.account || event.livemode) return;
  if(event.type==="checkout.session.expired"){
    const s=event.data.object;
    if(s.mode!=="subscription" || !s.metadata?.billing_attempt || !s.metadata.breeder_id) return;
    const {error}=await paymentsAdmin().from("breeder_subscriptions").update({status:"expired",checkout_id:s.id})
      .eq("id",s.metadata.billing_attempt).eq("breeder_id",s.metadata.breeder_id).eq("status","checkout");
    if(error) throw error;
    return;
  }
  if(event.type!=="customer.subscription.created" && event.type!=="customer.subscription.updated" &&
      event.type!=="customer.subscription.deleted") return;
  const notification=event.data.object;
  const attempt=notification.metadata.billing_attempt;
  if(!attempt) return;
  const db=paymentsAdmin();
  const {data:row,error}=await db.from("breeder_subscriptions").select("*").eq("id",attempt).single();
  if(error) throw error;
  // Read current Stripe state after the revision, then compare-and-swap. A raced webhook is retried.
  const sub=await getStripe().subscriptions.retrieve(notification.id);
  if(sub.metadata.breeder_id!==row.breeder_id || sub.metadata.billing_attempt!==row.id ||
      (row.subscription_id && row.subscription_id!==sub.id) ||
      sub.items.data.length!==1 || sub.items.data[0]?.price.id!==row.price_id)
    throw new Error("Unexpected subscription mapping.");
  if(row.subscription_id===sub.id && row.status===sub.status) return;
  const saved=await db.from("breeder_subscriptions").update({subscription_id:sub.id,status:sub.status,revision:row.revision+1})
    .eq("id",row.id).eq("revision",row.revision).select("id").single();
  if(saved.error) throw saved.error;
}
