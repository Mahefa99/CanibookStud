import { ClubSponsorEmail } from "@/components/forms/club-sponsor-email";
import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/domain/marketplace-cards";
import { StudCard } from "@/components/domain/stud-card";
import { Alert } from "@/components/ui/feedback";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { DEMO_CLUBS } from "@/lib/data/demo/clubs";
import { DEMO_EVENTS } from "@/lib/data/demo/events";
import { DEMO_STUDS } from "@/lib/data/demo/studs";

export const metadata: Metadata = { title: "My Club" };

export default function DashboardClubPage() {
  const club = DEMO_CLUBS[0];
  const studs = DEMO_STUDS.filter((stud) =>
    club?.recommendedStudSlugs.includes(stud.slug),
  );
  const events = DEMO_EVENTS.filter((event) =>
    club?.eventSlugs.includes(event.slug),
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">My Club</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">
            Club workspace
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            A preview of the club-manager section. The demo account does not
            hold the Club manager activity, so this page is not in the sidebar.
          </p>
        </div>
        <ButtonLink
          href="/clubs"
          variant="secondary"
          size="sm"
          iconLeft={<Icon name="external" className="h-4 w-4" />}
        >
          Public clubs
        </ButtonLink>
      </header>

      <Alert tone="info" title="Sample club section">
        Recommendations and events are sample data. Publishing, member lists and
        reports are not connected.
      </Alert>

      {club ? (
        <>
          <section className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {club.verification.replaceAll("_", " ")}
                </p>
                <h2 className="mt-1 font-display text-2xl text-navy-900">
                  {club.name}
                </h2>
                <p className="mt-1 text-[12px] text-muted">
                  {club.location.city}, {club.location.stateCode} ·{" "}
                  {club.websiteLabel}
                </p>
              </div>
              <Link
                href={`/clubs/${club.slug}`}
                className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-3.5 text-xs font-semibold text-navy-800"
              >
                View public profile
              </Link>
            </div>
            <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-muted">
              {club.description}
            </p>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl text-navy-900">
                Recommended studs
              </h2>
              <span className="text-[10px] text-muted">
                A club opinion, not a verification
              </span>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {studs.map((stud) => (
                <StudCard key={stud.id} stud={stud} />
              ))}
            </div>
            <p className="mt-3 text-[10px] text-muted">
              Recommendation management is not connected.
            </p>
          </section>

          <section>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-display text-xl text-navy-900">
                Club events
              </h2>
              <Link
                href="/dashboard/events"
                className="text-[11px] font-semibold text-navy-800 underline underline-offset-2"
              >
                Event workspace
              </Link>
            </div>
            <div className="mt-3 space-y-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [
                "Publish an article",
                "Draft and editorial review are not connected.",
              ],
              [
                "Report a concern",
                "A report route exists for members; no report is invented here.",
              ],
              ["Manage members", "Member data is not stored in this preview."],
            ].map(([title, body]) => (
              <div
                key={title}
                className="rounded-xl border border-line bg-cream-50 p-4"
              >
                <p className="text-sm font-semibold text-navy-900">{title}</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">
                  {body}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-muted">
                  <Icon name="lock" className="h-3 w-3" />
                  Disabled
                </span>
              </div>
            ))}
          </div>
        </>
      ) : null}
      <ClubSponsorEmail />
    </div>
  );
}
