"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "../../../lib/supabase/server";
import { activities, type AuthState } from "../types";

const schema = z.object({
  display_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
  activities: z.array(z.enum(activities)).min(1).max(activities.length),
});

export async function signUp(_: AuthState, form: FormData): Promise<AuthState> {
  const input = schema.safeParse({
    display_name: form.get("display_name"), email: form.get("email"),
    password: form.get("password"), activities: form.getAll("activities"),
  });
  if (!input.success) return { message: input.error.issues[0]?.message ?? "Check the form." };
  const { email, password, ...metadata } = input.data;
  const { data, error } = await createClient("write").auth.signUp({
    email, password, options: { data: metadata },
  });
  if (error) return { message: "Unable to register. Check your details or try again later." };
  redirect(data.session ? "/dashboard" : "/verify-email");
}
