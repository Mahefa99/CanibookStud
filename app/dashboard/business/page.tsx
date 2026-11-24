import type { Metadata } from "next";
import Link from "next/link";
import { ProfessionalVerificationBadge } from "@/components/domain/marketplace-badges";
import { Alert } from "@/components/ui/feedback";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { DEMO_PROFESSIONALS } from "@/lib/data/demo/professionals";

export const metadata: Metadata = { title: "My Business" };

export default function DashboardBusinessPage() {
  const business = DEMO_PROFESSIONALS.find((entry) => entry.slug === "pawsitive-training-co");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">My Business</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">My business</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            A preview of the professional workspace. The demo account does not hold the Professional
            activity, so this section is not shown in the sidebar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/dashboard/services/new" size="sm" iconLeft={<Icon name="plus" className="h-4 w-4" />}>
            Add a business
          </ButtonLink>
          <ButtonLink href="/pet-services" variant="secondary" size="sm" iconLeft={<Icon name="external" className="h-4 w-4" />}>
            Public directory
          </ButtonLink>
        </div>
      </header>

      <Alert tone="info" title="Sample professional section">
        This page demonstrates the layout a professional account would see. Document review, plan
        pricing and contact visibility are not active.
      </Alert>

      {business ? (
        <>
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {business.category.replaceAll("_", " ")}
                </p>
                <h2 className="mt-1 font-display text-2xl text-navy-900">{business.name}</h2>
                <p className="mt-1 text-[12px] text-muted">
                  {business.address.street} · {business.address.city}, {business.address.stateCode}
                </p>
              </div>
              <ProfessionalVerificationBadge status={business.verification} />
            </div>
            <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted">{business.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={`/pet-services/${business.slug}`}
                className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-3.5 text-xs font-semibold text-navy-800"
              >
                View public profile
              </Link>
              <span className="inline-flex min-h-9 items-center rounded-full bg-cream-50 px-3.5 text-xs font-semibold text-muted">
                Edit profile — not connected
              </span>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <section className="rounded-2xl border border-line bg-white p-5">
              <h2 className="font-display text-xl text-navy-900">Plan</h2>
              <p className="mt-2 text-sm font-semibold text-ink">Pricing to be confirmed</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                The source documents conflict. No plan is active, and a plan would never change the
                verification state.
              </p>
            </section>
            <section className="rounded-2xl border border-line bg-white p-5">
              <h2 className="font-display text-xl text-navy-900">Contact visibility</h2>
              <p className="mt-2 text-sm font-semibold text-ink">Under review</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                No phone or email is shown on the public profile. Free-plan contact visibility is an
                open decision.
              </p>
            </section>
          </div>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-xl text-navy-900">Services</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {business.services.map((service) => (
                <li key={service} className="rounded-full border border-line bg-cream-50 px-3 py-1 text-[11px] text-muted">
                  {service}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11px] text-muted">
              Service prices are not listed because no professional pricing decision is confirmed.
            </p>
          </section>
        </>
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-cream-50 p-6 text-sm text-muted">
          No professional profile in this demo.
        </p>
      )}
    </div>
  );
}
