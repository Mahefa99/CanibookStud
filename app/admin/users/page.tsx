import type { Metadata } from "next";
import { AdminDemoAction, AdminNotice, AdminPageHeader, AdminTableShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { ADMIN_USERS } from "@/lib/data/demo/admin";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin users" };

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Users"
        description="Sample accounts and activity assignments. No identity document, bank detail or password is present."
      />
      <AdminNotice />

      <AdminTableShell title="Accounts" count={ADMIN_USERS.length}>
        <table className="w-full min-w-[46rem] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-cream-50 text-[10px] uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-3 font-semibold">User</th>
              <th scope="col" className="px-4 py-3 font-semibold">Activities</th>
              <th scope="col" className="px-4 py-3 font-semibold">Joined</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_USERS.map((user) => (
              <tr key={user.id} className="border-b border-line/70 last:border-0">
                <th scope="row" className="px-4 py-3">
                  <p className="font-medium text-ink">{user.name}</p>
                  <p className="mt-0.5 text-[10px] text-muted">{user.email}</p>
                </th>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {user.activities.map((activity) => (
                      <span key={activity} className="rounded-full border border-line bg-cream-50 px-2 py-0.5 text-[10px] text-muted">
                        {activity}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(user.joined)}</td>
                <td className="px-4 py-3">
                  <Badge
                    tone={user.status === "active" ? "success" : user.status === "review" ? "warning" : "danger"}
                    size="sm"
                  >
                    {user.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <AdminDemoAction label="Open account" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      <p className="rounded-xl border border-line bg-cream-50 p-4 text-[11px] leading-relaxed text-muted">
        Activities decide which dashboard sections appear. They do not replace server authorization:
        every admin route and mutation must check the role independently.
      </p>
    </div>
  );
}
