import "server-only";
import { z } from "zod";

// This delivery is sandbox-only. Do not accept production payment keys here.
export function getStripeEnv() {
  return { secretKey: z.string().regex(/^sk_test_.+$/).parse(process.env.STRIPE_SECRET_KEY) };
}

export function paymentOrigin(): string {
  const url = new URL(z.string().url().parse(process.env.NEXT_PUBLIC_SITE_URL));
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost","127.0.0.1"].includes(url.hostname))) {
    throw new Error("Configure a secure site URL for Connect.");
  }
  return url.origin;
}

export function webhookSecrets(): string[] {
  const secret = z.string().regex(/^whsec_.+$/);
  return [secret.parse(process.env.STRIPE_WEBHOOK_SECRET),
    ...(process.env.STRIPE_CONNECT_WEBHOOK_SECRET ? [secret.parse(process.env.STRIPE_CONNECT_WEBHOOK_SECRET)] : [])];
}
