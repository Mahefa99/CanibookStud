import Link from "next/link";
import type { Metadata } from "next";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: "Contracts" };

export default function ContractsPage() {
  return (
    <div className="space-y-6"><Link className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-700" href="/contracts/CB-PUPPY-2026-1042">Preview puppy agreement and handover options</Link>
      <header>
        <p className="eyebrow">Contracts</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Contracts</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          A contract is a separate state from payment, acceptance and payout. No contract is
          generated or signed in this preview.
        </p>
      </header>

      <Alert tone="warning" title="Draft templates only">
        Contract templates and e-signature are not connected. The terms shown elsewhere in the
        prototype are drafts pending legal review, not enforceable terms.
      </Alert>

      <EmptyState
        icon="file"
        title="No signed contracts yet"
        description="A contract appears after both owners agree to proceed. It is not created automatically by a payment."
        action={<ButtonLink href="/contracts/CB-2026-1042" size="sm">Preview a draft contract</ButtonLink>}
        secondaryAction={
          <ButtonLink href="/dashboard/requests" size="sm" variant="secondary">
            View requests
          </ButtonLink>
        }
      />

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Draft", "Generated from the profile data for review."],
          ["Sent", "Shared with both parties for signature."],
          ["Signed", "Both parties signed; a copy is stored privately."],
          ["Voided", "Cancelled before or after signature; history retained."],
        ].map(([label, description]) => (
          <div key={label} className="rounded-2xl border border-line bg-white p-4">
            <Icon name="file" className="h-4 w-4 text-navy-400" />
            <p className="mt-2 text-sm font-semibold text-ink">{label}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">{description}</p>
          </div>
        ))}
      </section>

      <p className="rounded-xl border border-line bg-cream-50 p-4 text-[11px] leading-relaxed text-muted">
        Document storage, signature audit trails and access rules must be defined with the backend
        team. Private contract files must never have a permanent public link.
      </p>
    </div>
  );
}
