"use client";

import Link from "next/link";
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
import type { DamSummary, Stud } from "@/lib/types/domain";
import { addDays, formatDate, formatUsd, hashString } from "@/lib/utils";

const SERVICE_FEE = 600;
const READINESS_DAYS = 56;

interface LitterDraft {
  title: string;
  breed: string;
  damId: string;
  sireSlug: string;
  birthDate: string;
  puppyCount: string;
  puppyPrice: string;
  description: string;
  plan: "free" | "premium";
  newLitter: boolean;
}

export function LitterCreateForm({
  dams,
  studs,
  referenceDate,
}: {
  dams: DamSummary[];
  studs: Stud[];
  referenceDate: string;
}) {
  const [draft, setDraft] = useState<LitterDraft>({
    title: "",
    breed: "French Bulldog",
    damId: dams[0]?.id ?? "",
    sireSlug: "",
    birthDate: "2026-10-25",
    puppyCount: "4",
    puppyPrice: "3000",
    description: "",
    plan: "free",
    newLitter: true,
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [accuracy, setAccuracy] = useState(false);
  const [delivery, setDelivery] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const readyDate = draft.birthDate ? addDays(draft.birthDate, READINESS_DAYS) : "";
  const total = Number(draft.puppyPrice) + SERVICE_FEE;
  const selectedDam = dams.find((dam) => dam.id === draft.damId);

  function update<K extends keyof LitterDraft>(field: K, value: LitterDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!draft.title.trim()) next.title = "Enter a litter title.";
    if (!draft.breed) next.breed = "Select a breed.";
    if (!draft.damId) next.damId = "Select the dam.";
    if (!draft.sireSlug) next.sireSlug = "Select the sire.";
    if (!draft.birthDate) next.birthDate = "Enter the birth date.";
    else if (draft.birthDate > referenceDate) next.birthDate = "The birth date cannot be in the future.";
    const count = Number(draft.puppyCount);
    if (!Number.isInteger(count) || count < 1 || count > 12) next.puppyCount = "Use a whole number from 1 to 12.";
    const price = Number(draft.puppyPrice);
    if (!Number.isFinite(price) || price < 500 || price > 10_000) next.puppyPrice = "Use a price between $500 and $10,000.";
    if (!accuracy) next.accuracy = "Confirm that the litter information is accurate.";
    if (!delivery) next.delivery = "Acknowledge the pick-up rule.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById("litter-create-errors")?.focus();
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
    const reference = `LIT-2026-${1000 + (hashString(draft.title + draft.birthDate) % 9000)}`;
    return (
      <div role="status" className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-orange-100 text-orange-700">
          <Icon name="clock" className="h-5 w-5" />
        </span>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-700">
          Submitted for review · demo only
        </p>
        <h2 className="mt-1 font-display text-2xl text-navy-900">{draft.title} is in the review queue</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          No listing was published, no image was uploaded and no payment was taken. The sample status
          is “in review”.
        </p>
        <dl className="mt-4 space-y-2 rounded-xl bg-cream-50 p-4 text-[12px]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Reference</dt>
            <dd className="tabular font-semibold text-ink">{reference}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Dam / sire</dt>
            <dd className="font-medium text-ink">
              {selectedDam?.name ?? "—"} / {studs.find((stud) => stud.slug === draft.sireSlug)?.name ?? "—"}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Total per puppy</dt>
            <dd className="tabular font-semibold text-ink">{formatUsd(total)}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="warning">In review</Badge>
          <Badge tone="neutral">Not published</Badge>
          <Badge tone="neutral">No payment</Badge>
        </div>
        <Alert tone="info" className="mt-4" title="What would happen next in production">
          A manual content review would check readiness, photos and puppy identities. The premium
          subscription (pricing to be confirmed) would be billed only after approval.
        </Alert>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/dashboard/listings"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy-700 px-4 text-sm font-semibold text-white"
          >
            Back to listings
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard/litters/new"
            className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-navy-800"
          >
            Create another
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div id="litter-create-errors" tabIndex={-1}>
        <FormErrorSummary
          errors={Object.entries(errors).map(([fieldId, message]) => ({ fieldId, message }))}
        />
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Litter details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            id="title"
            name="title"
            label="Litter title"
            required
            value={draft.title}
            onChange={(event) => update("title", event.target.value)}
            error={errors.title}
            placeholder="e.g. Cedar & Stone Fall Litter"
          />
          <SelectField
            id="breed"
            name="breed"
            label="Breed"
            required
            value={draft.breed}
            onChange={(event) => update("breed", event.target.value)}
            error={errors.breed}
            options={["French Bulldog", "Labrador Retriever", "Golden Retriever", "German Shepherd Dog", "Boston Terrier", "English Bulldog"].map((breed) => ({ value: breed, label: breed }))}
          />
          <SelectField
            id="damId"
            name="damId"
            label="Dam"
            required
            value={draft.damId}
            onChange={(event) => update("damId", event.target.value)}
            error={errors.damId}
            placeholder="Select a dam"
            options={dams.map((dam) => ({ value: dam.id, label: `${dam.name} · ${dam.breed}` }))}
          />
          <SelectField
            id="sireSlug"
            name="sireSlug"
            label="Sire"
            required
            value={draft.sireSlug}
            onChange={(event) => update("sireSlug", event.target.value)}
            error={errors.sireSlug}
            placeholder="Select a stud"
            options={studs.map((stud) => ({ value: stud.slug, label: `${stud.name} · ${stud.breed}` }))}
          />
          <TextField
            id="birthDate"
            name="birthDate"
            type="date"
            label="Birth date"
            required
            max={referenceDate}
            value={draft.birthDate}
            onChange={(event) => update("birthDate", event.target.value)}
            error={errors.birthDate}
            hint={readyDate ? `Sample readiness date: ${formatDate(readyDate)} (birth + 56 days).` : undefined}
          />
          <TextField
            id="puppyCount"
            name="puppyCount"
            type="number"
            min="1"
            max="12"
            label="Puppies in the litter"
            required
            value={draft.puppyCount}
            onChange={(event) => update("puppyCount", event.target.value)}
            error={errors.puppyCount}
            hint="Each puppy will need its own identifier and status."
          />
          <TextField
            id="puppyPrice"
            name="puppyPrice"
            type="number"
            min="500"
            max="10000"
            label="Puppy price (USD)"
            required
            prefix="$"
            value={draft.puppyPrice}
            onChange={(event) => update("puppyPrice", event.target.value)}
            error={errors.puppyPrice}
            hint="Set by the breeder. The platform service fee is added separately."
          />
          <div className="rounded-xl border border-line bg-cream-50 p-3 text-[11px] leading-relaxed text-muted">
            <p className="font-semibold text-ink">Price breakdown</p>
            <p className="mt-1">
              Puppy {formatUsd(Number(draft.puppyPrice) || 0)} + service fee {formatUsd(SERVICE_FEE)} ={" "}
              <span className="tabular font-semibold text-ink">{formatUsd(total)}</span>.
            </p>
            <p className="mt-1">Whether the platform collects $600 or the full total is still undecided.</p>
          </div>
        </div>

        <div className="mt-4">
          <TextareaField
            id="description"
            name="description"
            label="About the litter"
            required
            rows={4}
            value={draft.description}
            onChange={(event) => update("description", event.target.value.slice(0, 1200))}
            error={errors.description}
            hint={`${draft.description.length}/1200 characters.`}
            placeholder="Home environment, routine, health notes and what a buyer should know."
          />
        </div>

        <div className="mt-4">
          <FileDropzone
            id="litter-photos"
            label="Photos"
            hint="Up to 10 images. Files stay in the browser and are not uploaded."
            files={photos}
            onChange={setPhotos}
            accept=".jpg,.jpeg,.png,.webp"
            maxFiles={10}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Listing plan</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {[
            {
              id: "free" as const,
              title: "Free · 7 days",
              body: "Bottom placement, no reservation button. Contact the breeder only.",
            },
            {
              id: "premium" as const,
              title: "Premium",
              body: "Top placement, gold badge and reservation button. V12 monthly subscription; no payment in this preview.",
            },
          ].map((plan) => (
            <label
              key={plan.id}
              className={
                draft.plan === plan.id
                  ? "cursor-pointer rounded-xl border-2 border-navy-700 bg-navy-50/40 p-4"
                  : "cursor-pointer rounded-xl border border-line bg-white p-4 hover:border-navy-300"
              }
            >
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="plan"
                  value={plan.id}
                  checked={draft.plan === plan.id}
                  onChange={() => update("plan", plan.id)}
                  className="h-4 w-4 accent-navy-700"
                />
                <span className="text-sm font-semibold text-navy-900">{plan.title}</span>
              </span>
              <span className="mt-1 block text-[11px] leading-relaxed text-muted">{plan.body}</span>
              {plan.id === "premium" ? (
                <Badge tone="warning" size="sm" className="mt-2">
                  V12 subscription / payment preview
                </Badge>
              ) : null}
            </label>
          ))}
        </div>
        <p className="mt-3 text-[10px] leading-relaxed text-muted">
          The premium plan is not charged in this preview. No subscription is started.
        </p>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Confirmations</h2>
        <div className="mt-3 space-y-3">
          <CheckboxField
            id="accuracy"
            name="accuracy"
            checked={accuracy}
            onChange={(event) => setAccuracy(event.target.checked)}
            error={errors.accuracy}
            required
            label="I confirm the litter information is accurate and the puppies will be at least 8 weeks old before pick-up."
          />
          <CheckboxField
            id="delivery"
            name="delivery"
            checked={delivery}
            onChange={(event) => setDelivery(event.target.checked)}
            error={errors.delivery}
            required
            label="I understand the platform does not deliver animals; pick-up is arranged directly with the buyer."
          />
        </div>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-sm text-[10px] leading-relaxed text-muted">
          Review is manual. No image upload, payment or publication happens in this preview.
        </p>
        <Button type="submit" size="lg" iconRight={<Icon name="arrow-right" className="h-4 w-4" />}>
          Submit litter for review
        </Button>
      </div>
    </form>
  );
}
