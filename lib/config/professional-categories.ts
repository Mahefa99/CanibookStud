import type { ProfessionalCategory } from "@/lib/types/marketplace";

/** The seven categories retained by the design brief. "Other" remains open. */
export const PROFESSIONAL_CATEGORIES: ReadonlyArray<{
  id: ProfessionalCategory;
  label: string;
  shortLabel: string;
  description: string;
  /** Map pin colour per métier (CDC V12 §10). */
  color: string;
}> = [
  {
    id: "emergency_vet",
    label: "Emergency Vet",
    shortLabel: "Emergency",
    description: "Urgent and after-hours veterinary care.",
    color: "#B71C1C",
  },
  {
    id: "vet",
    label: "Vet",
    shortLabel: "Vet",
    description: "Primary and reproductive veterinary care.",
    color: "#E53935",
  },
  {
    id: "shelter_rescue",
    label: "Shelter / Rescue",
    shortLabel: "Shelter",
    description: "Rescue organisations and adoption shelters.",
    color: "#8E24AA",
  },
  {
    id: "trainer",
    label: "Trainer",
    shortLabel: "Trainer",
    description: "Training and behaviour support.",
    color: "#43A047",
  },
  {
    id: "groomer",
    label: "Groomer",
    shortLabel: "Groomer",
    description: "Coat, nail and hygiene care.",
    color: "#1E88E5",
  },
  {
    id: "boarding_pet_sitter",
    label: "Boarding / Pet-sitter",
    shortLabel: "Boarding",
    description: "Overnight care, day care and home visits.",
    color: "#FB8C00",
  },
  {
    id: "pet_store",
    label: "Pet Store",
    shortLabel: "Pet store",
    description: "Food, supplies and local retail.",
    color: "#FDD835",
  },
] as const;

/** Grey pin for inactive (free, invisible) listings; gold for Boost (CDC V12 §10). */
export const PROFESSIONAL_PIN = {
  inactive: "#9E9E9E",
  boost: "#FFD700",
} as const;

export function professionalCategoryColor(category: ProfessionalCategory): string {
  return PROFESSIONAL_CATEGORIES.find((entry) => entry.id === category)?.color ?? "#9E9E9E";
}

export function professionalCategoryLabel(category: ProfessionalCategory): string {
  return PROFESSIONAL_CATEGORIES.find((entry) => entry.id === category)?.label ?? category;
}
