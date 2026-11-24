"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getPublicEnv } from "../env/public";
import type { Database } from "../../types/database";

export function createClient() {
  const { url, publishableKey } = getPublicEnv();
  return createBrowserClient<Database>(url, publishableKey);
}
