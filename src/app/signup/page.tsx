import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { SignupForm } from "@/src/features/auth/components/signup-form";
import { authConfigured } from "@/src/lib/env/public";

export const metadata = { title: "Create an account", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AuthLayout title="One account, several activities." subtitle="Choose the activities you will manage on CanibookStud.">
      <h1 className="font-display text-4xl text-navy-900">Create an account</h1>
      {authConfigured() ? <SignupForm /> : <p className="my-5" role="status">Account access is unavailable in this local preview.</p>}
      <Link className="mt-4 inline-block underline" href="/login">Already registered? Log in</Link>
    </AuthLayout>
  );
}
