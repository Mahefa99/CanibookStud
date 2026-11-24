import type { Metadata } from "next";
import { AdminDemoAction, AdminNotice, AdminPageHeader, AdminTableShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { ADMIN_VERIFICATIONS } from "@/lib/data/demo/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin verifications" };

export default function AdminVerificationsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Verification queue"
        description="Document review for studs, professionals and clubs. A document check is not a licence guarantee or an AKC confirmation."
      />
      <AdminNotice />

      <AdminTableShell
        title="Submissions"
        description="Sample records. Files themselves are not stored in this preview."
        count={ADMIN_VERIFICATIONS.length}
      >
        <table className="w-full min-w-[52rem] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-cream-50 text-[10px] uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-3 font-semibold">Subject</th>
              <th scope="col" className="px-4 py-3 font-semibold">Type</th>
              <th scope="col" className="px-4 py-3 font-semibold">Submitted</th>
              <th scope="col" className="px-4 py-3 font-semibold">Review note</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Decision</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_VERIFICATIONS.map((item) => (
              <tr key={item.id} className="border-b border-line/70 align-top last:border-0">
                <th scope="row" className="px-4 py-3 font-medium text-ink">{item.subject}</th>
                <td className="px-4 py-3 text-muted">{item.kind}</td>
                <td className="px-4 py-3 text-muted">{formatDate(item.submitted)}</td>
                <td className="max-w-xs px-4 py-3 text-[11px] leading-relaxed text-muted">{item.note}</td>
                <td className="px-4 py-3">
                  <Badge
                    tone={item.status === "approved" ? "info" : item.status === "requires_action" ? "danger" : "warning"}
                    size="sm"
                  >
                    {item.status.replaceAll("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    <AdminDemoAction label="Approve" />
                    <AdminDemoAction label="Request changes" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      <p className="rounded-xl border border-line bg-cream-50 p-4 text-[11px] leading-relaxed text-muted">
        No identity document, licence number or private file is stored in this repository. A production
        review queue must use private storage, short-lived URLs and an audit trail.
      </p>
    </div>
  );
}
