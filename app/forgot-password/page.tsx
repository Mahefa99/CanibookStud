import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";

export const metadata: Metadata = {
  title: "Forgot password",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="A reset link, without leaking whether an account exists."
      subtitle="The production flow sends one neutral response. The preview validates the address and shows the response pattern without sending anything."
    >
      <p className="eyebrow">Password recovery</p>
      <h1 className="mt-3 font-display text-4xl leading-tight text-navy-900">Forgot your password?</h1>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Enter the email address you use for CanibookStud. No email is sent in this preview.
      </p>
      <div className="mt-5">
        <ForgotPasswordForm />
      </div>
      <p className="mt-5 border-t border-line pt-4 text-[11px] text-muted">
        <Link href="/login" className="font-semibold text-navy-800 underline underline-offset-2">
          Back to log in
        </Link>
        {" · "}
        <Link href="/verify-email" className="font-semibold text-navy-800 underline underline-offset-2">
          Email verification
        </Link>
      </p>
    </AuthLayout>
  );
}
