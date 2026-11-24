import type { Metadata } from "next";
import Link from "next/link";
import { AdminDemoAction, AdminNotice, AdminPageHeader, AdminTableShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { TicketStates } from "@/components/domain/ticket-states";
import { DEMO_EVENTS } from "@/lib/data/demo/events";
import { formatDate, formatUsd } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin events" };

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Events & tickets"
        description="Capacity, ticket inventory and the check-in state review. No ticket is issued and no scan is possible."
      />
      <AdminNotice />

      <AdminTableShell title="Event inventory" count={DEMO_EVENTS.length}>
        <table className="w-full min-w-[46rem] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-cream-50 text-[10px] uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-3 font-semibold">Event</th>
              <th scope="col" className="px-4 py-3 font-semibold">Date</th>
              <th scope="col" className="px-4 py-3 font-semibold">Capacity</th>
              <th scope="col" className="px-4 py-3 font-semibold">Sold</th>
              <th scope="col" className="px-4 py-3 font-semibold">Ticket</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {DEMO_EVENTS.map((event) => (
              <tr key={event.id} className="border-b border-line/70 last:border-0">
                <th scope="row" className="px-4 py-3">
                  <Link href={`/events/${event.slug}`} className="font-medium text-ink underline underline-offset-2">
                    {event.title}
                  </Link>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {event.city}, {event.stateCode}
                  </p>
                </th>
                <td className="px-4 py-3 text-muted">{formatDate(event.startsAt.slice(0, 10))}</td>
                <td className="tabular px-4 py-3 text-muted">{event.capacity}</td>
                <td className="tabular px-4 py-3 text-muted">{event.ticketsSold}</td>
                <td className="tabular px-4 py-3 text-muted">{formatUsd(event.totalUsd)}</td>
                <td className="px-4 py-3">
                  <Badge tone={event.status === "on_sale" ? "success" : event.status === "sold_out" ? "neutral" : "warning"} size="sm">
                    {event.status.replaceAll("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <AdminDemoAction label="Check-in" />
                    <AdminDemoAction label="Export" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      <TicketStates />

      <p className="rounded-xl border border-line bg-cream-50 p-4 text-[11px] leading-relaxed text-muted">
        A check-in must be atomic: one scan marks the ticket used and a second scan returns the first
        check-in time. The QR generation, scanner and audit log are not connected.
      </p>
    </div>
  );
}
