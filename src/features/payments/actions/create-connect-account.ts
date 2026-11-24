"use server";
import { redirect } from "next/navigation";
import { ensureConnectAccount } from "../services/connect";

export async function createConnectAccount(): Promise<void> {
  await ensureConnectAccount();
  redirect("/api/stripe/connect");
}
