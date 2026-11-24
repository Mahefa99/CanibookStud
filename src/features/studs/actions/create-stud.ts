"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";
import { cities } from "@/src/lib/geo/cities";
import { createPublicLocation } from "@/src/lib/geo/public-location";
import { parseCivilDate } from "@/src/lib/dates";

const optionalText = z.string().trim().max(150).transform(value => value || null);
const date = optionalText.refine(value => {
  if (!value) return true;
  try { parseCivilDate(value); return true; } catch { return false; }
}, "Enter a valid test date.");
const price = z.string().regex(/^\d{1,8}(\.\d{1,2})?$/, "Enter a USD fee with up to two decimals.")
  .transform(value => {
    const [whole, fraction = ""] = value.split(".");
    return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  }).pipe(z.number().int().max(2147483647));
const schema = z.object({
  name: z.string().trim().min(1).max(100), breed: z.string().trim().min(1).max(100),
  city: z.string(), price, akcNumber: optionalText, brucellosisDate: date,
});

export async function createStud(_: { message: string }, form: FormData): Promise<{ message: string }> {
  const db = createClient("write");
  const { data: { user }, error: authError } = await db.auth.getUser();
  if (authError || !user) redirect("/login");
  const parsed = schema.safeParse(Object.fromEntries(Object.keys(schema.shape).map(key => [key, form.get(key)])));
  if (!parsed.success) return { message: parsed.error.issues[0]?.message ?? "Check the form." };
  const input = parsed.data;
  const city = cities.find(item => item.label === input.city);
  if (!city) return { message: "Choose a supported city." };
  const { error } = await db.from("studs").insert({
    owner_id: user.id, name: input.name, breed: input.breed, price: input.price,
    akc_number: input.akcNumber, brucellosis_date: input.brucellosisDate,
    status: "draft", ...createPublicLocation(city),
  });
  if (error) return { message: "Unable to save this stud. Check your profile and listing details." };
  revalidatePath("/studs");
  revalidatePath("/dashboard/animals");
  redirect("/dashboard/animals");
}
