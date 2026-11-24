import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";

export async function GET(_:Request,{params}:{params:{id:string}}) {
  const headers = { "Cache-Control":"private, no-store" };
  if (!z.string().uuid().safeParse(params.id).success) return new Response(null,{status:404,headers});
  const {data,error} = await createClient().from("reservation_contracts").select("pdf").eq("id",params.id).maybeSingle();
  if (error || !data) return new Response(null,{status:error && error.code!=="42501"?500:404,headers});
  return new Response(new Uint8Array(Buffer.from(data.pdf.slice(2),"hex")), {headers:{
    ...headers,"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="reservation-${params.id}.pdf"`
  }});
}
