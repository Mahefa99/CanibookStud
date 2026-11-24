import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/feedback";
import { AdSlot } from "@/components/domain/ad-slot";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { RatingStars } from "@/components/ui/pagination";
import { DEMO_COMPARATORS, comparatorPath } from "@/lib/data/demo/comparators";
import type { ComparatorType } from "@/lib/types/marketplace";
import { cn } from "@/lib/utils";

const SLUG_TO_TYPE: Record<string, ComparatorType> = {
  insurance: "insurance",
  "dog-food": "dog_food",
  "cat-food": "cat_food",
};

const LABELS: Record<ComparatorType, string> = {
  insurance: "Insurance",
  dog_food: "Dog food",
  cat_food: "Cat food",
};

type ComparePageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ filter?: string }>;
};

export function generateStaticParams() {
  return Object.keys(SLUG_TO_TYPE).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ComparePageProps): Promise<Metadata> {
  const { slug } = await params;
  const type = SLUG_TO_TYPE[slug];
  if (!type) return { title: "Comparison not found" };
  const config = DEMO_COMPARATORS[type];
  return {
    title: config.title,
    description: `${config.description} Sample comparison only.`,
  };
}

export default async function ComparePage({ params, searchParams }: ComparePageProps) {
  const { slug } = await params;
  const type = SLUG_TO_TYPE[slug];
  if (!type) notFound();

  const config = DEMO_COMPARATORS[type];
  const { filter } = await searchParams;
  const rows = filter ? config.rows.filter((row) => row.values[config.filterKey] === filter) : config.rows;
  const otherTypes = (Object.keys(DEMO_COMPARATORS) as ComparatorType[]).filter((entry) => entry !== type);

  return (
    <div className="shell py-8 lg:py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Compare", href: "/compare" },
          { label: LABELS[type] },
        ]}
      />

      <header className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Compare · {LABELS[type]}</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900 sm:text-5xl">{config.title}</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{config.description}</p>
        </div>
        <Badge tone="warning" icon="info">
          Sample data · not a quote
        </Badge>
      </header>

      <div className="mt-5">
        <Alert tone="info" title="How to read this table">
          These are fictional rows used to review the comparison layout. No real insurer, food brand,
          price, rating or affiliate relationship is represented. The score is an editorial demo
          score, not a customer rating.
        </Alert>
      </div>

      <div className="mt-5">
        <AdSlot placement="compare_top" pathname={`/compare/${slug}`} />
      </div>

      <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
        <form method="get" className="flex items-end gap-2">
          <div>
            <label htmlFor="compare-filter" className="field-label">
              {config.filterLabel}
            </label>
            <div className="relative">
              <select
                id="compare-filter"
                name="filter"
                defaultValue={filter ?? ""}
                className="form-input min-h-10 appearance-none py-2 pr-9 text-sm"
              >
                <option value="">All</option>
                {config.filters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Icon
                name="chevron-down"
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
              />
            </div>
          </div>
          <button
            type="submit"
            className="inline-flex min-h-10 items-center rounded-full bg-navy-700 px-4 text-xs font-semibold text-white hover:bg-navy-800"
          >
            Apply
          </button>
          {filter ? (
            <Link
              href={comparatorPath(type)}
              className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-xs font-semibold text-navy-800"
            >
              Clear
            </Link>
          ) : null}
        </form>
        <p className="text-[11px] text-muted">
          {rows.length} of {config.rows.length} sample rows
        </p>
      </div>

      <div className="mt-4 overflow-x-auto rounded-2xl border border-line bg-white shadow-card">
        <table className="w-full min-w-[52rem] text-left">
          <caption className="sr-only">
            Sample {LABELS[type]} comparison. All data is fictional.
          </caption>
          <thead>
            <tr className="border-b border-line bg-cream-50 text-[10px] uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-3 font-semibold">Provider</th>
              {config.columns.map((column) => (
                <th key={column.key} scope="col" className="px-4 py-3 font-semibold">
                  {column.label}
                </th>
              ))}
              <th scope="col" className="px-4 py-3 font-semibold">Sample score</th>
              <th scope="col" className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line/70 last:border-0">
                <th scope="row" className="px-4 py-4 align-top">
                  <p className="text-sm font-semibold text-navy-900">{row.name}</p>
                  <p className="mt-0.5 max-w-[16rem] text-[11px] leading-relaxed text-muted">{row.tagline}</p>
                  <p className="tabular mt-1 text-[11px] font-semibold text-ink">{row.priceLabel}</p>
                </th>
                {config.columns.map((column) => (
                  <td key={column.key} className="tabular px-4 py-4 align-top text-[12px] text-muted">
                    {row.values[column.key] ?? "—"}
                  </td>
                ))}
                <td className="px-4 py-4 align-top">
                  <RatingStars value={row.sampleRating} />
                  <p className="tabular mt-0.5 text-[10px] text-muted">{row.sampleRating.toFixed(1)} / 5 demo</p>
                </td>
                <td className="px-4 py-4 align-top">
                  <span
                    className="inline-flex min-h-8 items-center rounded-full border border-line bg-cream-50 px-3 text-[10px] font-semibold text-muted"
                    title="Affiliate links are not connected in this preview."
                  >
                    Affiliate link · sample
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-cream-50 p-5">
        <h2 className="font-display text-xl text-navy-900">Affiliate disclosure</h2>
        <p className="mt-2 max-w-3xl text-[11px] leading-relaxed text-muted">
          When affiliate links are enabled, the interface must identify them and the partner must be
          disclosed next to the link. Prices, availability and ratings must come from a configured feed
          with a verification date. No link is active in this preview.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          {otherTypes.map((other) => (
            <Link
              key={other}
              href={comparatorPath(other)}
              className={cn(
                "inline-flex min-h-9 items-center gap-1.5 rounded-full border border-line bg-white px-3.5 text-xs font-semibold text-navy-800 hover:border-navy-300",
              )}
            >
              Compare {LABELS[other]}
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
