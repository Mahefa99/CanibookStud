"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/icon";
import { PROFESSIONAL_CATEGORIES } from "@/lib/config/professional-categories";
import { US_STATES } from "@/lib/data/us-states";
import type { ProfessionalSearchQuery } from "@/lib/search/professionals";
import { cn } from "@/lib/utils";

/** Native GET filters for the pet-services directory. */
export function ProfessionalFilters({
  query,
  activeCount,
}: {
  query: ProfessionalSearchQuery;
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="professional-filters"
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
        id="professional-filters"
        className={cn(
          "mt-3 rounded-2xl border border-line bg-white p-5 shadow-card lg:mt-0 lg:block",
          open ? "block" : "hidden",
        )}
      >
        <div className="hidden items-center justify-between lg:flex">
          <h2 className="font-display text-xl text-navy-900">Filters</h2>
          {activeCount > 0 ? (
            <Link href="/pet-services" className="text-[11px] font-semibold text-muted underline underline-offset-2">
              Clear all
            </Link>
          ) : null}
        </div>

        <form method="get" action="/pet-services" className="mt-4 space-y-5">
          {query.view === "map" ? <input type="hidden" name="view" value="map" /> : null}

          <div>
            <label htmlFor="pro-q" className="field-label">
              Search
            </label>
            <div className="relative">
              <Icon
                name="search"
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />
              <input
                id="pro-q"
                name="q"
                type="search"
                defaultValue={query.q ?? ""}
                placeholder="Business or city"
                className="form-input pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="pro-category" className="field-label">
              Category
            </label>
            <div className="relative">
              <select
                id="pro-category"
                name="category"
                defaultValue={query.category ?? ""}
                className="form-input appearance-none pr-9"
              >
                <option value="">All categories</option>
                {PROFESSIONAL_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
              <Icon name="chevron-down" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>

          <div>
            <label htmlFor="pro-state" className="field-label">
              State
            </label>
            <div className="relative">
              <select
                id="pro-state"
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
              <Icon name="chevron-down" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-lg p-1 text-[13px] leading-relaxed text-ink">
            <input
              type="checkbox"
              name="emergency"
              value="1"
              defaultChecked={query.emergencyOnly}
              className="form-checkbox mt-0.5"
            />
            <span>
              Accepts emergencies
              <span className="block text-[11px] text-muted">
                Owner-declared only. It does not mean open 24/7.
              </span>
            </span>
          </label>

          <div className="space-y-2 border-t border-line pt-4">
            <button
              type="submit"
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-navy-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Apply filters
            </button>
            <Link
              href="/pet-services"
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
