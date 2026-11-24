"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";
import { requireAccess } from "@/src/lib/supabase/require-access";

export async function reviewCase(_: string, form: FormData) {
  await requireAccess("/admin");
  const parsed = z.object({case_id:z.string().uuid(),decision:z.enum(["approved","rejected"]),
    note:z.string().trim().min(1).max(500)}).safeParse(Object.fromEntries(form));
  if (!parsed.success) return "Select a decision and enter a review note.";
  const {data,error} = await createClient().rpc("review_kyc",parsed.data);
  if (error) return "Unable to record this review.";
  revalidatePath("/admin");
  revalidatePath("/admin/verifications");
  return data ? "Review recorded." : "Case already reviewed or score insufficient.";
}
