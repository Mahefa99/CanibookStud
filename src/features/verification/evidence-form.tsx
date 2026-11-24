"use client";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/src/features/auth/components/submit-button";
import { submitEvidence } from "./submit-evidence";

export function EvidenceForm() {
  const [message,action] = useFormState(submitEvidence,"");
  return <form action={action} className="surface space-y-4 p-5">
    <p>Your selfie and identity document will be available to you and the verification team. Choose JPEG or PNG images up to 1 MiB each.</p>
    <label className="field-label">Selfie<input required type="file" name="selfie" accept="image/jpeg,image/png"/></label>
    <label className="field-label">Identity document<input required type="file" name="identity" accept="image/jpeg,image/png"/></label>
    <SubmitButton label="Submit for identity review"/><p role="status">{message}</p>
  </form>;
}
