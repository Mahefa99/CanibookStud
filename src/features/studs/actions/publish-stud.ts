"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { checkStudEligibility } from "../services/stud-eligibility";

export async function publishStud(_:string, form:FormData) {
  const parsed=z.object({id:z.string().uuid(),akcNumber:z.string().trim().min(1).max(150),
    brucellosisDate:z.string().date()}).safeParse(Object.fromEntries(form));
  if(!parsed.success || !checkStudEligibility(parsed.data).eligible)
    return "Provide an AKC number and a brucellosis collection date within the last 14 days.";
  const db=createClient("write");
  const {data:{user}}=await db.auth.getUser();
  if(!user) return "Sign in to publish your stud.";
  const {id,akcNumber,brucellosisDate}=parsed.data;
  const {data,error}=await db.from("studs").update({status:"published",akc_number:akcNumber,brucellosis_date:brucellosisDate})
    .eq("id",id).eq("owner_id",user.id).eq("status","draft").select("id").maybeSingle();
  if(error?.code==="P0160") return "Your plan limit is reached. Move a published stud to drafts or change your plan in Billing.";
  if(error?.code==="23514") return "Publication requires an eligible DNA report, AKC number and current brucellosis test.";
  if(error || !data) return "Draft unavailable. Refresh your animal list.";
  revalidatePath("/dashboard/animals");
  revalidatePath("/studs");
  revalidatePath("/studs/"+id);
  return "Stud published.";
}
