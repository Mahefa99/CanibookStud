import type { User } from "@supabase/supabase-js";

// Only a trusted backend can assign app_metadata.role.
export function protectedRedirect(path: string, user: User | null): "/login" | "/" | null {
  const admin = path === "/admin" || path.startsWith("/admin/");
  const dashboard = path === "/dashboard" || path.startsWith("/dashboard/");
  if ((dashboard || admin) && !user) return "/login";
  if (admin && user?.app_metadata.role !== "admin") return "/";
  return null;
}
