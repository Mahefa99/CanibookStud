import type { Litter } from "@/lib/types/marketplace";
import { stateName } from "@/lib/data/us-states";
import { demoPhotos } from "@/lib/data/demo/photos";

/**
 * Fictional litters and individually identified puppies.
 *
 * The readiness date uses a 56-day window from the source documents, but the
 * UI labels it as a configurable platform rule, not a verified legal minimum.
 * No buyer, exact address or contact detail is stored.
 */
export const DEMO_LITTERS: Litter[] = [
  {
    id: "litter-cedar-fall",
    slug: "cedar-stone-fall-litter",
    title: "Cedar & Stone Fall Litter",
    breed: "French Bulldog",
    breederName: "Cedar & Stone Frenchies",
    location: {
      city: "Asheville",
      stateCode: "NC",
      stateName: stateName("NC"),
      lat: 35.5951,
      lng: -82.5515,
      precision: "approximate",
    },
    birthDate: "2026-08-20",
    readyDate: "2026-10-15",
    damName: "Juniper",
    sireName: "Marlo",
    sireSlug: "marlo-northshore",
    puppyPriceUsd: 3_000,
    serviceFeeUsd: 600,
    totalUsd: 3_600,
    listingPlan: "premium",
    featured: true,
    status: "available",
    description:
      "A small fall litter raised in a home with two adults, a senior cat and a very structured nap schedule. The breeder shares weekly photos and keeps a paper record of weights and first vet visits.",
    healthNotes: ["First vet check completed", "Deworming schedule started", "Vaccination record shared at pick-up"],
    photos: demoPhotos("cedar-stone-fall-litter", "upright", 4, "the Cedar & Stone fall litter"),
    puppies: [
      { id: "poppy", name: "Poppy", sex: "female", color: "Cream", mark: "Orange collar", status: "available" },
      { id: "finn", name: "Finn", sex: "male", color: "Blue", mark: "Blue collar", status: "reserved", reservationRef: "sample-res-201" },
      { id: "nell", name: "Nell", sex: "female", color: "Fawn", mark: "Pink collar", status: "available" },
      { id: "otis", name: "Otis", sex: "male", color: "Pied", mark: "Green collar", status: "reservation_pending", reservationRef: "sample-res-204" },
    ],
  },
  {
    id: "litter-harborline-winter",
    slug: "harborline-winter-litter",
    title: "Harborline Winter Litter",
    breed: "French Bulldog",
    breederName: "Harborline Frenchies",
    location: {
      city: "Portland",
      stateCode: "ME",
      stateName: stateName("ME"),
      lat: 43.6591,
      lng: -70.2568,
      precision: "approximate",
    },
    birthDate: "2026-09-12",
    readyDate: "2026-11-07",
    damName: "Sunday",
    sireName: "Biscuit",
    sireSlug: "biscuit-harborline",
    puppyPriceUsd: 3_200,
    serviceFeeUsd: 600,
    totalUsd: 3_800,
    listingPlan: "premium",
    featured: true,
    status: "available",
    description:
      "Five puppies from a calm first-time dam. The breeder is a veterinary technician and prefers two visits before pick-up: one to meet the litter, one to take the puppy home.",
    healthNotes: ["Vet-checked at 6 weeks", "Dewormed", "Starter food provided"],
    photos: demoPhotos("harborline-winter-litter", "upright", 3, "the Harborline winter litter"),
    puppies: [
      { id: "ada", name: "Ada", sex: "female", color: "Fawn", mark: "Yellow collar", status: "available" },
      { id: "milo", name: "Milo", sex: "male", color: "Blue", mark: "Blue collar", status: "available" },
      { id: "rue", name: "Rue", sex: "female", color: "Cream", mark: "Purple collar", status: "available" },
      { id: "theo", name: "Theo", sex: "male", color: "Pied", mark: "Red collar", status: "available" },
      { id: "wren", name: "Wren", sex: "female", color: "Fawn", mark: "Green collar", status: "available" },
    ],
  },
  {
    id: "litter-prairie-working",
    slug: "prairie-rose-working-litter",
    title: "Prairie Rose Working Litter",
    breed: "Labrador Retriever",
    breederName: "Prairie Rose Labradors",
    location: {
      city: "Madison",
      stateCode: "WI",
      stateName: stateName("WI"),
      lat: 43.0731,
      lng: -89.4012,
      precision: "approximate",
    },
    birthDate: "2026-10-25",
    readyDate: "2026-12-20",
    damName: "Nell",
    sireName: "Gus",
    sireSlug: "gus-prairie",
    puppyPriceUsd: 2_200,
    serviceFeeUsd: 600,
    totalUsd: 2_800,
    listingPlan: "free",
    featured: false,
    status: "available",
    description:
      "A working-line Labrador litter raised around water and children. The listing is on the free seven-day plan, so it has no reserve button; contact the breeder to discuss the litter.",
    healthNotes: ["Parents health-tested", "Puppies will be vet-checked before pick-up"],
    photos: demoPhotos("prairie-rose-working-litter", "floppy", 3, "the Prairie Rose litter"),
    puppies: [
      { id: "scout", name: "Scout", sex: "male", color: "Yellow", mark: "Green collar", status: "available" },
      { id: "birdie", name: "Birdie", sex: "female", color: "Black", mark: "Pink collar", status: "available" },
      { id: "river", name: "River", sex: "male", color: "Chocolate", mark: "Blue collar", status: "available" },
      { id: "june", name: "June", sex: "female", color: "Yellow", mark: "Purple collar", status: "available" },
    ],
    expiresOn: "2026-11-11",
  },
  {
    id: "litter-sunshine-cream",
    slug: "sunshine-cream-litter",
    title: "Sunshine Cream Litter",
    breed: "French Bulldog",
    breederName: "Sunshine Frenchies",
    location: {
      city: "Miami",
      stateCode: "FL",
      stateName: stateName("FL"),
      lat: 25.7617,
      lng: -80.1918,
      precision: "approximate",
    },
    birthDate: "2026-06-10",
    readyDate: "2026-08-05",
    damName: "Lola",
    sireName: "Romeo",
    sireSlug: "romeo-sunshine",
    puppyPriceUsd: 3_000,
    serviceFeeUsd: 600,
    totalUsd: 3_600,
    listingPlan: "premium",
    featured: false,
    status: "sold_out",
    description:
      "This sample litter is fully reserved and kept visible as an example of a sold-out state. The listing is not accepting requests.",
    healthNotes: ["All puppies placed", "Records archived"],
    photos: demoPhotos("sunshine-cream-litter", "upright", 3, "the Sunshine cream litter"),
    puppies: [
      { id: "coco", name: "Coco", sex: "female", color: "Cream", mark: "Pink collar", status: "sold" },
      { id: "leo", name: "Leo", sex: "male", color: "Cream", mark: "Blue collar", status: "sold" },
      { id: "mimi", name: "Mimi", sex: "female", color: "Fawn", mark: "Yellow collar", status: "sold" },
    ],
    expiresOn: "2026-08-20",
  },
];

export const DEMO_BREEDS_LITTERS: readonly string[] = Array.from(
  new Set(DEMO_LITTERS.map((litter) => litter.breed)),
).sort();
