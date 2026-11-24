/**
 * Domain types shared by the UI and the replaceable data layer.
 *
 * Privacy by construction: public animal types deliberately contain no exact
 * address, ZIP, phone number or email. Those values must never be returned by
 * public API responses, and CSS hiding is not a substitute for that rule.
 */

export type Activity =
  | "stud_owner"
  | "dam_owner"
  | "breeder"
  | "buyer"
  | "professional"
  | "club_manager"
  | "sponsor";

export const ACTIVITY_LABELS: Record<Activity, string> = {
  stud_owner: "Stud owner",
  dam_owner: "Dam owner",
  breeder: "Breeder",
  buyer: "Buyer",
  professional: "Pet professional",
  club_manager: "Club manager",
  sponsor: "Sponsor",
};

export type StudPlan = "basic" | "premium" | "founder_trial";
export type SubscriptionStatus = "active" | "past_due" | "canceled" | "not_selected";

/**
 * Review state of an uploaded record. Kept separate from the subscription and
 * from club recommendations: the three signals are never merged into one badge.
 */
export type RecordReviewStatus =
  | "not_submitted"
  | "in_review"
  | "approved"
  | "changes_requested"
  | "expired";

/** AKC checks in this prototype only validate the number's format. */
export type AkcFormatStatus = "format_checked" | "not_checked" | "invalid";

export type BrucellosisStatus = "current" | "expired" | "missing";

export type LocationPrecision = "approximate";

/** Public, intentionally coarse location. Never includes a street address. */
export interface PublicLocation {
  city: string;
  stateCode: string;
  stateName: string;
  lat: number;
  lng: number;
  precision: LocationPrecision;
}

export interface BrucellosisRecord {
  /** ISO date of the most recent test, when one is on file. */
  testDate?: string;
  status: BrucellosisStatus;
  /** Documents are private; the UI only exposes their existence. */
  documentStatus: "on_file" | "missing";
  reviewStatus: RecordReviewStatus;
}

export interface AkcRecord {
  /** Masked registration number for public display. */
  numberMasked: string;
  formatStatus: AkcFormatStatus;
  checkedAt?: string;
}

export interface HealthTest {
  id: string;
  name: string;
  result: string;
  testedOn?: string;
  reviewStatus: RecordReviewStatus;
}

export interface ClubRecommendation {
  clubName: string;
  clubSlug: string;
  recommendedOn: string;
}

export interface StudAvailabilityWindow {
  startDate: string;
  endDate: string;
  status: "available" | "booked";
}

export interface StudReview {
  id: string;
  authorLabel: string;
  rating: 1 | 2 | 3 | 4 | 5;
  date: string;
  body: string;
}

/** Art-directed placeholder. Real photos replace this via `imageUrl` later. */
export interface DemoPhoto {
  id: string;
  tone: "navy" | "clay" | "sage" | "sand";
  /** Shape variant for the illustrative portrait. */
  variant: "upright" | "floppy" | "pointed";
  alt: string;
}

export interface Stud {
  id: string;
  slug: string;
  name: string;
  breed: string;
  sex: "male";
  birthDate: string;
  weightLb: number;
  color: string;
  location: PublicLocation;
  headline: string;
  description: string;
  akc: AkcRecord;
  brucellosis: BrucellosisRecord;
  healthTests: HealthTest[];
  pedigree: {
    sire: string;
    dam: string;
    championBloodline: boolean;
  };
  studFeeUsd: number;
  plan: StudPlan;
  subscriptionStatus: SubscriptionStatus;
  /** Paid placement. Must never be presented as verification or endorsement. */
  featured: boolean;
  clubRecommendation?: ClubRecommendation;
  photos: DemoPhoto[];
  availability: StudAvailabilityWindow[];
  reviews: StudReview[];
  createdAt: string;
  listingStatus: "active" | "in_review" | "unavailable";
}

export interface HeatWindow {
  id: string;
  startDate: string;
  endDate: string;
}

export interface DamSummary {
  id: string;
  name: string;
  breed: string;
  birthDate: string;
  location: PublicLocation;
  akc: AkcRecord;
  brucellosis: BrucellosisRecord;
  /** Female profiles and their calendar are private by default. */
  visibility: "private" | "shared-with-request";
  lastHeatDate: string;
  cycleLengthDays: number;
  heatHistory: HeatWindow[];
  matings: Array<{ id: string; date: string; studName: string }>;
}

export type StudSort = "featured" | "price_asc" | "price_desc" | "youngest";

export interface StudSearchQuery {
  color?: string;
  minAge?: number;
  maxAge?: number;
  hasOfa?: boolean;
  hasAkc?: boolean;
  origin?: string;
  radius?: number;
  q?: string;
  breed?: string;
  stateCode?: string;
  maxPrice?: number;
  hasCurrentBrucellosis?: boolean;
  page?: number;
  /** Internal page size override, used by the map to show every match. */
  pageSize?: number;
  sort?: StudSort;
  view?: "list" | "map";
}

export interface StudSearchResult {
  items: Stud[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
}

export interface DemoRequest {
  id: string;
  studName: string;
  studSlug: string;
  damName: string;
  status: "awaiting_payment" | "payment_pending" | "payment_failed" | "contact_unlocked" | "declined";
  createdAt: string;
  amountUsd: number;
}

export interface DemoAccount {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  email: string;
  country: "US";
  activities: Activity[];
  plan: { tier: StudPlan; status: SubscriptionStatus; renewsOn?: string };
  location: PublicLocation;
  memberSince: string;
  profileCompletion: number;
  unreadMessages: number;
  requests: DemoRequest[];
}
