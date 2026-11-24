"use client";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/src/features/auth/components/submit-button";
import { signContract } from "./sign-contract";

export function SignForm({id}:{id:string}) {
  const [message, action] = useFormState(signContract, "");
  return <form action={action} className="space-y-4">
    <input type="hidden" name="id" value={id}/>
    <label><input required type="checkbox" name="agree"/> I have read this agreement and consent to sign it electronically.</label>
    <SubmitButton label="Sign agreement"/><p role="status">{message}</p>
  </form>;
}
