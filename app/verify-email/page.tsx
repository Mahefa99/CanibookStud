import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";

export default function VerifyEmailPage() {
  return <AuthLayout title="Confirm your email" subtitle="Open the confirmation link sent to the address you entered.">
    <h1 className="font-display text-4xl">Check your inbox</h1>
    <p className="my-4">After confirming your address, sign in to your workspace.</p>
    <Link href="/login" className="underline">Return to login</Link>
  </AuthLayout>;
}
