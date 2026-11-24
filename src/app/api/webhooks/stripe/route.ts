import type Stripe from "stripe";
import { getStripe } from "@/src/lib/stripe/server";
import { webhookSecrets } from "@/src/lib/env/server";
import { applyStripeEvent } from "@/src/features/payments/services/webhooks";

export async function POST(request: Request): Promise<Response> {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature.", { status:400 });
  const body = await request.text();
  const stripe = getStripe();
  let event: Stripe.Event | undefined;
  for (const secret of webhookSecrets()) {
    try {
      event = stripe.webhooks.constructEvent(body,signature,secret);
      break;
    } catch {
      // Separate platform and connected-account endpoints may use different secrets.
    }
  }
  if (!event || event.livemode) return new Response("Invalid sandbox event.", { status:400 });
  try {
    await applyStripeEvent(event);
    return new Response(null, { status:204 });
  } catch {
    console.error("Stripe event pending reconciliation",event.id,event.type);
    return new Response("Retry later.", { status:500 });
  }
}
