import { SponsorBooking } from "@/components/forms/sponsor-booking";
import type { Metadata } from "next";
import Link from "next/link";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: "Sponsorships" };

export default function DashboardSponsorshipsPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Sponsorships</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">
          Sponsorships
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          A preview of a sponsor workspace. No campaign exists, so no
          impression, click or audience metric is shown.
        </p>
      </header>

      <Alert tone="info" title="No active campaign">
        The demo account does not hold the Sponsor activity. The public
        sponsorship page documents the plans and placements; this workspace
        remains empty until a campaign exists.
      </Alert>

      <EmptyState
        icon="star"
        title="No sponsorships yet"
        description="A sponsorship appears after a creative review and a confirmed payment. The platform does not invent a campaign to fill this screen."
        action={
          <ButtonLink href="/sponsors" size="sm">
            View sponsor plans
          </ButtonLink>
        }
        secondaryAction={
          <Link
            href="/sponsors#apply"
            className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-4 text-xs font-semibold text-navy-800"
          >
            Sample application
          </Link>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        {[
          ["Placement", "Site or event, with a defined creative size."],
          ["Review", "Creative approval is separate from payment."],
          ["Reporting", "Metrics appear only after a campaign is served."],
        ].map(([title, body]) => (
          <div
            key={title}
            className="rounded-xl border border-line bg-cream-50 p-4"
          >
            <p className="flex items-center gap-2 text-sm font-semibold text-navy-900">
              <Icon name="star" className="h-3.5 w-3.5 text-navy-400" />
              {title}
            </p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">
              {body}
            </p>
          </div>
        ))}
      </section>
      <SponsorBooking />
    </div>
  );
}
