import type { Metadata } from "next";
import { AdminDemoAction, AdminNotice, AdminPageHeader, AdminTableShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { ADMIN_SPONSORS } from "@/lib/data/demo/admin";

export const metadata: Metadata = { title: "Admin sponsors" };

export default function AdminSponsorsPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sponsors"
        description="Creative review, plan and period for sample sponsors. No impression, click or partner metric is invented."
      />
      <AdminNotice />

      <AdminTableShell title="Sponsor queue" count={ADMIN_SPONSORS.length}>
        <table className="w-full min-w-[46rem] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-cream-50 text-[10px] uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-3 font-semibold">Company</th>
              <th scope="col" className="px-4 py-3 font-semibold">Plan</th>
              <th scope="col" className="px-4 py-3 font-semibold">Period</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Metrics</th>
              <th scope="col" className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_SPONSORS.map((sponsor) => (
              <tr key={sponsor.id} className="border-b border-line/70 last:border-0">
                <th scope="row" className="px-4 py-3 font-medium text-ink">{sponsor.company}</th>
                <td className="px-4 py-3 text-muted">{sponsor.plan}</td>
                <td className="px-4 py-3 text-muted">{sponsor.period}</td>
                <td className="px-4 py-3">
                  <Badge
                    tone={sponsor.status === "active" ? "success" : sponsor.status === "pending_payment" ? "warning" : "info"}
                    size="sm"
                  >
                    {sponsor.status.replaceAll("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-[10px] text-muted">
                  {sponsor.metrics === "none" ? "No campaign data" : "Sample only"}
                </td>
                <td className="px-4 py-3">
                  <AdminDemoAction label="Review creative" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-xl text-navy-900">Reporting policy</h2><div className="my-4 grid gap-3 sm:grid-cols-3">{["Revenue", "Active / pending / refused", "Placement occupancy", "Event split", "Unfilled for 7 days", "Payment overdue", "CTR below 0.2%"].map(label => <div key={label} className="rounded-xl bg-cream-50 p-3 text-xs"><p className="font-semibold">{label}</p><p className="mt-2">No live data / alerts</p></div>)}</div>
        <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-muted">
          Sponsor reporting will show impressions, clicks and attributed actions only when a real
          placement is served and measured. This preview contains no analytics, no third-party pixel
          and no fabricated numbers.
        </p>
      </section>
    </div>
  );
}
