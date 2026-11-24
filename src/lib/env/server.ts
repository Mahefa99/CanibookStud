import "server-only";
import { z } from "zod";

const stripeEnv = z.object({ secretKey: z.string().regex(/^sk_(test|live)_.+$/) });

// Validate lazily so starting an Auth-only installation needs no Stripe secret.
export function getStripeEnv() {
  return stripeEnv.parse({ secretKey: process.env.STRIPE_SECRET_KEY });
}
