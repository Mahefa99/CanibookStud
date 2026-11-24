import type { Metadata } from "next";
import Link from "next/link";
import { ClubCard } from "@/components/domain/marketplace-cards";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { DEMO_CLUBS } from "@/lib/data/demo/clubs";

export const metadata: Metadata = {
  title: "Clubs & associations",
  description:
    "Sample club directory with separate document review, recommendations and events. Parent-club claims are not an AKC confirmation.",
};

export default function ClubsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Clubs · demo"
        title="Clubs that show their work."
        description="A club profile can carry a document-review status, recommended studs and professionals, and its own events. A recommendation is an opinion, not a verification."
        actions={
          <>
            <Link
              href="/clubs/new"
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Register a club
              <Icon name="plus" className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-800 hover:border-navy-300"
            >
              Create account
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </>
        }
      />

      <div className="shell py-8 lg:py-10">
        <div className="mb-6">
          <Alert tone="info" title="Separate signals">
            Document review, a recommendation and a paid plan are three different things. None of
            them is combined into a “verified club” badge in this interface.
          </Alert>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {DEMO_CLUBS.map((club) => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>

        <section className="mt-10 grid gap-4 rounded-2xl border border-line bg-cream-50 p-6 sm:grid-cols-3">
          {[
            ["Recommend", "Point members to a stud or professional with a visible club attribution."],
            ["Host", "Publish an event with a ticket price, capacity and time zone."],
            ["Report", "Raise a concern to administration without exposing the reporter publicly."],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="text-sm font-semibold text-navy-900">{title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </section>

        <p className="mt-6 text-[11px] leading-relaxed text-muted">
          The source documents describe an AKC Parent Club check. It is not implemented: a sample
          “parent club claim” is shown as a claim, never as an AKC confirmation.
        </p>
      </div>
    </>
  );
}
