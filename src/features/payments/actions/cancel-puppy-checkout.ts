"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";
import { paymentsAdmin } from "@/src/lib/supabase/payments-admin";
import { getStripe } from "@/src/lib/stripe/server";

export async function cancelPuppyCheckout(form:FormData):Promise<void> {
  const id=z.string().uuid().parse(form.get("reservation"));
  const {data:{user}}=await createClient().auth.getUser();
  if(!user) redirect("/login");
  const db=paymentsAdmin();
  const {data:row,error}=await db.from("reservations").select("payment_intent_id,status,litter_id")
    .eq("id",id).eq("buyer_id",user.id).maybeSingle();
  if(error) throw new Error("Unable to load reservation.");
  if(!row?.litter_id || row.status!=="pending" || !row.payment_intent_id) return;
  const stripe=getStripe();
  let intent=await stripe.paymentIntents.retrieve(row.payment_intent_id);
  if(["requires_payment_method","requires_confirmation","requires_action"].includes(intent.status)){
    intent=await stripe.paymentIntents.cancel(intent.id,{}, {idempotencyKey:"cancel-puppy-"+id});
  }
  // Never free inventory while Stripe could still capture the charge.
  if(intent.status==="canceled"){
    const {error:removeError}=await db.from("reservations").delete().eq("id",id)
      .eq("buyer_id",user.id).eq("status","pending").eq("payment_intent_id",intent.id);
    if(removeError)throw new Error("Unable to release this checkout.");
  }
  revalidatePath("/dashboard/messages");
}
