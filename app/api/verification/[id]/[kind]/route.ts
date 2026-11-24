import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";

export const dynamic = "force-dynamic";
export async function GET(_:Request,{params}:{params:{id:string;kind:string}}) {
  const headers = {"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"};
  const kind = z.enum(["identity","selfie"]).safeParse(params.kind);
  if (!kind.success || !z.string().uuid().safeParse(params.id).success) return new Response(null,{status:404,headers});
  const db = createClient();
  const {data:{user}} = await db.auth.getUser();
  if (!user) return new Response(null,{status:401,headers});
  const {data,error} = await db.from("kyc_evidence").select("content")
    .eq("case_id",params.id).eq("kind",kind.data).maybeSingle();
  if (error || !data) return new Response(null,{status:error?500:404,headers});
  const bytes = Buffer.from(data.content.slice(2),"hex");
  const ext = bytes[0]===255?"jpg":"png";
  return new Response(new Uint8Array(bytes),{headers:{...headers,"Content-Type":"application/octet-stream",
    "Content-Disposition":`attachment; filename="${kind.data}.${ext}"`}});
}
