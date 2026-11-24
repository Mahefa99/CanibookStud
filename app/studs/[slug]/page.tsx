import { authConfigured } from "@/src/lib/env/public";
import { LiveProfile } from "@/src/features/studs/components/live-profile";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AvailabilityCalendar } from "@/components/domain/availability-calendar";
import { FavoriteButton } from "@/components/domain/favorite-button";
import { MarketMap } from "@/components/domain/market-map";
import { StudGallery } from "@/components/domain/stud-gallery";
import { StudCard } from "@/components/domain/stud-card";
import {
  AkcBadge,
  BrucellosisBadge,
  ClubRecommendationBadge,
  DocumentationBadge,
  PlanBadge,
  SignalLegend,
} from "@/components/domain/signal-badges";
import { Alert } from "@/components/ui/feedback";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon, type IconName } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { RatingStars } from "@/components/ui/pagination";
import { catalogRepository } from "@/lib/api/catalog";
import { STUD_PRICING } from "@/lib/config/pricing";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";
import { getRequestAvailability } from "@/lib/stud-status";
import type { Stud } from "@/lib/types/domain";
import {
  ageInYears,
  daysSince,
  formatDate,
  formatUsd,
  pluralize,
} from "@/lib/utils";

type StudPageProps = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  if (authConfigured()) return [];
  const slugs = await catalogRepository.listStudSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StudPageProps): Promise<Metadata> {
  if (authConfigured()) return { title: "Stud profile" };
  const { slug } = await params;
  const stud = await catalogRepository.getStudBySlug(slug);
  if (!stud) return { title: "Stud not found" };

  return {
    title: `${stud.name} — ${stud.breed} stud in ${stud.location.city}, ${stud.location.stateCode}`,
    description: `${stud.headline} Stud fee ${formatUsd(stud.studFeeUsd)}. Sample profile with document review, brucellosis test date and location privacy.`,
    openGraph: {
      title: `${stud.name} — ${stud.breed}`,
      description: stud.headline,
      type: "profile",
    },
  };
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-t border-line py-3">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-ink">{value}</dd>
    </div>
  );
}

function RecordCard({
  icon,
  title,
  badge,
  children,
}: {
  icon: IconName;
  title: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-navy-50 text-navy-700">
            <Icon name={icon} className="h-4 w-4" />
          </span>
          <h3 className="text-sm font-semibold text-navy-900">{title}</h3>
        </div>
        {badge}
      </div>
      <div className="mt-3 text-[13px] leading-relaxed text-muted">{children}</div>
    </div>
  );
}

function RequestCard({ stud, canRequest, blockReason }: { stud: Stud; canRequest: boolean; blockReason?: string }) {
  return (
    <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">Stud fee</p>
          <p className="tabular mt-1 font-display text-4xl leading-none text-navy-900">
            {formatUsd(stud.studFeeUsd)}
          </p>
        </div>
        <PlanBadge plan={stud.plan} status={stud.subscriptionStatus} />
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted">
        Set by the owner. The stud fee is paid directly under your agreement and is not charged on
        this platform in the preview.
      </p>

      <hr className="my-4 border-line" />

      <p className="text-sm font-semibold text-navy-900">Contact & breeding request</p>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-muted">Deposit (escrowed)</span>
        <span className="tabular font-semibold text-ink">{formatUsd(STUD_PRICING.depositUsd)}</span>
      </div>
      <dl className="mt-3 space-y-1.5 rounded-xl bg-cream-50 p-3 text-[11px]">
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Applied toward the stud fee</dt>
          <dd className="tabular font-medium text-ink">{formatUsd(STUD_PRICING.depositUsd)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Balance (escrowed)</dt>
          <dd className="tabular font-medium text-ink">{formatUsd(STUD_PRICING.balanceUsd)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted">Total (dam owner)</dt>
          <dd className="tabular font-medium text-ink">{formatUsd(STUD_PRICING.totalUsd)}</dd>
        </div>
      </dl>
      <p className="mt-2 text-[11px] leading-relaxed text-muted">
        The {formatUsd(STUD_PRICING.depositUsd)} deposit is escrowed and applied toward the{" "}
        {formatUsd(STUD_PRICING.studFeeUsd)} stud fee. The {formatUsd(STUD_PRICING.serviceFeeUsd)}{" "}
        service fee is non-refundable. Payout timing and refund rules are still being confirmed.
      </p>

      <div className="mt-4">
        {canRequest ? (
          <ButtonLink
            href={`/studs/${stud.slug}/request`}
            fullWidth
            size="lg"
            iconRight={<Icon name="arrow-right" className="h-4 w-4" />}
          >
            Start request — {formatUsd(STUD_PRICING.depositUsd)} deposit
          </ButtonLink>
        ) : (
          <Button fullWidth size="lg" disabled>
            Requests paused
          </Button>
        )}
      </div>

      {canRequest ? (
        <p className="mt-2 text-center text-[10px] text-muted">
          Preview build: opening the summary does not charge or unlock anything.
        </p>
      ) : (
        <p className="mt-2 text-[11px] leading-relaxed text-warning-700">{blockReason}</p>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-xl border border-line bg-cream-50 p-3 text-[11px] leading-relaxed text-muted">
        <Icon name="lock" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-600" />
        <span>
          Phone numbers and emails are not in the public page data. Contact details unlock only
          after a server-confirmed request — never from a success redirect alone.
        </span>
      </div>

      <details className="mt-4 border-t border-line pt-3">
        <summary className="flex items-center justify-between text-[11px] font-semibold text-navy-800">
          What the signals mean
          <Icon name="chevron-down" className="h-3.5 w-3.5" />
        </summary>
        <div className="mt-3">
          <SignalLegend />
        </div>
      </details>
    </div>
  );
}

export default async function StudPage({ params }: StudPageProps) {
  if (authConfigured()) return <LiveProfile id={(await params).slug} />;
  const { slug } = await params;
  const stud = await catalogRepository.getStudBySlug(slug);
  if (!stud) notFound();

  const related = await catalogRepository.getRelatedStuds(slug, 3);
  const age = ageInYears(stud.birthDate, DEMO_REFERENCE_DATE);
  const testAge = stud.brucellosis.testDate
    ? daysSince(stud.brucellosis.testDate, DEMO_REFERENCE_DATE)
    : null;

  const { canRequest, reason: blockReason } = getRequestAvailability(stud);

  const reviewAverage =
    stud.reviews.length > 0
      ? stud.reviews.reduce((sum, review) => sum + review.rating, 0) / stud.reviews.length
      : 0;

  return (
    <>
      <div className="border-b border-line bg-cream-50">
        <div className="shell py-6 lg:py-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Studs", href: "/studs" },
              { label: stud.breed, href: `/studs?breed=${encodeURIComponent(stud.breed)}` },
              { label: stud.name },
            ]}
          />

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <PlanBadge plan={stud.plan} status={stud.subscriptionStatus} />
                {stud.clubRecommendation ? (
                  <ClubRecommendationBadge recommendation={stud.clubRecommendation} />
                ) : null}
                <span className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-medium text-muted">
                  <Icon name="pin" className="h-3 w-3" />
                  Approximate location
                </span>
              </div>

              <h1 className="mt-3 font-display text-5xl leading-none text-navy-900 sm:text-6xl">
                {stud.name}
              </h1>
              <p className="mt-2 text-sm font-medium text-ink">
                {stud.breed} · {age} {pluralize(age, "year")} · {stud.sex === "male" ? "Male" : "Female"}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <Icon name="pin" className="h-4 w-4 text-navy-300" />
                {stud.location.city}, {stud.location.stateName}
                <span className="text-[11px] text-muted">· exact address private</span>
              </p>
              <p className="mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted">
                {stud.headline}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <FavoriteButton studId={stud.id} studName={stud.name} />
              <Link
                href="/#safety"
                className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-xs font-semibold text-navy-800 hover:border-navy-300"
              >
                <Icon name="shield" className="h-3.5 w-3.5" />
                How signals work
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-8">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start lg:gap-8">
          <div className="min-w-0 lg:col-start-1 lg:row-start-1">
            <StudGallery photos={stud.photos} name={stud.name} />
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2">
            <RequestCard stud={stud} canRequest={canRequest} blockReason={blockReason} />
            {!canRequest ? (
              <div className="mt-3">
                <Alert tone="warning" title="Listing rule under review">
                  The 14-day test window is a platform listing rule in this prototype, not a legal
                  determination. The owner can update the record at any time.
                </Alert>
              </div>
            ) : null}
          </aside>

          <div className="min-w-0 space-y-10 lg:col-start-1 lg:row-start-2">
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className="font-display text-2xl text-navy-900">
                About {stud.name}
              </h2>
              <div className="mt-3 max-w-2xl space-y-3 text-[15px] leading-7 text-muted">
                <p>{stud.description}</p>
                <p className="rounded-xl border border-line bg-cream-50 p-3 text-[11px] leading-relaxed">
                  Descriptions are written by the owner. Sample profile for design review.
                </p>
              </div>

              <dl className="mt-6 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
                <Fact label="Breed" value={stud.breed} />
                <Fact label="Date of birth" value={formatDate(stud.birthDate)} />
                <Fact label="Age" value={`${age} ${pluralize(age, "year")}`} />
                <Fact label="Weight" value={`${stud.weightLb} lb`} />
                <Fact label="Color" value={stud.color} />
                <Fact
                  label="Location"
                  value={`${stud.location.city}, ${stud.location.stateCode}`}
                />
              </dl>
            </section>

            <section aria-labelledby="records-heading">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="records-heading" className="font-display text-2xl text-navy-900">
                    Health & records
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    Uploaded records remain private. Public profiles show status, not documents.
                  </p>
                </div>
                <DocumentationBadge status={stud.brucellosis.reviewStatus} />
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <RecordCard icon="file" title="AKC registration" badge={<AkcBadge akc={stud.akc} />}>
                  <p className="tabular text-base font-semibold text-ink">{stud.akc.numberMasked}</p>
                  {stud.akc.checkedAt ? (
                    <p className="mt-1 text-[11px]">Format checked {formatDate(stud.akc.checkedAt)}.</p>
                  ) : (
                    <p className="mt-1 text-[11px]">No format check has been run.</p>
                  )}
                  <p className="mt-2 text-[11px]">
                    A format check is not an AKC registration confirmation. No registry API is
                    connected in this preview.
                  </p>
                </RecordCard>

                <RecordCard
                  icon="shield"
                  title="Brucellosis"
                  badge={<BrucellosisBadge record={stud.brucellosis} referenceDate={DEMO_REFERENCE_DATE} />}
                >
                  {stud.brucellosis.testDate ? (
                    <>
                      <p className="text-base font-semibold text-ink">
                        Tested {formatDate(stud.brucellosis.testDate)}
                      </p>
                      <p className="mt-1 text-[11px]">
                        {testAge} {pluralize(testAge ?? 0, "day")} before the demo snapshot.
                      </p>
                    </>
                  ) : (
                    <p className="text-base font-semibold text-ink">No test on file</p>
                  )}
                  <p className="mt-2 flex items-center gap-1.5 text-[11px]">
                    <Icon name="lock" className="h-3 w-3" />
                    {stud.brucellosis.documentStatus === "on_file"
                      ? "Document on file · not publicly linked"
                      : "No document uploaded"}
                  </p>
                  <p className="mt-2 text-[11px]">
                    The 14-day window is a listing rule under review, not a legal ruling. A test
                    date is not a guarantee of health.
                  </p>
                </RecordCard>
              </div>

              <div className="mt-3 rounded-2xl border border-line bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-navy-900">Additional health tests</h3>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Optional · owner-provided
                  </span>
                </div>
                {stud.healthTests.length > 0 ? (
                  <div className="mt-3 min-w-0 max-w-full overflow-x-auto">
                    <table className="w-full min-w-[32rem] text-left text-[13px]">
                      <thead>
                        <tr className="border-b border-line text-[10px] uppercase tracking-wide text-muted">
                          <th scope="col" className="py-2 font-semibold">Test</th>
                          <th scope="col" className="py-2 font-semibold">Result</th>
                          <th scope="col" className="py-2 font-semibold">Tested</th>
                          <th scope="col" className="py-2 font-semibold">Review</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stud.healthTests.map((test) => (
                          <tr key={test.id} className="border-b border-line/70 last:border-0">
                            <th scope="row" className="py-2.5 pr-4 font-medium text-ink">{test.name}</th>
                            <td className="py-2.5 pr-4 text-muted">{test.result}</td>
                            <td className="py-2.5 pr-4 text-muted">
                              {test.testedOn ? formatDate(test.testedOn) : "—"}
                            </td>
                            <td className="py-2.5">
                              <DocumentationBadge status={test.reviewStatus} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="mt-3 text-[13px] leading-relaxed text-muted">
                    No additional tests are listed. Optional tests are not required by law, and
                    their absence is not proof of a health problem.
                  </p>
                )}
                <p className="mt-3 text-[11px] leading-relaxed text-muted">
                  Results are transcribed from owner-provided documents and reviewed against the
                  platform checklist. They are not an independent veterinary opinion.
                </p>
              </div>
            </section>

            <section aria-labelledby="pedigree-heading">
              <h2 id="pedigree-heading" className="font-display text-2xl text-navy-900">
                Pedigree
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-line bg-white p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Sire</p>
                  <p className="mt-1 text-sm font-medium text-ink">{stud.pedigree.sire}</p>
                </div>
                <div className="rounded-xl border border-line bg-white p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Dam</p>
                  <p className="mt-1 text-sm font-medium text-ink">{stud.pedigree.dam}</p>
                </div>
                <div className="rounded-xl border border-line bg-white p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                    Champion bloodline
                  </p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {stud.pedigree.championBloodline ? "Owner-reported" : "Not claimed"}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-muted">
                Pedigree names are owner-reported and not independently verified in this preview.
              </p>
            </section>

            <section aria-labelledby="availability-heading">
              <h2 id="availability-heading" className="font-display text-2xl text-navy-900">
                Availability
              </h2>
              <p className="mt-1 text-sm text-muted">
                Owner-provided sample windows for the current period.
              </p>
              <div className="mt-4 rounded-2xl border border-line bg-white p-5">
                <AvailabilityCalendar
                  windows={stud.availability}
                  referenceDate={DEMO_REFERENCE_DATE}
                />
              </div>
            </section>

            <section aria-labelledby="contract-heading">
              <h2 id="contract-heading" className="font-display text-2xl text-navy-900">
                Contract
              </h2>
              <div className="mt-3 rounded-2xl border border-line bg-white p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-navy-900">Breeding agreement template</p>
                    <p className="mt-0.5 text-[11px] text-muted">
                      Draft for review · not a legal document in this preview
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" disabled>
                    Preview contract
                  </Button>
                </div>
                <ul className="mt-4 grid gap-2 text-[13px] text-muted sm:grid-cols-2">
                  {[
                    "Identification of both animals and owners",
                    "Stud fee, request fee and payment schedule",
                    "Brucellosis test dates and document status",
                    "Repeat-breeding terms, subject to review",
                    "Care, transport and no-delivery terms",
                    "Signatures, dates and dispute route",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[11px] leading-relaxed text-muted">
                  Contract generation, e-signature and legal review are not connected. No clause is
                  presented as final. A repeat-breeding promise must not be read as a guarantee of
                  pregnancy.
                </p>
              </div>
            </section>

            <section aria-labelledby="reviews-heading">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 id="reviews-heading" className="font-display text-2xl text-navy-900">
                    Reviews
                  </h2>
                  <p className="mt-1 text-[11px] text-muted">
                    Sample reviews · fictional profiles and authors
                  </p>
                </div>
                {stud.reviews.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <RatingStars value={reviewAverage} />
                    <span className="tabular text-xs text-muted">
                      {reviewAverage.toFixed(1)} · {stud.reviews.length}{" "}
                      {pluralize(stud.reviews.length, "review")}
                    </span>
                  </div>
                ) : null}
              </div>

              {stud.reviews.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {stud.reviews.map((review) => (
                    <li key={review.id} className="rounded-2xl border border-line bg-white p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-ink">{review.authorLabel}</p>
                        <div className="flex items-center gap-2">
                          <RatingStars value={review.rating} />
                          <span className="text-[11px] text-muted">{formatDate(review.date)}</span>
                        </div>
                      </div>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">{review.body}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 rounded-xl border border-dashed border-line bg-cream-50 p-4 text-[13px] text-muted">
                  No reviews yet. Reviews are only shown for completed request states once the
                  backend is connected.
                </p>
              )}
            </section>

            <section aria-labelledby="location-heading">
              <h2 id="location-heading" className="font-display text-2xl text-navy-900">
                Approximate location
              </h2>
              <p className="mt-1 text-sm text-muted">
                {stud.location.city}, {stud.location.stateName} · pin offset to protect the exact
                address.
              </p>
              <div className="mt-4">
                <MarketMap studs={[stud]} compact />
              </div>
            </section>

            {related.length > 0 ? (
              <section aria-labelledby="related-heading">
                <h2 id="related-heading" className="font-display text-2xl text-navy-900">
                  Related studs
                </h2>
                <p className="mt-1 text-sm text-muted">Same breed or nearby state.</p>
                <div className="mt-4 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {related.map((item) => (
                    <StudCard key={item.id} stud={item} />
                  ))}
                </div>
              </section>
            ) : null}

            <p className="rounded-xl border border-line bg-cream-50 px-4 py-3 text-[11px] leading-relaxed text-muted">
              No advertising is shown on this animal profile. Subscription, document review and
              club recommendations are separate signals; none of them is a health guarantee.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

