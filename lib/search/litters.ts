import type { Litter, LitterStatus } from "@/lib/types/marketplace";

export type LitterSort = "featured" | "price_asc" | "price_desc" | "youngest";

export interface LitterSearchQuery {
  q?: string;
  breed?: string;
  stateCode?: string;
  status?: LitterStatus;
  readyNow?: boolean;
  sort?: LitterSort;
}

const VALID_SORTS: readonly LitterSort[] = ["featured", "price_asc", "price_desc", "youngest"];
const VALID_STATUS: readonly LitterStatus[] = ["available", "sold_out", "expired", "cancelled"];

export function parseLitterSearchParams(
  raw: Record<string, string | string[] | undefined>,
): LitterSearchQuery {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const statusRaw = first(raw.status) as LitterStatus | undefined;
  const sortRaw = first(raw.sort) as LitterSort | undefined;
  const stateRaw = first(raw.state)?.trim().toUpperCase();

  return {
    q: first(raw.q)?.trim().slice(0, 80) || undefined,
    breed: first(raw.breed)?.trim() || undefined,
    stateCode: stateRaw && /^[A-Z]{2}$/.test(stateRaw) ? stateRaw : undefined,
    status: statusRaw && VALID_STATUS.includes(statusRaw) ? statusRaw : undefined,
    readyNow: first(raw.ready) === "1",
    sort: sortRaw && VALID_SORTS.includes(sortRaw) ? sortRaw : "featured",
  };
}

/** Applies the public litter filters. Readiness is a demo-state rule. */
export function filterLitters(
  litters: readonly Litter[],
  query: LitterSearchQuery,
  referenceDate: string,
): Litter[] {
  const q = query.q?.toLowerCase();
  return [...litters]
    .filter((litter) => {
      if (q) {
        const haystack = `${litter.title} ${litter.breed} ${litter.breederName} ${litter.location.city} ${litter.location.stateName}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (query.breed && litter.breed !== query.breed) return false;
      if (query.stateCode && litter.location.stateCode !== query.stateCode) return false;
      if (query.status && litter.status !== query.status) return false;
      if (query.readyNow) {
        if (litter.status !== "available" || litter.readyDate > referenceDate) return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (query.sort) {
        case "price_asc":
          return a.totalUsd - b.totalUsd || a.title.localeCompare(b.title);
        case "price_desc":
          return b.totalUsd - a.totalUsd || a.title.localeCompare(b.title);
        case "youngest":
          return b.birthDate.localeCompare(a.birthDate) || a.title.localeCompare(b.title);
        case "featured":
        default:
          return (
            Number(b.featured) - Number(a.featured) ||
            Number(b.listingPlan === "premium") - Number(a.listingPlan === "premium") ||
            b.birthDate.localeCompare(a.birthDate)
          );
      }
    });
}

export function buildLitterSearchHref(
  query: LitterSearchQuery,
  overrides: Partial<LitterSearchQuery> = {},
): string {
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();
  if (merged.q) params.set("q", merged.q);
  if (merged.breed) params.set("breed", merged.breed);
  if (merged.stateCode) params.set("state", merged.stateCode);
  if (merged.status) params.set("status", merged.status);
  if (merged.readyNow) params.set("ready", "1");
  if (merged.sort && merged.sort !== "featured") params.set("sort", merged.sort);
  const string = params.toString();
  return string ? `/puppies?${string}` : "/puppies";
}
