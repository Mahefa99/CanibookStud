/**
 * Sample breed pages. The text is editorial demo copy, not an AKC standard and
 * not veterinary advice. No health or legal claim should be read as verified.
 */
export interface DemoBreed {
  slug: string;
  name: string;
  group: string;
  summary: string;
  size: string;
  coat: string;
  exercise: string;
  grooming: string;
  note: string;
}

export const DEMO_BREEDS: DemoBreed[] = [
  {
    slug: "french-bulldog",
    name: "French Bulldog",
    group: "Companion",
    summary:
      "A compact companion breed with a sociable, often comic presence. The sample profiles on this site focus on calm handling and clear health records.",
    size: "Typically 16–28 lb",
    coat: "Short coat; fawn, cream, brindle, pied and blue appear in the sample data.",
    exercise: "Short, regular walks and indoor play. Heat and breathing comfort deserve extra care.",
    grooming: "Minimal brushing; regular ear and skin checks are commonly discussed.",
    note: "This is a sample overview for layout review, not an AKC breed standard or a veterinary recommendation.",
  },
  {
    slug: "labrador-retriever",
    name: "Labrador Retriever",
    group: "Sporting",
    summary:
      "A working and family retriever with a reputation for food motivation and water enthusiasm. Sample profiles emphasise clearances and a settled routine.",
    size: "Typically 55–80 lb",
    coat: "Short, dense coat in black, yellow or chocolate.",
    exercise: "Daily walking, swimming and retrieving games.",
    grooming: "Regular brushing, especially during shedding season.",
    note: "This is a sample overview for layout review, not an AKC breed standard or a veterinary recommendation.",
  },
  {
    slug: "golden-retriever",
    name: "Golden Retriever",
    group: "Sporting",
    summary:
      "A friendly retriever often described as eager to please. Sample profiles include eye and hip records where the owner provided them.",
    size: "Typically 55–75 lb",
    coat: "Medium-length golden coat; regular brushing helps.",
    exercise: "Daily walks, retrieving and swimming.",
    grooming: "Brushing several times a week; occasional trimming.",
    note: "This is a sample overview for layout review, not an AKC breed standard or a veterinary recommendation.",
  },
  {
    slug: "german-shepherd-dog",
    name: "German Shepherd Dog",
    group: "Herding",
    summary:
      "A working herding breed that benefits from structured exercise and clear handling. Sample profiles mention training routines and handling comfort.",
    size: "Typically 55–90 lb",
    coat: "Double coat, often black and tan; regular shedding.",
    exercise: "Daily structured exercise and training.",
    grooming: "Regular brushing; more during coat blows.",
    note: "This is a sample overview for layout review, not an AKC breed standard or a veterinary recommendation.",
  },
  {
    slug: "boston-terrier",
    name: "Boston Terrier",
    group: "Companion",
    summary:
      "A small companion breed with a bright, busy temperament. Sample profiles highlight socialisation and a calm home routine.",
    size: "Typically 12–25 lb",
    coat: "Short coat, often seal, black or brindle with white markings.",
    exercise: "Short walks and indoor play.",
    grooming: "Minimal; regular nail and ear care.",
    note: "This is a sample overview for layout review, not an AKC breed standard or a veterinary recommendation.",
  },
  {
    slug: "english-bulldog",
    name: "English Bulldog",
    group: "Companion",
    summary:
      "A low-slung companion breed often described as calm and stubborn in equal measure. Sample profiles emphasise heat management and patient handling.",
    size: "Typically 40–55 lb",
    coat: "Short coat in brindle, white, fawn or pied.",
    exercise: "Gentle walks; avoid hot periods.",
    grooming: "Regular wrinkle and coat care.",
    note: "This is a sample overview for layout review, not an AKC breed standard or a veterinary recommendation.",
  },
];

export function findDemoBreed(slug: string): DemoBreed | undefined {
  return DEMO_BREEDS.find((breed) => breed.slug === slug);
}

export function breedSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
