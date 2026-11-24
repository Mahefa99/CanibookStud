import Link from "next/link";
import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Alert } from "@/components/ui/feedback";
import { BrucellosisBadge, DocumentationBadge, PlanBadge } from "@/components/domain/signal-badges";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";
import { DEMO_DAMS } from "@/lib/data/demo/account";
import { DEMO_STUDS } from "@/lib/data/demo/studs";
import { formatUsd } from "@/lib/utils";

export const metadata: Metadata = { title: "My Listings" };

export default function ListingsPage() {
  const marlo = DEMO_STUDS.find((stud) => stud.slug === "marlo-northshore");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">My Listings</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Listings</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Public listings, private profiles and drafts in one place. A listing can be paused by
            documents, by billing or by the owner — each state is shown separately.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/dashboard/litters/new" size="sm" iconLeft={<Icon name="plus" className="h-4 w-4" />}>
            New litter
          </ButtonLink>
          <ButtonLink href="/dashboard/animals/new/stud" size="sm" variant="secondary" iconLeft={<Icon name="plus" className="h-4 w-4" />}>
            New stud listing
          </ButtonLink>
        </div>
      </header>

      <Alert tone="info" title="Preview inventory">
        These are sample listings. Expiry, renewal and publication are not connected.
      </Alert>

      <section aria-labelledby="public-heading">
        <h2 id="public-heading" className="font-display text-2xl text-navy-900">
          Public
        </h2>
        <div className="mt-3 overflow-hidden rounded-2xl border border-line bg-white shadow-card">
          {marlo ? (
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-navy-50 font-display text-xl text-navy-700">
                M
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{marlo.name} · Stud profile</p>
                  <PlanBadge plan={marlo.plan} status={marlo.subscriptionStatus} />
                  <BrucellosisBadge record={marlo.brucellosis} referenceDate={DEMO_REFERENCE_DATE} />
                </div>
                <p className="mt-1 text-[11px] text-muted">
                  {marlo.breed} · {marlo.location.city}, {marlo.location.stateCode} ·{" "}
                  {formatUsd(marlo.studFeeUsd)} stud fee · {marlo.photos.length} photos
                </p>
                <div className="mt-1.5">
                  <DocumentationBadge status={marlo.brucellosis.reviewStatus} />
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href={`/studs/${marlo.slug}`}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-xs font-semibold text-navy-800"
                >
                  <Icon name="external" className="h-3.5 w-3.5" />
                  View public
                </Link>
                <Link
                  href="/dashboard/animals"
                  className="inline-flex min-h-9 items-center rounded-full bg-navy-700 px-3.5 text-xs font-semibold text-white"
                >
                  Manage
                </Link>
              </div>
            </div>
          ) : (
            <p className="p-5 text-sm text-muted">No public listings.</p>
          )}
        </div>
      </section>

      <section aria-labelledby="private-heading">
        <h2 id="private-heading" className="font-display text-2xl text-navy-900">
          Private profiles
        </h2>
        <p className="mt-1 text-[11px] text-muted">
          A private female profile is not a public listing and has no directory card.
        </p>
        <div className="mt-3 space-y-2">
          {DEMO_DAMS.map((dam) => (
            <div
              key={dam.id}
              className="flex flex-col gap-2 rounded-xl border border-line bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-ink">
                  {dam.name} · Dam profile{" "}
                  <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-line bg-cream-50 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted">
                    <Icon name="lock" className="h-2.5 w-2.5" />
                    Private
                  </span>
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  {dam.breed} · {dam.visibility === "private" ? "Visible only to you" : "Shared by request"}
                </p>
              </div>
              <span className="text-[11px] text-muted">No listing fee</span>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="draft-heading">
        <h2 id="draft-heading" className="font-display text-2xl text-navy-900">
          Drafts
        </h2>
        <div className="mt-3 rounded-2xl border border-dashed border-[#CFC6B8] bg-cream-50 p-5">
          <p className="text-sm font-semibold text-ink">No drafts</p>
          <p className="mt-1 max-w-xl text-[12px] leading-relaxed text-muted">
            A draft is saved locally while you complete a new profile. Drafts are not visible in the
            directory and do not start a subscription.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-xl text-navy-900">Listing states</h2>
        <dl className="mt-3 grid gap-3 text-[12px] sm:grid-cols-2">
          {[
            ["Draft", "Saved, not submitted, not public."],
            ["In review", "Submitted; documents and content are checked. Hidden from search."],
            ["Active", "Visible in the directory, subject to the current document rule."],
            ["Paused", "Requests paused because a document is missing or expired."],
            ["Expired", "Listing period ended; owner must renew."],
            ["Unavailable", "Owner paused the profile or marked the animal unavailable."],
          ].map(([label, description]) => (
            <div key={label} className="rounded-lg border border-line bg-cream-50 p-3">
              <dt className="font-semibold text-ink">{label}</dt>
              <dd className="mt-0.5 text-muted">{description}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
