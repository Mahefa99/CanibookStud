/**
 * Feature flags for the frontend preview.
 *
 * Every integration that is not actually connected is disabled here and
 * surfaced in the UI as a labelled simulation. Do not flip a flag without the
 * corresponding backend contract and a working server-side confirmation.
 */
export const FEATURES = {
  dataMode: "demo",

  auth: {
    enabled: false,
    mode: "demo",
    label: "Demo workspace",
    note: "No account is created and no session is issued in this preview.",
  },

  payments: {
    enabled: false,
    note: "No payment provider is connected. Payment buttons are disabled.",
  },

  uploads: {
    enabled: false,
    maxFileSizeMb: 10,
    acceptedTypes: [".pdf", ".jpg", ".jpeg", ".png"] as readonly string[],
    note: "Files are previewed locally in the browser and are never uploaded.",
  },

  messaging: {
    enabled: false,
    note: "No platform messaging between clubs and sponsors: both parties' emails are shown and exchanges happen by direct email. The platform never reads, negotiates or stores messages.",
  },

  /** Optional puppy delivery via an approved transporter (CDC V12 §7). Disabled until the admin validates the transporter list and prices. */
  delivery: {
    enabled: false,
    defaultMode: "pick-up",
    note: "Optional delivery via an approved transporter only. Not active until the administrator validates the transporter list and prices.",
  },

  /**
   * Unlocking contact details must depend on a server-confirmed payment.
   * A redirect to a success page is never sufficient.
   */
  contactUnlockRequiresServerConfirmation: true,

  escrow: {
    enabled: false,
    status: "unconfirmed",
    note: "An escrow or 48-hour hold is not an acquired capability.",
  },

  installments: {
    enabled: false,
    note: "Buy-now-pay-later is not available and must not be advertised.",
  },

  founderProgram: {
    enabled: false,
    note: "Founder terms are under commercial review.",
  },

  ads: {
    // Placement previews are rendered on allowed pages. No sponsor is sold and
    // no creative, impression or click is invented.
    enabled: true,
    mode: "inventory-preview",
    soldCampaigns: 0,
    leadPromises: "never",
    note: "The platform sells visibility, not leads; no promised leads are ever displayed. Sponsor inventory is previewed only; no campaign is live.",
  },
} as const;

export type AdPlacement =
  | "home_top_banner"
  | "stud_list_native"
  | "map_sidebar"
  | "breed_sidebar"
  | "services_sidebar"
  | "compare_top"
  | "compare_sidebar"
  | "event_page";

/**
 * Advertising policy. Animal profiles, galleries, contracts, checkout and
 * personal spaces are permanently excluded. A global layout must never render
 * an ad: each allowed placement is opted into by its page.
 */
export const AD_POLICY = {
  allowedPlacements: [
    "home_top_banner",
    "stud_list_native",
    "map_sidebar",
    "breed_sidebar",
    "services_sidebar",
    "compare_top",
    "compare_sidebar",
    "event_page",
  ] satisfies AdPlacement[],
  forbiddenPathPatterns: [
    /^\/studs\/[^/]+$/,
    /^\/puppies\/[^/]+$/,
    /^\/dashboard(\/|$)/,
    /^\/checkout(\/|$)/,
    /^\/contracts(\/|$)/,
    /^\/admin(\/|$)/,
  ],
  /** Professional profile pages remain undecided, so no ad is shown there. */
  professionalProfileAds: "pending",
} as const;

export function isAdAllowedForPath(pathname: string, placement: AdPlacement): boolean {
  if (!FEATURES.ads.enabled) return false;
  if (!AD_POLICY.allowedPlacements.includes(placement)) return false;
  return !AD_POLICY.forbiddenPathPatterns.some((pattern) => pattern.test(pathname));
}
