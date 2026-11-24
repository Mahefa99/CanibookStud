import type { ComparatorConfig } from "@/lib/types/marketplace";

/**
 * Fictional comparison data.
 *
 * No real insurer, food brand, price, rating or affiliate partnership is
 * represented. Every page repeats that these are sample rows, and the rating is
 * labelled as an editorial demo score rather than a verified customer rating.
 * "Quote" actions are deliberately inert until affiliate terms exist.
 */
export const DEMO_COMPARATORS: Record<ComparatorConfig["type"], ComparatorConfig> = {
  insurance: {
    type: "insurance",
    title: "Pet insurance, side by side",
    description:
      "A sample table for reviewing the shape of a comparison page. Coverage, deductibles and limits are illustrative; they are not quotes.",
    priceLabel: "Sample monthly range",
    columns: [
      { key: "monthly", label: "Monthly" },
      { key: "deductible", label: "Deductible" },
      { key: "reimbursement", label: "Reimbursement" },
      { key: "annualLimit", label: "Annual limit" },
    ],
    filterLabel: "Coverage",
    filterKey: "coverage",
    filters: [
      { value: "Accident & illness", label: "Accident & illness" },
      { value: "Accident only", label: "Accident only" },
    ],
    rows: [
      {
        id: "ins-northline",
        name: "Northline Pet Insurance",
        tagline: "Sample accident and illness plan with a fixed deductible.",
        priceLabel: "From $24/mo",
        values: {
          monthly: "$24–$38",
          deductible: "$250",
          reimbursement: "80%",
          annualLimit: "$10,000",
          coverage: "Accident & illness",
        },
        sampleRating: 4.4,
        affiliate: true,
      },
      {
        id: "ins-harbor",
        name: "Harbor Mutual Pet",
        tagline: "Sample unlimited-limit plan with a higher monthly range.",
        priceLabel: "From $31/mo",
        values: {
          monthly: "$31–$49",
          deductible: "$500",
          reimbursement: "90%",
          annualLimit: "Unlimited",
          coverage: "Accident & illness",
        },
        sampleRating: 4.1,
        affiliate: true,
      },
      {
        id: "ins-summit",
        name: "Summit Paws",
        tagline: "Sample budget plan focused on accidents.",
        priceLabel: "From $19/mo",
        values: {
          monthly: "$19–$27",
          deductible: "$500",
          reimbursement: "70%",
          annualLimit: "$5,000",
          coverage: "Accident only",
        },
        sampleRating: 3.8,
        affiliate: true,
      },
      {
        id: "ins-redwood",
        name: "Redwood Pet Care",
        tagline: "Sample low-deductible plan with a high reimbursement rate.",
        priceLabel: "From $42/mo",
        values: {
          monthly: "$42–$58",
          deductible: "$100",
          reimbursement: "90%",
          annualLimit: "Unlimited",
          coverage: "Accident & illness",
        },
        sampleRating: 4.6,
        affiliate: true,
      },
      {
        id: "ins-prairie",
        name: "Prairie Shield",
        tagline: "Sample mid-range plan for multi-pet households.",
        priceLabel: "From $27/mo",
        values: {
          monthly: "$27–$41",
          deductible: "$300",
          reimbursement: "80%",
          annualLimit: "$15,000",
          coverage: "Accident & illness",
        },
        sampleRating: 4.0,
        affiliate: true,
      },
    ],
  },
  dog_food: {
    type: "dog_food",
    title: "Dog food, without the marketing fog",
    description:
      "A sample structure for comparing formulas. Protein percentages, bag sizes and prices are fictional and must be replaced by verified product data.",
    priceLabel: "Sample price",
    columns: [
      { key: "protein", label: "Protein" },
      { key: "lifeStage", label: "Life stage" },
      { key: "bag", label: "Bag" },
      { key: "price", label: "Price" },
    ],
    filterLabel: "Life stage",
    filterKey: "lifeStage",
    filters: [
      { value: "Adult", label: "Adult" },
      { value: "Puppy", label: "Puppy" },
      { value: "All life stages", label: "All life stages" },
    ],
    rows: [
      {
        id: "dog-field-hound",
        name: "Field & Hound Adult Chicken",
        tagline: "Sample grain-inclusive adult formula.",
        priceLabel: "$64 / 24 lb",
        values: {
          protein: "28%",
          lifeStage: "Adult",
          bag: "24 lb",
          price: "$64",
          diet: "Grain-inclusive",
        },
        sampleRating: 4.3,
        affiliate: true,
      },
      {
        id: "dog-northline-puppy",
        name: "Northline Puppy Salmon",
        tagline: "Sample puppy formula with a smaller kibble.",
        priceLabel: "$58 / 20 lb",
        values: {
          protein: "30%",
          lifeStage: "Puppy",
          bag: "20 lb",
          price: "$58",
          diet: "Grain-inclusive",
        },
        sampleRating: 4.5,
        affiliate: true,
      },
      {
        id: "dog-cedar-bowl",
        name: "Cedar Bowl Grain-Free",
        tagline: "Sample grain-free formula for adult dogs.",
        priceLabel: "$72 / 22 lb",
        values: {
          protein: "32%",
          lifeStage: "Adult",
          bag: "22 lb",
          price: "$72",
          diet: "Grain-free",
        },
        sampleRating: 4.0,
        affiliate: true,
      },
      {
        id: "dog-prairie-lamb",
        name: "Prairie Rose Lamb",
        tagline: "Sample lamb-based formula for sensitive stomachs.",
        priceLabel: "$69 / 24 lb",
        values: {
          protein: "26%",
          lifeStage: "All life stages",
          bag: "24 lb",
          price: "$69",
          diet: "Grain-inclusive",
        },
        sampleRating: 3.9,
        affiliate: true,
      },
      {
        id: "dog-harbor-whitefish",
        name: "Harbor Kitchen Whitefish",
        tagline: "Sample limited-ingredient formula.",
        priceLabel: "$76 / 20 lb",
        values: {
          protein: "29%",
          lifeStage: "Adult",
          bag: "20 lb",
          price: "$76",
          diet: "Limited ingredient",
        },
        sampleRating: 4.1,
        affiliate: true,
      },
    ],
  },
  cat_food: {
    type: "cat_food",
    title: "Cat food, with the fine print visible",
    description:
      "A sample structure for comparing cat formulas. All rows are fictional; no brand, price or nutritional claim is verified.",
    priceLabel: "Sample price",
    columns: [
      { key: "protein", label: "Protein" },
      { key: "lifeStage", label: "Life stage" },
      { key: "bag", label: "Bag" },
      { key: "price", label: "Price" },
    ],
    filterLabel: "Life stage",
    filterKey: "lifeStage",
    filters: [
      { value: "Adult", label: "Adult" },
      { value: "Kitten", label: "Kitten" },
      { value: "Senior", label: "Senior" },
    ],
    rows: [
      {
        id: "cat-willow-chicken",
        name: "Willow & Whisker Chicken",
        tagline: "Sample adult chicken formula.",
        priceLabel: "$38 / 10 lb",
        values: { protein: "36%", lifeStage: "Adult", bag: "10 lb", price: "$38" },
        sampleRating: 4.2,
        affiliate: true,
      },
      {
        id: "cat-northline-kitten",
        name: "Northline Kitten Salmon",
        tagline: "Sample kitten formula with a small kibble.",
        priceLabel: "$34 / 8 lb",
        values: { protein: "38%", lifeStage: "Kitten", bag: "8 lb", price: "$34" },
        sampleRating: 4.6,
        affiliate: true,
      },
      {
        id: "cat-cedar-indoor",
        name: "Cedar Bowl Indoor",
        tagline: "Sample indoor adult formula.",
        priceLabel: "$41 / 12 lb",
        values: { protein: "34%", lifeStage: "Adult", bag: "12 lb", price: "$41" },
        sampleRating: 4.0,
        affiliate: true,
      },
      {
        id: "cat-harbor-whitefish",
        name: "Harbor Kitchen Whitefish",
        tagline: "Sample fish-based adult formula.",
        priceLabel: "$44 / 10 lb",
        values: { protein: "35%", lifeStage: "Adult", bag: "10 lb", price: "$44" },
        sampleRating: 3.9,
        affiliate: true,
      },
      {
        id: "cat-prairie-senior",
        name: "Prairie Shield Senior",
        tagline: "Sample senior formula with a lower phosphorus target.",
        priceLabel: "$39 / 8 lb",
        values: { protein: "33%", lifeStage: "Senior", bag: "8 lb", price: "$39" },
        sampleRating: 4.1,
        affiliate: true,
      },
    ],
  },
};

export function comparatorPath(type: ComparatorConfig["type"]): string {
  return `/compare/${type.replace("_", "-")}`;
}
