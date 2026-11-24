import type { Metadata } from "next";
import { SettingsForm } from "@/components/forms/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Settings</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Settings</h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          Account details and the activities attached to this profile. Sensitive identity and
          payout data are not collected in the preview.
        </p>
      </header>

      <SettingsForm />
    </div>
  );
}
