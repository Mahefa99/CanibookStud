import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export const metadata = { title: "Forgot password", robots: { index: false, follow: false } };

export default function ForgotPasswordPage({ searchParams }: { searchParams: { expired?: string } }) {
  return <AuthLayout title="Recover your account" subtitle="Use the email address you registered with.">
    <h1 className="font-display text-4xl">Forgot your password?</h1>
    {searchParams.expired && <p role="alert">This link is invalid or expired. Request a new one and open it in this browser.</p>}
    <div className="my-5"><ForgotPasswordForm /></div>
    <Link href="/login" className="underline">Back to log in</Link>
  </AuthLayout>;
}
