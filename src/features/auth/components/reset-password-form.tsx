"use client";

import { useFormState } from "react-dom";
import { resetPassword } from "../actions/reset-password";
import { SubmitButton } from "./submit-button";

export function ResetPasswordForm() {
  const [state, action] = useFormState(resetPassword, { message: "" });
  return <form action={action} className="mt-5 space-y-4">
    <label className="field-label">New password<input className="form-input" name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={128} /></label>
    <label className="field-label">Confirm new password<input className="form-input" name="confirm" type="password" autoComplete="new-password" required minLength={8} maxLength={128} /></label>
    <p role="status">{state.message}</p>
    <SubmitButton label="Save new password" />
  </form>;
}
