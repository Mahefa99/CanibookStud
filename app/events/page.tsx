import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/domain/marketplace-cards";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { PageHeader } from "@/components/ui/page-header";
import { DEMO_EVENTS } from "@/lib/data/demo/events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Sample club events with explicit time zones, ticket prices and capacity. Ticket checkout is not connected.",
};

export default function EventsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Events · demo"
        title="Meet, learn, and keep the time zone straight."
        description="Each event belongs to a club, states its local time zone, and shows the ticket price with the platform fee separately. No ticket is issued in this preview."
        actions={
          <>
            <Link
              href="/events/new"
              className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
            >
              Create an event
              <Icon name="plus" className="h-4 w-4" />
            </Link>
            <Link
              href="/clubs"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-800 hover:border-navy-300"
            >
              Browse clubs
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </>
        }
      />

      <div className="shell py-8 lg:py-10">
        <div className="mb-6">
          <Alert tone="warning" title="Ticketing is disabled">
            The $25 + $2 = $27 example is shown for review. No ticket, QR code or payment is created,
            and a sold-out event has no connected waitlist.
          </Alert>
        </div>

        <div className="space-y-3">
          {DEMO_EVENTS.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <section className="mt-10 grid gap-4 rounded-2xl border border-line bg-cream-50 p-6 sm:grid-cols-3">
          {[
            ["Local time", "The event stores an IANA time zone, so a Miami and a Denver event are not shown in the visitor's zone by accident."],
            ["Capacity", "Tickets sold and remaining capacity are sample numbers. A sold-out state is visible before purchase."],
            ["Sponsorship", "The club receives the full event sponsorship payment."],
          ].map(([title, body]) => (
            <div key={title}>
              <p className="text-sm font-semibold text-navy-900">{title}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{body}</p>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
