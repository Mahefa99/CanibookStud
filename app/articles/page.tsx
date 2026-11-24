import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { DEMO_ARTICLES } from "@/lib/data/demo/articles";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Articles",
  description: "Sample editorial notes on stud requests, records and litter reservations.",
};

export default function ArticlesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Editorial · sample"
        title="Notes for better questions."
        description="Short sample articles about records, requests and reservations. They are editorial illustrations, not legal or veterinary advice."
      />
      <div className="shell py-8 lg:py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {DEMO_ARTICLES.map((article) => (
            <article key={article.slug} className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                {article.topic} · {article.readingMinutes} min
              </p>
              <h2 className="mt-2 font-display text-2xl leading-tight text-navy-900">
                <Link href={`/articles/${article.slug}`} className="hover:underline">
                  {article.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-[12px] leading-relaxed text-muted">{article.excerpt}</p>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[10px] text-muted">
                <span>{formatDate(article.published)}</span>
                <Link href={`/articles/${article.slug}`} className="inline-flex items-center gap-1 font-semibold text-navy-800">
                  Read
                  <Icon name="arrow-right" className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-muted">
          Sample editorial content. Do not use these notes as a substitute for a contract, a
          veterinarian&apos;s advice or a registry confirmation.
        </p>
      </div>
    </>
  );
}
