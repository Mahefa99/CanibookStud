import type { Metadata } from "next";
import Link from "next/link";
import { SponsorApplicationForm } from "@/components/forms/sponsor-application-form";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { SPONSOR_PRICING } from "@/lib/config/pricing";
import { DEMO_EVENTS } from "@/lib/data/demo/events";
import { formatUsd } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Sponsorship",
  description:
    "Sample sponsor plans for the site and for club events. No campaign, impression or click is represented.",
};

interface SponsorsPageProps {
  searchParams: Promise<{ event?: string }>;
}

export default async function SponsorsPage({ searchParams }: SponsorsPageProps) {
  const { event: eventSlug } = await searchParams;
  const event = DEMO_EVENTS.find((entry) => entry.slug === eventSlug);

  return (
    <>
      <PageHeader
        eyebrow="Sponsorship · demo"
        title="Sponsor the useful part."
        description="A defined set of placements, with the inventory written down. No fake partner, impression or click is shown."
        actions={
          <Link
            href="#apply"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Start a sample application
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        }
      />

      <div className="shell py-8 lg:py-10">
        <Alert tone="info" title="Inventory preview">
          The prices below come from the source documents. No sponsor has been sold, no banner is
          live, and no campaign metric is invented. Sponsor approval and payment are not
          connected.
        </Alert>

        <section aria-labelledby="site-plans-heading" className="mt-8">
          <h2 id="site-plans-heading" className="font-display text-2xl text-navy-900">
            Site sponsorship
          </h2>
          <p className="mt-1 text-[12px] text-muted">Monthly plans. Placements are defined per tier.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {SPONSOR_PRICING.site.map((tier) => (
              <article key={tier.id} className="rounded-2xl border border-line bg-white p-6 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">Site</p>
                    <h3 className="mt-1 font-display text-2xl text-navy-900">{tier.name}</h3>
                  </div>
                  <p className="tabular font-display text-3xl text-navy-900">
                    {formatUsd(tier.monthlyUsd)}
                    <span className="text-[11px] font-normal text-muted">/mo</span>
                  </p>
                </div>
                <ul className="mt-4 space-y-2 text-[12px] leading-relaxed text-muted">
                  {(tier.id === "premium"
                    ? [
                        "Home page top banner (728×90)",
                        "Sidebar on breed pages",
                        "Sponsor attribution on selected lists",
                        "Creative approval required",
                      ]
                    : [
                        "Sidebar on breed pages",
                        "Sponsor logo listing",
                        "Creative approval required",
                      ]
                  ).map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success-600" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[10px] leading-relaxed text-muted">
                  Placement availability is not guaranteed until a contract is signed. No ads on
                  animal profiles, checkout, contracts or personal spaces.
                </p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="event-plans-heading" className="mt-10">
          <h2 id="event-plans-heading" className="font-display text-2xl text-navy-900">
            Event sponsorship
          </h2>
          <p className="mt-1 text-[12px] text-muted">
            One-time per event. The announced 50/50 club/platform split still needs contract terms.
          </p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {SPONSOR_PRICING.event.map((tier) => (
              <article key={tier.id} className="rounded-2xl border border-line bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-xl text-navy-900">{tier.name}</h3>
                  <p className="tabular font-display text-2xl text-navy-900">
                    {formatUsd(tier.amountUsd)}
                    <span className="text-[11px] font-normal text-muted"> / event</span>
                  </p>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-muted">
                  Logo on the event page and ticket email, subject to creative approval. The split is
                  announced at 50/50 but is not presented as a signed policy.
                </p>
              </article>
            ))}
          </div>
          {event ? (
            <p className="mt-3 rounded-xl border border-line bg-cream-50 p-3 text-[11px] text-muted">
              Selected event: <strong className="text-ink">{event.title}</strong> ·{" "}
              {event.city}, {event.stateCode}. The form below will use this event.
            </p>
          ) : null}
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-3">
          {[
            ["Creative review", "A logo or banner is checked before publication. No approval is implied by this page."],
            ["Reporting", "No campaign metrics or attendee counts are shown because no campaign exists."],
            ["Payment", "Sponsor checkout is not connected. A plan is not active until payment and approval."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-2xl border border-line bg-cream-50 p-5">
              <p className="text-sm font-semibold text-navy-900">{title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </section>

        <section id="apply" className="mt-10 scroll-mt-24 rounded-2xl border border-line bg-white p-6 shadow-card">
          <h2 className="font-display text-2xl text-navy-900">Sample application</h2>
          <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted">
            This form does not create a sponsorship. It previews the fields, the local creative
            picker, the review state and the disabled payment step.
          </p>
          <div className="mt-5">
            <SponsorApplicationForm eventSlug={event?.slug} eventTitle={event?.title} />
          </div>
        </section>
      </div>
    </>
  );
}
