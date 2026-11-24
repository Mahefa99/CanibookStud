import type { Metadata } from "next";
import Link from "next/link";
import { MarketMap } from "@/components/domain/market-map";
import { AdSlot } from "@/components/domain/ad-slot";
import { ResultsToolbar } from "@/components/domain/results-toolbar";
import { StudCard } from "@/components/domain/stud-card";
import { StudFilters } from "@/components/domain/stud-filters";
import { EmptyState } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { Pagination } from "@/components/ui/pagination";
import { catalogRepository } from "@/lib/api/catalog";
import { DEMO_SNAPSHOT_LABEL, SITE } from "@/lib/config/site";
import {
  buildStudSearchHref,
  hasActiveStudFilters,
  parseStudSearchParams,
} from "@/lib/search/studs";
import type { StudSearchQuery } from "@/lib/types/domain";
import { pluralize } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Stud directory",
  description:
    "Browse US stud profiles by breed, state, fee and record freshness. Paid placement and document review are labelled separately.",
};

interface StudsPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function activeChips(query: StudSearchQuery) {
  const chips: Array<{ label: string; href: string }> = [];
  for (const [key, label] of [
    ["color", "Color"],
    ["minAge", "Min age"],
    ["maxAge", "Max age"],
  ] as const) {
    if (query[key] !== undefined && query[key] !== "")
      chips.push({
        label: `${label}: ${query[key]}`,
        href: buildStudSearchHref(query, { [key]: undefined, page: undefined }),
      });
  }
  if (query.hasOfa)
    chips.push({
      label: "OFA / orthopaedic records",
      href: buildStudSearchHref(query, { hasOfa: false, page: undefined }),
    });
  if (query.hasAkc)
    chips.push({
      label: "AKC format checked",
      href: buildStudSearchHref(query, { hasAkc: false, page: undefined }),
    });
  if (query.origin && query.radius)
    chips.push({
      label: `Within ${query.radius} miles`,
      href: buildStudSearchHref(query, {
        origin: undefined,
        radius: undefined,
        page: undefined,
      }),
    });
  if (query.q) {
    chips.push({
      label: `Search: “${query.q}”`,
      href: buildStudSearchHref(query, { q: undefined, page: undefined }),
    });
  }
  if (query.breed) {
    chips.push({
      label: query.breed,
      href: buildStudSearchHref(query, { breed: undefined, page: undefined }),
    });
  }
  if (query.stateCode) {
    chips.push({
      label: `State: ${query.stateCode}`,
      href: buildStudSearchHref(query, {
        stateCode: undefined,
        page: undefined,
      }),
    });
  }
  if (query.maxPrice) {
    chips.push({
      label: `Up to $${query.maxPrice.toLocaleString("en-US")}`,
      href: buildStudSearchHref(query, {
        maxPrice: undefined,
        page: undefined,
      }),
    });
  }
  if (query.hasCurrentBrucellosis) {
    chips.push({
      label: "Test within 14 days",
      href: buildStudSearchHref(query, {
        hasCurrentBrucellosis: false,
        page: undefined,
      }),
    });
  }
  return chips;
}

export default async function StudsPage({ searchParams }: StudsPageProps) {
  const rawParams = await searchParams;
  const query = parseStudSearchParams(rawParams);

  const [result, breeds, directory] = await Promise.all([
    catalogRepository.searchStuds(
      query.view === "map" ? { ...query, page: 1, pageSize: 100 } : query,
    ),
    catalogRepository.listBreeds(),
    catalogRepository.searchStuds({ pageSize: 100 }),
  ]);
  const locations = Array.from(
    new Map(
      directory.items.map(({ location }) => [
        `${location.city}, ${location.stateCode}`,
        location,
      ]),
    ).values(),
  );

  const chips = activeChips(query);
  const filtersActive = hasActiveStudFilters(query);
  const clearHref = query.view === "map" ? "/studs?view=map" : "/studs";

  return (
    <>
      <PageHeader
        eyebrow="Stud directory · demo"
        title="Find the right match, with the records in view."
        description="Filter by breed, location, fee and record freshness. Every profile shows paid placement, document status and club recommendations as separate signals."
        actions={
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-muted">
              <span
                className="h-1.5 w-1.5 rounded-full bg-orange-500"
                aria-hidden="true"
              />
              {DEMO_SNAPSHOT_LABEL}
            </span>
            <Link
              href="/#safety"
              className="inline-flex min-h-9 items-center gap-1.5 text-sm font-semibold text-navy-800 underline decoration-navy-200 underline-offset-4 hover:decoration-navy-700"
            >
              How records are checked
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </>
        }
      />

      <div className="shell py-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[276px_minmax(0,1fr)] lg:gap-10">
          <StudFilters
            query={query}
            breeds={breeds}
            locations={locations}
            activeCount={chips.length}
          />

          <section aria-labelledby="results-heading" className="min-w-0">
            <div className="flex flex-col gap-4 border-b border-line pb-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2
                    id="results-heading"
                    className="font-display text-2xl text-navy-900"
                  >
                    {query.view === "map"
                      ? "Map of matching studs"
                      : "Matching studs"}
                  </h2>
                  <p className="mt-1 text-xs text-muted" aria-live="polite">
                    <span className="tabular font-semibold text-ink">
                      {result.total}
                    </span>{" "}
                    {pluralize(result.total, "profile")} in the sample directory
                    {query.view === "map"
                      ? ` · ${result.items.length} shown on the map`
                      : ""}
                  </p>
                </div>
                <ResultsToolbar
                  query={query}
                  listHref={buildStudSearchHref(query, {
                    view: "list",
                    page: undefined,
                  })}
                  mapHref={buildStudSearchHref(query, {
                    view: "map",
                    page: undefined,
                  })}
                />
              </div>

              {chips.length > 0 ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                    Active
                  </span>
                  {chips.map((chip) => (
                    <Link
                      key={chip.label}
                      href={chip.href}
                      className="inline-flex items-center gap-1.5 rounded-full border border-navy-200 bg-navy-50 px-2.5 py-1 text-[11px] font-medium text-navy-800 hover:border-navy-400"
                    >
                      {chip.label}
                      <Icon name="close" className="h-3 w-3" />
                      <span className="sr-only">Remove filter</span>
                    </Link>
                  ))}
                  <Link
                    href={clearHref}
                    className="ml-1 text-[11px] font-semibold text-muted underline underline-offset-2"
                  >
                    Clear all
                  </Link>
                </div>
              ) : null}
            </div>

            {query.view !== "map" ? (
              <div className="mt-4">
                <AdSlot
                  placement="stud_list_native"
                  pathname="/studs"
                  variant="native"
                />
              </div>
            ) : null}

            {result.total === 0 ? (
              <div className="pt-8">
                <EmptyState
                  icon="search"
                  title="No studs match these filters"
                  description={
                    filtersActive
                      ? "Try removing a filter or widening the fee range. The sample directory only contains the profiles listed in this preview."
                      : "The directory is empty in this demo build."
                  }
                  action={
                    filtersActive ? (
                      <Link
                        href={clearHref}
                        className="inline-flex min-h-10 items-center rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
                      >
                        Clear filters
                      </Link>
                    ) : null
                  }
                  secondaryAction={
                    <Link
                      href="/#safety"
                      className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-800"
                    >
                      How signals work
                    </Link>
                  }
                />
              </div>
            ) : query.view === "map" ? (
              <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(240px,0.75fr)]">
                <MarketMap
                  studs={result.items}
                  className="lg:sticky lg:top-24"
                  showSponsorPin
                />
                <div>
                  <AdSlot
                    placement="map_sidebar"
                    pathname="/studs"
                    variant="sidebar"
                  />
                  <h3 className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                    On the map
                  </h3>
                  <div className="mt-3 space-y-2.5">
                    {result.items.map((stud) => (
                      <StudCard key={stud.id} stud={stud} compact />
                    ))}
                  </div>
                  <p className="mt-3 text-[11px] leading-relaxed text-muted">
                    Pins show approximate city locations. Radius filters use
                    straight-line distances from the selected city, not driving
                    distances or a visitor's device location.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {result.items.map((stud) => (
                  <StudCard key={stud.id} stud={stud} />
                ))}
              </div>
            )}

            {result.total > 0 && query.view !== "map" ? (
              <div className="mt-8">
                <Pagination
                  page={result.page}
                  pageCount={result.pageCount}
                  total={result.total}
                  pageSize={result.pageSize}
                  hrefForPage={(page) => buildStudSearchHref(query, { page })}
                />
              </div>
            ) : null}

            <p className="mt-8 rounded-xl border border-line bg-cream-50 px-4 py-3 text-[11px] leading-relaxed text-muted">
              Sample profiles for design review. Prices and availability are
              fictional. No advertising is shown on animal profile pages; this
              directory only contains paid placement labels, never a claim of
              verification.
              <span className="sr-only">
                {" "}
                Source: {SITE.domain} preview build.
              </span>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
