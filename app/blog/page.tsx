import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { BLOG_ARTICLES, type BlogCategory } from "@/lib/data/demo/articles";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog — CanibookStud",
  description:
    "Editorial guides on dog health, behavior, breed costs, naming and US breeding rules. Demo editorial content.",
};

const CATEGORY_STYLES: Record<BlogCategory, string> = {
  Health: "bg-success-50 text-success-700",
  Behavior: "bg-info-50 text-info-700",
  "Breed & Cost": "bg-orange-50 text-orange-800",
  Names: "bg-cream-100 text-navy-700",
  "Law & Admin": "bg-warning-50 text-warning-700",
};

export default function BlogPage() {
  return (
    <>
      <PageHeader
        eyebrow="Blog · demo editorial"
        title="Answers for everyday dog questions."
        description="Practical guides on health, behavior, breed costs, naming and US breeding rules. All content is editorial demo material — not veterinary or legal advice."
      />
      <div className="shell py-8 lg:py-10">
        <div className="mb-6 rounded-2xl bg-navy-700 p-5 text-white">
          <h2 className="font-display text-2xl text-white">
            Find a name that fits your dog
          </h2>
          <p className="my-2 text-sm">
            Six local sample suggestions, a free certificate preview and no
            required tip.
          </p>
          <Link className="font-semibold underline" href="/godpet">
            Open GODPET name finder
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BLOG_ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="flex h-full flex-col rounded-2xl border border-line bg-white p-5 shadow-card"
            >
              <img
                src={article.coverImage}
                alt=""
                loading="lazy"
                width={1200}
                height={630}
                className="mb-4 aspect-[1200/630] w-full rounded-xl bg-cream-50 object-cover"
              />
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CATEGORY_STYLES[article.category]}`}
                >
                  {article.category}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                  {article.readingMinutes} min
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl leading-tight text-navy-900">
                <Link
                  href={`/blog/${article.slug}`}
                  className="hover:underline"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="mt-2 flex-1 text-[12px] leading-relaxed text-muted">
                {article.excerpt}
              </p>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[10px] text-muted">
                <span>{formatDate(article.publishedAt)}</span>
                <Link
                  href={`/blog/${article.slug}`}
                  className="inline-flex items-center gap-1 font-semibold text-navy-800"
                >
                  Read
                  <Icon name="arrow-right" className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 text-[11px] leading-relaxed text-muted">
          Demo editorial content. These articles are not a substitute for
          veterinary advice, legal advice or a registry confirmation.
        </p>
      </div>
    </>
  );
}
