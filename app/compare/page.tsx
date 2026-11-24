import type { Metadata } from "next";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { RatingStars } from "@/components/ui/pagination";
import { DEMO_COMPARATORS, comparatorPath } from "@/lib/data/demo/comparators";
import type { ComparatorType } from "@/lib/types/marketplace";

const LABELS: Record<ComparatorType, string> = {
  insurance: "Insurance",
  dog_food: "Dog food",
  cat_food: "Cat food",
};

export const metadata: Metadata = {
  title: "Comparators",
  description:
    "Three sample comparison structures for pet insurance, dog food and cat food. Rows are fictional; no quote, rating or affiliate partnership is presented as fact.",
};

export default function CompareHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Compare · demo"
        title="Comparisons, without invented certainty."
        description="Three comparison structures are ready for review. Every row is sample data, every affiliate action is labelled, and no price or rating is presented as a real quote."
      />

      <div className="shell py-8 lg:py-10">
        <Alert tone="info" title="Sample data only">
          The businesses, prices, coverage values and ratings below are fictional. Replace them with
          verified partner data before enabling any affiliate link.
        </Alert>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(Object.keys(DEMO_COMPARATORS) as ComparatorType[]).map((type) => {
            const config = DEMO_COMPARATORS[type];
            return (
              <Link
                key={type}
                href={comparatorPath(type)}
                className="group rounded-2xl border border-line bg-white p-6 shadow-card transition-[border,transform] hover:-translate-y-0.5 hover:border-navy-300"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-navy-50 text-navy-700">
                  <Icon name={type === "insurance" ? "shield" : "paw"} className="h-5 w-5" />
                </span>
                <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {LABELS[type]}
                </p>
                <h2 className="mt-1 font-display text-2xl leading-tight text-navy-900">{config.title}</h2>
                <p className="mt-2 text-[12px] leading-relaxed text-muted">{config.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-navy-800">
                  View sample table
                  <Icon name="arrow-right" className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>

        <section className="mt-10 rounded-2xl border border-line bg-cream-50 p-5">
          <h2 className="font-display text-xl text-navy-900">Advertising policy</h2>
          <p className="mt-2 max-w-3xl text-[12px] leading-relaxed text-muted">
            Comparator pages may carry sponsor inventory, provided every paid placement is labelled
            and affiliate links are disclosed. No advertising is rendered in this preview because no
            inventory has been sold. Animal profiles, checkout, contracts and personal spaces never
            carry advertising.
          </p>
        </section>
      </div>
    </>
  );
}
