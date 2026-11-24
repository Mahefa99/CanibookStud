"use client";

import Link from "next/link";
import { PROFESSIONAL_PRICING } from "@/lib/config/pricing";
import { formatUsd } from "@/lib/utils";
import { useState } from "react";
import { Alert } from "@/components/ui/feedback";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { FileDropzone } from "@/components/forms/file-dropzone";
import {
  CheckboxField,
  FormErrorSummary,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/forms/fields";
import { PROFESSIONAL_CATEGORIES } from "@/lib/config/professional-categories";
import { US_STATES } from "@/lib/data/us-states";
import type { ProfessionalCategory } from "@/lib/types/marketplace";
import { hashString } from "@/lib/utils";

interface ProfessionalDraft {
  name: string;
  category: ProfessionalCategory | "";
  street: string;
  city: string;
  stateCode: string;
  zip: string;
  email: string;
  phone: string;
  website: string;
  hours: string;
  services: string;
  emergency: boolean;
  description: string;
}

const EMPTY: ProfessionalDraft = {
  name: "",
  category: "",
  street: "",
  city: "",
  stateCode: "",
  zip: "",
  email: "",
  phone: "",
  website: "",
  hours: "",
  services: "",
  emergency: false,
  description: "",
};

export function ProfessionalCreateForm() {
  const [draft, setDraft] = useState<ProfessionalDraft>(EMPTY);
  const [license, setLicense] = useState<File[]>([]);
  const [insurance, setInsurance] = useState<File[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [plan, setPlan] = useState("free");
  const [boost, setBoost] = useState(false);
  const [review, setReview] = useState("in_review");

  function update<K extends keyof ProfessionalDraft>(
    field: K,
    value: ProfessionalDraft[K],
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!draft.name.trim()) next.name = "Enter the business name.";
    if (!draft.category) next.category = "Select a category.";
    if (!draft.street.trim()) next.street = "Enter the business address.";
    if (!draft.city.trim()) next.city = "Enter the city.";
    if (!draft.stateCode) next.stateCode = "Select a state.";
    if (!/^\d{5}$/.test(draft.zip)) next.zip = "Enter a 5-digit ZIP code.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(draft.email))
      next.email = "Enter a valid business email.";
    if (!draft.description.trim() || draft.description.trim().length < 40) {
      next.description = "Write at least 40 characters about the business.";
    }
    if (review === "refused")
      next.license = "Resubmit refused documents before review.";
    if (!consent)
      next.consent = "Confirm the manual review and accuracy statements.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById("professional-create-errors")?.focus();
      return false;
    }
    return true;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (submitted) {
    const reference = `PRO-2026-${1000 + (hashString(draft.name + draft.zip) % 9000)}`;
    return (
      <div
        role="status"
        className="rounded-2xl border border-line bg-white p-6 shadow-card"
      >
        <span className="grid h-11 w-11 place-items-center rounded-full bg-info-50 text-info-700">
          <Icon name="file" className="h-5 w-5" />
        </span>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-info-700">
          Manual review · demo only
        </p>
        <h2 className="mt-1 font-display text-2xl text-navy-900">
          {draft.name} is in the review queue
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          No business is published, no document is uploaded and no plan is
          charged. A human reviewer would check the documents against the
          platform checklist.
        </p>
        <dl className="mt-4 space-y-2 rounded-xl bg-cream-50 p-4 text-[12px]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Reference</dt>
            <dd className="tabular font-semibold text-ink">{reference}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Category</dt>
            <dd className="font-medium text-ink">
              {PROFESSIONAL_CATEGORIES.find(
                (entry) => entry.id === draft.category,
              )?.label ?? "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Plan</dt>
            <dd className="font-medium text-ink">
              {plan} {boost && plan !== "free" ? "+ Boost" : ""} / no payment
            </dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="warning">Manual review</Badge>
          <Badge tone="neutral">Documents private</Badge>
          <Badge tone="neutral">No payment</Badge>
        </div>
        <Alert tone="info" className="mt-4" title="No automated verification">
          This workflow is intentionally manual. There is no AI check, no
          licence API and no automatic approval.
        </Alert>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/dashboard/business"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy-700 px-4 text-sm font-semibold text-white"
          >
            Back to My Business
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
          <Link
            href="/pet-services"
            className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-navy-800"
          >
            Public directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <section className="surface p-5">
        <h2 className="font-display text-2xl">Professional visibility</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="field-label">
            Plan
            <select
              className="form-input"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
            >
              <option value="free">Free - locked number / grey point</option>
              <option value="standard">
                Standard - {formatUsd(PROFESSIONAL_PRICING.standard.amountUsd)}
                /month
              </option>
              <option value="premium">
                Premium - {formatUsd(PROFESSIONAL_PRICING.premium.amountUsd)}
                /year
              </option>
            </select>
          </label>
          <label className="field-label">
            Simulated document review
            <select
              className="form-input"
              value={review}
              onChange={(e) => setReview(e.target.value)}
            >
              <option value="in_review">In review (50-80%)</option>
              <option value="approved">Sample eligible score above 80%</option>
              <option value="refused">Refused (below 50%)</option>
            </select>
          </label>
        </div>
        <label className="my-3 flex gap-2 text-sm">
          <input
            type="checkbox"
            disabled={plan === "free"}
            checked={boost && plan !== "free"}
            onChange={(e) => setBoost(e.target.checked)}
          />
          Boost +{formatUsd(PROFESSIONAL_PRICING.boost.amountUsd)}/month,
          optional for 30 days
        </label>
        <p role="status" className="text-sm">
          {plan === "free"
            ? "Inactive grey point. Number locked and profile inactive."
            : review === "refused"
              ? "Document refusal: payment blocked. Resubmit evidence."
              : "Category colour after confirmed payment; gold when Boost is active. No real verification or payment in this preview."}
        </p>
      </section>
      <div id="professional-create-errors" tabIndex={-1}>
        <FormErrorSummary
          errors={Object.entries(errors).map(([fieldId, message]) => ({
            fieldId,
            message,
          }))}
        />
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">
          Business identity
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            id="name"
            name="name"
            label="Business name"
            required
            value={draft.name}
            onChange={(event) => update("name", event.target.value)}
            error={errors.name}
          />
          <SelectField
            id="category"
            name="category"
            label="Category"
            required
            value={draft.category}
            onChange={(event) =>
              update("category", event.target.value as ProfessionalCategory)
            }
            error={errors.category}
            placeholder="Select a category"
            options={PROFESSIONAL_CATEGORIES.map((category) => ({
              value: category.id,
              label: category.label,
            }))}
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Business email"
            required
            value={draft.email}
            onChange={(event) => update("email", event.target.value)}
            error={errors.email}
            hint="Not displayed publicly in this preview."
          />
          <TextField
            id="phone"
            name="phone"
            type="tel"
            label="Business phone"
            optionalLabel="optional"
            value={draft.phone}
            onChange={(event) => update("phone", event.target.value)}
            hint="Contact visibility is an open decision."
          />
          <TextField
            id="website"
            name="website"
            type="url"
            label="Website"
            optionalLabel="optional"
            value={draft.website}
            onChange={(event) => update("website", event.target.value)}
            placeholder="https://example.com"
          />
          <TextField
            id="zip"
            name="zip"
            label="ZIP"
            required
            inputMode="numeric"
            maxLength={5}
            value={draft.zip}
            onChange={(event) => update("zip", event.target.value)}
            error={errors.zip}
          />
          <TextField
            id="street"
            name="street"
            label="Street address"
            required
            value={draft.street}
            onChange={(event) => update("street", event.target.value)}
            error={errors.street}
            className="sm:col-span-2"
          />
          <TextField
            id="city"
            name="city"
            label="City"
            required
            value={draft.city}
            onChange={(event) => update("city", event.target.value)}
            error={errors.city}
          />
          <SelectField
            id="stateCode"
            name="stateCode"
            label="State"
            required
            value={draft.stateCode}
            onChange={(event) => update("stateCode", event.target.value)}
            error={errors.stateCode}
            placeholder="Select a state"
            options={US_STATES.map((state) => ({
              value: state.code,
              label: state.name,
            }))}
          />
        </div>

        <div className="mt-4">
          <TextareaField
            id="description"
            name="description"
            label="About the business"
            required
            rows={4}
            value={draft.description}
            onChange={(event) =>
              update("description", event.target.value.slice(0, 800))
            }
            error={errors.description}
            hint={`${draft.description.length}/800 characters. Minimum 40.`}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextareaField
            id="hours"
            name="hours"
            label="Opening hours"
            rows={3}
            value={draft.hours}
            onChange={(event) => update("hours", event.target.value)}
            placeholder={"Mon–Fri · 8:00 am–6:00 pm\nSat · 9:00 am–1:00 pm"}
          />
          <TextareaField
            id="services"
            name="services"
            label="Services"
            rows={3}
            value={draft.services}
            onChange={(event) => update("services", event.target.value)}
            placeholder={"Wellness exams\nUltrasound\nPuppy checks"}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Documents</h2>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">
          A private business licence and optional insurance document. Files stay
          in the browser.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <FileDropzone
            id="license"
            label="Business licence"
            hint="Private. PDF, JPG or PNG. No upload in this preview."
            files={license}
            onChange={setLicense}
          />
          <FileDropzone
            id="insurance"
            label="Liability insurance"
            hint="Optional; a document on file may support review."
            files={insurance}
            onChange={setInsurance}
          />
        </div>
        <div className="mt-4">
          <FileDropzone
            id="photos"
            label="Business photos"
            hint="Local preview only. Up to 5 images."
            files={photos}
            onChange={setPhotos}
            accept=".jpg,.jpeg,.png,.webp"
            maxFiles={5}
          />
        </div>
        <div className="mt-4">
          <CheckboxField
            id="emergency"
            name="emergency"
            checked={draft.emergency}
            onChange={(event) => update("emergency", event.target.checked)}
            label="The business accepts emergency cases."
            hint="This is a declaration. It does not mean the business is open 24/7."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Plan</h2>
        <p className="mt-2 text-sm font-semibold text-ink">
          {plan} {boost && plan !== "free" ? "+ Boost" : ""} / demo selection
        </p>
        <p className="mt-1 text-[11px] leading-relaxed text-muted">
          V12 prices are configured above. No subscription is created or
          charged. A plan would never create a verification badge.
        </p>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <CheckboxField
          id="consent"
          name="consent"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          error={errors.consent}
          required
          label="I confirm the information is accurate and understand that the documents will be reviewed manually, with no AI approval."
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-sm text-[10px] leading-relaxed text-muted">
          No document is uploaded, no plan is charged and no verification is
          automatic.
        </p>
        <Button
          type="submit"
          size="lg"
          iconRight={<Icon name="arrow-right" className="h-4 w-4" />}
        >
          Submit for manual review
        </Button>
      </div>
    </form>
  );
}
