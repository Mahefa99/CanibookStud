import { z } from "zod";

const schema = z.object({
  url: z.string().url(),
  publishableKey: z.string().startsWith("sb_publishable_"),
});

// Explicit property access lets Next inline only the browser-safe settings.
export function getPublicEnv() {
  return schema.parse({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}

export function authConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
}
