"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { currentBreeder } from "../services/connect";
import { loadBreederPlans } from "../services/breeder-plans";
import { paymentsAdmin } from "@/src/lib/supabase/payments-admin";
import { getStripe } from "@/src/lib/stripe/server";
import { paymentOrigin, webhookSecrets } from "@/src/lib/env/server";

export async function subscribe(_:string, form:FormData) {
  const {user,breeder}=await currentBreeder();
  if (!breeder) return "A breeder account is required.";
  const input=z.object({plan:z.enum(["starter","pro","unlimited"]),cadence:z.enum(["month","year"])}).safeParse(Object.fromEntries(form));
  if (!input.success) return "Select a plan and billing interval.";
  const {plan,cadence}=input.data;
  let url:string;
  try {
    webhookSecrets();
    const billingUrl=paymentOrigin()+"/dashboard/billing";
    const stripe=getStripe();
    const db=paymentsAdmin();
    const rate=(await loadBreederPlans()).find(p=>p.id===plan)?.rates.find(r=>r.interval===cadence);
    if(!rate) return "This price is currently unavailable.";
    const claim=await db.from("breeder_subscriptions").insert({breeder_id:user.id,plan,cadence,price_id:rate.priceId});
    if(claim.error && claim.error.code!=="23505") throw claim.error;
    const {data:row,error}=await db.from("breeder_subscriptions").select("*").eq("breeder_id",user.id)
      .not("status","in","(expired,incomplete_expired,canceled)").single();
    if(error) throw error;
    if(row.status!=="checkout") return "Your subscription already exists. Refresh billing for its status.";
    if(!row.checkout_id && Date.now()-Date.parse(row.created_at)>20*3600000)
      return "Please contact support to reconcile this checkout.";
    if(row.plan!==plan || row.cadence!==cadence) return "Resume your pending checkout or wait for it to expire.";
    const metadata={billing_attempt:row.id,breeder_id:user.id};
    const session=row.checkout_id ? await stripe.checkout.sessions.retrieve(row.checkout_id) :
      await stripe.checkout.sessions.create({mode:"subscription",payment_method_types:["card"],
        line_items:[{price:row.price_id,quantity:1}],client_reference_id:user.id,metadata,
        subscription_data:{metadata},success_url:billingUrl,cancel_url:billingUrl},
        {idempotencyKey:"breeder-subscription-"+row.id});
    const saved=await db.from("breeder_subscriptions").update({checkout_id:session.id}).eq("id",row.id);
    if(saved.error) throw saved.error;
    if(session.status==="expired"){
      const closed=await db.from("breeder_subscriptions").update({status:"expired"}).eq("id",row.id).eq("status","checkout");
      if(closed.error) throw closed.error;
      return "Checkout expired. Select a plan again.";
    }
    if(session.status!=="open" || !session.url) return "Checkout submitted. Refresh to see the confirmed subscription.";
    url=session.url;
  } catch {return "Subscription checkout unavailable. Please try again later.";}
  redirect(url);
}
