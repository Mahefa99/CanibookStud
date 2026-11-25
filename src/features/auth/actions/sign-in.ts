"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "../../../lib/supabase/server";
import type { AuthState } from "../types";

const credentials = z.object({
  email: z.string().trim().min(1, "Enter your email address.")
    .max(254, "Enter a valid email address.").email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export async function signIn(_: AuthState, form: FormData): Promise<AuthState> {
  const input = credentials
    .safeParse({ email: form.get("email") ?? "", password: form.get("password") ?? "" });
  if (!input.success) return { message: input.error.issues[0]?.message ?? "Check your email and password." };
  const { error } = await createClient("write").auth.signInWithPassword(input.data);
  if (error) {
    if (error.code === "invalid_credentials") {
      return { message: "Incorrect email or password. Try again or use Forgot password?" };
    }
    if (error.code === "email_not_confirmed") {
      return { message: "Your email is not confirmed yet. Check your inbox and spam folder for the confirmation link." };
    }
    if (error.status === 429 || error.code === "over_request_rate_limit") {
      return { message: "Too many sign-in attempts. Please wait before trying again." };
    }
    return { message: "Unable to sign in right now. Please try again later." };
  }
  redirect("/dashboard");
}
