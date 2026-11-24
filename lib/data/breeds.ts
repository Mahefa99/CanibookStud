/**
 * Common AKC-recognised breeds for the form select. This is a UI convenience
 * list, not an authoritative registry import. The backend should provide the
 * canonical breed table.
 */
export const BREED_OPTIONS: readonly string[] = [
  "French Bulldog",
  "English Bulldog",
  "Boston Terrier",
  "Labrador Retriever",
  "Golden Retriever",
  "German Shepherd Dog",
  "Standard Poodle",
  "Miniature Poodle",
  "Beagle",
  "Border Collie",
  "Australian Shepherd",
  "Cavalier King Charles Spaniel",
  "Cocker Spaniel",
  "Dachshund",
  "Doberman Pinscher",
  "Great Dane",
  "Miniature Schnauzer",
  "Pembroke Welsh Corgi",
  "Pomeranian",
  "Rottweiler",
  "Shetland Sheepdog",
  "Shih Tzu",
  "Siberian Husky",
  "Yorkshire Terrier",
] as const;
