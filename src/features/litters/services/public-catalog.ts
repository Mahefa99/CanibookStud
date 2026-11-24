import { z } from "zod";
import { publicCatalogClient } from "@/src/lib/supabase/public-catalog";

const fields = "id,breed,birth_date,puppy_price,puppy_count" as const;

export async function listLitters(page: number, breed: string) {
  const query = publicCatalogClient().from("litters").select(fields).eq("status","published")
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .order("birth_date",{ ascending:false }).order("id");
  if (breed) query.ilike("breed",breed.replace(/[\\%_]/g,"\\$&")+"%");
  const offset = (page-1)*24;
  const { data,error } = await query.range(offset,offset+24);
  if (error) throw new Error("Unable to load the litter directory.");
  return { litters:data.slice(0,24), more:data.length>24 };
}

export async function getLitter(id: string) {
  if (!z.string().uuid().safeParse(id).success) return null;
  const db = publicCatalogClient();
  const { data,error } = await db.from("litters").select(`${fields},photos,expires_at`)
    .eq("id",id).eq("status","published").maybeSingle();
  if (error) throw new Error("Unable to load this litter.");
  if (!data) return null;
  const ttl = data.expires_at ? Math.min(300, Math.floor((Date.parse(data.expires_at)-Date.now())/1000)) : 300;
  if (ttl <= 0) return null;
  const photos = data.photos.length ? await db.storage.from("litter-photos").createSignedUrls(data.photos,ttl) : null;
  return { ...data, urls: photos?.data?.flatMap(photo=>photo.signedUrl ? [photo.signedUrl] : []) ?? [] };
}
