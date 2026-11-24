import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoPortrait } from "@/components/domain/demo-portrait";
import { LitterPlanBadge, PuppyStatusBadge } from "@/components/domain/marketplace-badges";
import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";
import { DEMO_LITTERS } from "@/lib/data/demo/litters";
import { getReservationAvailability } from "@/lib/litter-status";
import { formatDate, formatUsd } from "@/lib/utils";

type ReservePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ puppy?: string }>;
};

export const metadata: Metadata = {
  title: "Reservation preview",
  robots: { index: false, follow: false },
};

export default async function LitterReservePage({ params, searchParams }: ReservePageProps) {
  const { slug } = await params;
  const { puppy: puppyId } = await searchParams;
  const litter = DEMO_LITTERS.find((entry) => entry.slug === slug);
  if (!litter) notFound();

  const puppy = litter.puppies.find((entry) => entry.id === puppyId) ?? litter.puppies.find((entry) => entry.status === "available");
  const { canReserve, reason } = getReservationAvailability(litter, DEMO_REFERENCE_DATE);
  const puppyAvailable = puppy?.status === "available";

  return (
    <div className="shell py-8 lg:py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Puppies", href: "/puppies" },
          { label: litter.title, href: `/puppies/${litter.slug}` },
          { label: "Reservation" },
        ]}
      />

      <header className="mt-5">
        <p className="eyebrow">Reservation · preview</p>
        <h1 className="mt-3 text-balance font-display text-4xl leading-tight text-navy-900 sm:text-5xl">
          One puppy, one clear total.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          This screen shows how a puppy reservation would be summarised. It does not charge, reserve
          or reveal contact details.
        </p>
      </header>

      <div className="mt-6 max-w-2xl">
        <Alert tone="warning" title="Checkout is disabled — collection rule not decided">
          The documents disagree on whether the platform collects the{" "}
          {formatUsd(litter.serviceFeeUsd)} service fee only or the full{" "}
          {formatUsd(litter.totalUsd)}. The interface shows the complete total and never presents a
          $3,600 debit as a smaller $600 charge.
        </Alert>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
        <div className="space-y-5">
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-2xl text-navy-900">Selected puppy</h2>
              <LitterPlanBadge plan={litter.listingPlan} />
            </div>

            {puppy ? (
              <div className="mt-4 flex items-start gap-4 rounded-xl border border-line p-4">
                <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl bg-cream-50">
                  <DemoPortrait photo={litter.photos[0]!} className="h-12 w-12 rounded-lg" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-display text-2xl text-navy-900">{puppy.name}</p>
                    <PuppyStatusBadge status={puppy.status} />
                  </div>
                  <p className="mt-1 text-[12px] text-muted">
                    {puppy.sex === "male" ? "Male" : "Female"} · {puppy.color} · {puppy.mark} · ID{" "}
                    {puppy.id.toUpperCase()}
                  </p>
                  <p className="mt-1 text-[11px] text-muted">
                    {litter.title} · {litter.breederName} · {litter.location.city},{" "}
                    {litter.location.stateCode}
                  </p>
                </div>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted">No puppy selected.</p>
            )}

            <dl className="mt-4 grid gap-3 text-[12px] sm:grid-cols-2">
              <div className="rounded-lg bg-cream-50 p-3">
                <dt className="text-muted">Born</dt>
                <dd className="mt-0.5 font-medium text-ink">{formatDate(litter.birthDate)}</dd>
              </div>
              <div className="rounded-lg bg-cream-50 p-3">
                <dt className="text-muted">Ready date</dt>
                <dd className="mt-0.5 font-medium text-ink">{formatDate(litter.readyDate)}</dd>
              </div>
              <div className="rounded-lg bg-cream-50 p-3">
                <dt className="text-muted">Pick-up</dt>
                <dd className="mt-0.5 font-medium text-ink">At the breeder</dd>
              </div>
              <div className="rounded-lg bg-cream-50 p-3">
                <dt className="text-muted">Delivery</dt>
                <dd className="mt-0.5 font-medium text-ink">Not offered by the platform</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="reserve-states-heading" className="rounded-2xl border border-line bg-white p-5">
            <h2 id="reserve-states-heading" className="font-display text-xl text-navy-900">
              Reservation states
            </h2>
            <ul className="mt-3 grid gap-2 text-[12px] leading-relaxed text-muted sm:grid-cols-2">
              {[
                ["Available", "No reservation exists yet."],
                ["Reservation pending", "A request exists but is not confirmed."],
                ["Reserved", "The puppy is held for a buyer."],
                ["Sold", "The puppy has been placed."],
                ["Expired", "The listing period ended."],
                ["Cancelled", "The reservation or listing was cancelled."],
              ].map(([label, body]) => (
                <li key={label} className="rounded-lg border border-line bg-cream-50 p-3">
                  <span className="font-semibold text-ink">{label}.</span> {body}
                </li>
              ))}
            </ul>
          </section>

          <Link
            href={`/puppies/${litter.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 underline underline-offset-4"
          >
            <Icon name="arrow-left" className="h-4 w-4" />
            Back to the litter
          </Link>
        </div>

        <aside className="rounded-2xl border border-line bg-white p-5 shadow-card lg:sticky lg:top-24">
          <h2 className="font-display text-2xl text-navy-900">Price summary</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted">Puppy price by breeder</dt>
              <dd className="tabular font-medium text-ink">{formatUsd(litter.puppyPriceUsd)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-muted">Platform service fee</dt>
              <dd className="tabular font-medium text-ink">{formatUsd(litter.serviceFeeUsd)}</dd>
            </div>
            <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
              <dt className="font-semibold text-ink">Total</dt>
              <dd className="tabular font-display text-3xl text-navy-900">{formatUsd(litter.totalUsd)}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">
            The {formatUsd(litter.serviceFeeUsd)} is the platform portion, not the amount that would
            necessarily be debited. Taxes and refunds are not defined here.
          </p>

          <div className="mt-4">
            <Button fullWidth size="lg" disabled>
              Pay {formatUsd(litter.totalUsd)} — unavailable
            </Button>
            <p className="mt-2 text-center text-[10px] text-muted">
              No payment provider is connected. No card details are collected.
            </p>
            <Link
              href={`/checkout/litter/${litter.slug}${puppy ? `?puppy=${puppy.id}` : ""}`}
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-[11px] font-semibold text-navy-800 hover:border-navy-300"
            >
              Preview checkout breakdown
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </Link>
          </div>

          {!canReserve || !puppyAvailable ? (
            <p className="mt-3 rounded-lg bg-warning-50 p-3 text-[11px] leading-relaxed text-warning-700">
              {!canReserve
                ? reason
                : "This puppy is not available. Choose another puppy from the litter."}
            </p>
          ) : null}

          <div className="mt-4 rounded-xl border border-line bg-cream-50 p-3 text-[11px] leading-relaxed text-muted">
            <p className="font-semibold text-ink">What this preview does not do</p>
            <p className="mt-1">
              It does not create a reservation, take payment, issue a contract, or unlock breeder
              contact details.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
