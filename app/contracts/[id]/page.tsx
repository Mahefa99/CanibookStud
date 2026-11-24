import { DeliveryOptions } from "@/components/forms/delivery-options";
import { STUD_PRICING, PUPPY_PRICING } from "@/lib/config/pricing";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@/components/ui/feedback";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { formatUsd } from "@/lib/utils";

const CONTRACT = {
  id: "CB-2026-1042",
  status: "draft",
  stud: "Marlo · French Bulldog",
  dam: "Nora · French Bulldog",
  studOwner: "Jordan Ellis · Austin, TX",
  damOwner: "Morgan Lee · Baton Rouge, LA",
  studFeeUsd: STUD_PRICING.studFeeUsd,
  requestFeeUsd: STUD_PRICING.depositUsd,
  sections: [
    ["1. Identification", "Both animals, their registration details and both owners are identified."],
    ["2. Fees", "The deposit is applied toward the stud fee. The balance is held before mating; release requires confirmation by both parties. A separate non-refundable platform service fee applies. All amounts follow the V12 order summary."],
    ["3. Health records", "Brucellosis test dates and document status are recorded; no health guarantee is created."],
    ["4. Care and transport", "The female owner arranges transport. The male owner provides care during the arrangement."],
    ["5. No delivery", "The platform does not deliver animals. Pick-up is arranged directly between the parties."],
    ["6. Repeat breeding", "One free repeat within six months only if never pregnant, supported by a day-30 ultrasound and progesterone evidence. No repeat after pregnancy followed by loss. A new agreement records the repeat and whether a further service fee applies."],
    ["7. Platform role", "The platform is not a party to the agreement and provides contract tooling only."],
    ["8. Signatures", "E-signature, timestamps and audit storage are not connected in this preview."],
  ],
};

type ContractPageProps = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return [{ id: CONTRACT.id }, { id: "CB-PUPPY-2026-1042" }];
}

export async function generateMetadata({ params }: ContractPageProps): Promise<Metadata> {
  const { id } = await params;
  return { title: [CONTRACT.id, "CB-PUPPY-2026-1042"].includes(id) ? "Contract preview" : "Contract not found", robots: { index: false } };
}

export default async function ContractPage({ params }: ContractPageProps) {
  const { id } = await params;
  if (![CONTRACT.id, "CB-PUPPY-2026-1042"].includes(id)) notFound();
  const puppy = id === "CB-PUPPY-2026-1042";
  const sections = puppy ? [
    ["1. Puppy identification", "The agreement identifies the litter, individual puppy, sex, colour, 15-digit microchip, parents, breeder and buyer. This sample contains no real identity data."],
    ["2. Price and acceptance", "The configured puppy price and platform service fee are recorded separately. A contract requires confirmed payment and breeder acceptance."],
    ["3. Readiness and health", "Handover must meet the platform readiness rule (birth date plus 56 days). Review vaccinations, deworming, veterinary check and the required current health certificate before handover."],
    ["4. Health and genetic claims", "The client brief provides a 72-hour veterinary health claim, one-year genetic claim with laboratory and veterinary evidence, and 30-day insurance. These clauses require legal and operational review; no insurance policy is issued by this preview."],
    ["5. Pick-up or approved delivery", "Pick-up is the default. Delivery remains disabled until transporters and prices are approved. The server starts escrow timing from confirmed handover, not a planned date."],
    ["6. Return and platform role", "The proposed agreement provides return to the breeder rather than a shelter and requires written agreement for resale. The platform is not a party to the animal sale. Mediation precedes any further dispute process."],
    ["7. Signatures", "Breeder and buyer signatures, timestamps and evidence are not connected. The exact address remains private until an authorized signed agreement exists."]
  ] : CONTRACT.sections;

  return (
    <div className="shell py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Contracts", href: "/dashboard/contracts" },
          { label: id },
        ]}
      />

      <div className="mx-auto mt-6 max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="warning" icon="file">
            Draft · not signed
          </Badge>
          <Badge tone="neutral" icon="info">
            Sample contract
          </Badge>
        </div>
        <h1 className="mt-3 font-display text-4xl leading-tight text-navy-900">{puppy ? "Puppy sale agreement" : "Breeding agreement"}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Contract {id} · a layout preview. The text is not legal advice and must be reviewed
          before use.
        </p>

        <div className="mt-5">
          <Alert tone="warning" title="Draft for legal review">
            No clause is final. Generation, e-signature, storage and identity verification are not
            connected. Payment, acceptance, contract and payout remain separate states.
          </Alert>
        </div>

        <section className="mt-5 rounded-2xl border border-line bg-white p-6 shadow-card">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl bg-cream-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{puppy ? "Individual puppy" : "Stud"}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{puppy ? "Sample puppy / identity pending" : CONTRACT.stud}</p>
              <p className="mt-0.5 text-[11px] text-muted">{CONTRACT.studOwner}</p>
            </div>
            <div className="rounded-xl bg-cream-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{puppy ? "Buyer / sample agreement" : "Dam"}</p>
              <p className="mt-1 text-sm font-semibold text-ink">{CONTRACT.dam}</p>
              <p className="mt-0.5 text-[11px] text-muted">{CONTRACT.damOwner}</p>
            </div>
            <div className="rounded-xl bg-cream-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{puppy ? "Puppy price" : "Stud fee"}</p>
              <p className="tabular mt-1 text-sm font-semibold text-ink">{formatUsd(puppy ? PUPPY_PRICING.puppyPriceUsd : CONTRACT.studFeeUsd)}</p>
            </div>
            <div className="rounded-xl bg-cream-50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{puppy ? "Platform service fee" : "Deposit applied to stud fee"}</p>
              <p className="tabular mt-1 text-sm font-semibold text-ink">{formatUsd(puppy ? PUPPY_PRICING.serviceFeeUsd : CONTRACT.requestFeeUsd)}</p>
            </div>
          </div>

          <div className="my-4 rounded-xl bg-cream-50 p-4 text-sm">Service fee: {formatUsd(puppy ? PUPPY_PRICING.serviceFeeUsd : STUD_PRICING.serviceFeeUsd)} / Escrow amount: {formatUsd(puppy ? PUPPY_PRICING.puppyPriceUsd : STUD_PRICING.balanceUsd)} / Total: {formatUsd(puppy ? PUPPY_PRICING.totalUsd : STUD_PRICING.totalUsd)}</div>
          {puppy ? <DeliveryOptions /> : null}
          <div className="mt-6 space-y-4">
            {sections.map(([title, body]) => (
              <div key={title} className="border-t border-line pt-4">
                <h2 className="text-sm font-semibold text-navy-900">{title}</h2>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{body}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 rounded-xl border border-line bg-cream-50 p-4 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{puppy ? "Breeder signature" : "Stud owner signature"}</p>
              <p className="mt-2 font-display text-lg text-muted">Not signed</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{puppy ? "Buyer signature" : "Dam owner signature"}</p>
              <p className="mt-2 font-display text-lg text-muted">Not signed</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button variant="secondary" disabled>
              Sign contract — unavailable
            </Button>
            <Button variant="ghost" disabled>
              Download PDF — unavailable
            </Button>
          </div>
          <p className="mt-2 text-[10px] leading-relaxed text-muted">
            No private document URL is generated. In production, signed copies must use short-lived,
            authorised links.
          </p>
        </section>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/dashboard/contracts"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 underline underline-offset-4"
          >
            <Icon name="arrow-left" className="h-4 w-4" />
            Back to contracts
          </Link>
          <Link href="/demo" className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 underline underline-offset-4">
            What is simulated?
          </Link>
        </div>
      </div>
    </div>
  );
}
