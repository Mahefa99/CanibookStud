import type {
  Stud,
  StudSearchQuery,
  StudSearchResult,
  StudSort,
} from "@/lib/types/domain";

export const STUD_PAGE_SIZE = 6;

const VALID_SORTS: readonly StudSort[] = [
  "featured",
  "price_asc",
  "price_desc",
  "youngest",
];

export function normalizeSearchOrigin(value?: string): string | undefined {
  if (!value || !/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(value)) return;
  const [lat, lng] = value.split(",").map(Number);
  if (
    lat === undefined ||
    lng === undefined ||
    Math.abs(lat) > 90 ||
    Math.abs(lng) > 180
  )
    return;
  return `${lat},${lng}`;
}

/**
 * Parses URL search params into a normalised query. Pure and dependency-free
 * so it can be shared by server components, links and (later) tests.
 */
export function parseStudSearchParams(
  raw: Record<string, string | string[] | undefined>,
): StudSearchQuery {
  const first = (value: string | string[] | undefined): string | undefined =>
    Array.isArray(value) ? value[0] : value;

  const q = first(raw.q)?.trim().slice(0, 80) || undefined;
  const breed = first(raw.breed)?.trim() || undefined;
  const stateCode = first(raw.state)?.trim().toUpperCase();
  const maxPriceRaw = Number.parseInt(first(raw.maxPrice) ?? "", 10);
  const pageRaw = Number.parseInt(first(raw.page) ?? "", 10);
  const sortRaw = first(raw.sort) as StudSort | undefined;
  const viewRaw = first(raw.view);
  const brucellosisRaw = first(raw.brucellosis);
  const age = (value?: string) =>
    value?.trim() &&
    Number.isFinite(Number(value)) &&
    Number(value) >= 0 &&
    Number(value) <= 20
      ? Number(value)
      : undefined;
  const minAge = age(first(raw.minAge));
  const maxAge = age(first(raw.maxAge));

  return {
    q,
    breed,
    color: first(raw.color)?.trim() || undefined,
    minAge:
      minAge !== undefined && maxAge !== undefined
        ? Math.min(minAge, maxAge)
        : minAge,
    maxAge:
      minAge !== undefined && maxAge !== undefined
        ? Math.max(minAge, maxAge)
        : maxAge,
    hasOfa: first(raw.ofa) === "1",
    hasAkc: first(raw.akc) === "1",
    origin: normalizeSearchOrigin(first(raw.origin)),
    radius: [25, 50, 100, 250].includes(Number(first(raw.radius)))
      ? Number(first(raw.radius))
      : undefined,
    stateCode:
      stateCode && /^[A-Z]{2}$/.test(stateCode) ? stateCode : undefined,
    maxPrice:
      Number.isFinite(maxPriceRaw) &&
      maxPriceRaw >= 500 &&
      maxPriceRaw <= 10_000
        ? maxPriceRaw
        : undefined,
    hasCurrentBrucellosis: brucellosisRaw === "1",
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
    sort: sortRaw && VALID_SORTS.includes(sortRaw) ? sortRaw : "featured",
    view: viewRaw === "map" ? "map" : "list",
  } as StudSearchQuery;
}

export function hasActiveStudFilters(query: StudSearchQuery): boolean {
  return Boolean(
    query.color ||
    query.minAge !== undefined ||
    query.maxAge !== undefined ||
    query.hasOfa ||
    query.hasAkc ||
    query.origin ||
    query.q ||
    query.breed ||
    query.stateCode ||
    query.maxPrice ||
    query.hasCurrentBrucellosis,
  );
}

function compareStuds(a: Stud, b: Stud, sort: StudSort): number {
  switch (sort) {
    case "price_asc":
      return a.studFeeUsd - b.studFeeUsd || a.name.localeCompare(b.name);
    case "price_desc":
      return b.studFeeUsd - a.studFeeUsd || a.name.localeCompare(b.name);
    case "youngest":
      return (
        b.birthDate.localeCompare(a.birthDate) || a.name.localeCompare(b.name)
      );
    case "featured":
    default:
      // Paid placement is explicit in the UI. It is not a quality ranking.
      return (
        Number(b.featured) - Number(a.featured) ||
        Number(b.plan === "premium") - Number(a.plan === "premium") ||
        b.createdAt.localeCompare(a.createdAt) ||
        a.name.localeCompare(b.name)
      );
  }
}

/** Applies filters, sorting and pagination to a stud collection. */
export function searchStuds(
  studs: readonly Stud[],
  query: StudSearchQuery,
): StudSearchResult {
  const normalizedQuery = query.q?.toLowerCase();
  const filtered = studs.filter((stud) => {
    if (stud.listingStatus !== "active") return false;
    if (normalizedQuery) {
      const haystack =
        `${stud.name} ${stud.breed} ${stud.location.city} ${stud.location.stateName} ${stud.description}`.toLowerCase();
      if (!haystack.includes(normalizedQuery)) return false;
    }
    if (query.breed && stud.breed !== query.breed) return false;
    if (
      query.color &&
      !stud.color.toLowerCase().includes(query.color.toLowerCase())
    )
      return false;
    const age =
      (Date.parse("2026-11-06") - Date.parse(stud.birthDate)) /
      (365.25 * 86400000);
    if (query.minAge !== undefined && age < query.minAge) return false;
    if (query.maxAge !== undefined && age > query.maxAge) return false;
    if (query.hasAkc && stud.akc.formatStatus !== "format_checked")
      return false;
    if (
      query.hasOfa &&
      !stud.healthTests.some((t) =>
        /ofa|hips|patella|cardiac|eyes/i.test(t.name),
      )
    )
      return false;
    const origin = normalizeSearchOrigin(query.origin);
    if (origin && query.radius) {
      const [lat, lng] = origin.split(",").map(Number);
      if (
        lat !== undefined &&
        lng !== undefined &&
        milesBetween(lat, lng, stud.location.lat, stud.location.lng) >
          query.radius
      )
        return false;
    }
    if (query.stateCode && stud.location.stateCode !== query.stateCode)
      return false;
    if (query.maxPrice && stud.studFeeUsd > query.maxPrice) return false;
    if (query.hasCurrentBrucellosis && stud.brucellosis.status !== "current")
      return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) =>
    compareStuds(a, b, query.sort ?? "featured"),
  );

  const pageSize = Math.min(Math.max(query.pageSize ?? STUD_PAGE_SIZE, 1), 100);
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const page = Math.min(Math.max(query.page ?? 1, 1), pageCount);
  const items = sorted.slice((page - 1) * pageSize, page * pageSize);

  return { items, total: sorted.length, page, pageCount, pageSize };
}

/**
 * Builds a /studs URL while preserving the active query. `undefined` removes a
 * parameter; pagination resets whenever filters change unless explicitly set.
 */
export function buildStudSearchHref(
  query: StudSearchQuery,
  overrides: Partial<StudSearchQuery> = {},
): string {
  const filterChanged = Object.keys(overrides).some(
    (key) => key !== "page" && key !== "pageSize" && key !== "view",
  );
  const merged = {
    ...query,
    ...(filterChanged ? { page: undefined } : {}),
    ...overrides,
  };
  const params = new URLSearchParams();
  for (const key of [
    "color",
    "minAge",
    "maxAge",
    "origin",
    "radius",
  ] as const) {
    if (merged[key] !== undefined && merged[key] !== "")
      params.set(key, String(merged[key]));
  }
  if (merged.hasOfa) params.set("ofa", "1");
  if (merged.hasAkc) params.set("akc", "1");
  if (merged.q) params.set("q", merged.q);
  if (merged.breed) params.set("breed", merged.breed);
  if (merged.stateCode) params.set("state", merged.stateCode);
  if (merged.maxPrice) params.set("maxPrice", String(merged.maxPrice));
  if (merged.hasCurrentBrucellosis) params.set("brucellosis", "1");
  if (merged.sort && merged.sort !== "featured")
    params.set("sort", merged.sort);
  if (merged.view === "map") params.set("view", "map");
  if (merged.page && merged.page > 1) params.set("page", String(merged.page));
  const queryString = params.toString();
  return queryString ? `/studs?${queryString}` : "/studs";
}

function milesBetween(a: number, b: number, c: number, d: number) {
  const r = Math.PI / 180;
  const h =
    Math.sin(((c - a) * r) / 2) ** 2 +
    Math.cos(a * r) * Math.cos(c * r) * Math.sin(((d - b) * r) / 2) ** 2;
  return 3958.8 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}
