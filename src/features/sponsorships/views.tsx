import Link from "next/link";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/src/lib/supabase/server";
import { publicCatalogClient } from "@/src/lib/supabase/public-catalog";
import { CalendarForm } from "./form";

export async function Calendar({searchParams}:{searchParams:{day?:string}}) {
  const today=new Date().toISOString().slice(0,10);
  const parsed=z.string().date().safeParse(searchParams.day);
  const day=parsed.success && parsed.data>=today?parsed.data:today;
  const {data,error}=await publicCatalogClient().rpc("sponsor_calendar",{day_filter:day});
  if(error) throw new Error("Unable to load sponsorship calendar.");
  return <section className="shell space-y-4 py-10"><h1 className="font-display text-3xl">Event sponsorship calendar</h1>
    <form><label>Placement date (UTC) <input type="date" name="day" min={today} defaultValue={day}/></label> <button>Show slots</button></form>
    {!data.length && <p>No event placements on this date.</p>}
    {data.map(s=><article key={s.slot} className="surface space-y-2 p-4"><h2>{s.event_name} · {s.placement}</h2>
      {s.available?<CalendarForm action="hold" id={s.slot} label="Hold for 15 minutes"/>:<p>Unavailable</p>}</article>)}
    <Link className="underline" href="/dashboard/sponsorships">Manage sponsorships</Link></section>;
}

export async function Workspace() {
  const db=createClient();
  const {data:{user}}=await db.auth.getUser();
  if(!user) redirect("/login");
  const [roles,requests]=await Promise.all([
    db.from("account_activities").select("activity").eq("profile_id",user.id),
    db.from("sponsor_requests").select("id,status,sponsor_id,proposal,deadline,sponsor_slots(event_name,placement,slot_day,club_id)").order("deadline",{ascending:false})
  ]);
  if(roles.error || requests.error) throw new Error("Unable to load sponsorships.");
  const today=new Date().toISOString().slice(0,10);
  return <section className="space-y-4"><h1 className="font-display text-3xl">Event sponsorships</h1>
    <Link className="underline" href="/sponsors/calendar">Open placement calendar</Link>
    {roles.data.some(r=>r.activity==="club") && <CalendarForm action="create" label="Publish placement">
      <label className="field-label">Event name<input name="event_name" required maxLength={100}/></label>
      <label className="field-label">Placement name<input name="placement" required maxLength={100}/></label>
      <label className="field-label">Placement date (UTC)<input name="slot_day" type="date" min={today} required/></label>
    </CalendarForm>}
    {!requests.data.length && <p>No sponsorship requests yet.</p>}
    {requests.data.map(r=>{
      const slot=r.sponsor_slots;
      const expired=["pending","held"].includes(r.status) && (Date.parse(r.deadline)<=Date.now() || (slot && slot.slot_day<today));
      const state=expired?"expired":r.status;
      return <article key={r.id} className="surface space-y-2 p-4"><h2>{slot?.event_name} · {slot?.placement}</h2>
        <p>{slot?.slot_day} · {state}</p>{r.proposal && <p>{r.proposal}</p>}
        {["pending","held"].includes(state) && <p>Deadline: {new Date(r.deadline).toUTCString()}</p>}
        {state==="held" && r.sponsor_id===user.id && <CalendarForm action="submit" id={r.id} label="Submit proposal"><label className="field-label">Proposal<textarea required maxLength={2000} name="proposal"/></label></CalendarForm>}
        {state==="pending" && slot?.club_id===user.id && <div className="flex gap-4"><CalendarForm action="accepted" id={r.id} label="Accept proposal"/><CalendarForm action="declined" id={r.id} label="Decline proposal"/></div>}
      </article>;
    })}</section>;
}
