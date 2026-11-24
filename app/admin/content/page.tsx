import type { Metadata } from "next";
import { AdminDemoAction, AdminNotice, AdminPageHeader, AdminTableShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { ADMIN_CONTENT } from "@/lib/data/demo/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin content" };

export default function AdminContentPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Content review"
        description="Stud listings, litters, clubs and events. Publishing decisions are disabled; the queue is here to review the layout and states."
      />
      <AdminNotice />

      <AdminTableShell title="Content queue" count={ADMIN_CONTENT.length}>
        <table className="w-full min-w-[50rem] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-cream-50 text-[10px] uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-3 font-semibold">Title</th>
              <th scope="col" className="px-4 py-3 font-semibold">Type</th>
              <th scope="col" className="px-4 py-3 font-semibold">Owner</th>
              <th scope="col" className="px-4 py-3 font-semibold">Submitted</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_CONTENT.map((item) => (
              <tr key={item.id} className="border-b border-line/70 align-top last:border-0">
                <th scope="row" className="px-4 py-3">
                  <p className="font-medium text-ink">{item.title}</p>
                  <p className="mt-0.5 max-w-xs text-[10px] leading-relaxed text-muted">{item.note}</p>
                </th>
                <td className="px-4 py-3 text-muted">{item.type}</td>
                <td className="px-4 py-3 text-muted">{item.owner}</td>
                <td className="px-4 py-3 text-muted">{formatDate(item.submitted)}</td>
                <td className="px-4 py-3">
                  <Badge
                    tone={item.status === "published" ? "success" : item.status === "changes_requested" ? "danger" : "warning"}
                    size="sm"
                  >
                    {item.status.replaceAll("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <AdminDemoAction label="Review" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      <p className="rounded-xl border border-line bg-cream-50 p-4 text-[11px] leading-relaxed text-muted">
        The readiness rule and the 14-day test window are configurable platform rules in this
        prototype. A moderation decision must record who made it, when, and on which document version.
      </p>
    </div>
  );
}
