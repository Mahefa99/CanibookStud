/**
 * Site-wide copy and navigation.
 *
 * Only routes that exist in this delivery are exposed in the header. Sections
 * from the functional scope that are not built yet are intentionally absent
 * instead of pointing to dead links; they are listed in README.md and
 * docs/DECISIONS_OPEN.md.
 */

export const SITE = {
  name: "CanibookStud",
  domain: "canibookstud.com",
  url: "https://canibookstud.com",
  locale: "en-US",
  market: "United States",
  currency: "USD",
  supportEmail: "hello@canibookstud.com",
  demoEmail: "preview@canibookstud.com",
} as const;

/**
 * Fictional snapshot date used by demo records so verification states stay
 * deterministic across builds and screenshots.
 */
export const DEMO_REFERENCE_DATE = "2026-11-04";
export const DEMO_SNAPSHOT_LABEL = "Demo snapshot · Nov 4, 2026";

export const DEMO_DISCLOSURE =
  "Preview build. Profiles, reviews and metrics are fictional sample data. No payment is processed and no file is uploaded.";

/**
 * Marketplace notice supplied by the client documents. It is displayed as a
 * draft pending legal review, not as a validated legal policy.
 */
export const MARKETPLACE_NOTICE =
  "CanibookStud is a marketplace platform connecting independent breeders. We do not own, breed, sell, or take possession of any dogs. Platform fees cover connection, verification assistance, technology and contract services, not the animal or semen. We are not a party to the stud contract between users. The platform sells visibility, not leads, and never promises leads. Puppies are picked up at the breeder by default; optional delivery via an approved transporter is available only once the administrator has validated the transporter list and prices.";

export const LEGAL_DRAFT_NOTICE = "Draft marketplace notice — pending legal review.";

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export const PRIMARY_NAV: readonly NavItem[] = [
  { label: "Studs", href: "/studs", description: "Browse the stud directory" },
  { label: "Females", href: "/females" },
  { label: "Puppies", href: "/puppies", description: "Browse litters and puppies" },
  { label: "Pet Services", href: "/pet-services", description: "Vets, trainers, groomers and more" },
  { label: "Clubs", href: "/clubs", description: "Clubs and associations" },
  { label: "Events", href: "/events", description: "Club events and tickets" },
  { label: "Compare", href: "/compare", description: "Insurance and food comparisons" },
  { label: "Blog & Names", href: "/blog", description: "Blog and GODPET name finder" },
] as const;

export const FOOTER_NAV: ReadonlyArray<{ heading: string; items: readonly NavItem[] }> = [
  {
    heading: "Explore",
    items: [
      { label: "Stud directory", href: "/studs" },
      { label: "Puppies & litters", href: "/puppies" },
      { label: "Pet services", href: "/pet-services" },
      { label: "Clubs", href: "/clubs" },
      { label: "Events", href: "/events" },
      { label: "Breed guides", href: "/breeds" },
      { label: "Articles", href: "/articles" },
      { label: "Blog", href: "/blog" },
      { label: "GODPET names", href: "/godpet" },
    ],
  },
  {
    heading: "Compare & partner",
    items: [
      { label: "Insurance", href: "/compare/insurance" },
      { label: "Dog food", href: "/compare/dog-food" },
      { label: "Cat food", href: "/compare/cat-food" },
      { label: "Sponsorship", href: "/sponsors" },
      { label: "How it works", href: "/#how-it-works" },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Log in", href: "/login" },
      { label: "Create account", href: "/signup" },
      { label: "Demo workspace", href: "/dashboard" },
      { label: "About this preview", href: "/demo" },
    ],
  },
] as const;
