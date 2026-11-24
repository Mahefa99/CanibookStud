"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "../../../lib/supabase/server";
import type { AuthState } from "../types";

export async function signIn(_: AuthState, form: FormData): Promise<AuthState> {
  const input = z.object({ email: z.string().trim().email(), password: z.string().min(1) })
    .safeParse({ email: form.get("email"), password: form.get("password") });
  if (!input.success) return { message: "Enter your email and password." };
  const { error } = await createClient("write").auth.signInWithPassword(input.data);
  if (error) return { message: "Sign-in failed. Check your details and confirm your email." };
  redirect("/dashboard");
}
