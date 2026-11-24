import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";
import { SignForm } from "./sign-form";

export async function ContractDetail({params}:{params:{id:string}}) {
  if (!z.string().uuid().safeParse(params.id).success) notFound();
  const db = createClient();
  const {data:{user}} = await db.auth.getUser();
  if (!user) redirect("/login");
  const {data,error} = await db.from("reservation_contracts").select("id,terms,buyer_id").eq("id",params.id).maybeSingle();
  if (error) throw new Error("Unable to load contract.");
  if (!data) notFound();
  const signatures = await db.from("contract_signatures").select("signer_id,signed_at").eq("contract_id",data.id);
  if (signatures.error) throw new Error("Unable to load signatures.");
  return <article className="shell space-y-4 py-10"><h1 className="font-display text-3xl">Reservation agreement</h1>
    {data.terms.filter(Boolean).map(line=><p key={line}>{line}</p>)}
    <Link className="underline" href={`/contracts/${data.id}/pdf`}>Download current PDF</Link>
    {signatures.data.map(s=><p key={s.signer_id}>{s.signer_id===data.buyer_id?"Buyer":"Breeder"} signed {s.signed_at}</p>)}
    {!signatures.data.some(s=>s.signer_id===user.id) && <SignForm id={data.id}/>}
  </article>;
}

export async function ContractList() {
  const {data,error} = await createClient().from("reservation_contracts").select("id,issued_at").order("issued_at",{ascending:false});
  if (error) throw new Error("Unable to list contracts.");
  return <section className="space-y-4"><h1 className="font-display text-3xl">My contracts</h1>
    {data.length===0 && <p>Your agreements appear here after payment confirmation.</p>}
    {data.map(c=><p key={c.id}><Link className="underline" href={`/contracts/${c.id}`}>Reservation {c.id}</Link> · {c.issued_at.slice(0,10)}</p>)}
  </section>;
}
