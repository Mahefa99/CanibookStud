import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getPublicEnv } from "../env/public";
import type { Database } from "../../types/database";

// Public directories always query as anonymous, even for signed-in owners.
export function publicCatalogClient() {
  const { url, publishableKey } = getPublicEnv();
  return createClient<Database>(url, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
}
