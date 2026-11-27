import { createClient } from "@/src/lib/supabase/server";
export const dynamic = "force-dynamic";

// Encode only the published thumbnail pixels as a 24-bit BMP, with no metadata.
export async function GET(_:Request,{params}:{params:{id:string}}) {
  const headers={"Cache-Control":"private, no-store"};
  const {data,error}=await createClient().from("females").select("photo_rgb").eq("id",params.id).eq("visible",true).maybeSingle();
  if(error || !data) return new Response(null,{status:error && error.code!=="22P02"?503:404,headers});
  const rgb=Buffer.from(data.photo_rgb,"base64");
  const bitmap=Buffer.alloc(54+rgb.length);
  bitmap.write("BM"); bitmap.writeUInt32LE(bitmap.length,2); bitmap.writeUInt32LE(54,10);
  bitmap.writeUInt32LE(40,14); bitmap.writeInt32LE(320,18); bitmap.writeInt32LE(-240,22);
  bitmap.writeUInt16LE(1,26); bitmap.writeUInt16LE(24,28);
  for(let i=0;i<rgb.length;i+=3) {
    bitmap[54+i]=rgb.readUInt8(i+2); bitmap[55+i]=rgb.readUInt8(i+1); bitmap[56+i]=rgb.readUInt8(i);
  }
  return new Response(new Uint8Array(bitmap),{headers:{...headers,"Content-Type":"image/bmp"}});
}
