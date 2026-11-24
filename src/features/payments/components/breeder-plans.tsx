import { formatUsdCents } from "@/src/lib/money";
import { loadBreederPlans } from "../services/breeder-plans";

export async function BreederPlans() {
  const plans = await loadBreederPlans();
  return <section className="space-y-3"><h2 className="font-display text-2xl">Breeder plans</h2>
    <div className="grid gap-3 sm:grid-cols-2">
      {plans.map(plan => <article key={plan.id} className="surface p-4">
        <h3 className="font-semibold">{plan.name}</h3>
        <p>{plan.dogLimit === null ? "Unlimited dogs" : plan.dogLimit === 1 ? "1 dog" : plan.dogLimit + " dogs"}</p>
        {plan.rates.map(rate => <p key={rate.interval}>{formatUsdCents(rate.cents)} / {rate.interval}</p>)}
        {plan.id !== "free" && !plan.rates.length && <p>Pricing unavailable.</p>}
      </article>)}
    </div>
  </section>;
}
