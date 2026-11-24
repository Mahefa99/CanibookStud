"use server";

import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

export async function signOut(): Promise<void> {
  const { error } = await createClient("write").auth.signOut({ scope: "local" });
  if (error) throw new Error("Unable to end this session. Please retry.");
  redirect("/login");
}
