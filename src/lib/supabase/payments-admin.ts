import "server-only";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "../../types/database";
import { getPublicEnv } from "../env/public";

export function paymentsAdmin() {
  const key = z.string().min(1).parse(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return createClient<Database>(getPublicEnv().url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: (url, init) => fetch(url, { ...init, cache: "no-store" }) },
  });
}
