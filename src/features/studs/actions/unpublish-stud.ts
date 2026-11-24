"use server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";

export async function unpublishStud(_:string, form:FormData) {
  const id=z.string().uuid().safeParse(form.get("id"));
  if(!id.success) return "Invalid listing.";
  const db=createClient("write");
  const {data:{user}}=await db.auth.getUser();
  if(!user) return "Sign in to manage this listing.";
  const {data,error}=await db.from("studs").update({status:"draft"})
    .eq("owner_id",user.id).eq("id",id.data).eq("status","published").select("id").maybeSingle();
  if(error || !data) return "Unable to move this listing to drafts. Refresh and retry.";
  revalidatePath("/dashboard/animals");
  revalidatePath("/studs");
  revalidatePath("/studs/"+id.data);
  return "Moved to drafts.";
}
