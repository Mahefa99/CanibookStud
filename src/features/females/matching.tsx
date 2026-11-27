import { DepositCheckout } from "@/src/features/payments/components/deposit-checkout";
import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { FemaleForm } from "./forms";

export async function MatchPicker({stud,female}:{stud?:string;female?:string}) {
  const db=createClient();
  const {data:{user}}=await db.auth.getUser();
  if(!user) return <Link href="/login">Log in to propose a match</Link>;
  if (stud) {
    const {data:accepted,error}=await db.from("mating_proposals").select("id")
      .eq("stud_id",stud).eq("female_owner",user.id).eq("status","accepted").limit(1).maybeSingle();
    if(error) throw Error("Unable to load the match status.");
    if(accepted) return <DepositCheckout studId={stud}/>;
  }
  const result=stud
    ? await db.from("females").select("id,name").eq("owner_id",user.id).neq("availability","Unavailable")
    : await db.from("studs").select("id,name").eq("owner_id",user.id).eq("status","published");
  if(result.error) throw Error("Unable to load your animals.");
  return result.data.length ? <FemaleForm action="propose" label="Propose a match">
    <input type="hidden" name={stud?"stud":"female"} value={stud ?? female}/>
    <label className="field-label">{stud?"Your female":"Your stud"}<select name={stud?"female":"stud"}>{result.data.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}</select></label>
    <p>The female owner makes the final decision.</p></FemaleForm> : <Link href="/dashboard/animals">Manage your animals to propose a match</Link>;
}
