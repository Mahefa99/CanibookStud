"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

function refreshLicenses() {
  revalidatePath("/dashboard/verification");
  revalidatePath("/admin/breeder-licenses");
}

export async function submitLicense(_:string, form:FormData) {
  const number=z.string().trim().min(1).max(100).safeParse(form.get("number"));
  const file=form.get("document");
  if(!number.success || !file || typeof file==="string" || file.size<12 || file.size>1048576)
    return "Enter a license number and select a PDF, JPEG or PNG up to 1 MiB.";
  const {error}=await createClient().rpc("submit_breeder_license",{number_text:number.data,
    document:Buffer.from(await file.arrayBuffer()).toString("base64")});
  if(error) return "Unable to submit. Check your breeder activity and file format.";
  refreshLicenses();
  return "License submitted for review.";
}

export async function reviewLicense(_:string,form:FormData) {
  const input=z.object({document_id:z.string().uuid(),decision:z.enum(["verified","rejected"]),
    note:z.string().trim().min(1).max(500)}).safeParse(Object.fromEntries(form));
  if(!input.success) return "Select a decision and include a review note.";
  const {data,error}=await createClient().rpc("review_breeder_license",input.data);
  if(error || !data) return "Review unavailable. Refresh the queue.";
  refreshLicenses();
  return "Decision recorded.";
}
