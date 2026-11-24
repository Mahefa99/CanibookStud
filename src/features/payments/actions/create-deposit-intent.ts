"use server";

import { checkoutIntent } from "../services/checkout-intent";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";
import { publicCatalogClient } from "@/src/lib/supabase/public-catalog";
import { paymentsAdmin } from "@/src/lib/supabase/payments-admin";
import { getStripe } from "@/src/lib/stripe/server";

type Result = { message: string } | { secret: string; cents: number };
const cents = z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().max(2147483647));

export async function createDepositIntent(studId: string): Promise<Result> {
  if (!z.string().uuid().safeParse(studId).success) return { message: "Invalid listing." };
  const { data: { user } } = await createClient().auth.getUser();
  if (!user) return { message: "Log in to start your deposit." };
  const pricing = z.object({ deposit: cents, fee: cents }).safeParse({
    deposit: process.env.STUD_DEPOSIT_CENTS, fee: process.env.STUD_PLATFORM_FEE_CENTS,
  });
  if (!pricing.success || pricing.data.deposit <= 0 || pricing.data.fee > pricing.data.deposit ||
      !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_") ||
      !process.env.STRIPE_WEBHOOK_SECRET?.startsWith("whsec_")) {
    return { message: "Deposit checkout is not configured yet." };
  }
  try {
    const stripe = getStripe();
    const db = paymentsAdmin();
    // Anonymous RLS excludes drafts and expired health tests even for the listing owner.
    const { data: stud,error } = await publicCatalogClient().from("studs").select("id,owner_id")
      .eq("id",studId).eq("status","published").maybeSingle();
    if (error) throw error;
    if (!stud || stud.owner_id === user.id) return { message: "This listing is unavailable for your request." };
    const { data: account,error: accountError } = await db.from("stripe_connect_accounts")
      .select("stripe_account_id,onboarding_complete").eq("breeder_id",stud.owner_id).maybeSingle();
    if (accountError) throw accountError;
    if (!account?.stripe_account_id || !account.onboarding_complete) return { message: "This breeder is not ready to receive deposits." };

    const claim = await db.from("reservations").upsert({
      buyer_id:user.id, breeder_id:stud.owner_id, stud_id:stud.id,
      deposit_cents:pricing.data.deposit, platform_fee_cents:pricing.data.fee,
    }, { onConflict:"buyer_id,stud_id",ignoreDuplicates:true });
    if (claim.error) throw claim.error;
    const { data: row,error: readError } = await db.from("reservations").select("*")
      .eq("buyer_id",user.id).eq("stud_id",stud.id).single();
    if (readError) throw readError;
    if (row.breeder_id !== stud.owner_id) return { message: "The listing owner has changed. Contact support." };
    return await checkoutIntent(row,"stud_deposit",stripe,db);
  } catch {
    return { message:"Unable to open checkout. Please try again or contact support." };
  }
}

