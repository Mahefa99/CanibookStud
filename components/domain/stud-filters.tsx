"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import { US_STATES } from "@/lib/data/us-states";
import type { PublicLocation, StudSearchQuery } from "@/lib/types/domain";
import { useRouter } from "next/navigation";
import { buildStudSearchHref } from "@/lib/search/studs";
import { cn } from "@/lib/utils";

/**
 * Filter panel. Native GET submission keeps the directory usable without
 * JavaScript; the client component only powers the mobile disclosure and the
 * active-filter count. Values are restored from the URL on every render.
 */
export function StudFilters({
  query,
  breeds,
  activeCount,
  locations,
}: {
  query: StudSearchQuery;
  breeds: readonly string[];
  activeCount: number;
  locations: readonly PublicLocation[];
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(query.q ?? "");
  const searchInput = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const clearing = useRef(false);
  useEffect(() => {
    setSearch(query.q ?? "");
    if (clearing.current) {
      searchInput.current?.focus();
      clearing.current = false;
    }
  }, [query.q]);
  const cityOptions = new Map<string, string>([
    ["25.7617,-80.1918", "Miami, FL"],
    ["28.5383,-81.3792", "Orlando, FL"],
    ["30.2672,-97.7431", "Austin, TX"],
    ["40.7128,-74.006", "New York, NY"],
    ["34.0522,-118.2437", "Los Angeles, CA"],
    ...locations.map((location): [string, string] => [
      `${location.lat},${location.lng}`,
      `${location.city}, ${location.stateCode}`,
    ]),
  ]);
  if (query.origin && !cityOptions.has(query.origin))
    cityOptions.set(query.origin, `Selected coordinates (${query.origin})`);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="stud-filters"
        className="flex min-h-11 w-full items-center justify-between rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-semibold text-navy-900 shadow-sm lg:hidden"
      >
        <span className="flex items-center gap-2">
          <Icon name="filter" className="h-4 w-4" />
          Filters
        </span>
        <span className="flex items-center gap-2">
          {activeCount > 0 ? (
            <span className="tabular rounded-full bg-orange-100 px-2 py-0.5 text-[11px] text-orange-800">
              {activeCount}
            </span>
          ) : null}
          <Icon
            name="chevron-down"
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </span>
      </button>

      <div
        id="stud-filters"
        className={cn(
          "mt-3 rounded-2xl border border-line bg-white p-5 shadow-card lg:mt-0 lg:block",
          open ? "block" : "hidden",
        )}
      >
        <div className="hidden items-center justify-between lg:flex">
          <h2 className="font-display text-xl text-navy-900">Filters</h2>
          {activeCount > 0 ? (
            <Link
              href="/studs"
              className="text-[11px] font-semibold text-muted underline underline-offset-2"
            >
              Clear all
            </Link>
          ) : null}
        </div>

        <form
          key={JSON.stringify(query)}
          noValidate
          method="get"
          action="/studs"
          className="mt-4 space-y-5 lg:mt-4"
        >
          <input type="hidden" name="sort" value={query.sort ?? "featured"} />
          {query.view === "map" ? (
            <input type="hidden" name="view" value="map" />
          ) : null}

          <div>
            <label htmlFor="filter-q" className="field-label">
              Search
            </label>
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />
              <input
                id="filter-q"
                name="q"
                type="search"
                ref={searchInput}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Name, breed or city"
                className="form-input pl-10 pr-11"
              />
              {search ? (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="absolute right-0 top-0 grid h-full w-11 place-items-center rounded-r-xl hover:bg-cream-100"
                  onClick={() => {
                    clearing.current = true;
                    setSearch("");
                    searchInput.current?.focus();
                    router.replace(
                      buildStudSearchHref(query, {
                        q: undefined,
                        page: undefined,
                      }),
                      { scroll: false },
                    );
                  }}
                >
                  <Icon name="close" className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="filter-breed" className="field-label">
              Breed
            </label>
            <div className="relative">
              <select
                id="filter-breed"
                name="breed"
                defaultValue={query.breed ?? ""}
                className="form-input appearance-none pr-9"
              >
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
            <label htmlFor="filter-state" className="field-label">
              State
            </label>
            <div className="relative">
              <select
                id="filter-state"
                name="state"
                defaultValue={query.stateCode ?? ""}
                className="form-input appearance-none pr-9"
              >
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

          <div>
            <label htmlFor="filter-price" className="field-label">
              Stud fee
            </label>
            <div className="relative">
              <select
                id="filter-price"
                name="maxPrice"
                defaultValue={query.maxPrice ? String(query.maxPrice) : ""}
                className="form-input appearance-none pr-9"
              >
                <option value="">Any fee</option>
                <option value="1000">Up to $1,000</option>
                <option value="1500">Up to $1,500</option>
                <option value="2000">Up to $2,000</option>
                <option value="2500">Up to $2,500</option>
              </select>
              <Icon
                name="chevron-down"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="field-label">
              Color
              <input
                className="form-input"
                name="color"
                defaultValue={query.color}
              />
            </label>
            <div className="grid grid-cols-2 gap-2">
              <label className="field-label">
                Min age
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="20"
                  name="minAge"
                  defaultValue={query.minAge}
                />
              </label>
              <label className="field-label">
                Max age
                <input
                  className="form-input"
                  type="number"
                  min="0"
                  max="20"
                  name="maxAge"
                  defaultValue={query.maxAge}
                />
              </label>
            </div>
            <label className="field-label">
              Distance from city
              <select
                className="form-input"
                name="origin"
                defaultValue={query.origin ?? ""}
              >
                <option value="">Any location</option>
                {Array.from(cityOptions)
                  .sort((a, b) => a[1].localeCompare(b[1]))
                  .map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
              </select>
              <span className="field-hint font-normal">
                Sample city centers, including every city in this preview
                catalog. No device location is requested.
              </span>
            </label>
            <label className="field-label">
              Radius (miles)
              <select
                className="form-input"
                name="radius"
                defaultValue={query.radius ?? 250}
              >
                {[25, 50, 100, 250].map((n) => (
                  <option key={n} value={n}>
                    {n} miles
                  </option>
                ))}
              </select>
            </label>
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                name="ofa"
                value="1"
                defaultChecked={query.hasOfa}
              />
              OFA / orthopaedic records
            </label>
            <label className="flex gap-2 text-sm">
              <input
                type="checkbox"
                name="akc"
                value="1"
                defaultChecked={query.hasAkc}
              />
              AKC format checked (not registry verification)
            </label>
          </div>
          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-navy-900">
              Records
            </legend>
            <label className="flex cursor-pointer items-start gap-2.5 rounded-lg p-1 text-[13px] leading-relaxed text-ink">
              <input
                type="checkbox"
                name="brucellosis"
                value="1"
                defaultChecked={query.hasCurrentBrucellosis}
                className="form-checkbox mt-0.5"
              />
              <span>
                Test within the 14-day window
                <span className="block text-[11px] text-muted">
                  A listing filter, not a health guarantee.
                </span>
              </span>
            </label>
          </fieldset>

          <div className="space-y-2 border-t border-line pt-4">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Apply filters
            </button>
            <Link
              href="/studs"
              className="inline-flex min-h-9 w-full items-center justify-center rounded-full px-4 py-2 text-[13px] font-semibold text-muted hover:bg-cream-50 hover:text-navy-800"
            >
              Reset
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
