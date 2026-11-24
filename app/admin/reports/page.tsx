import type { Metadata } from "next";
import { AdminDemoAction, AdminNotice, AdminPageHeader, AdminTableShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { ADMIN_REPORTS } from "@/lib/data/demo/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin reports" };

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Reports"
        description="Community reports about listings, profiles and content. Reporter identity is never shown publicly."
      />
      <AdminNotice />

      <div className="space-y-3">
        {ADMIN_REPORTS.map((report) => (
          <article key={report.id} className="rounded-2xl border border-line bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {report.id} · {formatDate(report.date)}
                </p>
                <h2 className="mt-1 font-display text-xl text-navy-900">{report.subject}</h2>
                <p className="mt-1 max-w-2xl text-[12px] leading-relaxed text-muted">{report.reason}</p>
                <p className="mt-1 text-[10px] text-muted">Reported by {report.reportedBy}</p>
              </div>
              <Badge
                tone={report.status === "open" ? "danger" : report.status === "reviewing" ? "warning" : "neutral"}
                size="sm"
              >
                {report.status}
              </Badge>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 border-t border-line pt-3">
              <AdminDemoAction label="Mark reviewing" />
              <AdminDemoAction label="Close report" />
              <AdminDemoAction label="Open subject" />
            </div>
          </article>
        ))}
      </div>

      <p className="rounded-xl border border-line bg-cream-50 p-4 text-[11px] leading-relaxed text-muted">
        A report is not a finding. Moderation actions must be logged, reversible where possible, and
        separated from any automated content check.
      </p>
    </div>
  );
}
