import type { Metadata } from "next";
import Link from "next/link";
import { AdminNotice, AdminPageHeader, AdminStat, AdminTableShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import {
  ADMIN_CONTENT,
  ADMIN_COUNTS,
  ADMIN_REPORTS,
  ADMIN_TRANSACTIONS,
  ADMIN_VERIFICATIONS,
} from "@/lib/data/demo/admin";
import { formatUsd } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin overview" };

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Administration overview"
        description="Verification, content, reports, transactions and sponsor queues in one place. Every action is disabled in the preview."
      />
      <AdminNotice />

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Admin metrics">
        <AdminStat label="Pending verifications" value={String(ADMIN_COUNTS.pendingVerification)} hint="Documents waiting for a manual review." />
        <AdminStat label="Content in review" value={String(ADMIN_COUNTS.contentReview)} hint="Litters, clubs and events." />
        <AdminStat label="Open reports" value={String(ADMIN_COUNTS.openReports)} hint="Includes one listing-age concern." />
        <AdminStat label="Sample transactions" value={String(ADMIN_COUNTS.transactions)} hint="No payout is calculated." />
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminTableShell title="Verification queue" description="Newest submissions first." count={ADMIN_VERIFICATIONS.length}>
          <ul className="divide-y divide-line">
            {ADMIN_VERIFICATIONS.slice(0, 4).map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-medium text-ink">{item.subject}</p>
                  <p className="mt-0.5 text-[10px] text-muted">
                    {item.kind} · submitted {item.submitted}
                  </p>
                </div>
                <Badge
                  tone={item.status === "pending" ? "warning" : item.status === "requires_action" ? "danger" : "info"}
                  size="sm"
                  className="shrink-0"
                >
                  {item.status.replaceAll("_", " ")}
                </Badge>
              </li>
            ))}
          </ul>
        </AdminTableShell>

        <AdminTableShell title="Open reports" description="Community and visitor reports." count={ADMIN_REPORTS.length}>
          <ul className="divide-y divide-line">
            {ADMIN_REPORTS.map((report) => (
              <li key={report.id} className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[12px] font-semibold text-ink">{report.subject}</p>
                  <Badge
                    tone={report.status === "open" ? "danger" : report.status === "reviewing" ? "warning" : "neutral"}
                    size="sm"
                  >
                    {report.status}
                  </Badge>
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">{report.reason}</p>
                <p className="mt-1 text-[10px] text-muted">
                  {report.reportedBy} · {report.date}
                </p>
              </li>
            ))}
          </ul>
        </AdminTableShell>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <AdminTableShell title="Content queue" description="Publishing states." count={ADMIN_CONTENT.length}>
          <ul className="divide-y divide-line">
            {ADMIN_CONTENT.map((item) => (
              <li key={item.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-ink">{item.title}</p>
                  <p className="text-[10px] text-muted">
                    {item.type} · {item.owner}
                  </p>
                </div>
                <Badge
                  tone={item.status === "published" ? "success" : item.status === "changes_requested" ? "danger" : "warning"}
                  size="sm"
                  className="shrink-0"
                >
                  {item.status.replaceAll("_", " ")}
                </Badge>
              </li>
            ))}
          </ul>
        </AdminTableShell>

        <AdminTableShell title="Recent transactions" description="Sample amounts; no payout calculation." count={ADMIN_TRANSACTIONS.length}>
          <ul className="divide-y divide-line">
            {ADMIN_TRANSACTIONS.slice(0, 4).map((transaction) => (
              <li key={transaction.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                <div>
                  <p className="text-[12px] font-semibold text-ink">{transaction.reference}</p>
                  <p className="text-[10px] text-muted">
                    {transaction.kind} · {transaction.status.replaceAll("_", " ")}
                  </p>
                </div>
                <p className="tabular text-[12px] font-semibold text-ink">{formatUsd(transaction.amountUsd)}</p>
              </li>
            ))}
          </ul>
        </AdminTableShell>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Verification queue",
            body: "Documents, entity type and the current state.",
            href: "/admin/verifications",
          },
          {
            title: "Sponsor review",
            body: "Creative, plan and period. No campaign metrics are invented.",
            href: "/admin/sponsors",
          },
          {
            title: "Event tracking",
            body: "Capacity and ticket inventory; check-in states are sample data.",
            href: "/admin/events",
          },
        ].map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-2xl border border-line bg-white p-5 shadow-card hover:border-navy-300"
          >
            <p className="text-sm font-semibold text-navy-900">{card.title}</p>
            <p className="mt-1 text-[11px] leading-relaxed text-muted">{card.body}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-navy-800">
              Open
              <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </span>
          </Link>
        ))}
      </section>
    </div>
  );
}
