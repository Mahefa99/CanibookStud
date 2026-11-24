import Link from "next/link";
import { DemoPortrait } from "@/components/domain/demo-portrait";
import { FavoriteButton } from "@/components/domain/favorite-button";
import {
  BrucellosisBadge,
  ClubRecommendationBadge,
  DocumentationBadge,
  PlanBadge,
} from "@/components/domain/signal-badges";
import { Icon } from "@/components/ui/icon";
import { DEMO_REFERENCE_DATE } from "@/lib/config/site";
import type { Stud } from "@/lib/types/domain";
import { ageInYears, cn, formatUsd } from "@/lib/utils";

/**
 * Directory card. Paid placement is labelled in the top-left corner; document
 * and health signals remain separate badges below. No contact details appear.
 */
export function StudCard({
  stud,
  compact = false,
}: {
  stud: Stud;
  compact?: boolean;
}) {
  const age = ageInYears(stud.birthDate, DEMO_REFERENCE_DATE);
  const ageLabel = `${age} ${age === 1 ? "year" : "years"}`;

  if (compact) {
    return (
      <article className="flex gap-3 rounded-xl border border-line bg-white p-2.5 transition-colors hover:border-navy-200">
        <Link
          href={`/studs/${stud.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-100"
        >
          <DemoPortrait photo={stud.photos[0]!} className="h-full w-full" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted">
                {stud.breed}
              </p>
              <h3 className="truncate font-display text-lg leading-tight text-navy-900">
                <Link href={`/studs/${stud.slug}`} className="hover:underline">
                  {stud.name}
                </Link>
              </h3>
            </div>
            <span className="tabular shrink-0 text-sm font-semibold text-navy-900">
              {formatUsd(stud.studFeeUsd)}
            </span>
          </div>
          <p className="mt-1 flex items-center gap-1 truncate text-xs text-muted">
            <Icon name="pin" className="h-3.5 w-3.5 shrink-0" />
            {stud.location.city}, {stud.location.stateCode}
          </p>
          <div className="mt-1.5 flex flex-wrap gap-1">
            <BrucellosisBadge record={stud.brucellosis} referenceDate={DEMO_REFERENCE_DATE} />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="relative aspect-[4/3] overflow-hidden bg-cream-100">
        <Link
          href={`/studs/${stud.slug}`}
          className="block h-full w-full"
          aria-label={`View ${stud.name}, ${stud.breed}, in ${stud.location.city}, ${stud.location.stateCode}`}
        >
          <DemoPortrait
            photo={stud.photos[0]!}
            alt={stud.photos[0]!.alt}
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.025]"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <div className="pointer-events-auto">
            <PlanBadge plan={stud.plan} status={stud.subscriptionStatus} />
          </div>
          <div className="pointer-events-auto">
            <FavoriteButton studId={stud.id} studName={stud.name} />
          </div>
        </div>
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted backdrop-blur">
          Illustration
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              {stud.breed}
            </p>
            <p className="text-[11px] text-muted">{ageLabel}</p>
          </div>
          <h3 className="mt-1 font-display text-2xl leading-tight text-navy-900">
            <Link href={`/studs/${stud.slug}`} className="hover:underline">
              {stud.name}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
            <Icon name="pin" className="h-4 w-4 text-navy-300" />
            {stud.location.city}, {stud.location.stateCode}
          </p>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted">{stud.headline}</p>

        <div className="flex flex-wrap gap-1.5">
          <BrucellosisBadge record={stud.brucellosis} referenceDate={DEMO_REFERENCE_DATE} />
          <DocumentationBadge status={stud.brucellosis.reviewStatus} />
          {stud.clubRecommendation ? (
            <ClubRecommendationBadge recommendation={stud.clubRecommendation} />
          ) : null}
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
              Stud fee
            </p>
            <p className="tabular font-display text-xl text-navy-900">
              {formatUsd(stud.studFeeUsd)}
            </p>
          </div>
          <Link
            href={`/studs/${stud.slug}`}
            className={cn(
              "inline-flex min-h-9 items-center gap-1 rounded-full px-3 text-[13px] font-semibold text-navy-700",
              "hover:bg-navy-50",
            )}
          >
            View profile
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
