"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { LitterSearchQuery } from "@/lib/search/litters";
import { US_STATES } from "@/lib/data/us-states";
import { cn } from "@/lib/utils";

/** Mobile-collapsible native GET form for the puppy directory. */
export function LitterFilters({
  query,
  breeds,
  activeCount,
}: {
  query: LitterSearchQuery;
  breeds: readonly string[];
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="litter-filters"
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
          <Icon name="chevron-down" className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
        </span>
      </button>

      <div
        id="litter-filters"
        className={cn(
          "mt-3 rounded-2xl border border-line bg-white p-5 shadow-card lg:mt-0 lg:block",
          open ? "block" : "hidden",
        )}
      >
        <div className="hidden items-center justify-between lg:flex">
          <h2 className="font-display text-xl text-navy-900">Filters</h2>
          {activeCount > 0 ? (
            <Link href="/puppies" className="text-[11px] font-semibold text-muted underline underline-offset-2">
              Clear all
            </Link>
          ) : null}
        </div>

        <form method="get" action="/puppies" className="mt-4 space-y-5">
          <div>
            <label htmlFor="litter-q" className="field-label">
              Search
            </label>
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />
              <input
                id="litter-q"
                name="q"
                type="search"
                defaultValue={query.q ?? ""}
                placeholder="Litter or breeder"
                className="form-input pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="litter-breed" className="field-label">
              Breed
            </label>
            <div className="relative">
              <select id="litter-breed" name="breed" defaultValue={query.breed ?? ""} className="form-input appearance-none pr-9">
                <option value="">Any breed</option>
                {breeds.map((breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>

          <div>
            <label htmlFor="litter-state" className="field-label">
              State
            </label>
            <div className="relative">
              <select id="litter-state" name="state" defaultValue={query.stateCode ?? ""} className="form-input appearance-none pr-9">
                <option value="">Any state</option>
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>

          <div>
            <label htmlFor="litter-status" className="field-label">
              Listing status
            </label>
            <div className="relative">
              <select id="litter-status" name="status" defaultValue={query.status ?? ""} className="form-input appearance-none pr-9">
                <option value="">Any status</option>
                <option value="available">Available</option>
                <option value="sold_out">Sold out</option>
                <option value="expired">Expired</option>
              </select>
              <Icon name="chevron-down" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-navy-900">Timing</legend>
            <label className="flex cursor-pointer items-start gap-2.5 rounded-lg p-1 text-[13px] leading-relaxed text-ink">
              <input type="checkbox" name="ready" value="1" defaultChecked={query.readyNow} className="form-checkbox mt-0.5" />
              <span>
                Ready now
                <span className="block text-[11px] text-muted">Based on the sample readiness window.</span>
              </span>
            </label>
          </fieldset>

          <div>
            <label htmlFor="litter-sort" className="field-label">
              Sort
            </label>
            <div className="relative">
              <select id="litter-sort" name="sort" defaultValue={query.sort ?? "featured"} className="form-input appearance-none pr-9">
                <option value="featured">Featured placement</option>
                <option value="price_asc">Total: low to high</option>
                <option value="price_desc">Total: high to low</option>
                <option value="youngest">Youngest litter</option>
              </select>
              <Icon name="chevron-down" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>

          <div className="space-y-2 border-t border-line pt-4">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Apply filters
            </button>
            <Link
              href="/puppies"
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
