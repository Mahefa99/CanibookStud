import type { Metadata } from "next";
import { EventCreateForm } from "@/components/forms/event-create-form";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Create an event",
  robots: { index: false, follow: false },
};

export default function NewEventPage() {
  return (
    <div>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Events", href: "/events" },
          { label: "Create an event" },
        ]}
      />

      <header className="mt-4">
        <p className="eyebrow">Club event · preview</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Create an event</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Submit a club event with a local time zone, capacity and ticket price. Review is manual;
          ticketing and sponsorship payments are not connected.
        </p>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <EventCreateForm />

        <aside className="space-y-4 lg:sticky lg:top-24">
          <Alert tone="warning" title="No ticket sales">
            The event is not published and no ticket can be bought. The ticket breakdown is a sample
            only.
          </Alert>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-xl text-navy-900">Review checklist</h2>
            <ul className="mt-3 space-y-2 text-[11px] leading-relaxed text-muted">
              {[
                "Club authority and event ownership",
                "Venue, capacity and time zone",
                "Ticket price and the separate $2 fee",
                "Sponsor creative and 50/50 split, if applicable",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-navy-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-xl text-navy-900">Ticket states</h2>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              Valid, checked in, already used and invalid codes are previewed on the public event page.
              No QR code is generated.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
