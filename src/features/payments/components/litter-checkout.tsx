"use client";
import { useState } from "react";
import { CardCheckout } from "./card-checkout";
import { createLitterIntent } from "../actions/create-litter-intent";

export function LitterCheckout({listing,count}:{listing:string;count:number}) {
  const [puppy,setPuppy] = useState(1);
  return <section><label className="field-label">Puppy number (1–{count})
    <input className="form-input" type="number" min={1} max={count} value={puppy || ""} onChange={e=>setPuppy(Number(e.target.value))} /></label>
    {Number.isInteger(puppy) && puppy>=1 && puppy<=count &&
      <CardCheckout key={puppy} title={"Puppy #"+puppy} label="Reserve this Puppy" startOrder={()=>createLitterIntent(listing,puppy)} />}
  </section>;
}
