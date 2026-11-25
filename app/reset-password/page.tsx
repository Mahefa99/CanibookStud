import { redirect } from "next/navigation";
import { AuthLayout } from "@/components/layout/auth-layout";
import { ResetPasswordForm } from "@/src/features/auth/components/reset-password-form";
import { createClient } from "@/src/lib/supabase/server";

export default async function ResetPasswordPage() {
  if (!(await createClient().auth.getUser()).data.user) redirect("/forgot-password?expired=1");
  return <AuthLayout title="Account recovery" subtitle="Choose a new password for CanibookStud.">
    <h1 className="font-display text-4xl">Reset password</h1>
    <ResetPasswordForm />
  </AuthLayout>;
}
