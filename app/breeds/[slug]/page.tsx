import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LitterCard } from "@/components/domain/marketplace-cards";
import { AdSlot } from "@/components/domain/ad-slot";
import { StudCard } from "@/components/domain/stud-card";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { DEMO_ARTICLES } from "@/lib/data/demo/articles";
import { DEMO_BREEDS } from "@/lib/data/demo/breeds";
import { DEMO_LITTERS } from "@/lib/data/demo/litters";
import { DEMO_STUDS } from "@/lib/data/demo/studs";

type BreedPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DEMO_BREEDS.map((breed) => ({ slug: breed.slug }));
}

export async function generateMetadata({ params }: BreedPageProps): Promise<Metadata> {
  const { slug } = await params;
  const breed = DEMO_BREEDS.find((entry) => entry.slug === slug);
  if (!breed) return { title: "Breed not found" };
  return {
    title: `${breed.name} — sample breed guide`,
    description: `${breed.summary} Sample editorial overview, not an AKC standard.`,
  };
}

export default async function BreedPage({ params }: BreedPageProps) {
  const { slug } = await params;
  const breed = DEMO_BREEDS.find((entry) => entry.slug === slug);
  if (!breed) notFound();

  const studs = DEMO_STUDS.filter((stud) => stud.breed === breed.name).slice(0, 2);
  const litters = DEMO_LITTERS.filter((litter) => litter.breed === breed.name).slice(0, 2);
  const articles = DEMO_ARTICLES.filter((article) => article.breedSlugs.includes(breed.slug));

  return (
    <div className="shell py-8 lg:py-10">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Breeds", href: "/breeds" },
          { label: breed.name },
        ]}
      />

      <header className="mt-5 max-w-3xl">
        <p className="eyebrow">{breed.group} · sample overview</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900 sm:text-5xl">{breed.name}</h1>
        <p className="mt-3 text-[15px] leading-7 text-muted">{breed.summary}</p>
        <p className="mt-3 rounded-xl border border-line bg-cream-50 p-3 text-[11px] leading-relaxed text-muted">
          {breed.note}
        </p>
      </header>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Size", breed.size],
          ["Coat", breed.coat],
          ["Exercise", breed.exercise],
          ["Grooming", breed.grooming],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line bg-white p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-5 max-w-xl">
        <AdSlot placement="breed_sidebar" pathname={`/breeds/${breed.slug}`} variant="sidebar" />
      </div>

      {studs.length > 0 ? (
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-navy-900">Studs of this breed</h2>
              <p className="mt-1 text-sm text-muted">Sample profiles from the directory.</p>
            </div>
            <Link
              href={`/studs?breed=${encodeURIComponent(breed.name)}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-navy-800 underline underline-offset-2"
            >
              View all
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {studs.map((stud) => (
              <StudCard key={stud.id} stud={stud} />
            ))}
          </div>
        </section>
      ) : null}

      {litters.length > 0 ? (
        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl text-navy-900">Litters of this breed</h2>
              <p className="mt-1 text-sm text-muted">Sample litters, with each puppy state visible.</p>
            </div>
            <Link
              href={`/puppies?breed=${encodeURIComponent(breed.name)}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-navy-800 underline underline-offset-2"
            >
              View litters
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {litters.map((litter) => (
              <LitterCard key={litter.id} litter={litter} />
            ))}
          </div>
        </section>
      ) : null}

      {articles.length > 0 ? (
        <section className="mt-10 rounded-2xl border border-line bg-cream-50 p-5">
          <h2 className="font-display text-xl text-navy-900">Related reading</h2>
          <ul className="mt-3 space-y-2">
            {articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/articles/${article.slug}`}
                  className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white p-3 text-[12px] font-medium text-ink hover:border-navy-300"
                >
                  {article.title}
                  <Icon name="arrow-right" className="h-3.5 w-3.5 text-navy-400" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
