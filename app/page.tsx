import Link from "next/link";
import type { Metadata } from "next";
import { MarketMap } from "@/components/domain/market-map";
import { AdSlot } from "@/components/domain/ad-slot";
import { LitterCard } from "@/components/domain/marketplace-cards";
import { StudCard } from "@/components/domain/stud-card";
import {
  BrucellosisBadge,
  ClubRecommendationBadge,
  DocumentationBadge,
  PlanBadge,
} from "@/components/domain/signal-badges";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/page-header";
import { catalogRepository } from "@/lib/api/catalog";
import { DEMO_REFERENCE_DATE, MARKETPLACE_NOTICE } from "@/lib/config/site";
import { DEMO_CLUBS } from "@/lib/data/demo/clubs";
import { DEMO_EVENTS } from "@/lib/data/demo/events";
import { DEMO_LITTERS } from "@/lib/data/demo/litters";
import { DEMO_PROFESSIONALS } from "@/lib/data/demo/professionals";
import { US_STATES } from "@/lib/data/us-states";

export const metadata: Metadata = {
  title: "Stud discovery, with the records in view",
  description:
    "Browse US stud profiles with documented health records, private locations, and clear request states. Subscription, document review and club recommendations are always shown separately.",
};

const PRINCIPLES = [
  {
    number: "01",
    title: "Three signals, kept apart",
    body: "A paid listing, a reviewed document and a club recommendation answer different questions. They get different badges — never one vague checkmark.",
    icon: "shield" as const,
  },
  {
    number: "02",
    title: "Private by default",
    body: "Public profiles show a city and an approximate map pin. Exact addresses and contact details are never part of the public response.",
    icon: "lock" as const,
  },
  {
    number: "03",
    title: "States that tell the truth",
    body: "Waiting, failed, confirmed, expired, declined. Those are separate states, and the interface names them instead of hiding them behind a success screen.",
    icon: "list" as const,
  },
];

const ROLES = [
  { label: "Stud owner", detail: "Publish a male, keep records current, answer requests." },
  { label: "Dam owner", detail: "Keep a private heat calendar and request a stud." },
  { label: "Breeder", detail: "Plan a litter without exposing private details." },
  { label: "Buyer", detail: "See the full price breakdown before reserving." },
  { label: "Pet professional", detail: "Claim a business profile and list services." },
  { label: "Club manager", detail: "Support members with recommendations and events." },
  { label: "Sponsor", detail: "Choose a defined placement, not a vague promise." },
];

export default async function HomePage() {
  const [featured, breeds] = await Promise.all([
    catalogRepository.getFeaturedStuds(6),
    catalogRepository.listBreeds(),
  ]);

  const highlight = featured[0];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line bg-cream-50">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-[#FFE7D4] opacity-70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-navy-100 opacity-50 blur-3xl"
        />

        <div className="shell relative grid gap-12 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-20">
          <div className="animate-fade-up">
            <p className="eyebrow">Built for responsible breeding</p>
            <h1 className="mt-5 text-balance font-display text-[2.9rem] leading-[0.98] tracking-[-0.03em] text-navy-900 sm:text-6xl lg:text-[4.4rem]">
              Elite genetics.
              <br />
              Buckle up, the pups are coming!<span className="text-orange-500">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-[15px] leading-7 text-muted sm:text-base">
              Find studs with the records in view: registration details, health
              documentation, availability and the owner&apos;s terms. Contact details stay private
              until a request is confirmed.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/studs" size="lg" iconRight={<Icon name="arrow-right" className="h-4 w-4" />}>
                Find a stud
              </ButtonLink>
              <ButtonLink href="/puppies" variant="secondary" size="lg">
                Find a puppy
              </ButtonLink>
              <ButtonLink href="/pet-services" variant="secondary" size="lg">Find pet services</ButtonLink>
            </div>

            <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs font-medium text-[#3E4A59]">
              {[
                "Private contact details",
                "Separate verification signals",
                "No delivery by the platform",
              ].map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Icon name="check" className="h-3.5 w-3.5 text-success-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative lg:pl-4">
            <div
              aria-hidden="true"
              className="absolute -inset-3 -rotate-1 rounded-[2.2rem] bg-orange-100"
            />
            <div className="relative rounded-[2rem] border border-line bg-white p-3 shadow-lift">
              <MarketMap
                studs={featured}
                compact
                ariaLabel="Schematic preview of approximate stud locations across the United States."
                className=""
              />

              {highlight ? (
                <div className="mt-3 rounded-2xl border border-line bg-cream-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Three signals, never merged
                    </p>
                    <Link
                      href={`/studs/${highlight.slug}`}
                      className="text-[11px] font-semibold text-navy-800 underline underline-offset-2"
                    >
                      See profile
                    </Link>
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    <PlanBadge plan={highlight.plan} status={highlight.subscriptionStatus} />
                    <DocumentationBadge status={highlight.brucellosis.reviewStatus} />
                    <BrucellosisBadge
                      record={highlight.brucellosis}
                      referenceDate={DEMO_REFERENCE_DATE}
                    />
                    {highlight.clubRecommendation ? (
                      <ClubRecommendationBadge recommendation={highlight.clubRecommendation} />
                    ) : null}
                  </div>
                  <p className="mt-2.5 text-[11px] leading-relaxed text-muted">
                    Sample profile. Paid placement is not a verification, and a club
                    recommendation is not a subscription.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div id="search" className="shell relative pb-10 lg:pb-14">
          <form
            method="get"
            action="/studs"
            className="grid gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:grid-cols-[1.2fr_1fr_auto] sm:items-end sm:p-5"
          >
            <div>
              <label htmlFor="home-breed" className="field-label">
                Breed
              </label>
              <div className="relative">
                <select id="home-breed" name="breed" className="form-input appearance-none pr-9" defaultValue="">
                  <option value="">Any breed</option>
                  {breeds.map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                />
              </div>
            </div>

            <div>
              <label htmlFor="home-state" className="field-label">
                State
              </label>
              <div className="relative">
                <select id="home-state" name="state" className="form-input appearance-none pr-9" defaultValue="">
                  <option value="">Any state</option>
                  {US_STATES.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name}
                    </option>
                  ))}
                </select>
                <Icon
                  name="chevron-down"
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-navy-700 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-navy-800"
            >
              <Icon name="search" className="h-4 w-4" />
              Search studs
            </button>
          </form>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="shell py-14 lg:py-20">
          <div className="mb-8">
            <AdSlot placement="home_top_banner" pathname="/" />
          </div>
          <SectionHeading
            eyebrow="Featured placement"
            title="A first look at the directory"
          description="These profiles are shown because their owners selected featured placement. It is paid visibility — not a quality score, a verification, or an endorsement."
          action={
            <Link
              href="/studs"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 underline decoration-navy-200 underline-offset-4 hover:decoration-navy-700"
            >
              View all studs
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          }
        />

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.slice(0, 6).map((stud) => (
            <StudCard key={stud.id} stud={stud} />
          ))}
        </div>
        {featured.length === 0 ? (
          <p className="mt-6 text-sm text-muted">No profiles are available in this demo.</p>
        ) : null}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="shell py-14 lg:py-20">
          <SectionHeading
            eyebrow="Litters · sample"
            title="Puppies, one by one"
            description="Each puppy has its own status. A reservation concerns one identified puppy, never the whole litter, and the platform does not deliver animals."
            action={
              <Link
                href="/puppies"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 underline decoration-navy-200 underline-offset-4 hover:decoration-navy-700"
              >
                Browse litters
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {DEMO_LITTERS.filter((litter) => litter.featured)
              .slice(0, 6)
              .map((litter) => (
                <LitterCard key={litter.id} litter={litter} />
              ))}
          </div>
        </div>
      </section>

      <section className="shell py-14 lg:py-20">
        <SectionHeading
          eyebrow="The rest of the marketplace"
          title="More than a stud directory."
          description="Services, clubs, events and comparison pages use the same signal rules: label what is paid, what is reviewed, and what is still undecided."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              title: "Pet services",
              body: "Seven categories, from emergency vets to pet stores.",
              href: "/pet-services",
              icon: "pin" as const,
              meta: `${DEMO_PROFESSIONALS.length} sample businesses`,
            },
            {
              title: "Clubs",
              body: "Recommendations and events, with document review kept separate.",
              href: "/clubs",
              icon: "award" as const,
              meta: `${DEMO_CLUBS.length} sample clubs`,
            },
            {
              title: "Events",
              body: "Local time zones, capacity and the ticket fee shown separately.",
              href: "/events",
              icon: "calendar" as const,
              meta: `${DEMO_EVENTS.length} sample events`,
            },
            {
              title: "Compare",
              body: "Insurance and food tables with sample data clearly labelled.",
              href: "/compare",
              icon: "shield" as const,
              meta: "3 sample comparators",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-line bg-white p-5 shadow-card transition-[border,transform] hover:-translate-y-0.5 hover:border-navy-300"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-cream-100 text-navy-700">
                <Icon name={card.icon} className="h-5 w-5" />
              </span>
              <h3 className="mt-4 font-display text-xl leading-tight text-navy-900">{card.title}</h3>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{card.body}</p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-muted">{card.meta}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-navy-800">
                Explore
                <Icon name="arrow-right" className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="shell py-14 lg:py-20">
          <SectionHeading
            eyebrow="Design principles"
            title="The interface should not blur the facts"
            description="Marketplace signals are only useful if people can tell them apart. These three rules shape every screen, badge and state."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {PRINCIPLES.map((principle) => (
              <article key={principle.number} className="rounded-2xl border border-line bg-cream-50 p-6">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-navy-700 shadow-sm">
                    <Icon name={principle.icon} className="h-5 w-5" />
                  </span>
                  <span className="tabular text-xs font-semibold tracking-[0.16em] text-navy-500">
                    {principle.number}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-2xl leading-tight text-navy-900">
                  {principle.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-14 lg:py-20" id="roles">
        <div className="overflow-hidden rounded-[2rem] bg-navy-900 text-white">
          <div className="grid gap-10 p-7 sm:p-10 lg:grid-cols-[0.95fr_1.05fr] lg:p-14">
            <div>
              <p className="eyebrow text-orange-300 before:bg-orange-400">One account</p>
              <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-white sm:text-4xl">
                Every side of the breed, without seven logins.
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-navy-100">
                An account can hold several activities at once. The dashboard shows the sections
                that activity needs — not a different account for every role.
              </p>
              <ButtonLink
                href="/signup"
                variant="accent"
                className="mt-7"
                iconRight={<Icon name="arrow-right" className="h-4 w-4" />}
              >
                Create an account
              </ButtonLink>
              <p className="mt-3 text-[11px] text-navy-300">
                Preview only — this button does not create a real account.
              </p>
            </div>

            <ul className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              {ROLES.map((role) => (
                <li key={role.label} className="border-t border-white/10 pt-3">
                  <p className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Icon name="paw" className="h-3.5 w-3.5 text-orange-300" />
                    {role.label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-navy-200">{role.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="scroll-mt-24 border-y border-line bg-cream-100/60">
        <div className="shell py-14 lg:py-20">
          <SectionHeading
            eyebrow="How it works"
            title="From a profile to a clear next step"
            description="The request flow is built around a server-confirmed state. A redirect to a success page is never enough to unlock contact details."
          />

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <article className="rounded-2xl border border-line bg-white p-6 lg:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-orange-700">
                For stud owners
              </p>
              <h3 className="mt-2 font-display text-2xl text-navy-900">Publish the record, not a promise</h3>
              <ol className="mt-6 space-y-5">
                {[
                  {
                    title: "Build the profile",
                    body: "Identity, location, registration details, health documents, photos and availability.",
                  },
                  {
                    title: "Submit for review",
                    body: "Document states are shown separately from the subscription. Missing or expired records pause requests.",
                  },
                  {
                    title: "Answer requests",
                    body: "Contact details are only shared after the request state is confirmed by the server.",
                  },
                ].map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="tabular grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-50 text-xs font-semibold text-navy-800">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{step.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link
                href="/dashboard/animals/new/stud"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 underline decoration-navy-200 underline-offset-4 hover:decoration-navy-700"
              >
                Preview the stud form
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </article>

            <article className="rounded-2xl border border-line bg-white p-6 lg:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-info-700">
                For dam owners
              </p>
              <h3 className="mt-2 font-display text-2xl text-navy-900">Keep the calendar private</h3>
              <ol className="mt-6 space-y-5">
                {[
                  {
                    title: "Add your female",
                    body: "Registration and health records, plus a heat history. Female profiles are private by default.",
                  },
                  {
                    title: "Track the cycle",
                    body: "A 182-day cycle is the default estimate and can be changed. Projections are labelled as estimates.",
                  },
                  {
                    title: "Request a stud",
                    body: "$400 covers contact and the request; $80 is the platform fee. The stud fee stays a separate agreement.",
                  },
                ].map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="tabular grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-50 text-xs font-semibold text-navy-800">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink">{step.title}</p>
                      <p className="mt-1 text-[13px] leading-relaxed text-muted">{step.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <Link
                href="/dashboard/animals/new/dam"
                className="mt-7 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 underline decoration-navy-200 underline-offset-4 hover:decoration-navy-700"
              >
                Preview the dam form
                <Icon name="arrow-right" className="h-4 w-4" />
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section id="safety" className="shell scroll-mt-24 py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow">Safety & signals</p>
            <h2 className="mt-4 text-balance font-display text-3xl leading-tight text-navy-900 sm:text-4xl">
              What is checked — and what is not.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              A responsible interface says what it knows. Format checks, document reviews and
              club opinions are not the same as an official registry confirmation, and none of them
              is a health guarantee.
            </p>
            <div className="mt-6 rounded-xl border border-line bg-cream-50 p-4 text-xs leading-relaxed text-muted">
              <p className="font-semibold text-ink">Sample notice</p>
              <p className="mt-1">{MARKETPLACE_NOTICE}</p>
              <p className="mt-1.5 text-[11px] text-muted">
                Draft wording, pending legal review. No policy is presented as final.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Registration number format",
                body: "The number is checked against an expected format. That is not an AKC registration confirmation.",
                icon: "file" as const,
                tone: "bg-info-50 text-info-700",
              },
              {
                title: "Health document dates",
                body: "The brucellosis test date is shown with its age. The 14-day window is a listing rule under review, not a legal ruling.",
                icon: "shield" as const,
                tone: "bg-success-50 text-success-700",
              },
              {
                title: "Private contact details",
                body: "Phone numbers and emails are not part of public profiles. Hiding them with CSS would not be enough.",
                icon: "lock" as const,
                tone: "bg-warning-50 text-warning-700",
              },
              {
                title: "No delivery",
                body: "The platform does not ship animals. Pick-up is arranged directly between the breeder and the buyer.",
                icon: "pin" as const,
                tone: "bg-navy-50 text-navy-800",
              },
            ].map((card) => (
              <article key={card.title} className="rounded-2xl border border-line bg-white p-5">
                <span className={`grid h-9 w-9 place-items-center rounded-full ${card.tone}`}>
                  <Icon name={card.icon} className="h-4 w-4" />
                </span>
                <h3 className="mt-4 font-display text-xl leading-tight text-navy-900">{card.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
