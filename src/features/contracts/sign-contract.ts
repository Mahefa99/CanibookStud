"use server";
import { isIP } from "node:net";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";
import { paymentsAdmin } from "@/src/lib/supabase/payments-admin";

export async function signContract(_: string, form: FormData) {
  const id = z.string().uuid().safeParse(form.get("id"));
  if (!id.success || form.get("agree") !== "on") return "Review the terms and confirm your consent.";
  const { data: { user } } = await createClient().auth.getUser();
  if (!user) return "Sign in to sign your agreement.";
  // Trust only the hosting platform's client IP header in its own environment.
  const address = process.env.NETLIFY === "true" ? headers().get("x-nf-client-connection-ip") : null;
  if (!address || !isIP(address)) return "Verified client IP unavailable. Signing is unavailable.";
  const { error } = await paymentsAdmin().rpc("sign_contract", {contract:id.data, signer:user.id, address});
  if (error) return "Unable to record signature.";
  revalidatePath("/contracts/" + id.data);
  return "Signature recorded.";
}
