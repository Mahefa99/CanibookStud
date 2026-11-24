"use client";

import { useFormState } from "react-dom";
import { signIn } from "../actions/sign-in";
import { SubmitButton } from "./submit-button";

export function LoginForm() {
  const [state, action] = useFormState(signIn, { message: "" });
  return (
    <form action={action} className="mt-5 space-y-4">
      
      <label className="field-label">Email<input className="form-input" name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      <label className="field-label">Password<input className="form-input" name="password" type="password" autoComplete="current-password"  required /></label>
      
      <p role="status" className="text-sm text-danger-700">{state.message}</p>
      <SubmitButton label="Log in" />
    </form>
  );
}
