import { BulkImportWorkspace } from "@/components/forms/bulk-import-workspace";
export const metadata = { title: "Owner KYC & multiple dog import" };
export default function ImportPage() {
  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Breeder workspace</p>
        <h1 className="mt-3 font-display text-4xl text-navy-900">
          One owner. Every dog in view.
        </h1>
        <p className="mt-3 text-muted">
          KYC checklist, local CSV import and individual verification.
          Demonstration only.
        </p>
      </header>
      <BulkImportWorkspace />
    </div>
  );
}
