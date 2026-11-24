import "server-only";
import Stripe from "stripe";
import { getStripeEnv } from "../env/server";

let client: Stripe | undefined;
export function getStripe(): Stripe {
  client ??= new Stripe(getStripeEnv().secretKey, { maxNetworkRetries: 2 });
  return client;
}
