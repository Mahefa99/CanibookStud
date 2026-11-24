import type { StudSort } from "@/lib/types/domain";

/**
 * Centralised commercial configuration — CDC V12.
 *
 * Rules:
 * - A price marked "pending"/"unconfirmed" must never be used as a total or charged.
 * - Every price lives here; screens read from configuration, never hard-code amounts.
 * - Values marked "confirmed" are fixed by CDC V12 (see docs/CDC_V12_DIFF.md).
 */

export type PriceStatus = "confirmed" | "pending" | "unconfirmed";

export interface PriceLine {
  amountUsd: number;
  status: PriceStatus;
  note?: string;
}

/* ============================================================ */
/* BREEDING SERVICE (saillie) — CDC V12 §3                        */
/* ============================================================ */

export const STUD_PRICING = {
  serviceFeeUsd: 300,
  studFeeUsd: 2000,
  depositUsd: 400,
  balanceUsd: 1600,
  totalUsd: 2300,
  currency: "USD",
  status: "confirmed" as PriceStatus,
  note: "Service (300) is non-refundable, paid by the dam owner. Deposit (400) and balance (1600) are escrowed. Total paid by the dam owner: 2300.",
} as const;

export const PUPPY_PRICING = {
  serviceFeeUsd: 600,
  puppyPriceUsd: 3000,
  totalUsd: 3600,
  currency: "USD",
  status: "confirmed" as PriceStatus,
  note: "Buyer pays 600 service + 3000 puppy = 3600, escrowed 48h after pickup or confirmed delivery.",
} as const;

/**
 * @deprecated Replaced by STUD_PRICING (CDC V12). The $400 is the escrowed deposit
 * that unlocks contact; the 80/320 platform/owner split shown below is a V11
 * preview artefact, not a V12 rule. Migrate consumers to STUD_PRICING.
 */
export const STUD_REQUEST_FEE = {
  totalUsd: 400,
  platformFeeUsd: 80,
  ownerAllocationUsd: 320,
  status: "confirmed" as PriceStatus,
  currency: "USD",
  note: "Deposit (V12). Escrowed and applied toward the stud fee; unlocks contact after payment.",
  ownerAllocationNote:
    "Deposit is escrowed, not allocated at request time. Payout timing and refund rules are still being confirmed.",
} as const;

/* ============================================================ */
/* BREEDER / STUD SUBSCRIPTIONS — CDC V12 §3                      */
/* ============================================================ */

export interface BreederSubscriptionTier {
  id: "free" | "starter" | "pro" | "unlimited";
  name: string;
  /** Total dogs across all breeds, null = unlimited. */
  dogLimit: number | null;
  monthlyUsd: number | null;
  annualUsd: number | null;
  status: PriceStatus;
}

export const BREEDER_SUBSCRIPTIONS: readonly BreederSubscriptionTier[] = [
  { id: "free", name: "Free", dogLimit: 1, monthlyUsd: null, annualUsd: null, status: "confirmed" },
  { id: "starter", name: "Starter", dogLimit: 3, monthlyUsd: 29, annualUsd: 199, status: "confirmed" },
  { id: "pro", name: "Pro", dogLimit: 10, monthlyUsd: 59, annualUsd: 499, status: "confirmed" },
  { id: "unlimited", name: "Unlimited", dogLimit: null, monthlyUsd: 99, annualUsd: 799, status: "confirmed" },
] as const;

export interface StudPlanConfig {
  id: "basic" | "premium";
  name: string;
  monthlyUsd: number;
  photoLimit: number;
  visibility: string;
  status: PriceStatus;
  features: string[];
}

/**
 * @deprecated Replaced by BREEDER_SUBSCRIPTIONS (CDC V12). These two tiers are a
 * V11 preview artefact; V12 defines Free/Starter/Pro/Unlimited. Migrate consumers.
 */
export const STUD_PLANS: readonly StudPlanConfig[] = [
  {
    id: "basic",
    name: "Basic",
    monthlyUsd: 55,
    photoLimit: 5,
    visibility: "Standard directory placement",
    status: "confirmed",
    features: ["5 photos", "Public stud profile", "Request inbox"],
  },
  {
    id: "premium",
    name: "Premium",
    monthlyUsd: 100,
    photoLimit: 15,
    visibility: "Featured placement and larger map pin",
    status: "confirmed",
    features: ["15 photos", "Featured placement", "Larger map pin", "Featured on the home page"],
  },
] as const;

/** Founder offer from the sources. Not activated until terms are set by the client. */
export const FOUNDER_PROGRAM = {
  enabled: false,
  status: "unconfirmed" as PriceStatus,
  durationDays: 90,
  label: "Founder 90-day trial",
  description:
    "Founder terms and quotas are under review. This offer is not available in the preview.",
} as const;

/* ============================================================ */
/* LITTER LISTING — CDC V12 §3                                    */
/* ============================================================ */

export const LITTER_PRICING = {
  freeListingDays: 7,
  premiumListing: {
    amountUsd: 99,
    period: "month",
    status: "confirmed" as PriceStatus,
    note: "Top of list, gold badge, Reserve button enabled.",
  },
  serviceFee: {
    amountUsd: 600,
    status: "confirmed" as PriceStatus,
    note: "Puppy service fee. Buyer pays 600 + 3000 = 3600 total.",
  },
  example: {
    puppyPriceUsd: 3000,
    serviceFeeUsd: 600,
    totalUsd: 3600,
  },
} as const;

/* ============================================================ */
/* PROFESSIONALS — CDC V12 §3 (was conflicting in V11)           */
/* ============================================================ */

export const PROFESSIONAL_PRICING = {
  status: "confirmed" as PriceStatus,
  free: {
    amountUsd: 0,
    label: "Free",
    note: "Invisible listing, grey pin, locked number, no calls.",
  },
  standard: {
    amountUsd: 69,
    period: "month",
    label: "Standard",
    note: "Visible unlimited, coloured pin, visible number, simple profile (1 photo + name + phone + website).",
  },
  premium: {
    amountUsd: 199,
    period: "year",
    label: "Premium",
    note: "Standard + verified badge + top of city + detailed profile + services/prices + urgency + booking button.",
  },
  boost: {
    amountUsd: 49,
    period: "month",
    label: "Boost",
    note: "Large gold pin at the top of the city for 30 days (on top of Standard or Premium).",
  },
} as const;

/* ============================================================ */
/* EVENTS + CLUB — CDC V12 §3                                     */
/* ============================================================ */

export const EVENT_TICKET_EXAMPLE = {
  ticketUsd: 25,
  feeUsd: 2,
  totalUsd: 27,
  status: "confirmed" as PriceStatus,
} as const;

export const CLUB_PRICING = {
  registrationUsd: 0,
  ticketFeeUsd: 2,
  ticketExample: { ticketUsd: 25, feeUsd: 2, totalUsd: 27 },
  status: "confirmed" as PriceStatus,
} as const;

/* ============================================================ */
/* SPONSORS — CDC V12 §3 & §11                                    */
/* ============================================================ */

export const SPONSOR_PRICING = {
  site: [
    { id: "official", name: "Official", monthlyUsd: 149, status: "confirmed" as PriceStatus },
    { id: "premium", name: "Premium", monthlyUsd: 400, status: "confirmed" as PriceStatus },
  ],
  event: [
    { id: "official", name: "Official event", amountUsd: 149, status: "confirmed" as PriceStatus },
    { id: "premium", name: "Premium event", amountUsd: 400, status: "confirmed" as PriceStatus },
  ],
  eventSplitLabel:
    "50 / 50 club / platform split: $74.50 club + $74.50 platform (on $149), $200 + $200 (on $400).",
} as const;

/* ============================================================ */
/* GODPET — CDC V12 §3 & §8                                       */
/* ============================================================ */

export const GODPET_PRICING = {
  baseUsd: 0,
  pdfFreeEvenIfTipZero: true,
  tip: { minUsd: 1, maxUsd: 50, presetButtons: "none" },
  godfatherClubMonthlyUsd: 9.99,
  status: "confirmed" as PriceStatus,
  note: "Free PDF even when tip = 0. Tip is a single free field (1-50 USD), no preset amount buttons.",
} as const;

/* ============================================================ */
/* COMPARATOR AFFILIATE — CDC V12 §3 (corrected, were wrong)      */
/* ============================================================ */

export const AFFILIATE_PRICING = {
  insurance: [
    { provider: "Lemonade", commissionUsd: 15, unit: "per_sale", status: "confirmed" as PriceStatus },
    { provider: "Trupanion", commissionUsd: 25, unit: "per_sale", status: "confirmed" as PriceStatus },
    { provider: "Quote", commissionUsd: 1, unit: "per_quote", status: "confirmed" as PriceStatus },
  ],
  dogFood: [
    {
      provider: "Chewy",
      ratePct: 4,
      examplesUsd: [2.8, 3.4],
      unit: "per_sale_pct",
      status: "confirmed" as PriceStatus,
    },
    {
      provider: "Amazon Associates",
      ratePct: 3,
      examplesUsd: [1.8],
      unit: "per_sale_pct",
      status: "confirmed" as PriceStatus,
    },
    {
      provider: "Chewy new customer",
      commissionUsd: 15,
      unit: "flat_per_sale",
      note: "On some networks.",
      status: "confirmed" as PriceStatus,
    },
  ],
  disclaimer:
    "No guaranteed leads. Commissions are realized only on completed referred sales. Do not display 30-50 USD per lead or 5-10 USD per sale.",
} as const;

/* ============================================================ */
/* DELIVERY — CDC V12 §7 (disabled until admin validates)         */
/* ============================================================ */

export const DELIVERY = {
  enabled: false,
  defaultMode: "pick-up" as const,
  modes: ["pick-up", "approved-transporter"] as const,
  feeStatus: "pending" as PriceStatus,
  note: "Optional delivery via an approved transporter only. Fees are set by the administrator; not active until the admin validates the transporter list and prices.",
} as const;

/* ============================================================ */
/* SORT OPTIONS                                                   */
/* ============================================================ */

export interface SortOption {
  id: StudSort;
  label: string;
  /** Shown next to paid-placement sorts so the ordering is never ambiguous. */
  disclosure?: string;
}

export const STUD_SORT_OPTIONS: readonly SortOption[] = [
  {
    id: "featured",
    label: "Featured placement",
    disclosure: "Paid visibility, not an endorsement.",
  },
  { id: "price_asc", label: "Stud fee: low to high" },
  { id: "price_desc", label: "Stud fee: high to low" },
  { id: "youngest", label: "Youngest first" },
] as const;

export const PRICE_STATUS_LABELS: Record<PriceStatus, string> = {
  confirmed: "Confirmed",
  pending: "Pricing to be confirmed",
  unconfirmed: "Not confirmed",
};
