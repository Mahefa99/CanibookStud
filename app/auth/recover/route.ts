import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const valid = code && !(await createClient("write").auth.exchangeCodeForSession(code)).error;
  const response = NextResponse.redirect(new URL(valid ? "/reset-password" : "/forgot-password?expired=1", request.url));
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}
