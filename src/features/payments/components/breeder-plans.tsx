import { SubscribeForm } from "./subscribe-form";
import { createClient } from "@/src/lib/supabase/server";
import { formatUsdCents } from "@/src/lib/money";
import { loadBreederPlans } from "../services/breeder-plans";

export async function BreederPlans() {
  const plans = await loadBreederPlans();
  const {data:current,error}=await createClient().from("breeder_subscriptions").select("plan,cadence,status")
    .order("created_at",{ascending:false}).limit(1).maybeSingle();
  if(error) throw new Error("Unable to load subscription status.");
  const canStart=!current || ["expired","incomplete_expired","canceled"].includes(current.status);
  return <section className="space-y-3"><h2 className="font-display text-2xl">Breeder plans</h2>
    {current && <p>Latest subscription: {current.plan} · {current.cadence} · {current.status}</p>}
    <div className="grid gap-3 sm:grid-cols-2">
      {plans.map(plan => <article key={plan.id} className="surface p-4">
        <h3 className="font-semibold">{plan.name}</h3>
        <p>{plan.dogLimit === null ? "Unlimited dogs" : plan.dogLimit === 1 ? "1 dog" : plan.dogLimit + " dogs"}</p>
        {plan.rates.map(rate => <div key={rate.interval}><p>{formatUsdCents(rate.cents)} / {rate.interval}</p>
          {(canStart || (current?.status==="checkout" && current.plan===plan.id && current.cadence===rate.interval)) &&
            <SubscribeForm plan={plan.id} cadence={rate.interval}/>}</div>)}
        {plan.id !== "free" && !plan.rates.length && <p>Pricing unavailable.</p>}
      </article>)}
    </div>
  </section>;
}
