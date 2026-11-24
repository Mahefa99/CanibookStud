import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/page-header";
import {
  BLOG_ARTICLES,
  findBlogArticle,
  relatedBlogArticles,
} from "@/lib/data/demo/articles";
import { SITE } from "@/lib/config/site";
import { formatDate } from "@/lib/utils";

type BlogArticlePageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_ARTICLES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: BlogArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = findBlogArticle(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: { canonical: `/blog/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      images: [
        {
          url:
            article.coverImage?.replace(/\.svg$/, ".png") ??
            "/brand/canibookstud-logo.jpg",
          alt: "CanibookStud editorial cover",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function BlogArticlePage({
  params,
}: BlogArticlePageProps) {
  const { slug } = await params;
  const article = findBlogArticle(slug);
  if (!article) notFound();

  const related = relatedBlogArticles(article);
  const canonical = `${SITE.url}/blog/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.metaDescription,
        author: { "@type": "Organization", name: article.author },
        datePublished: article.publishedAt,
        dateModified: article.reviewedAt ?? article.publishedAt,
        image: new URL(
          article.coverImage?.replace(/\.svg$/, ".png") ??
            "/brand/canibookstud-logo.jpg",
          SITE.url,
        ).toString(),
        citation: article.sources?.map((source) => source.url),
        mainEntityOfPage: canonical,
        isAccessibleForFree: true,
      },
      {
        "@type": "FAQPage",
        mainEntity: article.faq.map((entry) => ({
          "@type": "Question",
          name: entry.question,
          acceptedAnswer: { "@type": "Answer", text: entry.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE.url}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: canonical,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="shell py-8 lg:py-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: article.title },
          ]}
        />

        <article className="mx-auto mt-6 max-w-2xl">
          <img
            src={article.coverImage}
            alt=""
            width={1200}
            height={630}
            className="mb-6 aspect-[1200/630] w-full rounded-2xl border border-line bg-cream-50 object-cover"
          />
          <p className="eyebrow">{article.category} · demo editorial</p>
          <h1 className="mt-3 text-balance font-display text-4xl leading-tight text-navy-900 sm:text-5xl">
            {article.title}
          </h1>
          <p className="mt-3 text-[15px] leading-7 text-muted">
            {article.excerpt}
          </p>
          <p className="mt-3 text-[11px] text-muted">
            {formatDate(article.publishedAt)} · {article.readingMinutes} min
            read · {article.author}
          </p>

          <div className="mt-6">
            <Alert tone="info" title="Demo editorial">
              This article is written for design review. It is not veterinary
              advice, legal advice or a registry confirmation.
            </Alert>
          </div>

          <nav
            aria-label="On this page"
            className="mt-8 rounded-2xl border border-line bg-cream-50 p-5"
          >
            <p className="text-sm font-semibold text-navy-900">On this page</p>
            <ol className="mt-3 space-y-2 text-sm">
              {article.sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    className="underline decoration-line underline-offset-4 hover:decoration-navy-700"
                    href={`#section-${index + 1}`}
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="mt-8 space-y-8">
            {article.sections.map((section, index) => (
              <section
                id={`section-${index + 1}`}
                className="scroll-mt-28"
                key={section.heading}
              >
                <h2 className="font-display text-2xl leading-snug text-navy-900">
                  {section.heading}
                </h2>
                <div className="prose-editorial mt-3">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {article.faq.length > 0 ? (
            <section
              className="mt-10 rounded-2xl border border-line bg-cream-50 p-5"
              aria-labelledby="faq-title"
            >
              <h2
                id="faq-title"
                className="font-display text-2xl text-navy-900"
              >
                Common questions
              </h2>
              <dl className="mt-4 space-y-4">
                {article.faq.map((entry) => (
                  <div
                    key={entry.question}
                    className="rounded-xl border border-line bg-white p-4"
                  >
                    <dt className="text-sm font-semibold text-navy-900">
                      {entry.question}
                    </dt>
                    <dd className="mt-1.5 text-[13px] leading-relaxed text-muted">
                      {entry.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          {article.sources?.length ? (
            <section
              aria-labelledby="sources-title"
              className="mt-8 border-t border-line pt-5"
            >
              <h2 id="sources-title" className="font-display text-2xl">
                Sources & editorial review
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Source check
                {article.reviewedAt
                  ? `: ${formatDate(article.reviewedAt)}`
                  : " pending"}
                . This is a sourced editorial draft; veterinary, legal and final
                publication approval remain pending.
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {article.sources.map((source) => (
                  <li key={source.url}>
                    <a
                      className="break-words underline decoration-line underline-offset-4 hover:decoration-navy-700"
                      href={source.url}
                      rel="noreferrer"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-8 space-y-3">
            {article.ctaGodpet ? (
              <div className="rounded-2xl border border-line bg-white p-5">
                <p className="font-display text-xl text-navy-900">
                  Looking for a name for your dog?
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  Try GODPET — free name ideas matched to breed, personality and
                  style.
                </p>
                <ButtonLink
                  href="/godpet"
                  className="mt-3"
                  iconRight={<Icon name="sparkle" className="h-4 w-4" />}
                >
                  Try GODPET
                </ButtonLink>
              </div>
            ) : null}
            {article.ctaBreeders ? (
              <div className="rounded-2xl border border-line bg-white p-5">
                <p className="font-display text-xl text-navy-900">
                  Looking for a responsible breeder?
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">
                  Browse listings with documented records, clearly separated
                  from paid placement.
                </p>
                <ButtonLink href="/studs" variant="secondary" className="mt-3">
                  Browse listings
                </ButtonLink>
              </div>
            ) : null}
          </div>

          {related.length > 0 ? (
            <div className="mt-8 border-t border-line pt-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Related articles
              </p>
              <ul className="mt-2 space-y-2">
                {related.map((entry) => (
                  <li key={entry.slug}>
                    <Link
                      href={`/blog/${entry.slug}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3 text-[12px] font-medium text-ink hover:border-navy-300"
                    >
                      {entry.title}
                      <Icon
                        name="arrow-right"
                        className="h-3.5 w-3.5 text-navy-400"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </article>
      </div>
    </>
  );
}
