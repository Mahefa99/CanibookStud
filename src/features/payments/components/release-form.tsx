"use client";

import { useFormState } from "react-dom";
import { releaseEscrow } from "../actions/release-escrow";
import { SubmitButton } from "@/src/features/auth/components/submit-button";

export function ReleaseForm({ id, stud }: { id: string; stud: boolean }) {
  const [message, action] = useFormState(releaseEscrow, "");
  return <form action={action}>
    <input type="hidden" name="reservation" value={id} />
    <SubmitButton label={stud ? "Confirm Mating / Release Funds" : "Release Funds"} />
    <p role="status">{message}</p>
  </form>;
}
