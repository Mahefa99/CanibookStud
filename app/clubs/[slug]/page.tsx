import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventCard, ProfessionalCard } from "@/components/domain/marketplace-cards";
import { StudCard } from "@/components/domain/stud-card";
import { Alert } from "@/components/ui/feedback";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { DEMO_CLUBS } from "@/lib/data/demo/clubs";
import { DEMO_EVENTS } from "@/lib/data/demo/events";
import { DEMO_PROFESSIONALS } from "@/lib/data/demo/professionals";
import { DEMO_STUDS } from "@/lib/data/demo/studs";

type ClubPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DEMO_CLUBS.map((club) => ({ slug: club.slug }));
}

export async function generateMetadata({ params }: ClubPageProps): Promise<Metadata> {
  const { slug } = await params;
  const club = DEMO_CLUBS.find((entry) => entry.slug === slug);
  if (!club) return { title: "Club not found" };
  return {
    title: club.name,
    description: `${club.description} Sample club profile in ${club.location.city}, ${club.location.stateCode}.`,
  };
}

export default async function ClubPage({ params }: ClubPageProps) {
  const { slug } = await params;
  const club = DEMO_CLUBS.find((entry) => entry.slug === slug);
  if (!club) notFound();

  const studs = club.recommendedStudSlugs
    .map((studSlug) => DEMO_STUDS.find((stud) => stud.slug === studSlug))
    .filter((stud): stud is NonNullable<typeof stud> => Boolean(stud));
  const professionals = club.recommendedProfessionalSlugs
    .map((proSlug) => DEMO_PROFESSIONALS.find((professional) => professional.slug === proSlug))
    .filter((professional): professional is NonNullable<typeof professional> => Boolean(professional));
  const events = DEMO_EVENTS.filter((event) => club.eventSlugs.includes(event.slug));

  return (
    <>
      <div className="border-b border-line bg-cream-50">
        <div className="shell py-6 lg:py-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Clubs", href: "/clubs" },
              { label: club.name },
            ]}
          />

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl border border-line bg-white font-display text-2xl text-navy-800">
                {club.name
                  .split(" ")
                  .slice(0, 2)
                  .map((word) => word[0])
                  .join("")}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {club.verification === "documents_reviewed" ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-info-600/20 bg-info-50 px-2.5 py-1 text-[11px] font-semibold text-info-700">
                      <Icon name="file" className="h-3.5 w-3.5" />
                      Documents reviewed
                    </span>
                  ) : club.verification === "in_review" ? (
                    <span className="inline-flex items-center gap-1 rounded-full border border-warning-600/25 bg-warning-50 px-2.5 py-1 text-[11px] font-semibold text-warning-700">
                      <Icon name="clock" className="h-3.5 w-3.5" />
                      Documents in review
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-muted">
                      <Icon name="file" className="h-3.5 w-3.5" />
                      Documents not submitted
                    </span>
                  )}
                  {club.parentClubClaim ? (
                    <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-800">
                      Parent club claim · sample
                    </span>
                  ) : null}
                </div>
                <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900 sm:text-5xl">
                  {club.name}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                  <Icon name="pin" className="h-4 w-4 text-navy-300" />
                  {club.location.city}, {club.location.stateName}
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  Website: {club.websiteLabel} · sample domain, not linked
                </p>
              </div>
            </div>
            <ButtonLink href="/clubs" variant="secondary" size="sm" iconLeft={<Icon name="arrow-left" className="h-4 w-4" />}>
              All clubs
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="shell py-8">
        <div className="mb-6">
          <Alert tone="info" title="A recommendation is not a guarantee">
            The recommendations below are a club&apos;s opinion. They are separate from document
            review, and no payment creates a recommendation.
          </Alert>
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="min-w-0 space-y-9">
            <section>
              <h2 className="font-display text-2xl text-navy-900">About the club</h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-muted">{club.description}</p>
              <p className="mt-3 text-[11px] leading-relaxed text-muted">
                This is a fictional sample club. No real membership, officer, address or affiliation
                is represented.
              </p>
            </section>

            {studs.length > 0 ? (
              <section aria-labelledby="club-studs-heading">
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <h2 id="club-studs-heading" className="font-display text-2xl text-navy-900">
                      Recommended studs
                    </h2>
                    <p className="mt-1 text-sm text-muted">A club attribution, shown on the profile.</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {studs.map((stud) => (
                    <StudCard key={stud.id} stud={stud} />
                  ))}
                </div>
              </section>
            ) : null}

            {professionals.length > 0 ? (
              <section aria-labelledby="club-pros-heading">
                <h2 id="club-pros-heading" className="font-display text-2xl text-navy-900">
                  Recommended professionals
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {professionals.map((professional) => (
                    <ProfessionalCard key={professional.id} professional={professional} />
                  ))}
                </div>
              </section>
            ) : null}

            {events.length > 0 ? (
              <section aria-labelledby="club-events-heading">
                <h2 id="club-events-heading" className="font-display text-2xl text-navy-900">
                  Club events
                </h2>
                <div className="mt-4 space-y-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            ) : null}

            <section className="rounded-2xl border border-line bg-cream-50 p-5">
              <h2 className="font-display text-xl text-navy-900">Club tools</h2>
              <ul className="mt-3 grid gap-2 text-[12px] leading-relaxed text-muted sm:grid-cols-2">
                {[
                  "Recommend a stud or a professional with attribution",
                  "Publish events with tickets and capacity",
                  "Publish breed notes and articles",
                  "Report a concern to administration",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] leading-relaxed text-muted">
                These tools are not connected in the preview. No member count, article or report is
                invented.
              </p>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h2 className="font-display text-xl text-navy-900">Club contact</h2>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                Contact details are not public in this sample. The source documents require domain,
                email and document checks that are not implemented here.
              </p>
              <div className="mt-3 rounded-xl border border-dashed border-line bg-cream-50 p-3 text-[11px] text-muted">
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <Icon name="lock" className="h-3.5 w-3.5" />
                  Email hidden
                </p>
                <p className="mt-1">No real club email is stored or displayed.</p>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="font-display text-lg text-navy-900">Verification status</h2>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">
                Club verification would require a domain check, a parent-club source and a manual
                review. Only a document-review state is shown here, and it is labelled as sample.
              </p>
              <Link href="/demo" className="mt-3 inline-flex text-[11px] font-semibold text-navy-800 underline underline-offset-2">
                What is simulated?
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
