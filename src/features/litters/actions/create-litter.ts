"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";
import { formatCivilDate } from "@/src/lib/dates";
import { litterReadiness } from "../services/readiness";

const schema = z.object({
  breed: z.string().trim().min(1, "Enter a breed.").max(100),
  birth: z.string().refine(date => {
    try { litterReadiness(date); return true; } catch { return false; }
  }, "Enter a valid birth date."),
  count: z.string().regex(/^[1-9]\d*$/, "Enter a positive puppy count.")
    .transform(Number).pipe(z.number().int().max(2147483647)),
  price: z.string().regex(/^\d{1,8}(\.\d{1,2})?$/, "Enter a USD price with up to two decimals.")
    .transform(value => {
      const [whole, fraction = ""] = value.split(".");
      return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
    }).pipe(z.number().int().min(0).max(2147483647)),
});

function photoType(bytes: Buffer) {
  if (bytes.subarray(0,3).equals(Buffer.from([255,216,255]))) return "jpeg";
  if (bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return "png";
  if (bytes.toString("ascii",0,4)==="RIFF" && bytes.toString("ascii",8,12)==="WEBP") return "webp";
  return null;
}

export async function createLitter(_: { message: string }, form: FormData): Promise<{ message: string }> {
  const db = createClient("write");
  const { data: { user }, error: authError } = await db.auth.getUser();
  if (authError || !user) redirect("/login");
  const input = schema.safeParse(Object.fromEntries(["breed","birth","count","price"].map(k => [k,form.get(k)])));
  if (!input.success) return { message: input.error.issues[0]?.message ?? "Check the form." };
  const { breed, birth, count, price } = input.data;
  const age = litterReadiness(birth);
  if (!age.ready) return { message: "Not ready until " + formatCivilDate(age.readyDate) + "." };

  const files = form.getAll("photos").filter(f => !(typeof f !== "string" && !f.name && !f.size));
  if (files.length > 4) return { message: "Choose up to four photos." };
  const id = randomUUID();
  const images = [];
  for (const file of files) {
    if (typeof file === "string" || !file.size || file.size > 1048576) return { message: "Each photo must be 1 MiB or smaller." };
    const bytes = Buffer.from(await file.arrayBuffer());
    const type = photoType(bytes);
    if (!type || file.type !== "image/" + type) return { message: "Choose JPEG, PNG or WebP photos." };
    images.push({ bytes, type, path: user.id + "/" + id + "/" + randomUUID() + "." + type });
  }

  const bucket = db.storage.from("litter-photos");
  const photos: string[] = [];
  for (const image of images) {
    const { error } = await bucket.upload(image.path, image.bytes, { contentType: "image/" + image.type });
    if (error) {
      if (photos.length) await bucket.remove(photos);
      return { message: "Photo upload failed. Please try again." };
    }
    photos.push(image.path);
  }
  const { error } = await db.from("litters").insert({
    id, breeder_id: user.id, breed, birth_date: birth, puppy_count: count, puppy_price: price,
    photos, status: "published", listing_type: "free",
    expires_at: new Date(Date.now() + 7 * 86400000).toISOString(),
  });
  if (error) {
    if (photos.length) await bucket.remove(photos);
    return { message: "Unable to publish this litter. Please try again." };
  }
  revalidatePath("/puppies");
  redirect("/puppies/" + id);
}
