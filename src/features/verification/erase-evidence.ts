"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";

export async function eraseEvidence(_: string, form: FormData) {
  const id = z.string().uuid().safeParse(form.get("id"));
  if (!id.success || form.get("confirm") !== "on") return "Confirm removal first.";
  const {data,error} = await createClient().rpc("erase_reviewed_evidence",{target:id.data});
  if (error || !data) return "Unable to remove documents for this case.";
  revalidatePath("/dashboard/verification");
  revalidatePath("/admin/verifications");
  return "Documents removed.";
}
