"use client";
import { useFormState } from "react-dom";
import type { ReactNode } from "react";
import { SubmitButton } from "@/src/features/auth/components/submit-button";
import { calendarAction } from "./action";

export function CalendarForm({action,id,label,children}:{action:string;id?:string;label:string;children?:ReactNode}) {
  const [message,submit]=useFormState(calendarAction,"");
  return <form action={submit} className="space-y-2"><input type="hidden" name="action" value={action}/>
    {id && <input type="hidden" name="id" value={id}/>} {children}
    <SubmitButton label={label}/><p role="status">{message}</p></form>;
}
