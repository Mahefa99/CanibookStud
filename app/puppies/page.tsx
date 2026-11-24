import type { Metadata } from "next";
import Link from "next/link";
import { LitterCard } from "@/components/domain/marketplace-cards";
import { LitterFilters } from "@/components/domain/litter-filters";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { DEMO_REFERENCE_DATE, DEMO_SNAPSHOT_LABEL } from "@/lib/config/site";
import { DEMO_LITTERS } from "@/lib/data/demo/litters";
import { parseLitterSearchParams, filterLitters } from "@/lib/search/litters";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Puppies & litters",
  description:
    "Browse sample litters with individually listed puppies, readiness dates and a clear price breakdown. Reservations are not open in this preview.",
};

interface PuppiesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PuppiesPage({ searchParams }: PuppiesPageProps) {
  const raw = await searchParams;
  const query = parseLitterSearchParams(raw);
  const litters = filterLitters(DEMO_LITTERS, query, DEMO_REFERENCE_DATE);
  const breeds = Array.from(new Set(DEMO_LITTERS.map((litter) => litter.breed))).sort();
  const activeFilters = [query.q, query.breed, query.stateCode, query.status, query.readyNow].filter(Boolean).length;

  return (
    <>
      <PageHeader
        eyebrow="Puppies · demo"
        title="Litters, with each puppy accounted for."
        description="Every puppy is listed individually, with its own status. A reservation is for one puppy — never for the whole litter — and no delivery is offered by the platform."
        actions={
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500" aria-hidden="true" />
              {DEMO_SNAPSHOT_LABEL}
            </span>
            <Link
              href="/dashboard/litters/new"
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              List a litter
              <Icon name="plus" className="h-4 w-4" />
            </Link>
          </>
        }
      />

      <div className="shell py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[276px_minmax(0,1fr)] lg:gap-10">
          <LitterFilters query={query} breeds={breeds} activeCount={activeFilters} />

          <section aria-labelledby="litter-results-heading" className="min-w-0">
            <div className="border-b border-line pb-4">
              <h2 id="litter-results-heading" className="font-display text-2xl text-navy-900">
                Matching litters
              </h2>
              <p className="mt-1 text-xs text-muted" aria-live="polite">
                <span className="tabular font-semibold text-ink">{litters.length}</span>{" "}
                {pluralize(litters.length, "litter")} in the sample directory ·{" "}
                {litters.reduce(
                  (total, litter) => total + litter.puppies.filter((puppy) => puppy.status === "available").length,
                  0,
                )}{" "}
                puppies marked available
              </p>
            </div>

            <div className="mt-4">
              <Alert tone="warning" title="Reservation checkout is not open">
                The source documents disagree on whether the platform collects $600 or the $3,600
                total. The prototype shows the full breakdown and disables payment. It never presents
                a $3,600 debit as a smaller $600 charge.
              </Alert>
            </div>

            {litters.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  icon="search"
                  title="No litters match these filters"
                  description="Try another breed, state or timing. This preview only contains four sample litters."
                  action={
                    <Link
                      href="/puppies"
                      className="inline-flex min-h-10 items-center rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
                    >
                      Clear filters
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                {litters.map((litter) => (
                  <LitterCard key={litter.id} litter={litter} />
                ))}
              </div>
            )}

            <section id="how-it-works" className="mt-10 scroll-mt-24 rounded-2xl border border-line bg-cream-50 p-5">
              <h2 className="font-display text-2xl text-navy-900">How a reservation would work</h2>
              <div className="mt-4 grid gap-4 text-[12px] leading-relaxed text-muted sm:grid-cols-3">
                {[
                  ["1. Pick one puppy", "Each puppy has an identifier, a collar colour and its own status."],
                  ["2. Agree the total", "Puppy price + service fee. The collection rule is an open decision."],
                  ["3. Meet at pick-up", "No delivery by the platform. Pick-up is arranged directly with the breeder."],
                ].map(([title, body]) => (
                  <div key={title}>
                    <p className="font-semibold text-ink">{title}</p>
                    <p className="mt-1">{body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 flex items-start gap-2 border-t border-line pt-4 text-[11px] text-muted">
                <Icon name="info" className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Readiness windows and reservation states are configurable platform rules in this
                preview, not legal advice.
              </p>
            </section>
          </section>
        </div>
      </div>
    </>
  );
}
