import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "../../types/database";
import { getPublicEnv } from "../env/public";

// Server Components read the cookies refreshed by middleware. Actions and
// Route Handlers must opt into writes when signing in, out or exchanging codes.
export function createClient(mode: "read" | "write" = "read") {
  const store = cookies();
  const { url, publishableKey } = getPublicEnv();
  return createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(updates) {
        if (mode === "write") {
          for (const { name, value, options } of updates) store.set(name, value, options);
        }
      },
    },
  });
}
