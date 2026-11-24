import { publicCatalogClient } from "@/src/lib/supabase/public-catalog";

function publishedStuds() {
  return publicCatalogClient().from("studs").select("id,name,breed,lat,lng,price,brucellosis_date")
    .eq("status", "published");
}

export async function listStuds(page: number, breed: string) {
  const start = (page - 1) * 24;
  const query = publishedStuds().order("name").order("id");
  if (breed) query.ilike("breed", breed.replace(/[\\%_]/g, "\\$&") + "%");
  const { data, error } = await query.range(start, start + 24);
  if (error) throw new Error("Unable to load the public stud directory.");
  return { studs: data.slice(0, 24), more: data.length > 24 };
}

export async function getStud(id: string) {
  if (!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id)) return null;
  const { data, error } = await publishedStuds().eq("id", id).maybeSingle();
  if (error) throw new Error("Unable to load this public stud.");
  return data;
}

