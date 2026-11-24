import { DEMO_STUDS, DEMO_BREEDS, findDemoStudBySlug } from "@/lib/data/demo/studs";
import { studySearchDelay } from "@/lib/data/demo/delay";
import type { Stud, StudSearchQuery, StudSearchResult } from "@/lib/types/domain";
import { searchStuds } from "@/lib/search/studs";

/**
 * Replaceable catalog boundary.
 *
 * The UI only talks to this interface. Swapping the demo implementation for a
 * backend client should not require screen changes. The backend contract is
 * proposed in docs/API_NEEDS.md and must be coordinated with API_CONTRACT.
 */
export interface CatalogRepository {
  searchStuds(query: StudSearchQuery): Promise<StudSearchResult>;
  getStudBySlug(slug: string): Promise<Stud | null>;
  getFeaturedStuds(limit: number): Promise<Stud[]>;
  getRelatedStuds(slug: string, limit: number): Promise<Stud[]>;
  listBreeds(): Promise<string[]>;
  /** Slugs used for static generation; the backend can expose the same list. */
  listStudSlugs(): Promise<string[]>;
}

/**
 * In-memory demo implementation. `studySearchDelay` keeps loading states
 * observable during local testing without making the product feel slow.
 */
export const demoCatalogRepository: CatalogRepository = {
  async searchStuds(query) {
    await studySearchDelay();
    return searchStuds(DEMO_STUDS, query);
  },

  async getStudBySlug(slug) {
    await studySearchDelay();
    return findDemoStudBySlug(slug) ?? null;
  },

  async getFeaturedStuds(limit) {
    await studySearchDelay();
    return DEMO_STUDS.filter((stud) => stud.featured && stud.listingStatus === "active")
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  },

  async getRelatedStuds(slug, limit) {
    await studySearchDelay();
    const current = findDemoStudBySlug(slug);
    if (!current) return [];
    return DEMO_STUDS.filter(
      (stud) =>
        stud.slug !== slug &&
        stud.listingStatus === "active" &&
        (stud.breed === current.breed || stud.location.stateCode === current.location.stateCode),
    )
      .sort(
        (a, b) =>
          Number(b.breed === current.breed) - Number(a.breed === current.breed) ||
          Number(b.featured) - Number(a.featured),
      )
      .slice(0, limit);
  },

  async listBreeds() {
    await studySearchDelay();
    return [...DEMO_BREEDS];
  },

  async listStudSlugs() {
    await studySearchDelay();
    return DEMO_STUDS.map((stud) => stud.slug);
  },
};

/** Single import point for screens; replace here when the API is available. */
export const catalogRepository: CatalogRepository = demoCatalogRepository;
