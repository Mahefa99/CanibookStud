"use client";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/src/features/auth/components/submit-button";
import { publishStud } from "../actions/publish-stud";

export function PublishDraft({id,akc,date}:{id:string;akc:string|null;date:string|null}) {
  const [message,action]=useFormState(publishStud,"");
  return <form action={action} className="space-y-2">
    <input type="hidden" name="id" value={id}/>
    <label className="field-label">AKC number<input className="form-input" name="akcNumber" required defaultValue={akc??""} maxLength={150}/></label>
    <label className="field-label">Brucellosis collection date<input className="form-input" type="date" name="brucellosisDate" required defaultValue={date??""}/></label>
    <SubmitButton label="Publish stud"/><p role="status">{message}</p>
  </form>;
}
