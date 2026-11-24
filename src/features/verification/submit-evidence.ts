"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

export async function submitEvidence(_: string, form: FormData) {
  const db = createClient();
  const {data:{user}} = await db.auth.getUser();
  if (!user) return "Sign in to submit documents.";
  const images: string[] = [];
  for (const field of ["selfie","identity"]) {
    const file = form.get(field);
    if (!file || typeof file === "string" || file.size < 12 || file.size > 1048576)
      return "Choose two JPEG or PNG images up to 1 MiB each.";
    images.push(Buffer.from(await file.arrayBuffer()).toString("base64"));
  }
  const [selfie, identity] = images;
  if (!selfie || !identity) return "Both images are required.";
  const {error} = await db.rpc("submit_identity_evidence",{selfie,identity_image:identity});
  if (error?.code === "23505") return "You already have an active identity case.";
  if (error) return "Unable to submit. Check that both images are JPEG or PNG and try again.";
  revalidatePath("/dashboard/verification");
  revalidatePath("/admin/verifications");
  revalidatePath("/admin");
  return "Identity documents submitted.";
}
