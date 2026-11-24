import type { DamSummary, DemoAccount, DemoRequest } from "@/lib/types/domain";
import { stateName } from "@/lib/data/us-states";

/** Fictional dams and requests belonging to the demo account. */
export const DEMO_DAMS: DamSummary[] = [
  {
    id: "dam-sable",
    name: "Sable",
    breed: "French Bulldog",
    birthDate: "2023-06-12",
    location: {
      city: "Austin",
      stateCode: "TX",
      stateName: stateName("TX"),
      lat: 30.2672,
      lng: -97.7431,
      precision: "approximate",
    },
    akc: { numberMasked: "DN•••••318", formatStatus: "format_checked", checkedAt: "2026-09-19" },
    brucellosis: {
      testDate: "2026-10-27",
      status: "current",
      documentStatus: "on_file",
      reviewStatus: "approved",
    },
    visibility: "private",
    lastHeatDate: "2026-10-02",
    cycleLengthDays: 182,
    heatHistory: [
      { id: "heat-sable-oct-26", startDate: "2026-10-02", endDate: "2026-10-16" },
      { id: "heat-sable-apr-26", startDate: "2026-04-03", endDate: "2026-04-17" },
      { id: "heat-sable-oct-25", startDate: "2025-10-04", endDate: "2025-10-18" },
    ],
    matings: [],
  },
  {
    id: "dam-willa",
    name: "Willa",
    breed: "Boston Terrier",
    birthDate: "2024-02-01",
    location: {
      city: "Austin",
      stateCode: "TX",
      stateName: stateName("TX"),
      lat: 30.2672,
      lng: -97.7431,
      precision: "approximate",
    },
    akc: { numberMasked: "Not provided", formatStatus: "not_checked" },
    brucellosis: { status: "missing", documentStatus: "missing", reviewStatus: "not_submitted" },
    visibility: "private",
    lastHeatDate: "2026-09-18",
    cycleLengthDays: 182,
    heatHistory: [
      { id: "heat-willa-sep-26", startDate: "2026-09-18", endDate: "2026-10-02" },
      { id: "heat-willa-mar-26", startDate: "2026-03-20", endDate: "2026-04-03" },
    ],
    matings: [],
  },
];

export const DEMO_REQUESTS: DemoRequest[] = [
  {
    id: "req-1042",
    studName: "Marlo",
    studSlug: "marlo-northshore",
    damName: "Nora",
    status: "contact_unlocked",
    createdAt: "2026-10-29",
    amountUsd: 400,
  },
  {
    id: "req-1041",
    studName: "Marlo",
    studSlug: "marlo-northshore",
    damName: "Pepper",
    status: "awaiting_payment",
    createdAt: "2026-10-28",
    amountUsd: 400,
  },
  {
    id: "req-1038",
    studName: "Marlo",
    studSlug: "marlo-northshore",
    damName: "Juniper",
    status: "declined",
    createdAt: "2026-10-21",
    amountUsd: 400,
  },
];

export const DEMO_ACCOUNT: DemoAccount = {
  id: "account-jordan",
  firstName: "Jordan",
  lastName: "Ellis",
  displayName: "Jordan Ellis",
  email: "jordan.ellis@example.com",
  country: "US",
  activities: ["stud_owner", "dam_owner", "buyer"],
  plan: { tier: "premium", status: "active", renewsOn: "2026-12-02" },
  location: {
    city: "Austin",
    stateCode: "TX",
    stateName: stateName("TX"),
    lat: 30.2672,
    lng: -97.7431,
    precision: "approximate",
  },
  memberSince: "2025-11-18",
  profileCompletion: 68,
  unreadMessages: 3,
  requests: DEMO_REQUESTS,
};
