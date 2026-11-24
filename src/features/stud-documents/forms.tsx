"use client";
import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/src/features/auth/components/submit-button";
import { uploadDocument,reviewDocument } from "./actions";

export function DocumentUpload({stud}:{stud:string}) {
  const [message,action]=useFormState(uploadDocument,"");
  const [kind,setKind]=useState("dna");
  return <details><summary>Submit health or registration document</summary><form action={action} className="space-y-3">
    <input type="hidden" name="stud" value={stud}/>
    <label className="field-label">Document type<select name="kind" value={kind} onChange={e=>setKind(e.target.value)}>
      <option value="dna">DNA panel</option><option value="akc">AKC registration</option><option value="brucellosis">Brucellosis report</option></select></label>
    {kind==="dna" && <label className="field-label">DNA provider<select name="provider"><option>Embark</option><option>Wisdom Panel</option></select></label>}
    <label className="field-label">PDF, JPEG or PNG (up to 1 MiB)<input required type="file" name="file" accept="application/pdf,image/jpeg,image/png"/></label>
    <p>Replacing a document starts a new review.</p><SubmitButton label="Submit document"/><p role="status">{message}</p>
  </form></details>;
}
export function DocumentDecision({id}:{id:string}) {
  const [message,action]=useFormState(reviewDocument,"");
  return <form action={action}><input type="hidden" name="document" value={id}/>
    <label>Review decision <select required name="decision" defaultValue=""><option disabled value="">Select</option>
      <option value="verified">Verify document</option><option value="rejected">Reject document</option></select></label>
    <SubmitButton label="Save decision"/><p role="status">{message}</p></form>;
}
