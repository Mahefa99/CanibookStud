import type { Metadata } from "next";
import { AdminNotice, AdminPageHeader, AdminTableShell } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { ADMIN_TRANSACTIONS } from "@/lib/data/demo/admin";
import { formatDate, formatUsd } from "@/lib/utils";

export const metadata: Metadata = { title: "Admin transactions" };

const STATUS_TONE = {
  paid: "success",
  awaiting_payment: "warning",
  failed: "danger",
  refund_pending: "info",
} as const;

export default function AdminTransactionsPage() {
  const gross = ADMIN_TRANSACTIONS.reduce((sum, transaction) => sum + transaction.amountUsd, 0);
  const fees = ADMIN_TRANSACTIONS.reduce((sum, transaction) => sum + transaction.feeUsd, 0);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Transactions"
        description="Sample request, ticket, sponsorship and litter amounts. No payout, refund or settlement is calculated."
      />
      <AdminNotice />

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Sample gross</p>
          <p className="tabular mt-2 font-display text-2xl text-navy-900">{formatUsd(gross)}</p>
          <p className="mt-1 text-[10px] text-muted">Fictional amounts only.</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Sample fees</p>
          <p className="tabular mt-2 font-display text-2xl text-navy-900">{formatUsd(fees)}</p>
          <p className="mt-1 text-[10px] text-muted">No allocation to an owner is settled.</p>
        </div>
        <div className="rounded-2xl border border-line bg-white p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Payout status</p>
          <p className="mt-2 text-sm font-semibold text-ink">Not connected</p>
          <p className="mt-1 text-[10px] text-muted">Timing and refunds remain open decisions.</p>
        </div>
      </div>

      <AdminTableShell title="Ledger sample" count={ADMIN_TRANSACTIONS.length}>
        <table className="w-full min-w-[44rem] text-left text-[12px]">
          <thead>
            <tr className="border-b border-line bg-cream-50 text-[10px] uppercase tracking-wide text-muted">
              <th scope="col" className="px-4 py-3 font-semibold">Reference</th>
              <th scope="col" className="px-4 py-3 font-semibold">Kind</th>
              <th scope="col" className="px-4 py-3 font-semibold">Amount</th>
              <th scope="col" className="px-4 py-3 font-semibold">Fee</th>
              <th scope="col" className="px-4 py-3 font-semibold">Status</th>
              <th scope="col" className="px-4 py-3 font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {ADMIN_TRANSACTIONS.map((transaction) => (
              <tr key={transaction.id} className="border-b border-line/70 last:border-0">
                <th scope="row" className="tabular px-4 py-3 font-medium text-ink">{transaction.reference}</th>
                <td className="px-4 py-3 text-muted">{transaction.kind}</td>
                <td className="tabular px-4 py-3 text-muted">{formatUsd(transaction.amountUsd)}</td>
                <td className="tabular px-4 py-3 text-muted">{formatUsd(transaction.feeUsd)}</td>
                <td className="px-4 py-3">
                  <Badge tone={STATUS_TONE[transaction.status]} size="sm">
                    {transaction.status.replaceAll("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted">{formatDate(transaction.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AdminTableShell>

      <p className="rounded-xl border border-line bg-cream-50 p-4 text-[11px] leading-relaxed text-muted">
        The $600 versus $3,600 litter collection rule and the refusal/refund path are open decisions.
        This table does not imply that either has been settled.
      </p>
    </div>
  );
}
