import type { Metadata } from "next";
import Link from "next/link";
import { ProfessionalCard } from "@/components/domain/marketplace-cards";
import { AdSlot } from "@/components/domain/ad-slot";
import { ProfessionalFilters } from "@/components/domain/professional-filters";
import { ServicesMap } from "@/components/domain/services-map";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { PROFESSIONAL_CATEGORIES, professionalCategoryLabel } from "@/lib/config/professional-categories";
import { DEMO_PROFESSIONALS } from "@/lib/data/demo/professionals";
import {
  buildProfessionalSearchHref,
  filterProfessionals,
  parseProfessionalSearchParams,
} from "@/lib/search/professionals";
import { cn, pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pet services",
  description:
    "Sample directory of vets, emergency clinics, shelters, trainers, groomers, boarding and pet stores. V12 plan prices are configured.",
};

interface PetServicesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PetServicesPage({ searchParams }: PetServicesPageProps) {
  const raw = await searchParams;
  const query = parseProfessionalSearchParams(raw);
  const results = filterProfessionals(DEMO_PROFESSIONALS, query);
  const activeCount = [query.q, query.category, query.stateCode, query.emergencyOnly].filter(Boolean).length;

  const categoryCounts = PROFESSIONAL_CATEGORIES.map((category) => ({
    ...category,
    count: DEMO_PROFESSIONALS.filter((professional) => professional.category === category.id).length,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Pet services · demo"
        title="Local help, with the boundaries visible."
        description="Seven categories of pet professionals. Emergency acceptance is owner-declared and never turned into a 24/7 promise; V12 plan prices are available in business registration."
        actions={
          <>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-warning-600/25 bg-warning-50 px-3 py-1.5 text-[11px] font-semibold text-warning-700">
              <Icon name="clock" className="h-3.5 w-3.5" />
              V12 plans / demo
            </span>
            <Link
              href="/dashboard/services/new"
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Add your business
              <Icon name="plus" className="h-4 w-4" />
            </Link>
          </>
        }
      />

      <div className="shell py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[276px_minmax(0,1fr)] lg:gap-10">
          <ProfessionalFilters query={query} activeCount={activeCount} />

          <section aria-labelledby="professional-results-heading" className="min-w-0">
            <div className="flex flex-wrap gap-1.5 border-b border-line pb-4">
              <Link
                href={buildProfessionalSearchHref(query, { category: undefined })}
                className={cn(
                  "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold",
                  !query.category
                    ? "border-navy-700 bg-navy-700 text-white"
                    : "border-line bg-white text-navy-800 hover:border-navy-300",
                )}
              >
                All
                <span className="tabular opacity-75">{DEMO_PROFESSIONALS.length}</span>
              </Link>
              {categoryCounts.map((category) => (
                <Link
                  key={category.id}
                  href={buildProfessionalSearchHref(query, { category: category.id })}
                  className={cn(
                    "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-semibold",
                    query.category === category.id
                      ? "border-navy-700 bg-navy-700 text-white"
                      : "border-line bg-white text-navy-800 hover:border-navy-300",
                  )}
                >
                  {category.shortLabel}
                  <span className="tabular opacity-75">{category.count}</span>
                </Link>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 id="professional-results-heading" className="font-display text-2xl text-navy-900">
                  {query.view === "map" ? "Map of pet services" : "Pet services directory"}
                </h2>
                <p className="mt-1 text-xs text-muted" aria-live="polite">
                  <span className="tabular font-semibold text-ink">{results.length}</span>{" "}
                  {pluralize(results.length, "business", "businesses")}
                  {query.category ? ` · ${professionalCategoryLabel(query.category)}` : ""}
                </p>
              </div>
              <div className="inline-flex rounded-full border border-line bg-white p-1">
                <Link
                  href={buildProfessionalSearchHref(query, { view: "list" })}
                  aria-current={query.view !== "map" ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold",
                    query.view !== "map" ? "bg-navy-700 text-white" : "text-navy-800 hover:bg-cream-50",
                  )}
                >
                  <Icon name="list" className="h-3.5 w-3.5" />
                  List
                </Link>
                <Link
                  href={buildProfessionalSearchHref(query, { view: "map" })}
                  aria-current={query.view === "map" ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold",
                    query.view === "map" ? "bg-navy-700 text-white" : "text-navy-800 hover:bg-cream-50",
                  )}
                >
                  <Icon name="map" className="h-3.5 w-3.5" />
                  Map
                </Link>
              </div>
            </div>

            <div className="mt-4">
              <Alert tone="warning" title="Plans are not for sale yet">
                The source documents contain conflicting professional prices ($0/$69/$199 versus
                superseded V11 amounts). No plan is selected or charged here.
              </Alert>
              <div className="mt-4 max-w-sm">
                <AdSlot placement="services_sidebar" pathname="/pet-services" variant="sidebar" />
              </div>
            </div>

            {results.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  icon="search"
                  title="No businesses match these filters"
                  description="Try another category or state. This preview contains eight sample businesses."
                  action={
                    <Link
                      href="/pet-services"
                      className="inline-flex min-h-10 items-center rounded-full bg-navy-700 px-5 text-sm font-semibold text-white"
                    >
                      Clear filters
                    </Link>
                  }
                />
              </div>
            ) : query.view === "map" ? (
              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(220px,0.7fr)]">
                <ServicesMap professionals={results} />
                <ul className="space-y-2">
                  {results.map((professional) => (
                    <li key={professional.id}>
                      <Link
                        href={`/pet-services/${professional.slug}`}
                        className="block rounded-xl border border-line bg-white p-3 transition-colors hover:border-navy-300"
                      >
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                          {professionalCategoryLabel(professional.category)}
                        </p>
                        <p className="mt-0.5 text-sm font-semibold text-navy-900">{professional.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted">
                          {professional.address.city}, {professional.address.stateCode}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((professional) => (
                  <ProfessionalCard key={professional.id} professional={professional} />
                ))}
              </div>
            )}

            <section className="mt-8 rounded-2xl border border-line bg-cream-50 p-5">
              <h2 className="font-display text-xl text-navy-900">What the badges mean</h2>
              <div className="mt-3 grid gap-3 text-[12px] leading-relaxed text-muted sm:grid-cols-3">
                <p>
                  <span className="font-semibold text-ink">Documents reviewed</span> means the
                  business uploaded documents and they were checked against a checklist. It is not a
                  licence guarantee.
                </p>
                <p>
                  <span className="font-semibold text-ink">Accepts emergencies</span> is declared by
                  the business. It does not mean the location is open 24/7.
                </p>
                <p>
                  <span className="font-semibold text-ink">Plan</span> controls visibility only. A
                  paid plan never creates a verification badge.
                </p>
              </div>
            </section>
          </section>
        </div>
      </div>
    </>
  );
}
