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
import { DEMO_BREEDS } from "@/lib/data/demo/breeds";
import { US_STATES } from "@/lib/data/us-states";
import { hashString } from "@/lib/utils";

interface ClubDraft {
  name: string;
  website: string;
  email: string;
  city: string;
  stateCode: string;
  breedFocus: string;
  description: string;
  parentClaim: boolean;
}

const EMPTY: ClubDraft = {
  name: "",
  website: "",
  email: "",
  city: "",
  stateCode: "",
  breedFocus: "",
  description: "",
  parentClaim: false,
};

export function ClubCreateForm() {
  const [draft, setDraft] = useState<ClubDraft>(EMPTY);
  const [logo, setLogo] = useState<File[]>([]);
  const [proof, setProof] = useState<File[]>([]);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  function update<K extends keyof ClubDraft>(field: K, value: ClubDraft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!draft.name.trim()) next.name = "Enter the club name.";
    try {
      const url = new URL(draft.website);
      if (!url.hostname.endsWith(".org")) next.website = "Use a .org website for this preview.";
    } catch {
      next.website = "Enter a valid .org website.";
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(draft.email)) {
      next.email = "Enter a valid club email.";
    } else if (!draft.email.toLowerCase().endsWith(".org")) {
      next.email = "The sample requires a .org email domain.";
    }
    if (!draft.city.trim()) next.city = "Enter the city.";
    if (!draft.stateCode) next.stateCode = "Select a state.";
    if (!draft.description.trim() || draft.description.trim().length < 40) {
      next.description = "Write at least 40 characters about the club.";
    }
    if (!consent) next.consent = "Confirm the manual review and accuracy statements.";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById("club-create-errors")?.focus();
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
    const reference = `CLB-2026-${1000 + (hashString(draft.name + draft.email) % 9000)}`;
    return (
      <div role="status" className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-info-50 text-info-700">
          <Icon name="award" className="h-5 w-5" />
        </span>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-info-700">
          Manual review · demo only
        </p>
        <h2 className="mt-1 font-display text-2xl text-navy-900">{draft.name} is in the review queue</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          No club page is published, no domain lookup was performed and no logo was uploaded. A human
          reviewer would verify the domain, the club email and any parent-club claim.
        </p>
        <dl className="mt-4 space-y-2 rounded-xl bg-cream-50 p-4 text-[12px]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Reference</dt>
            <dd className="tabular font-semibold text-ink">{reference}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Website</dt>
            <dd className="font-medium text-ink">{draft.website}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Parent-club claim</dt>
            <dd className="font-medium text-ink">{draft.parentClaim ? "Claimed, unverified" : "Not claimed"}</dd>
          </div>
        </dl>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone="warning">Manual review</Badge>
          <Badge tone="neutral">No AI check</Badge>
          <Badge tone="neutral">Not published</Badge>
        </div>
        <Alert tone="info" className="mt-4" title="No automation">
          The .org email and website are validated for format only. A real review must check the
          domain, the parent-club source and the person requesting club access.
        </Alert>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/clubs" className="inline-flex min-h-10 items-center gap-2 rounded-full bg-navy-700 px-4 text-sm font-semibold text-white">
            Public clubs
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
          <Link href="/dashboard/club" className="inline-flex min-h-10 items-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-navy-800">
            Club workspace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div id="club-create-errors" tabIndex={-1}>
        <FormErrorSummary
          errors={Object.entries(errors).map(([fieldId, message]) => ({ fieldId, message }))}
        />
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Club identity</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <TextField
            id="name"
            name="name"
            label="Club name"
            required
            value={draft.name}
            onChange={(event) => update("name", event.target.value)}
            error={errors.name}
            className="sm:col-span-2"
          />
          <TextField
            id="website"
            name="website"
            type="url"
            label="Website"
            required
            value={draft.website}
            onChange={(event) => update("website", event.target.value)}
            error={errors.website}
            placeholder="https://example.org"
            hint="A .org domain is expected by the source rule."
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Club email"
            required
            value={draft.email}
            onChange={(event) => update("email", event.target.value)}
            error={errors.email}
            placeholder="contact@example.org"
            hint="Format checked only; no email is sent."
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
            options={US_STATES.map((state) => ({ value: state.code, label: state.name }))}
          />
          <SelectField
            id="breedFocus"
            name="breedFocus"
            label="Primary breed focus"
            optionalLabel="optional"
            value={draft.breedFocus}
            onChange={(event) => update("breedFocus", event.target.value)}
            placeholder="All breeds"
            options={DEMO_BREEDS.map((breed) => ({ value: breed.name, label: breed.name }))}
          />
        </div>

        <div className="mt-4">
          <TextareaField
            id="description"
            name="description"
            label="About the club"
            required
            rows={4}
            value={draft.description}
            onChange={(event) => update("description", event.target.value.slice(0, 800))}
            error={errors.description}
            hint={`${draft.description.length}/800 characters. Minimum 40.`}
          />
        </div>

        <div className="mt-4">
          <CheckboxField
            id="parentClaim"
            name="parentClaim"
            checked={draft.parentClaim}
            onChange={(event) => update("parentClaim", event.target.checked)}
            label="The club claims AKC Parent Club status."
            hint="A claim only. No AKC list or parent-club source is checked in this preview."
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2 className="font-display text-2xl text-navy-900">Logo and supporting document</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <FileDropzone
            id="club-logo"
            label="Logo"
            hint="Local preview only; JPG, PNG or WebP."
            files={logo}
            onChange={setLogo}
          />
          <FileDropzone
            id="club-proof"
            label="Parent-club proof"
            hint="Optional private document. No upload in this preview."
            files={proof}
            onChange={setProof}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <CheckboxField
          id="consent"
          name="consent"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          error={errors.consent}
          required
          label="I confirm I am authorised to represent this club and understand the review is manual, with no AI approval."
        />
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="max-w-sm text-[10px] leading-relaxed text-muted">
          No .org lookup, no email is sent and no logo is uploaded in this preview.
        </p>
        <Button type="submit" size="lg" iconRight={<Icon name="arrow-right" className="h-4 w-4" />}>
          Submit club for review
        </Button>
      </div>
    </form>
  );
}
