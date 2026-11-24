"use client";

import { loadStripe, type Stripe } from "@stripe/stripe-js";
import { z } from "zod";

let client: Promise<Stripe | null> | undefined;
export function getStripeClient(): Promise<Stripe | null> {
  const key = z.string().regex(/^pk_test_.+$/).parse(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  client ??= loadStripe(key);
  return client;
}
