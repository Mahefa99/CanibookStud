"use client";

import { useFormState } from "react-dom";
import { signUp } from "../actions/sign-up";
import { SubmitButton } from "./submit-button";
import { activities } from "../types";
export function SignupForm() {
  const [state, action] = useFormState(signUp, { message: "" });
  return (
    <form action={action} className="mt-5 space-y-4">
      <label className="field-label">Display name<input className="form-input" name="display_name" autoComplete="name" required maxLength={100} /></label>
      <label className="field-label">Email<input className="form-input" name="email" type="email" autoComplete="email" required maxLength={254} /></label>
      <label className="field-label">Password<input className="form-input" name="password" type="password" autoComplete="new-password" minLength={8} maxLength={128} required /></label>
      <fieldset><legend className="field-label">Activities (choose at least one)</legend>
        {activities.map(activity => (
          <label key={activity} className="mr-4 inline-flex items-center gap-2 capitalize">
            <input type="checkbox" name="activities" value={activity} />{activity}
          </label>
        ))}
      </fieldset>
      <p role="status" className="text-sm text-danger-700">{state.message}</p>
      <SubmitButton label="Create an account" />
    </form>
  );
}
