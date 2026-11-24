import { authConfigured } from "@/src/lib/env/public";
import { OwnedStuds } from "@/src/features/studs/components/owned-studs";
import Link from "next/link";
import type { Metadata } from "next";
import { DemoPortrait } from "@/components/domain/demo-portrait";
import {
  BrucellosisBadge,
  DocumentationBadge,
  PlanBadge,
} from "@/components/domain/signal-badges";
import { Alert } from "@/components/ui/feedback";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";
import { DEMO_DAMS } from "@/lib/data/demo/account";
import { DEMO_STUDS } from "@/lib/data/demo/studs";
import { addDays, ageInYears, formatDate, pluralize } from "@/lib/utils";

export const metadata: Metadata = { title: "My Animals" };

export default function MyAnimalsPage() {
  if (authConfigured()) return <OwnedStuds />;
  const marlo = DEMO_STUDS.find((stud) => stud.slug === "marlo-northshore");

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">My Animals</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Your animals</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Male profiles can be public. Female profiles are private by default, including their
            heat calendar, unless you share them with a specific request.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/dashboard/animals/new/stud" size="sm" iconLeft={<Icon name="plus" className="h-4 w-4" />}>
            Add a male
          </ButtonLink>
          <ButtonLink href="/dashboard/animals/new/dam" size="sm" variant="secondary" iconLeft={<Icon name="plus" className="h-4 w-4" />}>
            Add a female
          </ButtonLink>
        </div>
      </header>

      <Alert tone="info" title="Privacy is enforced in the data, not with CSS">
        Public animal types contain no exact address, ZIP, phone or email. Female profiles have no
        public route in this build.
      </Alert>

      <section aria-labelledby="males-heading">
        <div className="flex items-center justify-between">
          <h2 id="males-heading" className="font-display text-2xl text-navy-900">
            Male profiles
          </h2>
          <span className="text-[11px] text-muted">1 sample</span>
        </div>

        <div className="mt-3">
          {marlo ? (
            <article className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:flex-row sm:items-center">
              <span className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-cream-100 sm:h-28 sm:w-32">
                <DemoPortrait photo={marlo.photos[0]!} alt={marlo.photos[0]!.alt} className="h-full w-full" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-display text-2xl text-navy-900">{marlo.name}</h3>
                  <PlanBadge plan={marlo.plan} status={marlo.subscriptionStatus} />
                  <span className="inline-flex items-center gap-1 rounded-full border border-success-600/20 bg-success-50 px-2.5 py-1 text-[10px] font-semibold text-success-700">
                    Public
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">
                  {marlo.breed} · {ageInYears(marlo.birthDate, DEMO_REFERENCE_DATE)} years ·{" "}
                  {marlo.location.city}, {marlo.location.stateCode}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <BrucellosisBadge record={marlo.brucellosis} referenceDate={DEMO_REFERENCE_DATE} />
                  <DocumentationBadge status={marlo.brucellosis.reviewStatus} />
                </div>
                <p className="mt-2 text-[11px] text-muted">
                  Last update: {formatDate("2026-10-31")} · 8 photos · 4 health tests
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href={`/studs/${marlo.slug}`}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-xs font-semibold text-navy-800 hover:border-navy-300"
                >
                  <Icon name="external" className="h-3.5 w-3.5" />
                  Public profile
                </Link>
                <Link
                  href="/dashboard/listings"
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-navy-700 px-3.5 text-xs font-semibold text-white hover:bg-navy-800"
                >
                  Listing
                </Link>
              </div>
            </article>
          ) : (
            <p className="rounded-2xl border border-dashed border-line bg-cream-50 p-6 text-sm text-muted">
              No male profiles yet.
            </p>
          )}
        </div>
      </section>

      <section aria-labelledby="females-heading">
        <div className="flex items-center justify-between">
          <h2 id="females-heading" className="font-display text-2xl text-navy-900">
            Female profiles
          </h2>
          <span className="text-[11px] text-muted">Private by default</span>
        </div>

        <div className="mt-3 space-y-3">
          {DEMO_DAMS.map((dam) => {
            const nextHeat = addDays(dam.lastHeatDate, dam.cycleLengthDays);
            return (
              <article key={dam.id} className="rounded-2xl border border-line bg-white p-4 shadow-card">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex gap-3">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-50 font-display text-xl text-navy-700">
                      {dam.name[0]}
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-display text-xl text-navy-900">{dam.name}</h3>
                        <span className="inline-flex items-center gap-1 rounded-full border border-line bg-cream-50 px-2.5 py-1 text-[10px] font-semibold text-muted">
                          <Icon name="lock" className="h-3 w-3" />
                          Private profile
                        </span>
                      </div>
                      <p className="mt-0.5 text-[13px] text-muted">
                        {dam.breed} · {ageInYears(dam.birthDate, DEMO_REFERENCE_DATE)} years ·{" "}
                        {dam.location.city}, {dam.location.stateCode}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <BrucellosisBadge record={dam.brucellosis} referenceDate={DEMO_REFERENCE_DATE} />
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/animals/${dam.id}/heat`}
                    className="inline-flex min-h-9 shrink-0 items-center gap-1.5 self-start rounded-full border border-line bg-white px-3.5 text-xs font-semibold text-navy-800 hover:border-navy-300"
                  >
                    Open heat calendar
                  </Link>
                </div>

                <div className="mt-4 grid gap-3 rounded-xl bg-cream-50 p-3 sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Last heat</p>
                    <p className="mt-0.5 text-[13px] font-medium text-ink">{formatDate(dam.lastHeatDate)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Cycle setting</p>
                    <p className="tabular mt-0.5 text-[13px] font-medium text-ink">
                      {dam.cycleLengthDays} days
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Next heat estimate</p>
                    <p className="mt-0.5 text-[13px] font-medium text-ink">
                      {formatDate(nextHeat)}{" "}
                      <span className="text-[10px] font-normal text-muted">estimate only</span>
                    </p>
                  </div>
                </div>

                {dam.brucellosis.status !== "current" ? (
                  <p className="mt-2 flex items-start gap-1.5 text-[11px] text-warning-700">
                    <Icon name="warning" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    Requests using {dam.name} are paused until a current test is on file.
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>

        <p className="mt-3 text-[11px] leading-relaxed text-muted">
          {DEMO_DAMS.length} sample {pluralize(DEMO_DAMS.length, "female")} · heat dates are estimates
          calculated from the last recorded heat and the cycle length. An estimate is not a
          confirmed pregnancy or a booking.
        </p>
      </section>

      <section className="grid gap-3 sm:grid-cols-2">
        {[
          {
            title: "Add a male",
            body: "Identity, records, photos and a Basic or Premium plan.",
            href: "/dashboard/animals/new/stud",
            icon: "paw" as const,
          },
          {
            title: "Add a female",
            body: "Free. Private by default, with a heat history and cycle setting.",
            href: "/dashboard/animals/new/dam",
            icon: "heart" as const,
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group rounded-2xl border border-dashed border-[#CFC6B8] bg-cream-50 p-5 transition-colors hover:border-navy-300 hover:bg-white"
          >
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-navy-700 shadow-sm">
              <Icon name={card.icon} className="h-4 w-4" />
            </span>
            <p className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-navy-900">
              {card.title}
              <Icon name="arrow-right" className="h-4 w-4 text-navy-300 transition-transform group-hover:translate-x-0.5" />
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">{card.body}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}

