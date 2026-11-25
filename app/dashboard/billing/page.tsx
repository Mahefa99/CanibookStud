import { BreederPlans } from "@/src/features/payments/components/breeder-plans";
import { createConnectAccount } from "@/src/features/payments/actions/create-connect-account";
import { currentBreeder } from "@/src/features/payments/services/connect";
import { SubmitButton } from "@/src/features/auth/components/submit-button";

export const metadata = { title: "Billing" };
export default async function BillingPage() {
  const { user,breeder,db } = await currentBreeder();
  const { data,error } = breeder ? await db.from("stripe_connect_accounts")
    .select("onboarding_complete,stripe_account_id").eq("breeder_id",user.id).maybeSingle() : { data:null,error:null };
  if (error) throw new Error("Unable to load billing. Check the payments migration.");
  return <section className="space-y-4"><h1 className="font-display text-4xl">Billing</h1>
    {breeder && <div className="surface max-w-xl space-y-4 p-5"><h2 className="font-semibold">Breeder payouts</h2>
      <p>{data?.onboarding_complete ? "Your Stripe account is ready to receive transfers." :
        "Complete Stripe identity verification to receive breeder payouts."}</p>
      {!data?.onboarding_complete && <form action={createConnectAccount}><SubmitButton label={data?.stripe_account_id ? "Continue Stripe onboarding" : "Connect your Stripe Account"} /></form>}
    </div>}
    {breeder && <BreederPlans/>}
  </section>;
}
