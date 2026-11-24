import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";

/**
 * Ticket state gallery for event pages. These are static examples, not scannable
 * tickets. The check-in success/invalid/used states are shown so the UI can be
 * reviewed before the QR service exists.
 */
export function TicketStates() {
  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-navy-900">Ticket states</h2>
          <p className="mt-1 text-sm text-muted">
            Sample states for the future QR ticket. None of these codes is real or scannable.
          </p>
        </div>
        <Badge tone="neutral" icon="info">
          Demo only
        </Badge>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          {
            code: "CB-DEMO-1042",
            state: "Valid · not scanned",
            tone: "success" as const,
            note: "The ticket exists and has not been used.",
          },
          {
            code: "CB-DEMO-1042",
            state: "Checked in",
            tone: "info" as const,
            note: "Scan succeeded and the ticket was marked used.",
          },
          {
            code: "CB-DEMO-1042",
            state: "Already used",
            tone: "warning" as const,
            note: "A second scan is rejected and shows the first check-in time.",
          },
          {
            code: "CB-DEMO-0000",
            state: "Invalid code",
            tone: "danger" as const,
            note: "The code is unknown, cancelled or belongs to another event.",
          },
        ].map((ticket) => (
          <article key={ticket.state} className="rounded-xl border border-line bg-cream-50 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-white text-navy-700 shadow-sm">
                <Icon name="calendar" className="h-4 w-4" />
              </span>
              <Badge tone={ticket.tone} size="sm">
                {ticket.state}
              </Badge>
            </div>
            <p className="tabular mt-3 text-sm font-semibold text-ink">{ticket.code}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">{ticket.note}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
