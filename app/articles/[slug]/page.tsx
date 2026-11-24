import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { DEMO_ARTICLES } from "@/lib/data/demo/articles";
import { DEMO_BREEDS } from "@/lib/data/demo/breeds";
import { formatDate } from "@/lib/utils";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DEMO_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = DEMO_ARTICLES.find((entry) => entry.slug === slug);
  if (!article) return { title: "Article not found" };
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = DEMO_ARTICLES.find((entry) => entry.slug === slug);
  if (!article) notFound();

  const breeds = DEMO_BREEDS.filter((breed) => article.breedSlugs.includes(breed.slug));
  const others = DEMO_ARTICLES.filter((entry) => entry.slug !== article.slug).slice(0, 2);

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Articles", href: "/articles" },
          { label: article.title },
        ]}
      />

      <article className="mx-auto mt-6 max-w-2xl">
        <p className="eyebrow">{article.topic} · sample editorial</p>
        <h1 className="mt-3 text-balance font-display text-4xl leading-tight text-navy-900 sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-3 text-[15px] leading-7 text-muted">{article.excerpt}</p>
        <p className="mt-3 text-[11px] text-muted">
          {formatDate(article.published)} · {article.readingMinutes} min read · sample content
        </p>

        <div className="mt-6">
          <Alert tone="info" title="Illustrative content">
            This article is written for design review. It is not legal advice, veterinary advice or a
            registry confirmation.
          </Alert>
        </div>

        <div className="mt-6 space-y-4">
          {article.body.map((paragraph) => (
            <p key={paragraph} className="text-[15px] leading-7 text-muted">
              {paragraph}
            </p>
          ))}
        </div>

        {breeds.length > 0 ? (
          <div className="mt-8 border-t border-line pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Related breeds</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {breeds.map((breed) => (
                <Link
                  key={breed.slug}
                  href={`/breeds/${breed.slug}`}
                  className="inline-flex min-h-8 items-center rounded-full border border-line bg-white px-3 text-[11px] font-semibold text-navy-800 hover:border-navy-300"
                >
                  {breed.name}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-8 rounded-2xl border border-line bg-cream-50 p-5">
          <h2 className="font-display text-xl text-navy-900">More notes</h2>
          <ul className="mt-3 space-y-2">
            {others.map((entry) => (
              <li key={entry.slug}>
                <Link
                  href={`/articles/${entry.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3 text-[12px] font-medium text-ink hover:border-navy-300"
                >
                  {entry.title}
                  <Icon name="arrow-right" className="h-3.5 w-3.5 text-navy-400" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </div>
  );
}
