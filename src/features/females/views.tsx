import Link from "next/link";
import { notFound,redirect } from "next/navigation";
import { cities } from "@/src/lib/geo/cities";
import { createClient } from "@/src/lib/supabase/server";
import { authConfigured } from "@/src/lib/env/public";
import { FemaleForm,PhotoField } from "./forms";
import { MatchPicker } from "./matching";

const availability=["Available","In heat soon","Unavailable"];
function Select({label,name,options,value}:{label:string;name:string;options:readonly string[];value?:string}) {
  return <label className="field-label">{label}<select className="form-input" name={name} defaultValue={value}>{options.map(o=><option key={o}>{o}</option>)}</select></label>;
}
export function NewFemale() {
  const today=new Date().toISOString().slice(0,10);
  return <section className="surface max-w-xl space-y-4 p-6"><h1 className="font-display text-4xl">Add a female</h1><p>Your profile starts hidden. You can publish it from Your females.</p>
    <FemaleForm action="create" label="Save private profile"><PhotoField/>
    <label className="field-label">Name<input className="form-input" required name="name" maxLength={60}/></label>
    <label className="field-label">Breed<input className="form-input" required name="breed" maxLength={80}/></label>
    <label className="field-label">Birth date<input required type="date" name="birth_date" max={today}/></label>
    <Select name="city" label="Nearest public city" options={cities.map(c=>c.label)}/>
    <Select name="health" label="Health screening" options={["Not provided","Screening pending","Screening completed"]}/>
    <Select name="vaccines" label="Vaccinations" options={["Not provided","Up to date","Update pending"]}/>
    <label className="field-label">Brucellosis test date<input type="date" name="brucellosis_date" max={today}/></label>
    <Select name="availability" label="Availability" options={availability}/></FemaleForm></section>;
}

export async function Directory({searchParams}:{searchParams:{q?:string;availability?:string}}) {
  const q=searchParams.q?.trim().toLowerCase() || "";
  const db=authConfigured()?createClient():null;
  let query=db?.from("females").select("id,name,breed,city,availability").eq("visible",true).order("name");
  if(query && availability.includes(searchParams.availability ?? "")) query=query.eq("availability",searchParams.availability!);
  const result=query?await query:null;
  if(result?.error) throw Error("Unable to load the female directory.");
  const rows=(result?.data ?? []).filter(f=>(f.name+" "+f.breed+" "+f.city).toLowerCase().includes(q));
  return <main className="shell space-y-6 py-10"><h1 className="font-display text-4xl">Females</h1>
    <form className="flex flex-wrap items-end gap-3"><label className="field-label">Name, breed or city<input name="q" className="form-input" defaultValue={searchParams.q}/></label>
    <Select name="availability" label="Availability" options={["All",...availability]} value={searchParams.availability}/><button className="underline">Search</button></form>
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{rows.map(f=><Link className="surface overflow-hidden" key={f.id} href={"/females/"+f.id}>
      <img width="320" height="240" className="w-full" alt={f.name} src={"/females/"+f.id+"/photo"}/><div className="p-4"><h2>{f.name}</h2><p>{f.breed} · {f.city} area</p><p>{f.availability}</p></div></Link>)}</div>
    {!rows.length && <p>No visible females match your search.</p>}</main>;
}

export async function Profile({params}:{params:{id:string}}) {
  if(!authConfigured()) notFound();
  const {data:f,error}=await createClient().from("females").select("id,name,breed,city,birth_date,pedigree_verified,health,vaccines,brucellosis_date,availability").eq("id",params.id).eq("visible",true).maybeSingle();
  if(error && error.code!=="22P02") throw Error("Unable to load this profile.");
  if(!f) notFound();
  const today=new Date().toISOString().slice(0,10);
  const years=Number(today.slice(0,4))-Number(f.birth_date.slice(0,4))-Number(today.slice(5)<f.birth_date.slice(5));
  return <article className="shell space-y-4 py-10"><Link href="/females">Back to females</Link><h1 className="font-display text-4xl">{f.name}</h1>
    <img src={"/females/"+f.id+"/photo"} width="320" height="240" alt={f.name}/><p>{f.breed} · {years===0?"Under one year":years+(years===1?" year":" years")} · {f.city} area</p>
    <p>Pedigree: {f.pedigree_verified?"Verified":"Pending verification"}</p><p>Health screening (owner reported): {f.health}</p>
    <p>Vaccinations (owner reported): {f.vaccines}</p><p>Brucellosis test date (owner reported): {f.brucellosis_date ?? "Not provided"}</p><p>{f.availability}</p>
    {f.availability!=="Unavailable" && <MatchPicker female={f.id}/>}</article>;
}

export async function Workspace() {
  const db=createClient();
  const {data:{user}}=await db.auth.getUser();
  if(!user) redirect("/login");
  const [animals,proposals]=await Promise.all([db.from("females").select("id,name,visible,availability").eq("owner_id",user.id).order("name"),db.from("mating_proposals").select("id,female_name,stud_name,female_owner,stud_owner,status,stud_id").order("created_at",{ascending:false})]);
  if(animals.error || proposals.error) throw Error("Unable to load your animals and proposals.");
  return <section className="space-y-5"><h1 className="font-display text-4xl">Your females</h1><Link className="underline" href="/dashboard/animals/new/dam">Add a female</Link>
    {animals.data.map(f=><article className="surface p-4" key={f.id}><h2>{f.name} · {f.visible?"Visible":"Hidden"}</h2><FemaleForm action="settings" label="Save settings">
    <input name="id" type="hidden" value={f.id}/><label><input type="checkbox" name="visible" defaultChecked={f.visible}/> Show in the female directory</label>
    <Select name="availability" label="Availability" options={availability} value={f.availability}/></FemaleForm></article>)}
    <h2 className="font-display text-2xl">Mating proposals</h2>{!proposals.data.length && <p>No proposals yet.</p>}
    {proposals.data.map(p=><article className="surface space-y-2 p-4" key={p.id}><h3>{p.female_name} × {p.stud_name}</h3><p>{p.status.replace("awaiting_","Awaiting ").replace("female","female owner’s final decision").replace("stud","stud owner’s response")}</p>
    {((p.status==="awaiting_female" && p.female_owner===user.id)||(p.status==="awaiting_stud" && p.stud_owner===user.id)) && <div className="flex gap-3">{["accept","decline"].map(a=><FemaleForm key={a} action={a} label={a==="decline"?"Decline":p.status==="awaiting_female"?"Confirm match":"Express interest"}><input type="hidden" name="id" value={p.id}/></FemaleForm>)}</div>}
    {p.status==="accepted" && p.female_owner===user.id && <Link className="underline" href={"/studs/"+p.stud_id}>Continue to stud deposit</Link>}</article>)}</section>;
}
