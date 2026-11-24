import type { DemoPhoto, PublicLocation } from "@/lib/types/domain";

/** Types for the public marketplace sections added after the stud slice. */

export type LitterStatus = "available" | "sold_out" | "expired" | "cancelled";
export type PuppyStatus = "available" | "reservation_pending" | "reserved" | "sold";

export interface Puppy {
  id: string;
  name: string;
  sex: "male" | "female";
  color: string;
  /** Distinct visual mark or collar colour, used to identify the individual. */
  mark: string;
  status: PuppyStatus;
  /** Optional sample reservation reference, never a buyer identity. */
  reservationRef?: string;
}

export interface Litter {
  id: string;
  slug: string;
  title: string;
  breed: string;
  breederName: string;
  location: PublicLocation;
  birthDate: string;
  /** Birth date + the configured readiness window (56 days in the sample). */
  readyDate: string;
  damName: string;
  sireName: string;
  sireSlug?: string;
  puppyPriceUsd: number;
  serviceFeeUsd: number;
  totalUsd: number;
  listingPlan: "free" | "premium";
  featured: boolean;
  status: LitterStatus;
  description: string;
  healthNotes: string[];
  photos: DemoPhoto[];
  puppies: Puppy[];
  expiresOn?: string;
}

export type ProfessionalCategory =
  | "emergency_vet"
  | "vet"
  | "shelter_rescue"
  | "trainer"
  | "groomer"
  | "boarding_pet_sitter"
  | "pet_store";

export interface BusinessAddress {
  street: string;
  city: string;
  stateCode: string;
  stateName: string;
  zip: string;
  lat: number;
  lng: number;
}

export interface Professional {
  id: string;
  slug: string;
  name: string;
  category: ProfessionalCategory;
  description: string;
  address: BusinessAddress;
  hours: string[];
  services: string[];
  photos: DemoPhoto[];
  /** Owner-declared emergency acceptance. Never turned into "open 24/7". */
  emergencyDeclared: boolean;
  verification: "documents_reviewed" | "in_review" | "not_submitted";
  recommendedBy?: string;
  /** CDC V12 §10: free (grey/invisible), standard/premium (métier colour), boost (gold). */
  plan: "free" | "standard" | "premium" | "boost";
  /** Mock AI licence check, independent of the plan. Not a legal verification. */
  licenseCheck: "verified" | "in_review" | "refused";
}

export interface Club {
  id: string;
  slug: string;
  name: string;
  websiteLabel: string;
  location: PublicLocation;
  description: string;
  verification: "documents_reviewed" | "in_review" | "not_submitted";
  /** A claim in the sample data, not an AKC confirmation. */
  parentClubClaim: boolean;
  recommendedStudSlugs: string[];
  recommendedProfessionalSlugs: string[];
  eventSlugs: string[];
}

export type EventStatus = "on_sale" | "sold_out" | "past";

export interface EventSponsor {
  name: string;
  tier: "official" | "premium";
  sample: true;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  clubSlug: string;
  startsAt: string;
  timeZone: string;
  timeZoneLabel: string;
  locationName: string;
  address: string;
  city: string;
  stateCode: string;
  stateName: string;
  capacity: number;
  ticketsSold: number;
  ticketPriceUsd: number;
  feeUsd: number;
  totalUsd: number;
  status: EventStatus;
  description: string;
  sponsors: EventSponsor[];
}

export type ComparatorType = "insurance" | "dog_food" | "cat_food";

export interface ComparatorColumn {
  key: string;
  label: string;
}

export interface ComparatorEntry {
  id: string;
  name: string;
  tagline: string;
  priceLabel: string;
  values: Record<string, string>;
  /** Explicitly a demo editorial score, not an independently verified rating. */
  sampleRating: number;
  affiliate: true;
}

export interface ComparatorConfig {
  type: ComparatorType;
  title: string;
  description: string;
  priceLabel: string;
  columns: ComparatorColumn[];
  filterLabel: string;
  /** Row value key used by the simple server-side filter. */
  filterKey: string;
  filters: Array<{ value: string; label: string }>;
  rows: ComparatorEntry[];
}
