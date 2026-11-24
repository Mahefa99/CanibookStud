"use server";

import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";
import { paymentsAdmin } from "@/src/lib/supabase/payments-admin";
import { getStripe } from "@/src/lib/stripe/server";
import { checkoutIntent } from "../services/checkout-intent";

export async function createLitterIntent(listing: string, puppy: number) {
  if (!z.string().uuid().safeParse(listing).success || !Number.isSafeInteger(puppy) || puppy<1)
    return { message:"Choose a valid puppy number." };
  const { data:{user} } = await createClient().auth.getUser();
  if (!user) return { message:"Log in to reserve this puppy." };
  const fee = process.env.PUPPY_SERVICE_FEE_CENTS ?? "";
  if (!/^\d+$/.test(fee) || Number(fee)>2147483647 || !process.env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_") ||
      !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_"))
    return { message:"Puppy checkout is not configured." };
  try {
    const stripe = getStripe();
    const db = paymentsAdmin();
    const claim = await db.rpc("claim_puppy",{listing,puppy,buyer:user.id,fee:Number(fee)});
    if (claim.error) return { message:"This puppy is unavailable for checkout." };
    const { data:row,error } = await db.from("reservations").select("*").eq("id",claim.data).eq("buyer_id",user.id).single();
    if (error) throw error;
    return await checkoutIntent(row,"puppy_purchase",stripe,db);
  } catch { return { message:"Unable to open puppy checkout. Try again." }; }
}
