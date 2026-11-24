import type { Metadata } from "next";
import Link from "next/link";
import { EventCard } from "@/components/domain/marketplace-cards";
import { Alert } from "@/components/ui/feedback";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { DEMO_EVENTS } from "@/lib/data/demo/events";
import { formatUsd } from "@/lib/utils";

export const metadata: Metadata = { title: "My Events" };

export default function DashboardEventsPage() {
  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">My Events</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Events workspace</h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            A preview of the club event section: capacity, ticket inventory and check-in states.
            Ticket sales and payouts are not connected.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/events/new" size="sm" iconLeft={<Icon name="plus" className="h-4 w-4" />}>
            Create an event
          </ButtonLink>
          <ButtonLink href="/events" variant="secondary" size="sm" iconLeft={<Icon name="external" className="h-4 w-4" />}>
            Public events
          </ButtonLink>
        </div>
      </header>

      <Alert tone="warning" title="Demo ticket inventory">
        Sold and remaining counts are sample values. No QR code is issued and no check-in can be
        recorded.
      </Alert>

      <div className="space-y-3">
        {DEMO_EVENTS.map((event) => (
          <div key={event.id} className="space-y-2">
            <EventCard event={event} />
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-2.5 text-[11px]">
              <span className="text-muted">
                Ticket total {formatUsd(event.totalUsd)} · {event.ticketsSold}/{event.capacity} sold
              </span>
              <div className="flex gap-2">
                <Link href={`/events/${event.slug}`} className="font-semibold text-navy-800 underline underline-offset-2">
                  Public page
                </Link>
                <Link href="/admin/events" className="font-semibold text-navy-800 underline underline-offset-2">
                  Admin check-in
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          ["Create an event", "Drafting is not connected."],
          ["Ticket inventory", "Sample counts only; no QR generation."],
          ["Sponsor an event", "The announcement and contract are separate steps."],
        ].map(([title, body]) => (
          <div key={title} className="rounded-xl border border-line bg-cream-50 p-4">
            <p className="text-sm font-semibold text-navy-900">{title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">{body}</p>
            <span className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-muted">
              <Icon name="lock" className="h-3 w-3" />
              Disabled
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
