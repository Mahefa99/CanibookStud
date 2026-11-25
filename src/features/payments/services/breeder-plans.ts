import "server-only";
import { BREEDER_SUBSCRIPTIONS } from "@/lib/config/pricing";
import { getStripe } from "@/src/lib/stripe/server";

const intervals = ["month", "year"] as const;
type Interval = typeof intervals[number];
type Rate = { priceId: string; cents: number; interval: Interval };

export async function loadBreederPlans() {
  const tiers = BREEDER_SUBSCRIPTIONS;
  const rates = new Map<string, Rate>();
  const lookupKey = (tier: string, interval: Interval) => `breeder_${tier}_${interval}`;
  const keys = tiers.filter(tier => tier.id !== "free")
    .flatMap(tier => intervals.map(interval => lookupKey(tier.id, interval)));

  if (process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_")) {
    try {
      const prices = await getStripe().prices.list({ active: true, type: "recurring", lookup_keys: keys, limit: 10 });
      for (const price of prices.data) {
        const interval = price.recurring?.interval;
        if (price.livemode || price.currency !== "usd" || price.billing_scheme !== "per_unit" ||
            price.unit_amount === null || price.unit_amount <= 0 || price.transform_quantity ||
            price.recurring?.usage_type !== "licensed" || price.recurring.interval_count !== 1 ||
            (interval !== "month" && interval !== "year") || !price.lookup_key ||
            !keys.includes(price.lookup_key) || !price.lookup_key.endsWith("_" + interval)) continue;
        rates.set(price.lookup_key, { priceId:price.id, cents: price.unit_amount, interval });
      }
    } catch {
      console.error("Unable to load the Stripe test subscription catalog.");
    }
  }

  return tiers.map(({id, name, dogLimit}) => ({
    id, name, dogLimit,
    rates: intervals.flatMap(interval => {
      const rate = rates.get(lookupKey(id, interval));
      return rate ? [rate] : [];
    }),
  }));
}
