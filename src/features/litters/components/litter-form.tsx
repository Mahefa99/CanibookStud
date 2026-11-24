"use client";

import { useState } from "react";
import { useFormState } from "react-dom";
import { SubmitButton } from "@/src/features/auth/components/submit-button";
import { formatCivilDate } from "@/src/lib/dates";
import { createLitter } from "../actions/create-litter";
import { litterReadiness } from "../services/readiness";

export function LitterForm() {
  const [birth, setBirth] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [state, action] = useFormState(createLitter, { message: "" });
  const readiness = /^\d{4}-\d{2}-\d{2}$/.test(birth) ? litterReadiness(birth) : null;
  return <form action={action} className="surface max-w-xl space-y-4 p-6">
    <label className="field-label">Breed<input className="form-input" name="breed" required maxLength={100} /></label>
    <label className="field-label">Date of birth<input className="form-input" name="birth" type="date" required value={birth} onChange={e=>setBirth(e.target.value)} /></label>
    <p role="status" className={readiness?.ready ? "text-success-700" : "text-warning-700"}>{readiness && (readiness.ready ? "Ready to go!" : "Not ready until " + formatCivilDate(readiness.readyDate))}</p>
    <label className="field-label">Number of puppies<input className="form-input" name="count" type="number" required min="1" step="1" /></label>
    <label className="field-label">Price per puppy (USD)<input className="form-input" name="price" type="number" required min="0" max="21474836.47" step="0.01" /></label>
    <label className="field-label">Photos (optional, up to four, 1 MiB each)<input className="form-input" name="photos" type="file" multiple accept="image/jpeg,image/png,image/webp" onChange={e=>{
      const files = Array.from(e.target.files ?? []);
      const message = files.length > 4 || files.some(f=>f.size > 1048576) ? "Choose at most four photos of up to 1 MiB each." : "";
      e.target.setCustomValidity(message);
      setPhotoError(message);
    }} /></label>
    <p role="status">{photoError || state.message}</p>
    <SubmitButton label="Publish free listing for 7 days" />
  </form>;
}
