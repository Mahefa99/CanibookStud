import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoPortrait } from "@/components/domain/demo-portrait";
import { ServicesMap } from "@/components/domain/services-map";
import {
  EmergencyBadge,
  ProfessionalLicenseBadge,
  ProfessionalPlanBadge,
  ProfessionalVerificationBadge,
} from "@/components/domain/marketplace-badges";
import { Alert } from "@/components/ui/feedback";
import { Button, ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Breadcrumbs } from "@/components/ui/page-header";
import { professionalCategoryLabel } from "@/lib/config/professional-categories";
import { DEMO_PROFESSIONALS } from "@/lib/data/demo/professionals";
import { formatUsd } from "@/lib/utils";

type ProfessionalPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DEMO_PROFESSIONALS.map((professional) => ({ slug: professional.slug }));
}

export async function generateMetadata({ params }: ProfessionalPageProps): Promise<Metadata> {
  const { slug } = await params;
  const professional = DEMO_PROFESSIONALS.find((entry) => entry.slug === slug);
  if (!professional) return { title: "Business not found" };
  return {
    title: `${professional.name} — ${professionalCategoryLabel(professional.category)}`,
    description: `${professional.description} Sample business profile in ${professional.address.city}, ${professional.address.stateCode}. Pricing to be confirmed.`,
  };
}

export default async function ProfessionalPage({ params }: ProfessionalPageProps) {
  const { slug } = await params;
  const professional = DEMO_PROFESSIONALS.find((entry) => entry.slug === slug);
  if (!professional) notFound();
  if (professional.plan === "free") return <div className="shell py-12"><h1 className="font-display text-4xl">Inactive business listing</h1><p className="my-4">This free listing has a locked number and no public profile. Activation requires a paid subscription confirmed by the server.</p><ButtonLink href="/dashboard/services/new">Activate my number</ButtonLink></div>;

  return (
    <>
      <div className="border-b border-line bg-cream-50">
        <div className="shell py-6 lg:py-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Pet services", href: "/pet-services" },
              {
                label: professionalCategoryLabel(professional.category),
                href: `/pet-services?category=${professional.category}`,
              },
              { label: professional.name },
            ]}
          />

          <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-[11px] font-semibold text-muted">
                  <Icon name="paw" className="h-3 w-3" />
                  {professionalCategoryLabel(professional.category)}
                </span>
                <ProfessionalVerificationBadge status={professional.verification} />
                <ProfessionalLicenseBadge status={professional.licenseCheck} />
                <ProfessionalPlanBadge plan={professional.plan} />
                {professional.emergencyDeclared ? <EmergencyBadge /> : null}
                {professional.recommendedBy ? (
                  <span className="inline-flex items-center gap-1 rounded-full border border-orange-200 bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-800">
                    <Icon name="award" className="h-3.5 w-3.5" />
                    Recommended by {professional.recommendedBy}
                  </span>
                ) : null}
              </div>
              <h1 className="mt-3 font-display text-4xl leading-tight text-navy-900 sm:text-5xl">
                {professional.name}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
                <Icon name="pin" className="h-4 w-4 text-navy-300" />
                {professional.address.city},{" "}
                {professional.address.stateCode}
              </p>
              <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-muted">
                {professional.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <ButtonLink href="/pet-services" variant="secondary" size="sm" iconLeft={<Icon name="arrow-left" className="h-4 w-4" />}>
                All services
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <div className="shell py-8">
        <div className="mb-6">
          <Alert tone="info" title="Contact visibility is still being decided">
            Free listings keep contact details locked. Paid contact access requires a server-confirmed subscription; no real contacts are supplied in this demo.
          </Alert>
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="min-w-0 space-y-8">
            <section aria-labelledby="about-business-heading">
              <h2 id="about-business-heading" className="font-display text-2xl text-navy-900">
                About this business
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {professional.photos.slice(0, 2).map((photo) => (
                  <div key={photo.id} className="overflow-hidden rounded-2xl border border-line bg-white">
                    <DemoPortrait photo={photo} alt={photo.alt} className="aspect-[4/3] w-full" />
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-muted">
                Illustrative images only. This is a fictional business used for design review; it is
                not a real clinic, store or rescue.
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                    <Icon name="clock" className="h-4 w-4 text-navy-400" />
                    Hours
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-[12px] text-muted">
                    {professional.hours.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[10px] leading-relaxed text-muted">
                    Hours are owner-provided. Emergency acceptance does not imply 24/7 opening.
                  </p>
                </div>

                <div className="rounded-2xl border border-line bg-white p-5">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-navy-900">
                    <Icon name="list" className="h-4 w-4 text-navy-400" />
                    Services
                  </h3>
                  <ul className="mt-2 space-y-1.5 text-[12px] text-muted">
                    {professional.services.map((service) => (
                      <li key={service} className="flex items-start gap-1.5">
                        <Icon name="check" className="mt-0.5 h-3 w-3 shrink-0 text-navy-400" />
                        {service}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-[10px] leading-relaxed text-muted">
                    Service prices are not listed because no pricing decision is confirmed.
                  </p>
                </div>
              </div>
            </section>

            <section aria-labelledby="location-business-heading">
              <h2 id="location-business-heading" className="font-display text-2xl text-navy-900">
                Location
              </h2>
              <p className="mt-1 text-sm text-muted">
                Published business address. Confirm the address-display policy before launch.
              </p>
              <div className="mt-4">
                <ServicesMap professionals={[professional]} compact />
              </div>
              <div className="mt-3 rounded-xl border border-line bg-white p-4 text-[12px] leading-relaxed text-muted">
                <p className="font-semibold text-ink">Approximate city location</p>
                <p>
                  {professional.address.city}, {professional.address.stateName}
                </p>
              </div>
            </section>

            <section aria-labelledby="verification-business-heading">
              <h2 id="verification-business-heading" className="font-display text-2xl text-navy-900">
                Verification and plan
              </h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Document review</p>
                  <div className="mt-2">
                    <ProfessionalVerificationBadge status={professional.verification} />
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">
                    This is a document checklist review. It is not a veterinary licence verification
                    or a guarantee of service quality.
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-white p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Licence check (AI mock)</p>
                  <div className="mt-2">
                    <ProfessionalLicenseBadge status={professional.licenseCheck} />
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">
                    A mock AI check on the business licence. It is not a legal verification and is
                    independent of the plan.
                  </p>
                </div>
                <div className="rounded-2xl border border-line bg-white p-5 sm:col-span-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Plan</p>
                  <div className="mt-2">
                    <ProfessionalPlanBadge plan={professional.plan} />
                  </div>
                  <p className="mt-2 text-[11px] leading-relaxed text-muted">
                    Visibility and pin style follow the plan. A paid plan never changes the document
                    review or the licence check.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="rounded-2xl border border-line bg-white p-5 shadow-card">
              <h2 className="font-display text-xl text-navy-900">Contact</h2>
              <div className="mt-3 space-y-2 rounded-xl border border-dashed border-line bg-cream-50 p-3 text-[11px] leading-relaxed text-muted">
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <Icon name="lock" className="h-3.5 w-3.5" />
                  Phone and email hidden
                </p>
                <p>
                  Free-plan contact visibility is an open decision. No contact detail is invented for
                  this sample profile.
                </p>
              </div>
              <div className="mt-3">
                <Button fullWidth disabled>
                  Contact business — unavailable
                </Button>
              </div>
              <p className="mt-2 text-center text-[10px] text-muted">
                No messaging or booking integration is connected.
              </p>

              <div className="mt-4 border-t border-line pt-4">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">Emergency</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">
                  {professional.emergencyDeclared
                    ? "The business declared that it accepts emergencies. Call ahead; this is not a 24/7 claim."
                    : "No emergency acceptance is declared for this sample business."}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-cream-50 p-5">
              <h2 className="font-display text-lg text-navy-900">Is this your business?</h2>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                Claiming a profile and choosing a plan will be connected with the professional account
                flow. Pricing is not available yet.
              </p>
              <ButtonLink href="/signup" variant="secondary" size="sm" className="mt-3">
                Preview the account flow
              </ButtonLink>
            </div>

            <p className="rounded-xl border border-line bg-cream-50 p-3 text-[10px] leading-relaxed text-muted">
              No advertising is shown on this professional profile. Advertising on professional pages
              remains undecided and is omitted from the prototype.
            </p>
          </aside>
        </div>
      </div>
    </>
  );
}
