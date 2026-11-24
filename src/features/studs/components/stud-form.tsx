"use client";

import { useFormState } from "react-dom";
import { cities } from "@/src/lib/geo/cities";
import { SubmitButton } from "@/src/features/auth/components/submit-button";
import { createStud } from "../actions/create-stud";

export function StudForm() {
  const [state, action] = useFormState(createStud, { message: "" });
  return <form action={action} className="surface max-w-xl space-y-4 p-6">
    <label className="field-label">Name<input className="form-input" name="name" required maxLength={100} /></label>
    <label className="field-label">Breed<input className="form-input" name="breed" required maxLength={100} /></label>
    <label className="field-label">Stud fee (USD)<input className="form-input" name="price" type="number" min="0" max="21474836.47" step="0.01" required /></label>
    <label className="field-label">Nearest supported city<select className="form-input" name="city" required defaultValue="">
      <option value="" disabled>Choose a city</option>{cities.map(city => <option key={city.label}>{city.label}</option>)}
    </select></label>
    <p className="field-hint">Your map pin uses an approximate city location.</p>
    <label className="field-label">AKC number<input className="form-input" name="akcNumber" maxLength={150} /></label>
    <label className="field-label">Brucellosis collection date<input className="form-input" name="brucellosisDate" type="date" /></label>
    <p>Save a draft, then upload an Embark or Wisdom Panel DNA report from Your animals to publish.</p>
    <p role="status">{state.message}</p><SubmitButton label="Save private draft" />
  </form>;
}
