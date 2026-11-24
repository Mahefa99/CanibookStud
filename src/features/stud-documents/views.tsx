import { createClient } from "@/src/lib/supabase/server";
import { requireAccess } from "@/src/lib/supabase/require-access";
import { publicCatalogClient } from "@/src/lib/supabase/public-catalog";
import { DocumentDecision } from "./forms";

const categories = {dna:"DNA panel",akc:"AKC registration",brucellosis:"Brucellosis report"};
export async function DocumentSignals({id}:{id:string}) {
  const {data,error}=await publicCatalogClient().rpc("stud_document_signals",{listing:id});
  if(error) return <p>Document verification unavailable.</p>;
  return <section><h2 className="font-semibold">Documentation</h2>{Object.entries(categories).map(([kind,label])=>{
    const state=data.find(row=>row.kind===kind)?.status;
    const description=state==="verified"?"Document verified":state==="pending"?"Document provided, awaiting review":
      state==="expired"?"Test outside the 14-day window":"No current document";
    return <p key={kind}>{label}: {description}</p>;
  })}</section>;
}
export async function DocumentQueue() {
  await requireAccess("/admin");
  const {data,error}=await createClient().from("stud_documents").select("id,stud_id,kind,reference")
    .eq("status","pending").order("submitted_at").order("id").limit(50);
  if(error) throw new Error("Unable to load animal documents.");
  return <section className="space-y-4"><h1 className="font-display text-3xl">Animal document review</h1>
    {!data.length && <p>No documents awaiting review.</p>}
    {data.map(d=><article key={d.id} className="surface space-y-2 p-4"><h2>{d.kind.toUpperCase()} · {d.reference}</h2>
      <p>Stud {d.stud_id}</p><a className="underline" href={`/api/stud-documents/${d.id}`}>Download submitted document</a>
      <DocumentDecision id={d.id}/></article>)}</section>;
}
