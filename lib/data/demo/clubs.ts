import type { Club } from "@/lib/types/marketplace";
import { stateName } from "@/lib/data/us-states";

/**
 * Fictional clubs. The "Parent club claim" flag is a sample claim and the UI
 * never presents it as an AKC confirmation. Verification stays separate from
 * any sponsor or subscription status.
 */
export const DEMO_CLUBS: Club[] = [
  {
    id: "club-lone-star",
    slug: "lone-star-french-bulldog-club",
    name: "Lone Star French Bulldog Club",
    websiteLabel: "lonestarfrenchie.example.org",
    location: {
      city: "Austin",
      stateCode: "TX",
      stateName: stateName("TX"),
      lat: 30.2672,
      lng: -97.7431,
      precision: "approximate",
    },
    description:
      "A regional club for French Bulldog owners and breeders. The sample club runs a monthly meetup, a handling workshop and a small breeder referral list.",
    verification: "documents_reviewed",
    parentClubClaim: false,
    recommendedStudSlugs: ["marlo-northshore"],
    recommendedProfessionalSlugs: ["pawsitive-training-co", "blue-ridge-emergency-veterinary"],
    eventSlugs: ["frenchie-meetup-austin"],
  },
  {
    id: "club-sunshine",
    slug: "sunshine-frenchie-club",
    name: "Sunshine Frenchie Club",
    websiteLabel: "sunshinefrenchie.example.org",
    location: {
      city: "Miami",
      stateCode: "FL",
      stateName: stateName("FL"),
      lat: 25.7617,
      lng: -80.1918,
      precision: "approximate",
    },
    description:
      "A coastal meetup group focused on heat safety, rescue support and responsible breeding conversations. Documents are still being reviewed in this sample.",
    verification: "in_review",
    parentClubClaim: false,
    recommendedStudSlugs: ["romeo-sunshine"],
    recommendedProfessionalSlugs: ["lakeside-animal-hospital"],
    eventSlugs: ["frenchie-beach-walk"],
  },
  {
    id: "club-rocky-mountain",
    slug: "rocky-mountain-shepherd-club",
    name: "Rocky Mountain Shepherd Club",
    websiteLabel: "rockymountainshepherd.example.org",
    location: {
      city: "Boulder",
      stateCode: "CO",
      stateName: stateName("CO"),
      lat: 40.015,
      lng: -105.2705,
      precision: "approximate",
    },
    description:
      "A working-dog club offering handling practice and trail safety sessions. The sample profile has not submitted verification documents.",
    verification: "not_submitted",
    parentClubClaim: false,
    recommendedStudSlugs: ["atlas-rocky-mountain"],
    recommendedProfessionalSlugs: [],
    eventSlugs: ["rocky-mountain-handling-workshop"],
  },
];

export function findDemoClub(slug: string): Club | undefined {
  return DEMO_CLUBS.find((club) => club.slug === slug);
}
