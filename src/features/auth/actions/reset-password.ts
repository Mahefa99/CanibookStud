"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import type { AuthState } from "../types";

export async function resetPassword(_: AuthState, form: FormData): Promise<AuthState> {
  const password = form.get("password");
  if (typeof password !== "string" || password.length < 8 || password.length > 128)
    return { message: "Use between 8 and 128 characters." };
  if (password !== form.get("confirm")) return { message: "The passwords must match." };
  const { auth } = createClient("write");
  if (!(await auth.getUser()).data.user) redirect("/forgot-password?expired=1");
  const { error } = await auth.updateUser({ password });
  if (error) return { message: "Password update failed. Try another password or request a fresh recovery link." };
  redirect("/dashboard");
}
