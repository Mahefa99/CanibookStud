import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EventStatusBadge } from "@/components/domain/marketplace-badges";
import { AdSlot } from "@/components/domain/ad-slot";
import { TicketStates } from "@/components/domain/ticket-states";
import { Alert } from "@/components/ui/feedback";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { SPONSOR_PRICING } from "@/lib/config/pricing";
import { DEMO_CLUBS } from "@/lib/data/demo/clubs";
import { DEMO_EVENTS } from "@/lib/data/demo/events";
import { formatEventDateTime, formatUsd } from "@/lib/utils";

type EventPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DEMO_EVENTS.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = DEMO_EVENTS.find((entry) => entry.slug === slug);
  if (!event) return { title: "Event not found" };
  return {
    title: event.title,
    description: `${event.title} · ${event.locationName}, ${event.city}, ${event.stateCode}. Sample event. Ticket checkout is not connected.`,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = DEMO_EVENTS.find((entry) => entry.slug === slug);
  if (!event) notFound();

  const club = DEMO_CLUBS.find((entry) => entry.slug === event.clubSlug);
  const remaining = Math.max(0, event.capacity - event.ticketsSold);
  const soldOut = event.status === "sold_out" || remaining === 0;

  return (
    <>
      <div className="border-b border-line bg-cream-50">
        <div className="shell py-6 lg:py-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Events", href: "/events" },
              { label: event.title },
            ]}
          />

          <div className="mt-5 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <EventStatusBadge status={event.status} />
                <span className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-muted">
                  <Icon name="clock" className="h-3 w-3" />
                  {event.timeZoneLabel}
                </span>
              </div>
              <h1 className="mt-3 font-display text-4xl leading-tight text-navy-900 sm:text-5xl">
                {event.title}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <Icon name="calendar" className="h-4 w-4 text-navy-300" />
                {formatEventDateTime(event.startsAt, event.timeZone)}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted">
                <Icon name="pin" className="h-4 w-4 text-navy-300" />
                {event.locationName} · {event.address}, {event.city}, {event.stateCode}
              </p>
              {club ? (
                <p className="mt-2 text-[12px] text-muted">
                  Hosted by{" "}
                  <Link href={`/clubs/${club.slug}`} className="font-semibold text-navy-800 underline underline-offset-2">
                    {club.name}
                  </Link>
                </p>
              ) : null}
            </div>
            <ButtonLink href="/events" variant="secondary" size="sm" iconLeft={<Icon name="arrow-left" className="h-4 w-4" />}>
              All events
            </ButtonLink>
          </div>
        </div>
      </div>

      <div className="shell py-8">
        <div className="mb-6">
          <Alert tone="warning" title="Ticket checkout is not connected">
            The example price is {formatUsd(event.ticketPriceUsd)} for the club plus{" "}
            {formatUsd(event.feeUsd)} platform fee, for a{" "}
            <strong>{formatUsd(event.totalUsd)}</strong> total. No payment, QR code or check-in exists
            in this preview.
          </Alert>
        </div>

        <div className="mb-6">
          <AdSlot placement="event_page" pathname={`/events/${event.slug}`} />
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="min-w-0 space-y-8">
            <section>
              <h2 className="font-display text-2xl text-navy-900">About this event</h2>
              <p className="mt-2 max-w-2xl text-[15px] leading-7 text-muted">{event.description}</p>
              <dl className="mt-5 grid grid-cols-2 gap-x-6 sm:grid-cols-3">
                {[
                  ["Capacity", String(event.capacity)],
                  ["Tickets sold", String(event.ticketsSold)],
                  ["Remaining", String(remaining)],
                  ["Ticket", formatUsd(event.ticketPriceUsd)],
                  ["Platform fee", formatUsd(event.feeUsd)],
                  ["Total", formatUsd(event.totalUsd)],
                ].map(([label, value]) => (
                  <div key={label} className="border-t border-line py-3">
                    <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</dt>
                    <dd className="tabular mt-1 text-sm font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <TicketStates />

            <section className="rounded-2xl border border-line bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl text-navy-900">Sponsor this event</h2>
                  <p className="mt-1 max-w-xl text-sm text-muted">
                    Event sponsorship is separate from a site sponsor plan. The source documents
                    announce a 50/50 club/platform split; the contract terms are still to be confirmed.
                  </p>
                </div>
                <Link
                  href={`/sponsors?event=${event.slug}`}
                  className="inline-flex min-h-9 items-center rounded-full bg-navy-700 px-4 text-xs font-semibold text-white hover:bg-navy-800"
                >
                  View sponsorship
                </Link>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {SPONSOR_PRICING.event.map((tier) => (
                  <div key={tier.id} className="rounded-xl border border-line bg-cream-50 p-4">
                    <p className="text-sm font-semibold text-ink">{tier.name}</p>
                    <p className="tabular mt-1 font-display text-2xl text-navy-900">
                      {formatUsd(tier.amountUsd)}
                      <span className="text-[11px] font-normal text-muted"> / event</span>
                    </p>
                    <p className="mt-1 text-[11px] text-muted">
                      Logo on the event page and ticket email; exact placements to be confirmed.
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {event.sponsors.length > 0 ? (
              <section className="rounded-2xl border border-line bg-cream-50 p-5">
                <h2 className="font-display text-xl text-navy-900">Event sponsors</h2>
                <ul className="mt-3 space-y-2">
                  {event.sponsors.map((sponsor) => (
                    <li key={sponsor.name} className="flex items-center justify-between gap-3 rounded-lg border border-line bg-white p-3 text-[12px]">
                      <span className="font-medium text-ink">{sponsor.name}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                        {sponsor.tier} · sample
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[10px] text-muted">
                  Fictional sponsor placeholder; no real partner is represented.
                </p>
              </section>
            ) : null}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">Ticket</p>
                  <p className="tabular mt-1 font-display text-4xl leading-none text-navy-900">
                    {formatUsd(event.totalUsd)}
                  </p>
                </div>
                <EventStatusBadge status={event.status} />
              </div>
              <dl className="mt-4 space-y-2 rounded-xl bg-cream-50 p-3 text-[12px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Club ticket</dt>
                  <dd className="tabular font-medium text-ink">{formatUsd(event.ticketPriceUsd)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Platform fee</dt>
                  <dd className="tabular font-medium text-ink">{formatUsd(event.feeUsd)}</dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-line pt-2">
                  <dt className="font-semibold text-ink">Total</dt>
                  <dd className="tabular font-semibold text-ink">{formatUsd(event.totalUsd)}</dd>
                </div>
              </dl>
              <div className="mt-4">
                {soldOut ? (
                  <Button fullWidth disabled>
                    Sold out
                  </Button>
                ) : (
                  <Button fullWidth disabled>
                    Buy ticket — unavailable
                  </Button>
                )}
              </div>
              <p className="mt-2 text-center text-[10px] text-muted">
                {soldOut
                  ? "The waitlist is not connected."
                  : `${remaining} sample tickets remaining. No payment is taken.`}
              </p>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <h2 className="font-display text-lg text-navy-900">Before you attend</h2>
              <ul className="mt-2 space-y-2 text-[11px] leading-relaxed text-muted">
                <li>Bring proof of ticket; check-in is at the door.</li>
                <li>Dogs must be comfortable in a crowd; the organiser may set additional rules.</li>
                <li>No delivery or shipping is involved. This is an in-person event.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
