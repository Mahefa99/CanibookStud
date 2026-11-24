import Link from "next/link";
import { DemoPortrait } from "@/components/domain/demo-portrait";
import {
  EmergencyBadge,
  EventStatusBadge,
  LitterPlanBadge,
  LitterStatusBadge,
  ProfessionalLicenseBadge,
  ProfessionalPlanBadge,
  ProfessionalVerificationBadge,
  PuppyStatusBadge,
  ReadinessBadge,
} from "@/components/domain/marketplace-badges";
import { Icon } from "@/components/ui/icon";
import { professionalCategoryLabel } from "@/lib/config/professional-categories";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";
import { DEMO_CLUBS, findDemoClub } from "@/lib/data/demo/clubs";
import type {
  Club,
  Event,
  Litter,
  Professional,
} from "@/lib/types/marketplace";
import {
  formatDate,
  formatEventDateTime,
  formatUsd,
  pluralize,
} from "@/lib/utils";

/** Cards for litters, professionals, clubs and events. */

export function LitterCard({ litter }: { litter: Litter }) {
  const available = litter.puppies.filter(
    (puppy) => puppy.status === "available",
  ).length;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
        <Link
          href={`/puppies/${litter.slug}`}
          className="block h-full w-full"
          aria-label={`View ${litter.title}`}
        >
          <DemoPortrait
            photo={litter.photos[0]!}
            alt={litter.photos[0]!.alt}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.025]"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="pointer-events-auto flex flex-wrap gap-1.5">
            <LitterPlanBadge plan={litter.listingPlan} />
            {litter.status !== "available" ? (
              <LitterStatusBadge status={litter.status} />
            ) : null}
          </div>
        </div>
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted backdrop-blur">
          Illustration
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              {litter.breed}
            </p>
            <p className="text-[11px] text-muted">{litter.breederName}</p>
          </div>
          <h3 className="mt-1 font-display text-2xl leading-tight text-navy-900">
            <Link href={`/puppies/${litter.slug}`} className="hover:underline">
              {litter.title}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <Icon name="pin" className="h-4 w-4 text-navy-300" />
            {litter.location.city}, {litter.location.stateCode}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <ReadinessBadge
            readyDate={litter.readyDate}
            referenceDate={DEMO_REFERENCE_DATE}
          />
          <span className="inline-flex items-center rounded-full border border-line bg-cream-50 px-2.5 py-1 text-[11px] font-semibold text-[#46505E]">
            {available} of {litter.puppies.length} available
          </span>
        </div>

        <p className="rounded-lg bg-cream-50 px-3 py-2 text-[11px] leading-relaxed text-muted">
          <span className="tabular font-semibold text-ink">
            {formatUsd(litter.puppyPriceUsd)}
          </span>{" "}
          puppy price by breeder +{" "}
          <span className="tabular font-semibold text-ink">
            {formatUsd(litter.serviceFeeUsd)}
          </span>{" "}
          service fee ={" "}
          <span className="tabular font-semibold text-ink">
            {formatUsd(litter.totalUsd)}
          </span>
          . Pick-up only.
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Litter total
            </p>
            <p className="tabular font-display text-xl text-navy-900">
              {formatUsd(litter.totalUsd)}
            </p>
          </div>
          <Link
            href={`/puppies/${litter.slug}`}
            className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[13px] font-semibold text-navy-700 hover:bg-navy-50"
          >
            View litter
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ProfessionalCard({
  professional,
}: {
  professional: Professional;
}) {
  if (professional.plan === "free")
    return (
      <article className="rounded-2xl border border-line bg-cream-100 p-5">
        <p className="text-xs font-semibold text-muted">
          Inactive listing / locked contact
        </p>
        <h3 className="mt-3 font-display text-xl">{professional.name}</h3>
        <p className="my-3 text-sm">
          {professional.address.city}, {professional.address.stateCode}
        </p>
        <Link
          className="text-sm font-semibold underline"
          href="/dashboard/services/new"
        >
          Activate my number
        </Link>
      </article>
    );
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative aspect-[16/10] overflow-hidden bg-cream-100">
        <Link
          href={`/pet-services/${professional.slug}`}
          className="block h-full w-full"
          aria-label={`View ${professional.name}`}
        >
          <DemoPortrait
            photo={professional.photos[0]!}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.025]"
          />
        </Link>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-navy-800 backdrop-blur">
          {professionalCategoryLabel(professional.category)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-xl leading-tight text-navy-900">
            <Link
              href={`/pet-services/${professional.slug}`}
              className="hover:underline"
            >
              {professional.name}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted">
            <Icon name="pin" className="h-3.5 w-3.5 text-navy-300" />
            {professional.address.city}, {professional.address.stateCode}
          </p>
        </div>

        <p className="line-clamp-2 text-[13px] leading-relaxed text-muted">
          {professional.description}
        </p>

        <div className="flex flex-wrap gap-1.5">
          <ProfessionalVerificationBadge status={professional.verification} />
          <ProfessionalLicenseBadge status={professional.licenseCheck} />
          <ProfessionalPlanBadge plan={professional.plan} />
          {professional.emergencyDeclared ? <EmergencyBadge /> : null}
          {professional.recommendedBy ? (
            <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-800">
              <Icon name="award" className="h-3.5 w-3.5" />
              Recommended by {professional.recommendedBy}
            </span>
          ) : null}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3">
          <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-muted">
            Configured subscription / demo
          </span>
          <Link
            href={`/pet-services/${professional.slug}`}
            className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[13px] font-semibold text-navy-700 hover:bg-navy-50"
          >
            View profile
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ClubCard({ club }: { club: Club }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card">
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy-50 font-display text-xl text-navy-700">
          {club.name
            .split(" ")
            .slice(0, 2)
            .map((word) => word[0])
            .join("")}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-xl leading-tight text-navy-900">
            <Link href={`/clubs/${club.slug}`} className="hover:underline">
              {club.name}
            </Link>
          </h3>
          <p className="mt-0.5 text-xs text-muted">
            {club.location.city}, {club.location.stateCode}
          </p>
        </div>
      </div>

      <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed text-muted">
        {club.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
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
          <span className="inline-flex items-center gap-1 rounded-full border border-line bg-cream-50 px-2.5 py-1 text-[11px] font-semibold text-muted">
            <Icon name="file" className="h-3.5 w-3.5" />
            Documents not submitted
          </span>
        )}
        {club.parentClubClaim ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-800">
            Parent club claim · sample
          </span>
        ) : null}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-3 text-[11px] text-muted">
        <span>
          {club.recommendedStudSlugs.length}{" "}
          {pluralize(club.recommendedStudSlugs.length, "stud")} ·{" "}
          {club.eventSlugs.length} {pluralize(club.eventSlugs.length, "event")}
        </span>
        <Link
          href={`/clubs/${club.slug}`}
          className="inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[13px] font-semibold text-navy-700 hover:bg-navy-50"
        >
          View club
          <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}

export function EventCard({ event }: { event: Event }) {
  const club = findDemoClub(event.clubSlug) ?? DEMO_CLUBS[0];
  const date = new Date(event.startsAt);
  const month = new Intl.DateTimeFormat("en-US", {
    month: "short",
    timeZone: event.timeZone,
  }).format(date);
  const day = new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    timeZone: event.timeZone,
  }).format(date);
  const remaining = Math.max(0, event.capacity - event.ticketsSold);

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 shadow-card sm:flex-row sm:items-center sm:p-5">
      <div className="flex shrink-0 items-center gap-3 sm:block sm:w-16 sm:text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-orange-700">
          {month}
        </p>
        <p className="tabular font-display text-3xl leading-none text-navy-900">
          {day}
        </p>
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-display text-xl leading-tight text-navy-900">
            <Link href={`/events/${event.slug}`} className="hover:underline">
              {event.title}
            </Link>
          </h3>
          <EventStatusBadge status={event.status} />
        </div>
        <p className="mt-1 text-xs text-muted">
          {club?.name} · {event.locationName}, {event.city}, {event.stateCode}
        </p>
        <p className="mt-1 text-[11px] text-muted">
          {formatEventDateTime(event.startsAt, event.timeZone)} ·{" "}
          {event.timeZoneLabel}
        </p>
        <p className="mt-2 text-[11px] text-muted">
          {event.status === "sold_out"
            ? "Sold out — waitlist is not connected."
            : `${remaining} of ${event.capacity} tickets remaining.`}{" "}
          Ticket {formatUsd(event.ticketPriceUsd)} + {formatUsd(event.feeUsd)}{" "}
          fee ={" "}
          <span className="tabular font-semibold text-ink">
            {formatUsd(event.totalUsd)}
          </span>
        </p>
      </div>
      <Link
        href={`/events/${event.slug}`}
        className="inline-flex min-h-9 shrink-0 items-center gap-1 self-start rounded-full border border-line bg-white px-3.5 text-xs font-semibold text-navy-800 hover:border-navy-300 sm:self-center"
      >
        Event details
        <Icon name="arrow-right" className="h-3.5 w-3.5" />
      </Link>
    </article>
  );
}
