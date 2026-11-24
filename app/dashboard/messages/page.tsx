import Link from "next/link";
import type { Metadata } from "next";
import { Alert, EmptyState } from "@/components/ui/feedback";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Messages</p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-navy-900">Messages</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          A message thread opens only after the request payment is confirmed by the server. Contact
          details stay out of the public profile until that state exists.
        </p>
      </header>

      <Alert tone="info" title="Messaging is not connected">
        The preview has no message transport. This screen documents the empty and locked states
        instead of inventing a conversation.
      </Alert>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
        <EmptyState
          icon="message"
          title="No messages yet"
          description="When a request is confirmed, the thread with the other owner appears here. Messages are unavailable in this preview build."
          action={<ButtonLink href="/dashboard/requests" size="sm">View requests</ButtonLink>}
          secondaryAction={
            <Link
              href="/studs"
              className="inline-flex min-h-9 items-center rounded-full border border-line bg-white px-4 text-xs font-semibold text-navy-800"
            >
              Browse studs
            </Link>
          }
        />

        <aside className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-display text-xl text-navy-900">Thread states</h2>
          <ul className="mt-3 space-y-3 text-[12px] leading-relaxed text-muted">
            {[
              ["Locked", "Request submitted, payment not confirmed."],
              ["Open", "Payment confirmed server-side; both parties can message."],
              ["Read-only", "Request declined or archived; history remains."],
              ["Reported", "A thread can be reported to administration."],
            ].map(([label, description]) => (
              <li key={label} className="flex gap-2.5">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-700">
                  <Icon name="lock" className="h-3 w-3" />
                </span>
                <span>
                  <strong className="font-semibold text-ink">{label}.</strong> {description}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-line pt-3 text-[10px] leading-relaxed text-muted">
            No unread count is displayed because no real inbox exists.
          </p>
        </aside>
      </div>
    </div>
  );
}
