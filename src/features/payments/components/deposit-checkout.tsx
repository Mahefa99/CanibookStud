"use client";
import { CardCheckout } from "./card-checkout";
import { createDepositIntent } from "../actions/create-deposit-intent";
export function DepositCheckout({studId}:{studId:string}) {
  return <CardCheckout title="Stud deposit" label="Reserve with a deposit" startOrder={()=>createDepositIntent(studId)} />;
}
