"use client";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/src/features/auth/components/submit-button";
import { eraseEvidence } from "./erase-evidence";

export function EraseEvidenceForm({id}:{id:string}) {
  const [message, action] = useFormState(eraseEvidence,"");
  return <details><summary>Remove identity documents</summary>
    <form className="space-y-2" action={action}>
      <input type="hidden" name="id" value={id}/>
      <label><input type="checkbox" name="confirm" required/> Permanently remove my selfie and ID image from this case. Keep my review decision.</label>
      <SubmitButton label="Remove both images"/><p role="status">{message}</p>
    </form></details>;
}
