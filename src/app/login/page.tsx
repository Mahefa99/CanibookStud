import Link from "next/link";
import { AuthLayout } from "@/components/layout/auth-layout";
import { LoginForm } from "@/src/features/auth/components/login-form";
import { authConfigured } from "@/src/lib/env/public";

export const metadata = { title: "Log in", robots: { index: false } };
export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <AuthLayout title="Welcome back." subtitle="Access your CanibookStud workspace.">
      <h1 className="font-display text-4xl text-navy-900">Log in</h1>
      {authConfigured() ? <LoginForm /> : <p className="my-5" role="status">Account access is unavailable in this local preview.</p>}
      <Link className="mt-4 inline-block underline" href="/signup">Create an account</Link>
    </AuthLayout>
  );
}
