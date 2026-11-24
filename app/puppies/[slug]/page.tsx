import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoPortrait } from "@/components/domain/demo-portrait";
import { StudGallery } from "@/components/domain/stud-gallery";
import {
  LitterPlanBadge,
  LitterStatusBadge,
  PendingPriceBadge,
  PuppyStatusBadge,
  ReadinessBadge,
} from "@/components/domain/marketplace-badges";
import { Alert } from "@/components/ui/feedback";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";
import { DEMO_LITTERS } from "@/lib/data/demo/litters";
import type { Litter } from "@/lib/types/marketplace";
import { getReservationAvailability } from "@/lib/litter-status";
import { formatDate, formatUsd, pluralize } from "@/lib/utils";

type LitterPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DEMO_LITTERS.map((litter) => ({ slug: litter.slug }));
}

export async function generateMetadata({ params }: LitterPageProps): Promise<Metadata> {
  const { slug } = await params;
  const litter = DEMO_LITTERS.find((entry) => entry.slug === slug);
  if (!litter) return { title: "Litter not found" };
  return {
    title: `${litter.title} — ${litter.breed} puppies`,
    description: `${litter.breederName} · ${litter.location.city}, ${litter.location.stateCode}. Sample litter with individually listed puppies and a $${litter.totalUsd.toLocaleString("en-US")} total. Pick-up only.`,
  };
}

export default async function LitterPage({ params }: LitterPageProps) {
  const { slug } = await params;
  const litter = DEMO_LITTERS.find((entry) => entry.slug === slug);
  if (!litter) notFound();

  const available = litter.puppies.filter((puppy) => puppy.status === "available");
  const { canReserve, reason } = getReservationAvailability(litter, DEMO_REFERENCE_DATE);
  const other = DEMO_LITTERS.filter((entry) => entry.slug !== litter.slug).slice(0, 2);

  return (
    <>
      <div className="border-b border-line bg-cream-50">
        <div className="shell py-6 lg:py-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Puppies", href: "/puppies" },
              { label: litter.breed, href: `/puppies?breed=${encodeURIComponent(litter.breed)}` },
              { label: litter.title },
            ]}
          />

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <LitterPlanBadge plan={litter.listingPlan} />
                <ReadinessBadge readyDate={litter.readyDate} referenceDate={DEMO_REFERENCE_DATE} />
                <LitterStatusBadge status={litter.status} />
              </div>
              <h1 className="mt-3 max-w-3xl text-balance font-display text-4xl leading-tight text-navy-900 sm:text-5xl">
                {litter.title}
              </h1>
              <p className="mt-2 text-sm font-medium text-ink">
                {litter.breed} · {litter.breederName}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <Icon name="pin" className="h-4 w-4 text-navy-300" />
                {litter.location.city}, {litter.location.stateName}
                <span className="text-[11px] text-muted">· approximate location</span>
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-muted">
                <Icon name="lock" className="h-3.5 w-3.5" />
                Breeder contact private
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <StudGallery photos={litter.photos} name={litter.title} />
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                    Total for one puppy
                  </p>
                  <p className="tabular mt-1 font-display text-4xl leading-none text-navy-900">
                    {formatUsd(litter.totalUsd)}
                  </p>
                </div>
                <PendingPriceBadge />
              </div>

              <dl className="mt-4 space-y-2 rounded-xl bg-cream-50 p-3 text-[12px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Puppy price by breeder</dt>
                  <dd className="tabular font-medium text-ink">{formatUsd(litter.puppyPriceUsd)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Platform service fee</dt>
                  <dd className="tabular font-medium text-ink">{formatUsd(litter.serviceFeeUsd)}</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-line pt-2">
                  <dt className="font-semibold text-ink">Total</dt>
                  <dd className="tabular font-semibold text-ink">{formatUsd(litter.totalUsd)}</dd>
                </div>
              </dl>

              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                Open decision: whether the platform collects only the {formatUsd(litter.serviceFeeUsd)}{" "}
                service fee or the full {formatUsd(litter.totalUsd)}. No payment is taken in this
                preview, and the amount displayed is never presented as a $600 debit.
              </p>

              <div className="mt-4">
                {canReserve ? (
                  <ButtonLink
                    href={`/puppies/${litter.slug}/reserve`}
                    fullWidth
                    size="lg"
                    iconRight={<Icon name="arrow-right" className="h-4 w-4" />}
                  >
                    Preview reservation
                  </ButtonLink>
                ) : (
                  <Button fullWidth size="lg" disabled>
                    Reservation unavailable
                  </Button>
                )}
              </div>
              {!canReserve ? (
                <p className="mt-2 text-[11px] leading-relaxed text-warning-700">{reason}</p>
              ) : (
                <p className="mt-2 text-center text-[10px] text-muted">
                  Preview only — no payment, no reservation, no contact unlock.
                </p>
              )}

              <div className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-cream-50 p-3 text-[11px] leading-relaxed text-muted">
                <Icon name="pin" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-600" />
                <span>
                  Pick-up at the breeder. The platform does not deliver animals and does not own or
                  sell them.
                </span>
              </div>
            </div>
          </aside>

          <div className="min-w-0 space-y-9 lg:col-start-1 lg:row-start-2">
            <section aria-labelledby="about-litter-heading">
              <h2 id="about-litter-heading" className="font-display text-2xl text-navy-900">
                About this litter
              </h2>
              <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">{litter.description}</p>

              <dl className="mt-5 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
                {[
                  ["Breed", litter.breed],
                  ["Born", formatDate(litter.birthDate)],
                  ["Ready", formatDate(litter.readyDate)],
                  ["Dam", litter.damName],
                  ["Puppies", String(litter.puppies.length)],
                  ["Pick-up", "At the breeder"],
                ].map(([label, value]) => (
                  <div key={label} className="border-t border-line py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
                    <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>

              {litter.sireSlug ? (
                <p className="mt-2 text-[12px] text-muted">
                  Sire:{" "}
                  <Link
                    href={`/studs/${litter.sireSlug}`}
                    className="font-semibold text-navy-800 underline underline-offset-2"
                  >
                    {litter.sireName}
                  </Link>{" "}
                  · public stud profile
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-2">
                {litter.healthNotes.map((note) => (
                  <span
                    key={note}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1 text-[11px] font-medium text-muted"
                  >
                    <Icon name="check" className="h-3 w-3 text-success-600" />
                    {note}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                Health notes are breeder-reported sample data, not an independent veterinary opinion.
                Pick-up and records should be discussed directly with the breeder.
              </p>
            </section>

            <section aria-labelledby="puppies-heading">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="puppies-heading" className="font-display text-2xl text-navy-900">
                    Puppies
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {available.length} available of {litter.puppies.length}. A reservation is for one
                    identified puppy, not the whole litter.
                  </p>
                </div>
                <span className="text-[11px] font-semibold text-muted">
                  {pluralize(available.length, "available puppy", "available puppies")}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {litter.puppies.map((puppy) => {
                  const canReservePuppy = canReserve && puppy.status === "available";
                  return (
                    <article key={puppy.id} className="rounded-2xl border border-line bg-white p-4">
                      <div className="flex items-start gap-3">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cream-50">
                          <DemoPortrait photo={litter.photos[0]!} className="h-10 w-10 rounded-lg" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-display text-xl leading-none text-navy-900">{puppy.name}</h3>
                            <PuppyStatusBadge status={puppy.status} />
                          </div>
                          <p className="mt-1 text-[11px] text-muted">
                            {puppy.sex === "male" ? "Male" : "Female"} · {puppy.color} · {puppy.mark}
                          </p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-2 border-t border-line pt-3">
                        <span className="text-[10px] text-muted">
                          ID {puppy.id.toUpperCase()} · one puppy
                        </span>
                        {canReservePuppy ? (
                          <Link
                            href={`/puppies/${litter.slug}/reserve?puppy=${puppy.id}`}
                            className="inline-flex min-h-8 items-center gap-1 rounded-full bg-navy-700 px-3 text-[11px] font-semibold text-white hover:bg-navy-800"
                          >
                            Reserve {puppy.name}
                          </Link>
                        ) : (
                          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                            Not reservable
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>

              {!canReserve ? (
                <div className="mt-4">
                  <Alert tone="warning" title="Reservations are closed for this litter">
                    {reason} The puppy cards remain visible so the state of each animal is clear.
                  </Alert>
                </div>
              ) : null}
            </section>

            <section className="rounded-2xl border border-line bg-cream-50 p-5">
              <h2 className="font-display text-xl text-navy-900">Before you reserve</h2>
              <ul className="mt-3 space-y-2 text-[12px] leading-relaxed text-muted">
                <li className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                  Confirm that the puppy you selected is the one named on the reservation.
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                  Ask for the health record and the pick-up plan before paying anything.
                </li>
                <li className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                  The platform does not deliver; pick-up is arranged with the breeder.
                </li>
              </ul>
            </section>

            {other.length > 0 ? (
              <section>
                <h2 className="font-display text-2xl text-navy-900">Other sample litters</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {other.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/puppies/${entry.slug}`}
                      className="rounded-xl border border-line bg-white p-4 transition-colors hover:border-navy-300"
                    >
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{entry.breed}</p>
                      <p className="mt-1 font-display text-lg text-navy-900">{entry.title}</p>
                      <p className="mt-1 text-[11px] text-muted">
                        {entry.location.city}, {entry.location.stateCode} ·{" "}
                        {entry.puppies.filter((puppy) => puppy.status === "available").length} available
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            <p className="rounded-xl border border-line bg-cream-50 px-4 py-3 text-[11px] leading-relaxed text-muted">
              No advertising is shown on this litter page. The readiness window is a configurable
              platform rule in this prototype, not a legal determination.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
