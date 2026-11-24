import { BreederLicense } from "@/src/features/breeder-licenses/views";
import { redirect } from "next/navigation";
import { createClient } from "@/src/lib/supabase/server";
import { EraseEvidenceForm } from "./erase-evidence-form";
import { EvidenceForm } from "./evidence-form";

export async function VerificationPage() {
  const db = createClient();
  const {data:{user}} = await db.auth.getUser();
  if (!user) redirect("/login");
  const {data,error} = await db.from("kyc_cases").select("id,status,review_note,created_at,evidence_deleted_at,kyc_evidence(kind)")
    .eq("profile_id",user.id).order("created_at",{ascending:false});
  if (error) throw new Error("Unable to load your verification status.");
  return <section className="space-y-4"><h1 className="font-display text-3xl">Identity verification</h1>
    {!data.some(c=>c.status!=="rejected") && <EvidenceForm/>}
    {data.map(c=><article key={c.id} className="surface p-4"><h2>Identity check · {c.status}</h2>
      <p>Submitted {c.created_at.slice(0,10)}</p><p>{c.review_note}</p>
      {c.evidence_deleted_at ? <p>Documents removed on {c.evidence_deleted_at.slice(0,10)}.</p> :
        c.status !== "pending" && c.kyc_evidence.length > 0 && <EraseEvidenceForm id={c.id}/>}
    </article>)}
    <BreederLicense owner={user.id}/>
  </section>;
}
