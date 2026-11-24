import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/src/lib/supabase/server";

// The signup email template supplies a one-time token hash, including across devices.
export async function GET(request: NextRequest) {
  const hash = request.nextUrl.searchParams.get("token_hash");
  if (hash) {
    const { error } = await createClient("write").auth.verifyOtp({ type: "email", token_hash: hash });
    if (!error) return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return new NextResponse("Confirmation link invalid or expired. Return to login.", {
    status: 400, headers: { "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" },
  });
}
