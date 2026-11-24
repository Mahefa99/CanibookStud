import type { Professional, ProfessionalCategory } from "@/lib/types/marketplace";

export interface ProfessionalSearchQuery {
  q?: string;
  category?: ProfessionalCategory;
  stateCode?: string;
  emergencyOnly?: boolean;
  view?: "list" | "map";
}

const VALID_CATEGORIES: readonly ProfessionalCategory[] = [
  "emergency_vet",
  "vet",
  "shelter_rescue",
  "trainer",
  "groomer",
  "boarding_pet_sitter",
  "pet_store",
];

export function parseProfessionalSearchParams(
  raw: Record<string, string | string[] | undefined>,
): ProfessionalSearchQuery {
  const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);
  const categoryRaw = first(raw.category) as ProfessionalCategory | undefined;
  const stateRaw = first(raw.state)?.trim().toUpperCase();
  return {
    q: first(raw.q)?.trim().slice(0, 80) || undefined,
    category: categoryRaw && VALID_CATEGORIES.includes(categoryRaw) ? categoryRaw : undefined,
    stateCode: stateRaw && /^[A-Z]{2}$/.test(stateRaw) ? stateRaw : undefined,
    emergencyOnly: first(raw.emergency) === "1",
    view: first(raw.view) === "map" ? "map" : "list",
  };
}

export function filterProfessionals(
  professionals: readonly Professional[],
  query: ProfessionalSearchQuery,
): Professional[] {
  const q = query.q?.toLowerCase();
  return professionals.filter((professional) => {
    if (q) {
      const haystack = `${professional.name} ${professional.description} ${professional.address.city} ${professional.address.stateName}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (query.category && professional.category !== query.category) return false;
    if (query.stateCode && professional.address.stateCode !== query.stateCode) return false;
    if (query.emergencyOnly && !professional.emergencyDeclared) return false;
    return true;
  });
}

export function buildProfessionalSearchHref(
  query: ProfessionalSearchQuery,
  overrides: Partial<ProfessionalSearchQuery> = {},
): string {
  const merged = { ...query, ...overrides };
  const params = new URLSearchParams();
  if (merged.q) params.set("q", merged.q);
  if (merged.category) params.set("category", merged.category);
  if (merged.stateCode) params.set("state", merged.stateCode);
  if (merged.emergencyOnly) params.set("emergency", "1");
  if (merged.view === "map") params.set("view", "map");
  const string = params.toString();
  return string ? `/pet-services?${string}` : "/pet-services";
}
