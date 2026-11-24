"use client";
import { useEffect,useState } from "react";
import { getMessages } from "../actions/get-messages";
import { sendMessage } from "../actions/send-message";

export function ChatWindow({thread,viewer}:{thread:string;viewer:string}) {
  const [rows,setRows]=useState<Awaited<ReturnType<typeof getMessages>>>([]);
  const [text,setText]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [revision,setRevision]=useState(0);
  useEffect(()=>{
    let active=true;
    let timer:ReturnType<typeof setTimeout>;
    async function refresh(){
      try {const messages=await getMessages(thread); if(active)setRows(messages);}
      catch {if(active)setError("Unable to refresh messages.");}
      finally {if(active)timer=setTimeout(refresh,5000);}
    }
    void refresh();
    return ()=>{active=false;clearTimeout(timer);};
  },[thread,revision]);
  return <section className="surface space-y-3 p-4"><h3 className="font-semibold">Private conversation</h3>
    <ul>{rows.map(row=><li key={row.id}><strong>{row.sender_id===viewer?"You":"Other participant"}: </strong>{row.content}</li>)}</ul>
    <form onSubmit={async e=>{
      e.preventDefault(); if(busy)return;setBusy(true);setError("");
      try {if(!await sendMessage(thread,text)) throw Error();setText("");setRevision(v=>v+1);}
      catch {setError("Message could not be sent.");} finally {setBusy(false);}
    }}><label className="field-label">Message<textarea className="form-input" required maxLength={4000} value={text} onChange={e=>setText(e.target.value)} /></label>
    <button disabled={busy || !text.trim()} className="underline">Send message</button></form><p role="status">{error}</p></section>;
}
