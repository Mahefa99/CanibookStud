"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";

export async function calendarAction(_:string,form:FormData) {
  const db=createClient();
  const {data:{user}}=await db.auth.getUser();
  if(!user) redirect("/login");
  const action=form.get("action");
  if(action==="create") {
    const slot=z.object({event_name:z.string().trim().min(1).max(100),placement:z.string().trim().min(1).max(100),slot_day:z.string().date()}).safeParse(Object.fromEntries(form));
    if(!slot.success) return "Enter an event, placement and valid date.";
    const {error}=await db.from("sponsor_slots").insert({...slot.data,club_id:user.id});
    if(error) return error.code==="23505"?"This slot already exists.":"Unable to create this slot.";
  } else {
    const id=z.string().uuid().safeParse(form.get("id"));
    if(!id.success) return "Invalid selection.";
    if(action==="hold") {
      const {error}=await db.rpc("hold_sponsor_slot",{slot:id.data});
      if(error) return "Slot unavailable. A separate sponsor account is required.";
    } else {
      const decision=z.enum(["accepted","declined","submit"]).safeParse(action);
      if(!decision.success) return "Invalid action.";
      const {data,error}=await db.rpc("advance_sponsor_request",{request_id:id.data,action_name:decision.data,message:String(form.get("proposal")??"")});
      if(error || !data) return "Request expired, already processed or unavailable.";
    }
  }
  revalidatePath("/sponsors/calendar");
  revalidatePath("/dashboard/sponsorships");
  if(action==="hold") redirect("/dashboard/sponsorships");
  return "Saved.";
}
