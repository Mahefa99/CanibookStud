import { NextResponse } from "next/server";
import { currentBreeder } from "@/src/features/payments/services/connect";
import { getStripe } from "@/src/lib/stripe/server";
import { paymentOrigin } from "@/src/lib/env/server";

export async function GET() {
  const { user, db, breeder } = await currentBreeder();
  if (!breeder) return new Response("Breeder access required.", { status: 403 });
  const {data,error} = await db.from("stripe_connect_accounts").select("stripe_account_id")
    .eq("breeder_id",user.id).maybeSingle();
  if (error) throw new Error("Unable to read Stripe account.");
  const origin = paymentOrigin();
  if (!data?.stripe_account_id) return NextResponse.redirect(origin+"/dashboard/billing");
  const link = await getStripe().accountLinks.create({
    account:data.stripe_account_id,type:"account_onboarding",
    return_url:origin+"/dashboard/billing", refresh_url:origin+"/api/stripe/connect",
  });
  const response = NextResponse.redirect(link.url,303);
  response.headers.set("Cache-Control","private, no-store");
  return response;
}
