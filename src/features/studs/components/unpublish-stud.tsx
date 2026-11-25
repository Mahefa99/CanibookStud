"use client";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/src/features/auth/components/submit-button";
import { unpublishStud } from "../actions/unpublish-stud";

export function UnpublishStud({id}:{id:string}) {
  const [message,action]=useFormState(unpublishStud,"");
  return <form action={action}><input type="hidden" name="id" value={id}/>
    <SubmitButton label="Move to drafts"/><p role="status">{message}</p></form>;
}
