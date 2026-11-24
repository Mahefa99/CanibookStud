"use client";
import { useFormState } from "react-dom";
import { reviewCase } from "./review-case";
import { SubmitButton } from "@/src/features/auth/components/submit-button";

export function ReviewForm({id,canApprove}:{id:string;canApprove:boolean}) {
  const [message,action] = useFormState(reviewCase,"");
  return <form action={action} className="space-y-2">
    <input type="hidden" name="case_id" value={id}/>
    <label className="field-label">Decision<select required name="decision" defaultValue="" className="form-input">
      <option value="" disabled>Select a decision</option><option value="approved" disabled={!canApprove}>Approve</option>
      <option value="rejected">Reject</option></select></label>
    <label className="field-label">Review note (visible to the applicant)<textarea name="note" required maxLength={500} className="form-input"/></label>
    <SubmitButton label="Record review"/><p role="status">{message}</p>
  </form>;
}
