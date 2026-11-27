"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/src/lib/supabase/server";

export async function manageFemale(_: string, form: FormData): Promise<string> {
  const db = createClient("write");
  const {data:{user}} = await db.auth.getUser();
  if (!user) redirect("/login");
  const field = (key:string) => String(form.get(key) ?? "").trim();
  const id = field("id");
  const action = field("action");
  if (action === "create") {
    const {error} = await db.from("females").insert({
      name:field("name"), breed:field("breed"), birth_date:field("birth_date"), city:field("city"),
      availability:field("availability"), health:field("health"), vaccines:field("vaccines"),
      brucellosis_date:field("brucellosis_date") || null, photo_rgb:field("photo_rgb")
    });
    if(error) return "Check your photo, name, breed and dates. The profile could not be saved.";
  } else if(action === "settings") {
    const {error} = await db.from("females").update({visible:field("visible")==="on",availability:field("availability")}).eq("owner_id",user.id).eq("id",id).select("id").single();
    if(error) return "Unable to update this female.";
  } else if(action === "propose") {
    const {error} = await db.rpc("propose_mating",{f:field("female"),s:field("stud")});
    if(error) return error.code==="23505" ? "A proposal already exists for this pair." : "This pair is unavailable.";
  } else if(action === "accept" || action === "decline") {
    const {error} = await db.rpc("decide_mating",{p:id,approve:action==="accept"});
    if(error) return "This proposal is no longer awaiting your decision.";
  } else return "Unknown action.";
  revalidatePath("/females","layout");
  revalidatePath("/dashboard/animals/females");
  redirect("/dashboard/animals/females");
}
