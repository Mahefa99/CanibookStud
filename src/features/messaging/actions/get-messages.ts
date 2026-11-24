"use server";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";

// RLS checks current membership and paid status for every read.
export async function getMessages(thread:string) {
  const db = createClient();
  const id = z.string().uuid().parse(thread);
  const {data,error} = await db.from("messages").select("id,sender_id,content,created_at")
    .eq("conversation_id",id).order("created_at",{ascending:false}).order("id",{ascending:false}).limit(100);
  if(error) throw new Error("Unable to load conversation.");
  return data.reverse();
}
