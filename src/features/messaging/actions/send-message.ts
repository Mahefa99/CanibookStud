"use server";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";

export async function sendMessage(thread:string,text:string):Promise<boolean> {
  const input=z.object({thread:z.string().uuid(),text:z.string().trim().min(1).max(4000)}).safeParse({thread,text});
  if(!input.success) return false;
  // PostgreSQL assigns sender_id from auth.uid(); clients cannot override it.
  const {error}=await createClient("write").from("messages").insert({
    conversation_id:input.data.thread,content:input.data.text,
  });
  return !error;
}
