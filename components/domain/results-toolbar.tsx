"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { STUD_SORT_OPTIONS, STUD_PRICING } from "@/lib/config/pricing";
import type { StudSearchQuery, StudSort } from "@/lib/types/domain";
import { cn } from "@/lib/utils";
import { buildStudSearchHref } from "@/lib/search/studs";

/**
 * Sort selector and List/Map toggle. Sorting submits the filter form through
 * the URL so the state is shareable and works before hydration.
 */
export function ResultsToolbar({
  query,
  listHref,
  mapHref,
}: {
  query: StudSearchQuery;
  listHref: string;
  mapHref: string;
}) {
  const activeSort = STUD_SORT_OPTIONS.find(
    (option) => option.id === (query.sort ?? "featured"),
  );
  const preserved = new URLSearchParams(
    buildStudSearchHref(query, { sort: undefined, page: undefined }).split(
      "?",
    )[1],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <form
          noValidate
          method="get"
          action="/studs"
          className="flex items-center gap-2"
        >
          {Array.from(preserved).map(([name, value]) => (
            <input type="hidden" key={name} name={name} value={value} />
          ))}
          <label htmlFor="sort" className="text-xs font-semibold text-muted">
            Sort
          </label>
          <div className="relative">
            <select
              id="sort"
              name="sort"
              defaultValue={query.sort ?? "featured"}
              onChange={(event) => event.currentTarget.form?.requestSubmit()}
              className="form-input min-h-9 appearance-none py-1.5 pl-3 pr-8 text-xs"
            >
              {STUD_SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon
              name="chevron-down"
              className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted"
            />
          </div>
          <noscript>
            <button
              type="submit"
              className="text-xs font-semibold text-navy-800 underline"
            >
              Apply
            </button>
          </noscript>
        </form>

        <div className="ml-auto inline-flex rounded-full border border-line bg-white p-1">
          <Link
            href={listHref}
            aria-current={query.view !== "map" ? "page" : undefined}
            className={cn(
              "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold",
              query.view !== "map"
                ? "bg-navy-700 text-white"
                : "text-navy-800 hover:bg-cream-50",
            )}
          >
            <Icon name="list" className="h-3.5 w-3.5" />
            List
          </Link>
          <Link
            href={mapHref}
            aria-current={query.view === "map" ? "page" : undefined}
            className={cn(
              "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold",
              query.view === "map"
                ? "bg-navy-700 text-white"
                : "text-navy-800 hover:bg-cream-50",
            )}
          >
            <Icon name="map" className="h-3.5 w-3.5" />
            Map
          </Link>
        </div>
      </div>

      {activeSort?.disclosure ? (
        <p className="text-[11px] leading-relaxed text-muted">
          {activeSort.disclosure} An escrow deposit of{" "}
          <span className="tabular font-semibold text-ink">
            ${STUD_PRICING.depositUsd}
          </span>{" "}
          unlocks contact after server-confirmed payment and is applied toward
          the stud fee. The platform service fee is separate.
        </p>
      ) : null}
    </div>
  );
}
