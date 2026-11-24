import { createClient } from "@/src/lib/supabase/server";
import { requireAccess } from "@/src/lib/supabase/require-access";
import { LicenseDecision,LicenseUpload } from "./forms";

export async function BreederLicense({owner}:{owner:string}) {
  const db=createClient();
  const role=await db.from("account_activities").select("activity").eq("profile_id",owner).eq("activity","breeder").maybeSingle();
  if(role.error) throw new Error("Unable to check breeder activity.");
  if(!role.data) return null;
  const {data,error}=await db.from("breeder_licenses").select("id,license_number,status,review_note").eq("breeder_id",owner).maybeSingle();
  if(error) throw new Error("Unable to load your license.");
  return <section className="surface space-y-3 p-4"><h2>USDA breeder license</h2>
    {data && <><p>{data.license_number} · {data.status}</p><p>{data.review_note}</p>
      <a className="underline" href={`/api/breeder-licenses/${data.id}`}>Download your submitted document</a></>}
    <LicenseUpload/></section>;
}

export async function LicenseQueue() {
  await requireAccess("/admin");
  const db=createClient();
  const {data:{user}}=await db.auth.getUser();
  if(!user) return null;
  const {data,error}=await db.from("breeder_licenses").select("id,breeder_id,license_number")
    .eq("status","pending").neq("breeder_id",user.id).order("submitted_at").order("id").limit(50);
  if(error) throw new Error("Unable to load USDA license queue.");
  return <section className="space-y-4"><h1 className="font-display text-3xl">USDA license review</h1>
    {!data.length && <p>No licenses awaiting your review.</p>}
    {data.map(d=><article key={d.id} className="surface space-y-2 p-4"><h2>License {d.license_number}</h2>
      <p>Breeder {d.breeder_id}</p><a className="underline" href={`/api/breeder-licenses/${d.id}`}>Download submitted license</a>
      <LicenseDecision id={d.id}/></article>)}</section>;
}
