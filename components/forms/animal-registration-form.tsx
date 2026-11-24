"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/feedback";
import { Icon } from "@/components/ui/icon";
import { FileDropzone } from "@/components/forms/file-dropzone";
import {
  CheckboxField,
  FormErrorSummary,
  SelectField,
  TextField,
  TextareaField,
} from "@/components/forms/fields";
import { BrucellosisBadge } from "@/components/domain/signal-badges";
import { BREED_OPTIONS } from "@/lib/data/breeds";
import { US_STATES } from "@/lib/data/us-states";
import { FOUNDER_PROGRAM, BREEDER_SUBSCRIPTIONS } from "@/lib/config/pricing";
import { AnimalHealthPanel } from "@/components/forms/animal-health-panel";
const STUD_PLANS = BREEDER_SUBSCRIPTIONS.map((tier) => ({
  ...tier,
  visibility: `${tier.dogLimit ?? "Unlimited"} dogs across all breeds`,
  features: [
    `${tier.dogLimit ?? "Unlimited"} dogs`,
    tier.annualUsd ? `${tier.annualUsd}/year available` : "Free listing",
  ],
}));
import { addDays, daysSince, formatDate, hashString } from "@/lib/utils";

type Mode = "stud" | "dam";

interface Draft {
  name: string;
  breed: string;
  birthDate: string;
  weight: string;
  color: string;
  city: string;
  stateCode: string;
  headline: string;
  description: string;
  akcNumber: string;
  brucellosisDate: string;
  ofaResult: string;
  lastHeatDate: string;
  cycleLength: string;
  plan: "free" | "starter" | "pro" | "unlimited";
}

const EMPTY_DRAFT: Draft = {
  name: "",
  breed: "",
  birthDate: "",
  weight: "",
  color: "",
  city: "",
  stateCode: "",
  headline: "",
  description: "",
  akcNumber: "",
  brucellosisDate: "",
  ofaResult: "",
  lastHeatDate: "",
  cycleLength: "182",
  plan: "free",
};

const AKC_PATTERN = /^[A-Z]{2}\d{8}$/;

/**
 * Multi-step stud/dam registration preview.
 *
 * - Validation is per step and the error summary links to each field.
 * - Non-file values are restored from localStorage after an error or reload.
 * - Files are never uploaded; the picker is a local preview.
 * - Submission only renders a demo "in review" state. Nothing is sent.
 */
export function AnimalRegistrationForm({
  mode,
  referenceDate,
}: {
  mode: Mode;
  referenceDate: string;
}) {
  const isStud = mode === "stud";
  const storageKey = `canibookstud.draft.${mode}.v1`;
  const [draft, setDraft] = useState<Draft>(EMPTY_DRAFT);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [brucellosisFiles, setBrucellosisFiles] = useState<File[]>([]);
  const [healthFiles, setHealthFiles] = useState<File[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [shareConsent, setShareConsent] = useState(false);
  const [termsConsent, setTermsConsent] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [restored, setRestored] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">(
    "idle",
  );
  const [submitted, setSubmitted] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  const steps = isStud
    ? ["Identity", "Records", "Story & photos", "Plan & review"]
    : ["Identity", "Records", "Cycle & privacy", "Review"];

  // Restore a local draft after mounting so server and client markup match.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          const saved = parsed as Partial<Draft> & { step?: number };
          setDraft((current) => ({
            ...current,
            ...saved,
            plan: ["free", "starter", "pro", "unlimited"].includes(
              saved.plan ?? "",
            )
              ? saved.plan!
              : current.plan,
          }));
          if (
            typeof saved.step === "number" &&
            saved.step >= 0 &&
            saved.step < steps.length
          ) {
            setStep(saved.step);
            setMaxStep(saved.step);
          }
          setRestored(true);
        }
      }
    } catch {
      // A corrupted draft should not block the form.
    } finally {
      setHydrated(true);
    }
    // steps.length is stable for a given mode.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    if (!hydrated || submitted) return;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(
          storageKey,
          JSON.stringify({ ...draft, step }),
        );
        setSaveState("saved");
      } catch {
        setSaveState("idle");
      }
    }, 450);
    return () => window.clearTimeout(timer);
  }, [draft, step, hydrated, submitted, storageKey]);

  function update<K extends keyof Draft>(field: K, value: Draft[K]) {
    setDraft((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function focusErrorSummary() {
    window.requestAnimationFrame(() => {
      document.getElementById("registration-errors")?.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function validateStep(currentStep: number): boolean {
    const next: Record<string, string> = {};

    if (currentStep === 0) {
      if (!draft.name.trim()) next.name = "Enter the animal's name.";
      if (!draft.breed) next.breed = "Select a breed.";
      if (!draft.birthDate) next.birthDate = "Enter the date of birth.";
      else if (draft.birthDate > referenceDate)
        next.birthDate = "The date of birth cannot be in the future.";
      const weight = Number(draft.weight);
      if (
        !draft.weight ||
        !Number.isFinite(weight) ||
        weight <= 0 ||
        weight > 250
      ) {
        next.weight = "Enter a weight in pounds between 1 and 250.";
      }
      if (!draft.color.trim()) next.color = "Enter the coat color.";
      if (!draft.city.trim()) next.city = "Enter the city.";
      if (!draft.stateCode) next.stateCode = "Select a state.";
    }

    if (currentStep === 1) {
      const normalized = draft.akcNumber.replace(/\s+/g, "").toUpperCase();
      if (!normalized) next.akcNumber = "Enter the registration number.";
      else if (!AKC_PATTERN.test(normalized)) {
        next.akcNumber =
          "Use two letters followed by eight digits, for example DN12345678.";
      }
      if (!draft.brucellosisDate) {
        next.brucellosisDate = "Enter the brucellosis test date.";
      } else if (draft.brucellosisDate > referenceDate) {
        next.brucellosisDate = "The test date cannot be in the future.";
      }
    }

    if (currentStep === 2 && isStud) {
      if (draft.description.trim().length < 60) {
        next.description =
          "Write at least 60 characters so owners can understand the profile.";
      }
    }

    if (currentStep === 2 && !isStud) {
      if (!draft.lastHeatDate)
        next.lastHeatDate = "Enter the first day of the last recorded heat.";
      else if (draft.lastHeatDate > referenceDate)
        next.lastHeatDate = "The heat date cannot be in the future.";
      const cycle = Number(draft.cycleLength);
      if (!Number.isFinite(cycle) || cycle < 120 || cycle > 365) {
        next.cycleLength = "Use a cycle between 120 and 365 days.";
      }
    }

    if (currentStep === 3) {
      if (!shareConsent) {
        next.shareConsent =
          "Confirm that you are authorized to share these records.";
      }
      if (!termsConsent) {
        next.termsConsent = isStud
          ? "Acknowledge that the plan is not active in this preview."
          : "Acknowledge that this profile is private by default.";
      }
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      focusErrorSummary();
      return false;
    }
    return true;
  }

  /**
   * Persist immediately when the step changes. Waiting for the debounce would
   * restore an older step after a quick reload, which looked like lost input.
   */
  function persistDraft(nextStep: number) {
    try {
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ ...draft, step: nextStep }),
      );
      setSaveState("saved");
    } catch {
      setSaveState("idle");
    }
  }

  function goNext() {
    if (!validateStep(step)) return;
    const nextStep = Math.min(step + 1, steps.length - 1);
    setStep(nextStep);
    setMaxStep((value) => Math.max(value, nextStep));
    persistDraft(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.requestAnimationFrame(() => {
      document.getElementById("registration-step-heading")?.focus();
    });
  }

  function goBack() {
    const nextStep = Math.max(0, step - 1);
    setStep(nextStep);
    persistDraft(nextStep);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function discardDraft() {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage restrictions.
    }
    setDraft(EMPTY_DRAFT);
    setStep(0);
    setMaxStep(0);
    setErrors({});
    setRestored(false);
    setSaveState("idle");
    setBrucellosisFiles([]);
    setHealthFiles([]);
    setPhotos([]);
    setShareConsent(false);
    setTermsConsent(false);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Guard against a submit fired while the step button is being replaced by
    // the final submit button during the same interaction.
    if (step !== steps.length - 1) return;
    if (!validateStep(step)) return;
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      // Ignore storage restrictions.
    }
    setSubmitted(true);
    window.requestAnimationFrame(() => {
      statusRef.current?.focus();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const brucellosisRecord = draft.brucellosisDate
    ? (() => {
        const age = daysSince(draft.brucellosisDate, referenceDate);
        return {
          testDate: draft.brucellosisDate,
          status: age <= 14 ? ("current" as const) : ("expired" as const),
          documentStatus:
            brucellosisFiles.length > 0
              ? ("on_file" as const)
              : ("missing" as const),
          reviewStatus: "in_review" as const,
        };
      })()
    : null;

  const nextHeat =
    draft.lastHeatDate && Number(draft.cycleLength) > 0
      ? addDays(draft.lastHeatDate, Number(draft.cycleLength))
      : null;

  const reference = `${isStud ? "STU" : "DAM"}-2026-${1000 + (hashString(draft.name + draft.birthDate) % 9000)}`;

  if (submitted) {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className="rounded-2xl border border-line bg-white p-6 shadow-card sm:p-8"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-orange-100 text-orange-700">
          <Icon name="clock" className="h-5 w-5" />
        </span>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-orange-700">
          Preview submission · nothing was sent
        </p>
        <h1 className="mt-1 font-display text-3xl leading-tight text-navy-900">
          {draft.name || "Profile"} is ready for review
        </h1>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
          In production this would create a draft profile and a document review
          task. No file was uploaded and no payment was started in this preview.
        </p>

        <dl className="mt-5 space-y-2 rounded-xl bg-cream-50 p-4 text-[13px]">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Reference</dt>
            <dd className="tabular font-semibold text-ink">{reference}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Profile</dt>
            <dd className="font-medium text-ink">
              {draft.name} · {draft.breed}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Plan</dt>
            <dd className="font-medium text-ink">
              {isStud
                ? (STUD_PLANS.find((plan) => plan.id === draft.plan)?.name ??
                  "Free")
                : "Free · no subscription"}
            </dd>
          </div>
        </dl>

        <ul className="mt-5 space-y-3">
          {[
            {
              label: "Profile draft",
              status: "Saved" as const,
              note: "The profile is not public while review is pending.",
            },
            {
              label: "Documents",
              status: "In review" as const,
              note: "The brucellosis date is checked against the listing window; the document is private.",
            },
            {
              label: "Subscription",
              status: "Not started" as const,
              note: "Billing begins only after review and a successful payment.",
            },
            {
              label: isStud ? "Public listing" : "Female profile visibility",
              status: "Private" as const,
              note: isStud
                ? "The profile is hidden from the directory until approved."
                : "Private by default. Nothing is published.",
            },
          ].map((item) => (
            <li
              key={item.label}
              className="flex items-start gap-3 rounded-xl border border-line p-3"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-700">
                <Icon name="check" className="h-4 w-4" />
              </span>
              <div>
                <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
                  {item.label}
                  <Badge tone="neutral" size="sm">
                    {item.status}
                  </Badge>
                </p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
                  {item.note}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <Alert tone="info" className="mt-5" title="Demo state">
          This page is a static preview. There is no backend request, no email
          and no subscription.
        </Alert>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/dashboard/animals"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-navy-700 px-5 text-sm font-semibold text-white hover:bg-navy-800"
          >
            Back to My Animals
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex min-h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-navy-800"
          >
            Dashboard overview
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="rounded-2xl border border-line bg-white p-4 shadow-card sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Step {step + 1} of {steps.length}
          </p>
          <span
            className="flex items-center gap-1.5 text-[10px] text-muted"
            aria-live="polite"
          >
            {saveState === "saved" ? (
              <>
                <Icon name="check" className="h-3 w-3 text-success-600" />
                Draft saved locally
              </>
            ) : saveState === "saving" ? (
              <>
                <Icon name="spinner" className="h-3 w-3 animate-spin" />
                Saving draft…
              </>
            ) : null}
          </span>
        </div>

        <ol className="mt-3 grid grid-cols-4 gap-1.5">
          {steps.map((label, index) => {
            const state =
              index === step ? "current" : index < step ? "complete" : "future";
            return (
              <li key={label}>
                <button
                  type="button"
                  disabled={index > maxStep}
                  onClick={() => {
                    if (index <= maxStep) setStep(index);
                  }}
                  aria-current={state === "current" ? "step" : undefined}
                  className={
                    state === "current"
                      ? "w-full rounded-lg border border-navy-700 bg-navy-700 px-2 py-2 text-left text-white"
                      : state === "complete"
                        ? "w-full rounded-lg border border-navy-200 bg-navy-50 px-2 py-2 text-left text-navy-800 hover:border-navy-400"
                        : "w-full cursor-not-allowed rounded-lg border border-line bg-cream-50 px-2 py-2 text-left text-navy-500"
                  }
                >
                  <span className="flex items-center gap-1.5 text-[10px] font-semibold">
                    <span
                      className={
                        state === "current"
                          ? "tabular grid h-4 w-4 place-items-center rounded-full bg-white/20 text-[9px]"
                          : "tabular grid h-4 w-4 place-items-center rounded-full bg-white text-[9px]"
                      }
                    >
                      {index + 1}
                    </span>
                    <span className="hidden truncate sm:inline">{label}</span>
                  </span>
                  <span className="mt-0.5 block truncate text-[9px] opacity-80 sm:hidden">
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {restored ? (
        <Alert
          tone="info"
          title="Local draft restored"
          action={
            <button
              type="button"
              onClick={() => setRestored(false)}
              className="text-[11px] font-semibold underline underline-offset-2"
            >
              Dismiss
            </button>
          }
        >
          We restored the values saved in this browser. Attached files are not
          stored, so please reattach them if needed.
        </Alert>
      ) : null}

      <div id="registration-errors" tabIndex={-1}>
        <FormErrorSummary
          errors={Object.entries(errors).map(([fieldId, message]) => ({
            fieldId,
            message,
          }))}
        />
      </div>

      <section className="rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <h2
          id="registration-step-heading"
          tabIndex={-1}
          className="font-display text-2xl text-navy-900 outline-none"
        >
          {steps[step]}
        </h2>

        {step === 0 ? (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <TextField
              id="name"
              name="name"
              label="Registered name"
              required
              value={draft.name}
              onChange={(event) => update("name", event.target.value)}
              error={errors.name}
              placeholder="e.g. Marlo"
              autoComplete="off"
            />
            <SelectField
              id="breed"
              name="breed"
              label="Breed"
              required
              value={draft.breed}
              onChange={(event) => update("breed", event.target.value)}
              error={errors.breed}
              placeholder="Select a breed"
              options={BREED_OPTIONS.map((breed) => ({
                value: breed,
                label: breed,
              }))}
            />
            <TextField
              id="birthDate"
              name="birthDate"
              type="date"
              label="Date of birth"
              required
              max={referenceDate}
              value={draft.birthDate}
              onChange={(event) => update("birthDate", event.target.value)}
              error={errors.birthDate}
            />
            <TextField
              id="weight"
              name="weight"
              type="number"
              inputMode="decimal"
              min="1"
              max="250"
              step="0.1"
              label="Weight (lb)"
              required
              value={draft.weight}
              onChange={(event) => update("weight", event.target.value)}
              error={errors.weight}
            />
            <TextField
              id="color"
              name="color"
              label="Coat color"
              required
              value={draft.color}
              onChange={(event) => update("color", event.target.value)}
              error={errors.color}
              placeholder="e.g. Blue"
            />
            <TextField
              id="city"
              name="city"
              label="City"
              required
              value={draft.city}
              onChange={(event) => update("city", event.target.value)}
              error={errors.city}
              hint="Only the city and state are shown publicly."
              autoComplete="address-level2"
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
            <TextField
              id="headline"
              name="headline"
              label="Headline"
              optionalLabel="optional"
              value={draft.headline}
              onChange={(event) => update("headline", event.target.value)}
              error={errors.headline}
              placeholder="One sentence that describes the animal"
              maxLength={120}
              hint={`${draft.headline.length}/120 characters.`}
            />
            <div className="sm:col-span-2">
              <Alert tone="neutral" title="Location privacy">
                A street address, ZIP code and contact details are not collected
                here. The public profile shows city and state only, with an
                approximate map pin.
              </Alert>
            </div>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="mt-4 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="akcNumber"
                name="akcNumber"
                label="AKC registration number"
                required
                value={draft.akcNumber}
                onChange={(event) =>
                  update("akcNumber", event.target.value.toUpperCase())
                }
                error={errors.akcNumber}
                placeholder="DN12345678"
                hint="Two letters + eight digits. The format is checked after submission; this is not an AKC registry confirmation."
                autoComplete="off"
              />
              <TextField
                id="brucellosisDate"
                name="brucellosisDate"
                type="date"
                label="Brucellosis test date"
                required
                max={referenceDate}
                value={draft.brucellosisDate}
                onChange={(event) =>
                  update("brucellosisDate", event.target.value)
                }
                error={errors.brucellosisDate}
                hint="The 14-day window is a listing rule under review, not a legal determination."
              />
            </div>

            {brucellosisRecord ? (
              <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-cream-50 p-3">
                <BrucellosisBadge
                  record={brucellosisRecord}
                  referenceDate={referenceDate}
                />
                <span className="text-[11px] text-muted">
                  {brucellosisFiles.length > 0
                    ? "A local file is attached for this preview."
                    : "No document attached. Requests will stay paused until one is reviewed."}
                </span>
              </div>
            ) : null}

            <FileDropzone
              id="brucellosisFile"
              label="Brucellosis document"
              hint="Private. Never publicly linked. PDF, JPG or PNG, up to 10 MB."
              files={brucellosisFiles}
              onChange={setBrucellosisFiles}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                id="ofaResult"
                name="ofaResult"
                label="OFA hips"
                optionalLabel="optional"
                value={draft.ofaResult}
                onChange={(event) => update("ofaResult", event.target.value)}
                options={[
                  { value: "", label: "Not provided" },
                  { value: "Excellent", label: "Excellent" },
                  { value: "Good", label: "Good" },
                  { value: "Fair", label: "Fair" },
                  { value: "Normal", label: "Normal" },
                ]}
                hint="Owner-provided. Optional tests are not required by law."
              />
              <div className="flex items-end">
                <FileDropzone
                  id="healthFile"
                  label="OFA certificate"
                  hint="Optional. Local preview only."
                  files={healthFiles}
                  onChange={setHealthFiles}
                />
              </div>
            </div>

            <Alert tone="warning" title="What review checks">
              The test date, document legibility and the registration number
              format. A format check is not an official registration
              confirmation, and a test date is not a health guarantee.
            </Alert>
          </div>
        ) : null}

        {step === 2 && isStud ? (
          <div className="mt-4 space-y-5">
            <PhotoField files={photos} onChange={setPhotos} />
            <TextareaField
              id="description"
              name="description"
              label="About this stud"
              required
              rows={5}
              value={draft.description}
              onChange={(event) =>
                update("description", event.target.value.slice(0, 1_200))
              }
              error={errors.description}
              hint={`${draft.description.length}/1200 characters. Minimum 60.`}
              placeholder="Temperament, routine, previous arrangements and what a dam owner should know."
            />
            <Alert tone="neutral" title="Keep claims checkable">
              Avoid promising pregnancy, “guaranteed” health, or champion status
              that is not documented. Owners are responsible for the accuracy of
              their description.
            </Alert>
          </div>
        ) : null}

        {step === 2 && !isStud ? (
          <div className="mt-4 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="lastHeatDate"
                name="lastHeatDate"
                type="date"
                label="First day of last heat"
                required
                max={referenceDate}
                value={draft.lastHeatDate}
                onChange={(event) => update("lastHeatDate", event.target.value)}
                error={errors.lastHeatDate}
              />
              <TextField
                id="cycleLength"
                name="cycleLength"
                type="number"
                inputMode="numeric"
                min="120"
                max="365"
                label="Average cycle (days)"
                required
                value={draft.cycleLength}
                onChange={(event) => update("cycleLength", event.target.value)}
                error={errors.cycleLength}
                hint="182 days is the default estimate. Change it to match your records."
              />
            </div>

            <div className="rounded-xl border border-line bg-cream-50 p-4">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                Next heat projection
              </p>
              <p className="mt-1 font-display text-2xl text-navy-900">
                {nextHeat ? formatDate(nextHeat) : "Add a last heat date"}
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                An estimate only, based on the last recorded heat plus{" "}
                {draft.cycleLength || "182"} days. It is not a confirmed date,
                and a recorded mating does not confirm pregnancy.
              </p>
            </div>

            <TextareaField
              id="description"
              name="description"
              label="Notes for your records"
              optionalLabel="optional"
              rows={4}
              value={draft.description}
              onChange={(event) =>
                update("description", event.target.value.slice(0, 800))
              }
              hint="Private. Not shown on any public page."
              placeholder="Anything you want to remember about this female's cycle or care."
            />

            <Alert tone="info" title="Private by default">
              The female profile and heat calendar have no public route. You
              choose what to share when you send a request.
            </Alert>
          </div>
        ) : null}

        {step === 1 ? <AnimalHealthPanel breed={draft.breed} /> : null}
        {step === 3 ? (
          <div className="mt-4 space-y-5">
            {isStud ? (
              <fieldset>
                <legend className="text-sm font-semibold text-navy-900">
                  Breeder subscription
                </legend>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">
                  Paid visibility only. A plan is not a verification and does
                  not change document review.
                </p>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {STUD_PLANS.map((plan) => {
                    const selected = draft.plan === plan.id;
                    return (
                      <label
                        key={plan.id}
                        className={
                          selected
                            ? "cursor-pointer rounded-2xl border-2 border-navy-700 bg-navy-50/50 p-4"
                            : "cursor-pointer rounded-2xl border border-line bg-white p-4 hover:border-navy-300"
                        }
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="plan"
                              value={plan.id}
                              checked={selected}
                              onChange={() => update("plan", plan.id)}
                              className="h-4 w-4 accent-navy-700"
                            />
                            <span className="text-sm font-semibold text-navy-900">
                              {plan.name}
                            </span>
                          </span>
                          <span className="tabular text-sm font-semibold text-navy-900">
                            ${plan.monthlyUsd ?? 0}
                            <span className="text-[10px] font-normal text-muted">
                              /mo
                            </span>
                          </span>
                        </div>
                        <p className="mt-2 text-[11px] text-muted">
                          {plan.visibility}
                        </p>
                        <ul className="mt-2 space-y-1 text-[11px] text-muted">
                          {plan.features.map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center gap-1.5"
                            >
                              <Icon
                                name="check"
                                className="h-3 w-3 text-navy-400"
                              />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </label>
                    );
                  })}

                  <div className="rounded-2xl border border-dashed border-line bg-cream-50 p-4 opacity-80">
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-2 text-sm font-semibold text-muted">
                        <Icon name="lock" className="h-3.5 w-3.5" />
                        {FOUNDER_PROGRAM.label}
                      </span>
                      <Badge tone="neutral" size="sm">
                        Not available
                      </Badge>
                    </div>
                    <p className="mt-2 text-[11px] leading-relaxed text-muted">
                      {FOUNDER_PROGRAM.description}
                    </p>
                  </div>
                </div>
              </fieldset>
            ) : null}

            <div className="rounded-2xl border border-line bg-cream-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-navy-900">Review</h3>
                <Badge tone="neutral" size="sm">
                  {isStud ? "Plan not active" : "Free · private"}
                </Badge>
              </div>
              <dl className="mt-3 grid gap-x-6 gap-y-2 text-[12px] sm:grid-cols-2">
                {[
                  ["Name", draft.name || "—"],
                  ["Breed", draft.breed || "—"],
                  ["Born", draft.birthDate ? formatDate(draft.birthDate) : "—"],
                  ["Weight", draft.weight ? `${draft.weight} lb` : "—"],
                  ["Color", draft.color || "—"],
                  [
                    "Location",
                    draft.city ? `${draft.city}, ${draft.stateCode}` : "—",
                  ],
                  ["AKC number", draft.akcNumber || "—"],
                  [
                    "Brucellosis test",
                    draft.brucellosisDate
                      ? formatDate(draft.brucellosisDate)
                      : "—",
                  ],
                  isStud
                    ? [
                        "Plan",
                        STUD_PLANS.find((plan) => plan.id === draft.plan)
                          ?.name ?? "Free",
                      ]
                    : ["Cycle", `${draft.cycleLength} days`],
                  isStud
                    ? [
                        "Photos",
                        photos.length > 0
                          ? `${photos.length} local file(s)`
                          : "Illustrative placeholders",
                      ]
                    : [
                        "Last heat",
                        draft.lastHeatDate
                          ? formatDate(draft.lastHeatDate)
                          : "—",
                      ],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-3 border-b border-line/70 py-1.5"
                  >
                    <dt className="text-muted">{label}</dt>
                    <dd className="text-right font-medium text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-[10px] leading-relaxed text-muted">
                Review creates a draft only. Documents and the subscription are
                separate states.
              </p>
            </div>

            <div className="space-y-4">
              <CheckboxField
                id="shareConsent"
                name="shareConsent"
                checked={shareConsent}
                onChange={(event) => setShareConsent(event.target.checked)}
                error={errors.shareConsent}
                required
                label="I confirm these records are mine to share and the information provided is accurate."
              />
              <CheckboxField
                id="termsConsent"
                name="termsConsent"
                checked={termsConsent}
                onChange={(event) => setTermsConsent(event.target.checked)}
                error={errors.termsConsent}
                required
                label={
                  isStud
                    ? "I understand the plan is not active until review and a successful payment, and that no payment is taken in this preview."
                    : "I understand this female profile is private by default and nothing is published by this form."
                }
              />
            </div>
          </div>
        ) : null}
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          {step > 0 ? (
            <Button
              type="button"
              variant="secondary"
              onClick={goBack}
              iconLeft={<Icon name="arrow-left" className="h-4 w-4" />}
            >
              Back
            </Button>
          ) : null}
          <button
            type="button"
            onClick={discardDraft}
            className="rounded-full px-3 py-2 text-[11px] font-semibold text-muted underline underline-offset-2 hover:text-danger-700"
          >
            Discard local draft
          </button>
        </div>

        {step < steps.length - 1 ? (
          <Button
            type="button"
            onClick={(event) => {
              // preventDefault also stops the browser's default form action if
              // React swaps this button for the submit button mid-click.
              event.preventDefault();
              goNext();
            }}
            iconRight={<Icon name="arrow-right" className="h-4 w-4" />}
          >
            Continue
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            iconRight={<Icon name="arrow-right" className="h-4 w-4" />}
          >
            Submit for review
          </Button>
        )}
      </div>

      <p className="text-[10px] leading-relaxed text-muted">
        Preview form. No data is sent to a server. Values are saved in this
        browser only; attached files are held in memory and disappear on
        refresh.
      </p>
    </form>
  );
}

function PhotoField({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  return (
    <div>
      <FileDropzone
        id="photos"
        label="Photos"
        hint="Up to 15 images in this local preview. Production limits follow the configured breeder subscription."
        files={files}
        onChange={onChange}
        accept=".jpg,.jpeg,.png,.webp"
        maxFiles={15}
      />
      <p className="mt-2 text-[11px] leading-relaxed text-muted">
        If no photo is attached, the preview uses an illustrative portrait. Real
        photography will be uploaded to private storage once the backend is
        connected.
      </p>
    </div>
  );
}
