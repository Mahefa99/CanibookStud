import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { requireAccess } from "@/src/lib/supabase/require-access";
import { formatUsdCents } from "@/src/lib/money";
import { ReviewForm } from "./review-form";

type PageProps = {searchParams:{page?:string}};
function bounds(page?:string) {
  const n = Number(page);
  const current = Number.isSafeInteger(n) && n>0 && n<=1000000 ? n : 1;
  return { current, start:(current-1)*25, end:current*25 };
}
function Pager({page,more}:{page:number;more:boolean}) {
  return <nav className="flex gap-4">{page>1 && <Link href={`?page=${page-1}`}>Previous</Link>}
    {more && <Link href={`?page=${page+1}`}>Next</Link>}</nav>;
}

export async function Overview() {
  await requireAccess("/admin");
  const db = createClient();
  const results = await Promise.all([
    db.from("profiles").select("id",{count:"exact",head:true}),
    db.from("kyc_cases").select("id",{count:"exact",head:true}).eq("status","pending"),
    db.from("reservations").select("id",{count:"exact",head:true}).eq("status","paid")
  ]);
  if(results.some(r=>r.error)) throw new Error("Unable to load administration totals.");
  return <section className="space-y-4"><h1 className="font-display text-3xl">Administration overview</h1>
    <div className="grid gap-3 sm:grid-cols-3">{([
      ["Registered users","/admin/users"],["Pending identity checks","/admin/verifications"],["Paid reservations","/admin/transactions"]
    ] as const).map(([label,href],i)=><Link className="surface p-4" href={href} key={href}>{label}<strong className="block text-2xl">{results[i]?.count}</strong></Link>)}</div></section>;
}

export async function Verifications({searchParams}:PageProps) {
  await requireAccess("/admin");
  const {current,start,end} = bounds(searchParams.page);
  const {data,error} = await createClient().from("kyc_cases")
    .select("id,status,face_match_score,created_at,review_note,reviewed_at,profiles(display_name)")
    .order("status").order("created_at").order("id").range(start,end);
  if(error) throw new Error("Unable to load identity checks.");
  const ids = data.slice(0,25).map(c=>c.id);
  const evidence = ids.length ? await createClient().from("kyc_evidence").select("case_id,kind").in("case_id",ids) : {data:[],error:null};
  if (evidence.error) throw new Error("Unable to load evidence list.");
  return <section className="space-y-4"><h1 className="font-display text-3xl">Identity checks</h1>
    {!data.length && <p>No identity checks on this page.</p>}
    {data.slice(0,25).map(c=><article key={c.id} className="surface space-y-2 p-4">
      <h2>{c.profiles?.display_name} · {c.status}</h2><p>Case {c.id}</p>
      {evidence.data.filter(e=>e.case_id===c.id).map(e=><p key={e.kind}><a className="underline" href={`/api/verification/${c.id}/${e.kind}`}>Download {e.kind}</a></p>)}
      <p>Face match: {c.face_match_score===null?"Awaiting score":c.face_match_score+"%"}</p>
      {c.status==="pending" ? <ReviewForm id={c.id} canApprove={(c.face_match_score??0)>90}/> :
        <p>{c.review_note} {c.reviewed_at}</p>}</article>)}
    <Pager page={current} more={data.length>25}/></section>;
}

export async function Users({searchParams}:PageProps) {
  await requireAccess("/admin");
  const {current,start,end} = bounds(searchParams.page);
  const {data,error} = await createClient().from("profiles").select("id,display_name,created_at")
    .order("created_at",{ascending:false}).order("id").range(start,end);
  if(error) throw new Error("Unable to load users.");
  return <section className="space-y-4"><h1 className="font-display text-3xl">Registered users</h1>
    {!data.length && <p>No users on this page.</p>}
    {data.slice(0,25).map(p=><p key={p.id}>{p.display_name} · Joined {p.created_at.slice(0,10)}</p>)}
    <Pager page={current} more={data.length>25}/></section>;
}

export async function Transactions({searchParams}:PageProps) {
  await requireAccess("/admin");
  const {current,start,end} = bounds(searchParams.page);
  const {data,error} = await createClient().from("reservations").select("id,paid_at,deposit_cents,platform_fee_cents,completed_at")
    .eq("status","paid").order("paid_at",{ascending:false}).order("id").range(start,end);
  if(error) throw new Error("Unable to load transactions.");
  return <section className="space-y-4"><h1 className="font-display text-3xl">Paid reservations</h1>
    {!data.length && <p>No paid reservations on this page.</p>}
    {data.slice(0,25).map(r=><article className="surface p-4" key={r.id}><h2>Reservation {r.id}</h2>
      <p>Payment {formatUsdCents(r.deposit_cents)} · Platform fee {formatUsdCents(r.platform_fee_cents)}</p>
      <p>{r.completed_at?"Funds released":"Funds held"}</p></article>)}
    <Pager page={current} more={data.length>25}/></section>;
}
