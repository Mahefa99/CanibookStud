import Link from "next/link";
import { createClient } from "@/src/lib/supabase/server";
import { ChatWindow } from "./chat-window";

export async function PaidThreads({animal}:{animal?:{kind:"stud_id"|"litter_id";id:string}}) {
  const db=createClient();
  const {data:{user}}=await db.auth.getUser();
  if(!user)return null;
  let query=db.from("conversations").select("id,buyer_id,stud_id,litter_id,created_at").order("created_at",{ascending:false});
  if(animal) query=query.eq(animal.kind,animal.id);
  const {data,error}=await query;
  if(error)return <p>Conversations are temporarily unavailable.</p>;
  if(!data.length)return animal?null:<p>Your conversations will appear after payment confirmation.</p>;
  return <div className="space-y-4">{await Promise.all(data.map(async thread=>{
    const buyer=user.id===thread.buyer_id;
    const contact=buyer ? (await db.rpc("breeder_contact",{thread:thread.id})).data?.[0] : null;
    const {data:reservation}=await db.from("reservations").select("puppy_number").eq("id",thread.id).maybeSingle();
    return <section key={thread.id}>
      <p>{thread.stud_id?"Stud request":"Puppy #"+reservation?.puppy_number} · Reservation {thread.id.slice(0,8)}</p>
      {!animal && <Link className="underline" href={thread.stud_id?"/studs/"+thread.stud_id:"/puppies/"+thread.litter_id}>View listing</Link>}
      {contact && <p>Breeder contact: {[contact.email,contact.phone].filter(Boolean).join(" · ")}</p>}
      <ChatWindow thread={thread.id} viewer={user.id}/>
    </section>;
  }))}</div>;
}
