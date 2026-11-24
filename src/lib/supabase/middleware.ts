import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getPublicEnv } from "../env/public";
import { protectedRedirect } from "./access";
import type { Database } from "../../types/database";

export async function updateSession(request: NextRequest): Promise<NextResponse> {
  // A local catalog preview can run anonymously until Supabase is provisioned.
  // Partial credentials and production deployments still require valid settings.
  if (
    process.env.NODE_ENV === "development" &&
    process.env.NEXT_PUBLIC_DATA_MODE === "demo" &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ) {
    const destination = protectedRedirect(request.nextUrl.pathname, null);
    if (!destination) return NextResponse.next({ request });
    const redirect = NextResponse.redirect(new URL(destination, request.url));
    redirect.headers.set("Cache-Control", "private, no-store");
    return redirect;
  }
  const { url, publishableKey } = getPublicEnv();
  let response = NextResponse.next({ request });
  const client = createServerClient<Database>(url, publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(updates) {
        for (const { name, value } of updates) request.cookies.set(name, value);
        const previous = response;
        response = NextResponse.next({ request });
        for (const cookie of previous.cookies.getAll()) response.cookies.set(cookie);
        for (const { name, value, options } of updates) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  const { data, error } = await client.auth.getUser();
  const destination = protectedRedirect(request.nextUrl.pathname, error ? null : data.user);
  if (destination) {
    const redirect = NextResponse.redirect(new URL(destination, request.url));
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    redirect.headers.set("Cache-Control", "private, no-store");
    return redirect;
  }
  if (response.cookies.getAll().length > 0 || data.user) {
    response.headers.set("Cache-Control", "private, no-store");
  }
  return response;
}
