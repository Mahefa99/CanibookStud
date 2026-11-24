"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";
import { requireAccess } from "@/src/lib/supabase/require-access";

export async function uploadDocument(_:string, form:FormData) {
  const id=z.string().uuid().safeParse(form.get("stud"));
  const kind=z.enum(["akc","dna","brucellosis"]).safeParse(form.get("kind"));
  const file=form.get("file");
  if (!id.success || !kind.success || !file || typeof file==="string" || file.size<12 || file.size>1048576)
    return "Select a document up to 1 MiB.";
  const {error}=await createClient().rpc("submit_stud_document",{listing:id.data,category:kind.data,
    image:Buffer.from(await file.arrayBuffer()).toString("base64"),provider:String(form.get("provider")??"")});
  if(error) return "Upload failed. Check the file, DNA provider and listing details.";
  revalidatePath("/dashboard/animals");
  revalidatePath("/studs/"+id.data);
  revalidatePath("/admin/animal-documents");
  return "Document submitted for review.";
}

export async function reviewDocument(_:string,form:FormData) {
  await requireAccess("/admin");
  const id=z.string().uuid().safeParse(form.get("document"));
  const decision=z.enum(["verified","rejected"]).safeParse(form.get("decision"));
  if(!id.success || !decision.success) return "Select a review decision.";
  const {data,error}=await createClient().rpc("review_stud_document",{document:id.data,decision:decision.data});
  if(error || !data) return "Document unavailable or already reviewed. Refresh the queue.";
  revalidatePath("/admin/animal-documents");
  revalidatePath("/studs/[slug]","page");
  return "Review saved.";
}
