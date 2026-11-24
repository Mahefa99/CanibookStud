"use client";
import { useFormState } from "react-dom";
import { subscribe } from "../actions/subscribe";
import { SubmitButton } from "@/src/features/auth/components/submit-button";

export function SubscribeForm({plan,cadence}:{plan:string;cadence:string}) {
  const [message,action]=useFormState(subscribe,"");
  return <form action={action}><input name="plan" type="hidden" value={plan}/>
    <input name="cadence" type="hidden" value={cadence}/>
    <SubmitButton label="Open test checkout"/><p role="status">{message}</p></form>;
}
