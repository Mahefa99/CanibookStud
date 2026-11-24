"use client";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/src/features/auth/components/submit-button";
import { reviewLicense,submitLicense } from "./actions";

export function LicenseUpload() {
  const [message,action]=useFormState(submitLicense,"");
  return <form action={action} className="space-y-3">
    <label className="field-label">USDA license number<input className="form-input" name="number" required maxLength={100}/></label>
    <label className="field-label">License document (PDF, JPEG or PNG, up to 1 MiB)<input required type="file" name="document" accept="application/pdf,image/jpeg,image/png"/></label>
    <p>A replacement document starts a new review.</p><SubmitButton label="Submit license"/><p role="status">{message}</p>
  </form>;
}

export function LicenseDecision({id}:{id:string}) {
  const [message,action]=useFormState(reviewLicense,"");
  return <form action={action} className="space-y-2"><input type="hidden" name="document_id" value={id}/>
    <label>Review decision <select required name="decision" defaultValue=""><option disabled value="">Select</option>
      <option value="verified">Verify document</option><option value="rejected">Reject document</option></select></label>
    <label className="field-label">Note for the breeder<textarea required name="note" maxLength={500}/></label>
    <SubmitButton label="Record review"/><p role="status">{message}</p></form>;
}
