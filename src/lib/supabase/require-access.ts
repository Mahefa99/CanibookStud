import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "./server";
import { protectedRedirect } from "./access";

export async function requireAccess(path: "/admin" | "/dashboard"): Promise<void> {
  const { data, error } = await createClient().auth.getUser();
  const destination = protectedRedirect(path, error ? null : data.user);
  if (destination) redirect(destination);
}
