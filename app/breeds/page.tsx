import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { DEMO_BREEDS } from "@/lib/data/demo/breeds";
import { DEMO_ARTICLES } from "@/lib/data/demo/articles";

export const metadata: Metadata = {
  title: "Breed guides",
  description:
    "Sample breed overviews linking to studs, litters and editorial notes. Not an AKC standard or veterinary advice.",
};

export default function BreedsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Breeds · sample"
        title="Breed context, without the encyclopedia."
        description="Short sample overviews that link to the studs and litters on the platform. These are editorial notes, not AKC standards and not veterinary advice."
      />

      <div className="shell py-8 lg:py-10">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DEMO_BREEDS.map((breed) => (
            <Link
              key={breed.slug}
              href={`/breeds/${breed.slug}`}
              className="group rounded-2xl border border-line bg-white p-5 shadow-card transition-[border,transform] hover:-translate-y-0.5 hover:border-navy-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{breed.group}</p>
                  <h2 className="mt-1 font-display text-2xl leading-tight text-navy-900">{breed.name}</h2>
                </div>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-cream-100 text-navy-600">
                  <Icon name="paw" className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-2 line-clamp-3 text-[12px] leading-relaxed text-muted">{breed.summary}</p>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-muted">
                {breed.size}
              </p>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-2xl border border-line bg-cream-50 p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl text-navy-900">Read before you compare</h2>
              <p className="mt-1 text-[12px] text-muted">Sample articles, written for interface review.</p>
            </div>
            <Link href="/articles" className="text-[11px] font-semibold text-navy-800 underline underline-offset-2">
              All articles
            </Link>
          </div>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {DEMO_ARTICLES.slice(0, 2).map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="block rounded-xl border border-line bg-white p-3 text-[12px] font-medium text-ink hover:border-navy-300"
                >
                  {article.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
